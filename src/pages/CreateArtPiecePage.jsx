import { useState } from "react";
import { imageUploader } from "../services/Firebase";
import { v4 } from "uuid";
import { ref, uploadBytes } from "firebase/storage";
import save from "../services/ArtPieceManager";

const CreatePage = () => {
  // State for form values
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [year, setYear] = useState(0);
  const [module, setModule] = useState(0);
  const [media, setMedia] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (media !== null) {
      const mediaFiles = [];
      for (let i = 0; i < media.length; i++) {
        const file = media[i];
        const fileType = file.type.split("/")[0];

        let storageRef;
        if (fileType === "image") {
          storageRef = ref(imageUploader, `images/${v4()}`);
        } else if (fileType === "video") {
          storageRef = ref(imageUploader, `videos/${v4()}`);
        } else {
          continue;
        }

        try {
          const uploadTask = await uploadBytes(storageRef, file);
          const relativePath = storageRef.fullPath;

          mediaFiles.push({
            locationReference: relativePath,
            order: i + 1,
          });
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      }

      // Create artPiece object
      const artPiece = {
        title,
        description,
        year,
        module,
        media: mediaFiles,
      };

      const newArtPiece = await save(artPiece);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="title">Titel</label>
      <input
        type="text"
        name="title"
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <label htmlFor="description">Beschrijving</label>
      <input
        type="text"
        name="description"
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <label htmlFor="year">Leerjaar</label>
      <input
        type="text"
        name="year"
        id="year"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        required
      />

      <label htmlFor="module">Module</label>
      <input
        type="text"
        name="module"
        id="module"
        value={module}
        onChange={(e) => setModule(e.target.value)}
        required
      />

      <label htmlFor="media">Media</label>
      <input
        type="file"
        name="media"
        id="media"
        onChange={(e) => setMedia(e.target.files)}
        multiple
      />

      <button
        className="bg-blue-500 text-white font-semibold border-solid border-black rounded p-2 border-2"
        type="submit"
      >
        Submit
      </button>
    </form>
  );
};

export default CreatePage;
