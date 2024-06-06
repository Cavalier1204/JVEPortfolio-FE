import { getBytes, ref } from "firebase/storage";
import { imageUploader } from "../services/Firebase";

export const fetchPreviewURL = async (locationReference) => {
  const mediaRef = ref(imageUploader, locationReference);
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
