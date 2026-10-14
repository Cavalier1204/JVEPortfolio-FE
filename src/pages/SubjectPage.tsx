import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import ArtPieceManager from "../services/ArtPieceManager";
import PortfolioItem from "../components/PortfolioItemCard";
import Breadcrumbs from "../components/Breadcrumbs";
import rawModules from "../data/modules.json";
import { ArtPiece, ModulesMap } from "../types";

const modules = rawModules as ModulesMap;

const SubjectPage: React.FC = () => {
  const { year, module, subject } = useParams<{
    year: string;
    module: string;
    subject: string;
  }>();
  const [artPieces, setArtPieces] = useState<ArtPiece[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getData = useCallback(async () => {
    if (!year || !module || !subject) return;
    setLoading(true);
    setError(null);
    try {
      const res = await ArtPieceManager.getArtPiecesByYearByModuleBySubject({
        year,
        module,
        subject,
      });
      setArtPieces(res.data);
    } catch (err) {
      console.error("Error fetching art pieces:", err);
      setError(
        "Er is een fout opgetreden bij het laden van de portfolio items.",
      );
    } finally {
      setLoading(false);
    }
  }, [year, module, subject]);

  useEffect(() => {
    getData();
  }, [getData]);

  const handlePieceUpdate = (updatedPiece: ArtPiece) => {
    setArtPieces((prev) =>
      prev.map((piece) =>
        piece.id === updatedPiece.id ? updatedPiece : piece,
      ),
    );
  };

  const handlePieceDelete = (deletedId: string) => {
    setArtPieces((prev) => prev.filter((piece) => piece.id !== deletedId));
  };

  const subjectInfo = subject && subject in modules ? modules[subject] : null;

  return (
    <div className="md:container md:mx-auto flex justify-center pt-5">
      <div className="px-5 pb-10 w-full">
        <Breadcrumbs
          items={[
            { label: "Home", to: "/" },
            { label: `Leerjaar ${year}` },
            { label: `Module ${module}`, to: `/module/${year}/${module}` },
            { label: subjectInfo?.title || subject || "Vak" },
          ]}
        />

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
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            <span className="sr-only">Laden...</span>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              type="button"
              onClick={getData}
              className="bg-[#b5bab6] hover:bg-[#a1a6a2] text-white px-4 py-2 rounded border-2 border-[#a1a6a2] shadow-md transition-colors"
            >
              Opnieuw proberen
            </button>
          </div>
        ) : !subjectInfo || artPieces.length === 0 ? (
          <div className="text-center py-16 text-gray-600">
            <p>Geen portfolio items gevonden voor dit onderdeel.</p>
          </div>
        ) : (
          subjectInfo.subjects.map(({ enumName, displayName }, index) => {
            const matchingPieces = artPieces.filter(
              (piece) => piece.subject === enumName,
            );
            if (matchingPieces.length === 0) return null;

            return (
              <div key={index} className="pt-5">
                <h2 className="mx-auto w-fit font-light">{displayName}</h2>
                <div
                  className="w-1/5 bg-[#b5bab6] mx-auto landingline mb-5"
                  style={{ height: "2px" }}
                />
                <div className="flex flex-wrap -m-4 justify-center">
                  {matchingPieces.map((piece) => (
                    <PortfolioItem
                      piece={piece}
                      key={piece.id}
                      onUpdate={handlePieceUpdate}
                      onDelete={handlePieceDelete}
                    />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SubjectPage;
