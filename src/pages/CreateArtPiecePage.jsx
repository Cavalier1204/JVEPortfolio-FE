import { useState } from "react";
import { imageUploader } from "../services/Firebase";
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const CreatePage = () => {
  const [img, setImg] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (img !== null) {
      for (let i = 0; i < img.length; i++) {
        const file = img[i];
        const fileType = file.type.split("/")[0]; // Get the first part of MIME type (e.g., "image" or "video")

        // Create a reference path based on file type
        let storageRef;
        if (fileType === "image") {
          storageRef = ref(imageUploader, `images/${v4()}`);
        } else if (fileType === "video") {
          storageRef = ref(videoUploader, `videos/${v4()}`);
        } else {
          continue;
        }

        try {
          const uploadTask = await uploadBytes(storageRef, file);
          console.log(uploadTask);
          const downloadURL = await getDownloadURL(uploadTask.ref);
          console.log(downloadURL);
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="title" id="" />
      <label htmlFor="title">Titel</label>

      <input type="text" name="description" id="" />
      <label htmlFor="description">Bescrijving</label>

      <input type="text" name="year" id="" />
      <label htmlFor="year">Leerjaar</label>

      <input type="text" name="module" id="" />
      <label htmlFor="module">Module</label>

      <input
        type="file"
        name="media"
        id=""
        onChange={(e) => setImg(e.target.files)}
      />
      <label htmlFor="media">Media</label>

      <button className="bg-blue-500 text-black" type="submit">
        Submit
      </button>
    </form>
  );
};

export default CreatePage;
