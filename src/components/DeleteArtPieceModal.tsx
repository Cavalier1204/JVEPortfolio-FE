import React, { useState } from "react";
import Modal from "./Modal";
import ArtPieceManager from "../services/ArtPieceManager";
import { ArtPiece } from "../types";

export interface DeleteArtPieceModalProps {
  isOpen: boolean;
  onClose: () => void;
  piece: ArtPiece;
  onDeleted: (deletedId: string) => void;
}

export const DeleteArtPieceModal: React.FC<DeleteArtPieceModalProps> = ({
  isOpen,
  onClose,
  piece,
  onDeleted,
}) => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDelete = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsDeleting(true);
    setErrorMessage(null);

    try {
      await ArtPieceManager.deleteArtPiece(piece.id);
      onDeleted(piece.id);
      onClose();
    } catch (error) {
      console.error("Error deleting art piece:", error);
      setErrorMessage(
        "Er is een fout opgetreden bij het verwijderen van het item. Probeer het later opnieuw.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal onClose={onClose} data-testid="deleteModal">
      <h3>Portfolio item verwijderen</h3>
      <form onSubmit={handleDelete}>
        <h4 className="font-normal my-5">
          Weet je zeker dat je dit item wilt verwijderen?
        </h4>

        {errorMessage && (
          <p className="text-red-600 font-medium mb-4 text-sm" role="alert">
            {errorMessage}
          </p>
        )}

        <div className="flex justify-between">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="bg-[#b5bab6] text-white px-4 py-2 rounded border-2 border-[#a1a6a2] shadow-md md:w-fit"
          >
            Annuleren
          </button>
          {isDeleting ? (
            <button
              type="button"
              className="border-black border-solid bg-red-600 text-white px-4 py-2 rounded border-2 shadow-md md:w-fit flex cursor-not-allowed"
              disabled
            >
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              Verwijderen...
            </button>
          ) : (
            <button
              className="border-black border-solid bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded border-2 shadow-md md:w-fit transition-colors"
              type="submit"
              data-testid="confirmDeleteButton"
            >
              Verwijderen
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default DeleteArtPieceModal;
