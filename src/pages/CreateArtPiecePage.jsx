import { useEffect, useState } from "react";
import { imageUploader } from "../services/Firebase";
import { v4 } from "uuid";
import { ref, uploadBytes } from "firebase/storage";
import ArtPieceManager from "../services/ArtPieceManager";
import TokenManager from "../services/TokenManager";
import { useNavigate } from "react-router-dom";
import ImageOrderPicker from "../components/ImageOrderPicker";

const CreatePage = () => {
  // State for form values
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [year, setYear] = useState(0);
  const [module, setModule] = useState(0);
  const [media, setMedia] = useState([]);
  const [subject, setSubject] = useState("WERKPRAKTIJK_1");

  const navigate = useNavigate();

  useEffect(() => {
    if (!TokenManager.getClaims()) {
      navigate("/");
    }
  }, []);

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
        year: parseInt(year),
        module: parseInt(module),
        media: mediaFiles,
        subject,
      };

      try {
        const newArtPiece = await ArtPieceManager.saveArtPiece(
          artPiece,
          TokenManager.getAccessToken(),
        );

        let subjectParam;
        switch (subject) {
          case "WERKPRAKTIJK_1":
          case "WERKPRAKTIJK_2":
            subjectParam = "werkpraktijk";
            break;
          case "THEORIE":
          case "SKILLS":
            subjectParam = "kennis";
            break;
          case "POSITIONERING":
            subjectParam = "positionering";
            break;
          default:
            subjectParam = "";
            break;
        }

        navigate(`/module/${year}/${module}/${subjectParam}`);
      } catch (error) {
        console.error("Error saving art piece:", error);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md flex flex-col justify-center mb-10"
    >
      <label htmlFor="title" className="block text-gray-500 font-bold mb-5">
        Titel
        <input
          type="text"
          name="title"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
        />
      </label>

      <label
        htmlFor="description"
        className="block text-gray-500 font-bold mb-5"
      >
        Beschrijving
        <textarea
          type="text"
          name="description"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
        />
      </label>

      <label htmlFor="year" className="block text-gray-500 font-bold mb-5">
        Leerjaar
        <input
          type="text"
          name="year"
          id="year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          required
          className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
        />
      </label>

      <label htmlFor="module" className="block text-gray-500 font-bold mb-5">
        Module
        <input
          type="text"
          name="module"
          id="module"
          value={module}
          onChange={(e) => setModule(e.target.value)}
          required
          className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
        />
      </label>

      <label htmlFor="subject" className="block text-gray-500 font-bold mb-5">
        Vak
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
      </label>

      <label htmlFor="media" className="block text-gray-500 font-bold mb-5">
        Media
        <ImageOrderPicker images={media} setImages={setMedia} />
      </label>

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded border-2 border-blue-700 shadow-md md:w-1/4"
        type="submit"
      >
        Opslaan
      </button>
    </form>
  );
};

export default CreatePage;
