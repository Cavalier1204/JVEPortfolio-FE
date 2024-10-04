import { useEffect, useState } from "react";
import { firebaseService, ref, uploadBytes } from "../services/Firebase";
import { v4 } from "uuid";
import ArtPieceManager from "../services/ArtPieceManager";
import TokenManager from "../services/TokenManager";
import { Navigate, useNavigate } from "react-router-dom";
import SubjectEnumToPath from "../services/SubjectParser";
import ArtPieceForm from "../components/ArtPieceForm";
import { imageUploader } from "../services/MediaUtils";

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

    if (mediaHook[0] !== null) {
      const media = await imageUploader(mediaHook[0]);

      const title = titleHook[0];
      const description = descriptionHook[0];
      const year = parseInt(yearHook[0]);
      const module = parseInt(moduleHook[0]);
      const subject = subjectHook[0];

      try {
        const newArtPiece = await ArtPieceManager.saveArtPiece(
          {
            title,
            description,
            year,
            module,
            media: media.mediaFiles,
            subject,
          },
          TokenManager.getAccessToken(),
        );

        const subjectParam = SubjectEnumToPath(subject);
        loadingHook[1](false);
        navigate(`/module/${year}/${module}/${subjectParam}`);
      } catch (error) {
        console.error("Error saving art piece:", error);
        loadingHook[1](false);
      }
    }
  };

  if (TokenManager.getClaims()) {
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
  } else {
    return <Navigate to="/login" />;
  }
};

export default CreatePage;
