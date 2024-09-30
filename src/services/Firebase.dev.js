export const imageUploader = null;

export const ref = (imageUploader, locationReference) => {
  if (locationReference.startsWith("images/")) {
    return `/sample-image.jpg`;
  } else if (locationReference.startsWith("videos/")) {
    return `/sample-video.mp4`;
  }
};

export const getBytes = async (mediaRef) => {
  const response = await fetch(mediaRef);

  if (!response.ok) {
    throw new Error("Failed to fetch the image");
  }

  const arrayBuffer = await response.arrayBuffer();
  return new Uint8Array(arrayBuffer);
};

export const deleteObject = async () => {
  // No-op for development
};

export const uploadBytes = async () => {
  // No-op for development
};
