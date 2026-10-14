import { v4 } from "uuid";
import imageCompression from "browser-image-compression";
import axios from "axios";
import { UploadedMediaItem } from "../types";
import { env } from "../config/env";

export type { UploadedMediaItem };

export const imageUploader = async (
  media: any[] | null,
): Promise<{ mediaFiles: UploadedMediaItem[] }> => {
  const mediaFiles: UploadedMediaItem[] = [];
  if (media !== null) {
    for (let i = 0; i < media.length; i++) {
      const file = media[i];
      const fileType = file.type ? file.type.split("/")[0] : "";

      let storageRef: string;
      let resizedFile: any = file;

      if (fileType === "image") {
        const options = {
          maxWidthOrHeight: 1920,
          useWebWorker: true,
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
        await axios.put(
          `${env.BUNNY_NET.STORAGE_URL}/${storageRef}`,
          resizedFile,
          {
            headers: {
              AccessKey: env.BUNNY_NET.API_KEY,
              "Content-Type": "application/octet-stream",
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
