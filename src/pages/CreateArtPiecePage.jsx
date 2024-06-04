import { useEffect, useState } from "react";
import { imageUploader } from "../services/Firebase";
import { v4 } from "uuid";
import { ref, uploadBytes } from "firebase/storage";
import ArtPieceManager from "../services/ArtPieceManager";
import TokenManager from "../services/TokenManager";
import { Link, useNavigate } from "react-router-dom";
import ImageOrderPicker from "../components/ImageOrderPicker";
import SubjectEnumToPath from "../services/SubjectParser";
import ArtPieceForm from "../components/ArtPieceForm";

const CreatePage = () => {
  const titleHook = useState("");
  const descriptionHook = useState("");
  const yearHook = useState(1);
  const moduleHook = useState(1);
  const mediaHook = useState([]);
  const subjectHook = useState("WERKPRAKTIJK_1");

  const navigate = useNavigate();

  useEffect(() => {
    if (!TokenManager.getClaims()) {
      navigate("/");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mediaHook[0] !== null) {
      const mediaFiles = [];
      for (let i = 0; i < mediaHook[0].length; i++) {
        const file = mediaHook[0][i];
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

      const title = titleHook[0];
      const description = descriptionHook[0];
      const year = parseInt(yearHook[0]);
      const module = parseInt(moduleHook[0]);
      const subject = subjectHook[0];

      try {
        const newArtPiece = await ArtPieceManager.saveArtPiece(
          { title, description, year, module, media: mediaFiles, subject },
          TokenManager.getAccessToken(),
        );

        const subjectParam = SubjectEnumToPath(subject);

        navigate(`/module/${year}/${module}/${subjectParam}`);
      } catch (error) {
        console.error("Error saving art piece:", error);
      }
    }
  };

  return (
    <div className="w-full max-w-md flex flex-col justify-center mb-10">
      <ArtPieceForm
        onSubmit={handleSubmit}
        headerText="Portfolio item aanmaken"
        titleHook={titleHook}
        descriptionHook={descriptionHook}
        yearHook={yearHook}
        moduleHook={moduleHook}
        subjectHook={subjectHook}
        mediaHook={mediaHook}
        onClose={() => navigate("/")}
      />
      {/* <form onSubmit={handleSubmit}>
        <h3>Portfolio item aanmaken</h3>
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

        <div className="flex justify-between">
          <Link
            className="bg-[#b5bab6] text-white px-4 py-2 rounded border-2 border-[#a1a6a2] shadow-md md:w-1/4"
            to="/"
          >
            Annuleren
          </Link>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded border-2 border-blue-700 shadow-md md:w-1/4"
            type="submit"
          >
            Opslaan
          </button>
        </div>
      </form> */}
    </div>
  );
};

export default CreatePage;
