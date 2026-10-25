import React from "react";
import { Link } from "react-router-dom";
import { env } from "../config/env";
import { ArtPiece } from "../types";

export interface PortfolioItemProps {
  piece: ArtPiece;
  onUpdate?: (updatedPiece: ArtPiece) => void;
  onDelete?: (deletedId: string) => void;
}

const PortfolioItem: React.FC<PortfolioItemProps> = ({ piece }) => {
  // Retrieve the first media item by order
  const sortedMedia = [...(piece.media || [])].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  );
  const firstMedia = sortedMedia[0];
  const isImage = firstMedia?.locationReference?.startsWith("images");
  const isVideo = firstMedia?.locationReference?.startsWith("videos");

  const cdnBase = env.BUNNY_NET.CDN_URL.replace(/\/$/, "");
  const firstMediaUrl =
    firstMedia?.preview ??
    (firstMedia?.locationReference
      ? `${cdnBase}/${firstMedia.locationReference}`
      : null);

  return (
    <div
      className="p-4 md:w-1/3 sm:w-1/2 w-full"
      key={piece.id}
      data-testid="artpieceCard"
    >
      <div className="h-full border-2 border-gray-300 border-opacity-60 hover:border-gray-400 rounded-lg group relative overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-200 flex flex-col">
        <Link
          to={`/portfolio/${piece.id}`}
          className="flex-1 flex flex-col cursor-pointer focus:outline-none"
        >
          {/* First Media / Image */}
          {firstMediaUrl && (
            <div className="w-full h-56 sm:h-48 md:h-56 bg-gray-100 flex items-center justify-center overflow-hidden">
              {isImage ? (
                <img
                  src={firstMediaUrl}
                  alt={piece.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : isVideo ? (
                <video
                  src={firstMediaUrl}
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={firstMediaUrl}
                  alt={piece.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              )}
            </div>
          )}

          {/* Title only */}
          <div
            className={`flex-1 flex items-center justify-center text-center ${
              firstMediaUrl ? "p-4" : "p-6 min-h-[10rem]"
            }`}
          >
            <h3
              className={`title-font text-base md:text-lg font-medium text-gray-800 group-hover:text-black transition-colors ${
                firstMediaUrl ? "line-clamp-2" : "line-clamp-4"
              }`}
              data-testid="artpieceTitle"
            >
              {piece.title}
            </h3>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default PortfolioItem;
