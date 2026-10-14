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
          <div className="w-full h-56 sm:h-48 md:h-56 bg-gray-100 flex items-center justify-center overflow-hidden">
            {firstMediaUrl ? (
              isImage ? (
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
              )
            ) : (
              <div className="text-gray-400 text-sm flex flex-col items-center justify-center p-4">
                <svg
                  className="w-12 h-12 mb-2 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>Geen afbeelding</span>
              </div>
            )}
          </div>

          {/* Title only */}
          <div className="p-4 flex-1 flex items-center justify-center text-center">
            <h3
              className="title-font text-base md:text-lg font-medium text-gray-800 group-hover:text-black transition-colors line-clamp-2"
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
