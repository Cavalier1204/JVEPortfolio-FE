import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import ArtPieceForm from "./ArtPieceForm";
import ArtPieceManager from "../services/ArtPieceManager";
import SubjectEnumToPath from "../services/SubjectParser";
import { imageUploader } from "../services/MediaUtils";
import { useLocation, useNavigate } from "react-router-dom";
import { ArtPiece, MediaItem } from "../types";

export interface EditArtPieceModalProps {
  isOpen: boolean;
  onClose: () => void;
  piece: ArtPiece;
  onSaved: (updatedPiece: ArtPiece) => void;
}

export const EditArtPieceModal: React.FC<EditArtPieceModalProps> = ({
  isOpen,
  onClose,
  piece,
  onSaved,
}) => {
  const [title, setTitle] = useState<string>(piece.title);
  const [description, setDescription] = useState<string>(
    piece.description ?? "",
  );
  const [year, setYear] = useState<number | string>(piece.year);
  const [moduleVal, setModuleVal] = useState<number | string>(piece.module);
  const [subject, setSubject] = useState<string>(piece.subject);
  const [media, setMedia] = useState<MediaItem[]>(
    [...piece.media].sort((a, b) => a.order - b.order),
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isOpen) {
      setTitle(piece.title);
      setDescription(piece.description ?? "");
      setYear(piece.year);
      setModuleVal(piece.module);
      setSubject(piece.subject);
      setMedia([...piece.media].sort((a, b) => a.order - b.order));
      setErrorMessage(null);
    }
  }, [isOpen, piece]);

  if (!isOpen) return null;

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const deletedMedia: (string | number)[] = [];
    let newMedia: any[] = [];
    const updatedMedia: any[] = [];

    piece.media.forEach((item) => {
      if (!media.includes(item)) {
        if (item.id !== undefined) {
          deletedMedia.push(item.id);
        }
      }
    });

    media.forEach((item: any, index: number) => {
      if (item instanceof File) {
        newMedia.push({ ...item, order: index + 1 });
        return;
      }

      updatedMedia.push({
        id: item.id,
        artPieceId: item.artPieceId,
        createdAt: item.createdAt,
        locationReference: item.locationReference,
        order: index + 1,
      });
    });

    try {
      if (newMedia.length > 0) {
        const uploadRes = await imageUploader(newMedia);
        newMedia = uploadRes.mediaFiles;
      }

      const id = piece.id;
      const parsedYear = Number(year);
      const parsedModule = Number(moduleVal);

      const updatedArtPieceRes = await ArtPieceManager.updateArtPiece({
        id,
        title,
        description,
        year: parsedYear,
        module: parsedModule,
        subject,
      });

      await ArtPieceManager.updateMedia(
        id,
        updatedMedia,
        deletedMedia,
        newMedia,
      );

      // Fetch fresh piece data to return clean updated item
      const freshRes = await ArtPieceManager.getArtPiece(id).catch(() => null);
      const resultingPiece = freshRes?.data || updatedArtPieceRes.data;

      onSaved(resultingPiece);
      onClose();

      const subjectParam = SubjectEnumToPath(subject);
      const targetUrl = `/module/${parsedYear}/${parsedModule}/${subjectParam}`;
      if (
        location.pathname !== targetUrl &&
        location.pathname !== "/portfolio"
      ) {
        navigate(targetUrl);
      }
    } catch (error) {
      console.error("Error updating art piece:", error);
      setErrorMessage(
        "Er is een fout opgetreden bij het opslaan van de wijzigingen. Probeer het later opnieuw.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      {errorMessage && (
        <div
          className="bg-red-50 border border-red-300 text-red-700 px-4 py-2 rounded mb-4 text-sm text-left"
          role="alert"
        >
          {errorMessage}
        </div>
      )}
      <ArtPieceForm
        onSubmit={handleUpdate}
        headerText="Portfolio item aanpassen"
        titleHook={[title, setTitle]}
        descriptionHook={[description, setDescription]}
        yearHook={[year, setYear]}
        moduleHook={[moduleVal, setModuleVal]}
        subjectHook={[subject, setSubject]}
        mediaHook={[media, setMedia]}
        onClose={onClose}
        loadingHook={[loading, setLoading]}
        dataTestId="uploadForm"
      />
    </Modal>
  );
};

export default EditArtPieceModal;
