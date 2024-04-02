import { useState } from "react";
import { imageUploader } from "../services/Firebase";
import { v4 } from "uuid";
import { ref, uploadBytes } from "firebase/storage";
import saveArtPiece from "../services/ArtPieceManager";
import TokenManager from "../services/TokenManager";

const CreatePage = () => {
  // State for form values
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [year, setYear] = useState(0);
  const [module, setModule] = useState(0);
  const [media, setMedia] = useState([]);
  const [subject, setSubject] = useState("");

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
        subject,
      };

      const newArtPiece = await saveArtPiece(
        artPiece,
        TokenManager.getAccessToken(),
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md flex flex-col justify-center"
    >
      <div className="md:flex md:items-center mb-6">
        <div className="md:w-1/4">
          <label
            htmlFor="title"
            className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
          >
            Titel
          </label>
        </div>
        <div className="md:w-1/2">
          <input
            type="text"
            name="title"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
          />
        </div>
      </div>

      <div className="md:flex md:items-center mb-6">
        <div className="md:w-1/4">
          <label
            htmlFor="description"
            className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
          >
            Beschrijving
          </label>
        </div>
        <div className="md:w-1/2">
          <input
            type="text"
            name="description"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
          />
        </div>
      </div>

      <div className="md:flex md:items-center mb-6">
        <div className="md:w-1/4">
          <label
            htmlFor="year"
            className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
          >
            Leerjaar
          </label>
        </div>
        <div className="md:w-1/2">
          <input
            type="text"
            name="year"
            id="year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
          />
        </div>
      </div>

      <div className="md:flex md:items-center mb-6">
        <div className="md:w-1/4">
          <label
            htmlFor="module"
            className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
          >
            Module
          </label>
        </div>
        <div className="md:w-1/2">
          <input
            type="text"
            name="module"
            id="module"
            value={module}
            onChange={(e) => setModule(e.target.value)}
            required
            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
          />
        </div>
      </div>

      <div className="md:flex md:items-center mb-6">
        <div className="md:w-1/4">
          <label
            htmlFor="subject"
            className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
          >
            Vak
          </label>
        </div>
        <div className="md:w-1/2">
          <select
            name="subject"
            id="subject"
            onChange={(e) => setSubject(e.target.value)}
            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
          >
            <option value="WERKPRAKTIJK_1">Werkpraktijk 1</option>
            <option value="WERKPRAKTIJK_2">Werkpraktijk 2</option>
            <option value="THEORIE">Theorie</option>
            <option value="SKILLS">Skills</option>
            <option value="POSITIONERING">Positionering</option>
            <option value="PORTFOLIO">Officieel portfolio</option>
          </select>
        </div>
      </div>

      <div className="md:flex md:items-center mb-6">
        <div className="md:w-1/4">
          <label
            htmlFor="media"
            className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
          >
            Media
          </label>
        </div>
        <div className="md:w-1/2">
          <input
            type="file"
            name="media"
            id="media"
            onChange={(e) => setMedia(e.target.files)}
            multiple
            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
          />
        </div>
      </div>

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded border-2 border-blue-700 shadow-md md:w-1/4"
        type="submit"
      >
        Submit
      </button>
    </form>
  );
};

export default CreatePage;
