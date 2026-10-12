import React, { useEffect, useState } from "react";
import ArtPieceManager from "../services/ArtPieceManager";
import TokenManager from "../services/TokenManager";
import { Navigate, useNavigate } from "react-router-dom";
import SubjectEnumToPath from "../services/SubjectParser";
import ArtPieceForm from "../components/ArtPieceForm";
import { imageUploader } from "../services/MediaUtils";

const CreatePage: React.FC = () => {
  const titleHook = useState<string>("");
  const descriptionHook = useState<string>("");
  const yearHook = useState<number | string>(1);
  const moduleHook = useState<number | string>(1);
  const mediaHook = useState<any[]>([]);
  const subjectHook = useState<string>("WERKPRAKTIJK_1");

  const loadingHook = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!TokenManager.getClaims()) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loadingHook[1](true);

    if (mediaHook[0] !== null) {
      const media = await imageUploader(mediaHook[0]);

      const title = titleHook[0];
      const description = descriptionHook[0];
      const year = Number(yearHook[0]);
      const module = Number(moduleHook[0]);
      const subject = subjectHook[0];

      try {
        await ArtPieceManager.saveArtPiece(
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
      <div className="md:container md:mx-auto flex justify-center pt-5">
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
            dataTestId="uploadForm"
          />
        </div>
      </div>
    );
  } else {
    return <Navigate to="/login" />;
  }
};

export default CreatePage;
