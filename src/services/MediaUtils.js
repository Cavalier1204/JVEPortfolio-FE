import {
  firebaseService,
  getBytes,
  ref,
  uploadBytes,
} from "../services/Firebase.js";
import { v4 } from "uuid";
import imageCompression from "browser-image-compression";

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
        } catch (error) {
          console.error("Error resizing the image:", error);
        }

        storageRef = ref(firebaseService, `images/${v4()}.jpg`);
      } else if (fileType === "video") {
        storageRef = ref(firebaseService, `videos/${v4()}.mp4`);
      } else {
        continue;
      }

      try {
        const uploadTask = await uploadBytes(storageRef, resizedFile);
        const relativePath = storageRef.fullPath;

        mediaFiles.push({
          locationReference: relativePath,
          order: i + 1,
        });
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  }
  return { mediaFiles };
};

export const fetchPreviewURL = async (locationReference) => {
  const mediaRef = ref(firebaseService, locationReference);
  const bytes = await getBytes(mediaRef);
  const blob = new Blob([bytes]);

  let url;
  let canvas;

  if (locationReference.startsWith("images/")) {
    url = URL.createObjectURL(blob);

    const img = document.createElement("img");
    img.src = url;

    await new Promise((resolve) => {
      img.onload = resolve;
    });

    canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 100;
    canvas.height = 100;
    ctx.drawImage(img, 0, 0, 100, 100);
  } else if (locationReference.startsWith("videos/")) {
    url = URL.createObjectURL(blob);

    const video = document.createElement("video");
    video.src = url;

    await new Promise((resolve) => {
      video.onloadeddata = () => {
        video.currentTime = 1; // seek to 1 second for the thumbnail
        video.onseeked = resolve;
      };
    });

    canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 100;
    canvas.height = 100;
    ctx.drawImage(video, 0, 0, 100, 100);
  }

  const preview = canvas.toDataURL("image/jpeg");

  return { preview, url };
};
