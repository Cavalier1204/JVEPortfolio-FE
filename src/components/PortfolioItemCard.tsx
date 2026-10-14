import React, { useState, useEffect } from "react";
import Carousel from "./Carousel";
import { useAuth } from "../modules/useAuth";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import EditArtPieceModal from "./EditArtPieceModal";
import DeleteArtPieceModal from "./DeleteArtPieceModal";
import { ArtPiece } from "../types";

export interface PortfolioItemProps {
  piece: ArtPiece;
  onUpdate?: (updatedPiece: ArtPiece) => void;
  onDelete?: (deletedId: string) => void;
}

const PortfolioItem: React.FC<PortfolioItemProps> = ({
  piece,
  onUpdate,
  onDelete,
}) => {
  const { isAuthenticated } = useAuth();
  const [currentPiece, setCurrentPiece] = useState<ArtPiece>(piece);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  useEffect(() => {
    setCurrentPiece(piece);
  }, [piece]);

  const handleSaved = (updated: ArtPiece) => {
    setCurrentPiece(updated);
    onUpdate?.(updated);
  };

  const handleDeleted = (id: string) => {
    onDelete?.(id);
  };

  return (
    <div
      className="p-4 md:w-1/3 w-full"
      key={currentPiece.id}
      data-testid="artpieceCard"
    >
      <div className="h-fit border-2 border-gray-300 border-opacity-60 rounded-lg group relative">
        {currentPiece.media.length > 0 && (
          <div className="lg:h-56 md:h-40 h-48 bg-gray-100">
            <Carousel media={currentPiece.media} />
          </div>
        )}
        <div className="px-6 pb-6 pt-5 relative">
          <h3
            className="title-font text-lg font-semibold text-gray-800 mb-3"
            data-testid="artpieceTitle"
          >
            {currentPiece.title}
          </h3>
          <p className="leading-relaxed mb-0 text-gray-600 whitespace-pre-line">
            {currentPiece.description}
          </p>

          {isAuthenticated && (
            <>
              <button
                type="button"
                data-testid="deleteButton"
                aria-label="Item verwijderen"
                className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity absolute p-2 border-black border-solid border-2 rounded bg-red-600 hover:bg-red-700 bottom-6 left-6 text-white cursor-pointer"
                onClick={() => setShowDeleteModal(true)}
              >
                <TrashIcon className="h-6 w-6" aria-hidden="true" />
              </button>
              <button
                type="button"
                data-testid="editButton"
                aria-label="Item aanpassen"
                className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity absolute p-2 border-gray-200 border-solid border-2 rounded bg-white hover:bg-gray-200 bottom-6 right-6 cursor-pointer"
                onClick={() => setShowEditModal(true)}
              >
                <PencilIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </>
          )}

          <EditArtPieceModal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            piece={currentPiece}
            onSaved={handleSaved}
          />

          <DeleteArtPieceModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            piece={currentPiece}
            onDeleted={handleDeleted}
          />
        </div>
      </div>
    </div>
  );
};

export default PortfolioItem;
