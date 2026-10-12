import React, { useEffect, useState } from "react";
import ArtPieceManager from "../services/ArtPieceManager";
import { useNavigate } from "react-router-dom";
import SubjectEnumToPath from "../services/SubjectParser";
import ArtPieceForm from "../components/ArtPieceForm";
import { imageUploader } from "../services/MediaUtils";
import { useAuth } from "../modules/useAuth";

const CreatePage: React.FC = () => {
  const titleHook = useState<string>("");
  const descriptionHook = useState<string>("");
  const yearHook = useState<number | string>(1);
  const moduleHook = useState<number | string>(1);
  const mediaHook = useState<any[]>([]);
  const subjectHook = useState<string>("WERKPRAKTIJK_1");

  const loadingHook = useState<boolean>(false);

  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate]);

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
        await ArtPieceManager.saveArtPiece({
          title,
          description,
          year,
          module,
          media: media.mediaFiles,
          subject,
        });

        const subjectParam = SubjectEnumToPath(subject);
        loadingHook[1](false);
        navigate(`/module/${year}/${module}/${subjectParam}`);
      } catch (error) {
        console.error("Error saving art piece:", error);
        loadingHook[1](false);
      }
    }
  };

  if (authLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

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
};

export default CreatePage;
