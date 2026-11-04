import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ArtPieceManager from "../services/ArtPieceManager";
import Carousel from "../components/Carousel";
import Breadcrumbs, { BreadcrumbItem } from "../components/Breadcrumbs";
import EditArtPieceModal from "../components/EditArtPieceModal";
import DeleteArtPieceModal from "../components/DeleteArtPieceModal";
import { useAuth } from "../modules/useAuth";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { SubjectEnumToPath } from "../services/SubjectParser";
import rawModules from "../data/modules.json";
import { ArtPiece, ModulesMap } from "../types";

const modules = rawModules as ModulesMap;

const PortfolioDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [piece, setPiece] = useState<ArtPiece | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const fetchPiece = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await ArtPieceManager.getArtPiece(id);
      setPiece(res.data);
    } catch (err) {
      console.error("Error fetching art piece:", err);
      setError(
        "Er is een fout opgetreden bij het laden van het portfolio item.",
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPiece();
  }, [fetchPiece]);

  const isSubject = Boolean(
    piece && piece.subject && piece.subject !== "PORTFOLIO",
  );

  const subjectPath =
    isSubject && piece ? SubjectEnumToPath(piece.subject) : "";
  const subjectCategory = subjectPath ? modules[subjectPath] : null;
  const subjectTitle = subjectCategory?.title || subjectPath;
  const specificSubject = subjectCategory?.subjects?.find(
    (s) => s.enumName === piece?.subject,
  );
  const specificName =
    specificSubject?.displayName ||
    (piece?.subject ? piece.subject.replace(/_/g, " ") : "");

  const backPath =
    isSubject && piece && piece.year && piece.module
      ? `/module/${piece.year}/${piece.module}/${subjectPath}`
      : "/portfolio";

  const breadcrumbs: BreadcrumbItem[] = piece
    ? isSubject && piece.year && piece.module
      ? [
          { label: "Home", to: "/" },
          { label: `Leerjaar ${piece.year}` },
          {
            label: `Module ${piece.module}`,
            to: `/module/${piece.year}/${piece.module}`,
          },
          {
            label: subjectTitle,
            to: `/module/${piece.year}/${piece.module}/${subjectPath}`,
          },
          { label: piece.title },
        ]
      : [
          { label: "Home", to: "/" },
          { label: "Portfolio", to: "/portfolio" },
          { label: piece.title },
        ]
    : [
        { label: "Home", to: "/" },
        { label: "Portfolio", to: "/portfolio" },
        { label: "Item detail" },
      ];

  const handleSaved = (updated: ArtPiece) => {
    setPiece(updated);
  };

  const handleDeleted = () => {
    navigate(backPath, { replace: true });
  };

  return (
    <div className="md:container md:mx-auto flex justify-center pt-5">
      <div className="px-5 pb-10 w-full">
        {/* Breadcrumbs without extra back button */}
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="flex justify-center items-center py-20" role="status">
            <svg
              className="animate-spin h-8 w-8 text-gray-500"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
          </div>
        ) : error || !piece ? (
          /* Error state */
          <div className="text-center py-16">
            <p className="text-red-600 mb-4">
              {error || "Portfolio item niet gevonden."}
            </p>
            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={fetchPiece}
                className="bg-[#b5bab6] hover:bg-[#a1a6a2] text-white px-4 py-2 rounded border-2 border-[#a1a6a2] shadow-md transition-colors"
              >
                Opnieuw proberen
              </button>
              <Link
                to={backPath}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded border border-gray-300 transition-colors"
              >
                Terug naar overzicht
              </Link>
            </div>
          </div>
        ) : (
          /* Main presentation */
          <div>
            {/* Header / Title */}
            <header className="text-center max-w-2xl mx-auto mb-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 tracking-tight">
                {piece.title}
              </h1>
              <div
                className="w-16 bg-[#b5bab6] mx-auto mt-4 mb-4"
                style={{ height: "2px" }}
              />
              <p className="text-xs sm:text-sm text-gray-500 tracking-wider uppercase font-light">
                {isSubject && piece.year && piece.module ? (
                  <>
                    Leerjaar {piece.year} &bull; Module {piece.module}
                    {specificName ? ` \u2022 ${specificName}` : ""}
                  </>
                ) : (
                  "Officieel Portfolio"
                )}
              </p>
            </header>

            {/* Media Carousel - with reduced height */}
            {piece.media && piece.media.length > 0 && (
              <div className="w-full h-64 sm:h-80 md:h-[400px] lg:h-[450px] my-6 flex items-center justify-center">
                <Carousel media={piece.media} />
              </div>
            )}

            {/* Description */}
            {piece.description && (
              <div className="max-w-2xl mx-auto mt-8">
                <h2 className="text-xs uppercase tracking-widest text-gray-400 font-medium mb-3">
                  Beschrijving
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line text-base md:text-lg font-light">
                  {piece.description}
                </p>
              </div>
            )}

            {/* Admin actions */}
            {isAuthenticated && (
              <div className="max-w-2xl mx-auto mt-12 pt-6 border-t border-gray-200/70 flex items-center justify-end gap-3">
                <button
                  type="button"
                  data-testid="editButton"
                  onClick={() => setShowEditModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs uppercase tracking-wider text-gray-600 hover:text-black border border-gray-300 rounded hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <PencilIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Aanpassen</span>
                </button>
                <button
                  type="button"
                  data-testid="deleteButton"
                  onClick={() => setShowDeleteModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs uppercase tracking-wider text-red-600 hover:text-red-700 border border-red-200 rounded hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <TrashIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Verwijderen</span>
                </button>
              </div>
            )}

            {/* Modals */}
            <EditArtPieceModal
              isOpen={showEditModal}
              onClose={() => setShowEditModal(false)}
              piece={piece}
              onSaved={handleSaved}
            />

            <DeleteArtPieceModal
              isOpen={showDeleteModal}
              onClose={() => setShowDeleteModal(false)}
              piece={piece}
              onDeleted={handleDeleted}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioDetailPage;
