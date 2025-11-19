import { v4 } from "uuid";
import imageCompression from "browser-image-compression";
import axios from "axios";

export const imageUploader = async (media) => {
  const mediaFiles = [];
  if (media !== null) {
    for (let i = 0; i < media.length; i++) {
      const file = media[i];
      const fileType = file.type.split("/")[0];

      let storageRef;
      let resizedFile = file;

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
        }
      } else if (fileType === "video") {
        storageRef = `videos/${v4()}.mp4`;
      } else {
        continue;
      }

      try {
        await axios.put(
          `${import.meta.env.VITE_BUNNY_STORAGE_URL}/${storageRef}`,
          resizedFile,
          {
            headers: {
              AccessKey: import.meta.env.VITE_BUNNY_API_KEY,
              "Content-Type": "application/octet-stream",
            },
          },
        );
        mediaFiles.push({
          locationReference: storageRef,
          order: media.order ?? i + 1,
        });
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  }
  return { mediaFiles };
};
