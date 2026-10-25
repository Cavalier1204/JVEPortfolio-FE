import { v4 } from "uuid";
import imageCompression from "browser-image-compression";
import axios from "axios";
import { UploadedMediaItem } from "../types";
import { env } from "../config/env";

export type { UploadedMediaItem };

export interface UploadProgressInfo {
  current: number;
  total: number;
  stage: "compressing" | "uploading";
  percent: number;
  filePercent: number;
  message: string;
}

export type UploadProgressCallback = (info: UploadProgressInfo) => void;

export const imageUploader = async (
  media: any[] | null,
  onProgress?: UploadProgressCallback,
): Promise<{ mediaFiles: UploadedMediaItem[] }> => {
  const mediaFiles: UploadedMediaItem[] = [];
  if (media !== null && media.length > 0) {
    const total = media.length;

    for (let i = 0; i < total; i++) {
      const file = media[i];
      const fileType = file.type ? file.type.split("/")[0] : "";

      let storageRef: string;
      let resizedFile: any = file;

      if (fileType === "image") {
        onProgress?.({
          current: i + 1,
          total,
          stage: "compressing",
          percent: Math.round((i / total) * 100),
          filePercent: 0,
          message: `Afbeelding ${i + 1} van ${total} comprimeren (0%)...`,
        });

        const options = {
          maxWidthOrHeight: 1920,
          useWebWorker: true,
          onProgress: (p: number) => {
            const clampedP = Math.min(100, Math.max(0, Math.round(p)));
            const overall = Math.round(((i + clampedP / 200) / total) * 100);
            onProgress?.({
              current: i + 1,
              total,
              stage: "compressing",
              percent: overall,
              filePercent: clampedP,
              message: `Afbeelding ${i + 1} van ${total} comprimeren (${clampedP}%)...`,
            });
          },
        };

        try {
          resizedFile = await imageCompression(file, options);
          storageRef = `images/${v4()}.jpg`;
        } catch (error) {
          console.error("Error resizing the image:", error);
          continue;
        }
      } else if (fileType === "video") {
        storageRef = `videos/${v4()}.mp4`;
      } else {
        continue;
      }

      try {
        const fileLabel = fileType === "video" ? "Video" : "Afbeelding";
        onProgress?.({
          current: i + 1,
          total,
          stage: "uploading",
          percent: Math.round(
            ((i + (fileType === "image" ? 0.5 : 0)) / total) * 100,
          ),
          filePercent: 0,
          message: `${fileLabel} ${i + 1} van ${total} uploaden (0%)...`,
        });

        await axios.put(
          `${env.BUNNY_NET.STORAGE_URL}/${storageRef}`,
          resizedFile,
          {
            headers: {
              AccessKey: env.BUNNY_NET.API_KEY,
              "Content-Type": "application/octet-stream",
            },
            onUploadProgress: (progressEvent) => {
              const filePercent = progressEvent.total
                ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
                : 0;
              const clampedFilePercent = Math.min(
                100,
                Math.max(0, filePercent),
              );
              const fileShare =
                fileType === "image"
                  ? 0.5 + clampedFilePercent / 200
                  : clampedFilePercent / 100;
              const overall = Math.round(((i + fileShare) / total) * 100);

              onProgress?.({
                current: i + 1,
                total,
                stage: "uploading",
                percent: overall,
                filePercent: clampedFilePercent,
                message: `${fileLabel} ${i + 1} van ${total} uploaden (${clampedFilePercent}%)...`,
              });
            },
          },
        );
        mediaFiles.push({
          locationReference: storageRef,
          order: file.order ?? i + 1,
        });
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  }
  return { mediaFiles };
};
