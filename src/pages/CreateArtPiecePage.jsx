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

  const loadingHook = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!TokenManager.getClaims()) {
      navigate("/");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    loadingHook[1](true);
    debugger;

    if (mediaHook[0] !== null) {
      const mediaFiles = [];
      for (let i = 0; i < mediaHook[0].length; i++) {
        const file = mediaHook[0][i];
        const fileType = file.type.split("/")[0];

        let storageRef;
        if (fileType === "image") {
          storageRef = ref(imageUploader, `images/${v4()}.jpg`);
        } else if (fileType === "video") {
          storageRef = ref(imageUploader, `videos/${v4()}.mp4`);
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
          loadingHook[1](true);
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
        loadingHook[1](true);
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
        loadingHook={loadingHook}
      />
    </div>
  );
};

export default CreatePage;
