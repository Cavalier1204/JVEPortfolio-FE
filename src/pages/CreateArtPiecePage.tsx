import React, { useEffect, useState } from "react";
import ArtPieceManager from "../services/ArtPieceManager";
import { useNavigate } from "react-router-dom";
import SubjectEnumToPath from "../services/SubjectParser";
import ArtPieceForm from "../components/ArtPieceForm";
import Breadcrumbs from "../components/Breadcrumbs";
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    setErrorMessage(null);

    try {
      let uploadedMedia: any[] = [];
      if (mediaHook[0] && mediaHook[0].length > 0) {
        const media = await imageUploader(mediaHook[0]);
        uploadedMedia = media.mediaFiles;
      }

      const title = titleHook[0];
      const description = descriptionHook[0];
      const year = Number(yearHook[0]);
      const module = Number(moduleHook[0]);
      const subject = subjectHook[0];

      await ArtPieceManager.saveArtPiece({
        title,
        description,
        year,
        module,
        media: uploadedMedia,
        subject,
      });

      const subjectParam = SubjectEnumToPath(subject);
      loadingHook[1](false);
      navigate(`/module/${year}/${module}/${subjectParam}`);
    } catch (error) {
      console.error("Error saving art piece:", error);
      setErrorMessage(
        "Er is een fout opgetreden bij het aanmaken van het portfolio item. Controleer de velden en probeer het opnieuw.",
      );
      loadingHook[1](false);
    }
  };

  const handleClose = () => {
    const isDirty = Boolean(
      titleHook[0] ||
        descriptionHook[0] ||
        (mediaHook[0] && mediaHook[0].length > 0),
    );
    if (isDirty) {
      if (
        window.confirm(
          "Weet je zeker dat je wilt annuleren? Niet-opgeslagen wijzigingen gaan verloren.",
        )
      ) {
        navigate(-1);
      }
    } else {
      navigate(-1);
    }
  };

  if (authLoading || !isAuthenticated) {
    return null;
  }

  return (
    <div className="md:container md:mx-auto flex justify-center pt-5">
      <div className="w-full max-w-md flex flex-col justify-center mb-10 px-4">
        <Breadcrumbs
          items={[
            { label: "Home", to: "/" },
            { label: "Nieuw portfolio item" },
          ]}
        />

        {errorMessage && (
          <div
            className="bg-red-50 border border-red-300 text-red-700 px-4 py-2.5 rounded mb-4 text-sm"
            role="alert"
          >
            {errorMessage}
          </div>
        )}

        <ArtPieceForm
          onSubmit={handleSubmit}
          headerText="Portfolio item aanmaken"
          titleHook={titleHook}
          descriptionHook={descriptionHook}
          yearHook={yearHook}
          moduleHook={moduleHook}
          subjectHook={subjectHook}
          mediaHook={mediaHook}
          onClose={handleClose}
          loadingHook={loadingHook}
          dataTestId="uploadForm"
        />
      </div>
    </div>
  );
};

export default CreatePage;
