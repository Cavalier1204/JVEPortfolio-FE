import React, { useEffect, useState, useCallback } from "react";
import ArtPieceManager from "../services/ArtPieceManager";
import PortfolioItem from "../components/PortfolioItemCard";
import Breadcrumbs from "../components/Breadcrumbs";
import { ArtPiece } from "../types";

const PortfolioPage: React.FC = () => {
  const [artPieces, setArtPieces] = useState<ArtPiece[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await ArtPieceManager.getPortfolioPieces();
      setArtPieces(res.data);
    } catch (err) {
      console.error("Error fetching art pieces:", err);
      setError("Er is een fout opgetreden bij het laden van het portfolio.");
    } finally {
      setLoading(false);
    }
  }, []);

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

  return (
    <div className="md:container md:mx-auto flex justify-center pt-5">
      <div className="container px-5 pt-2 pb-10 mx-auto">
        <Breadcrumbs
          items={[{ label: "Home", to: "/" }, { label: "Officieel portfolio" }]}
        />

        <h2 className="mx-auto w-fit font-light">Portfolio</h2>
        <div
          className="w-1/5 bg-[#b5bab6] mx-auto landingline mb-5"
          style={{ height: "2px" }}
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
        ) : artPieces.length === 0 ? (
          <div className="text-center py-16 text-gray-600">
            <p>Geen portfolio items gevonden in het portfolio.</p>
          </div>
        ) : (
          <div className="flex flex-wrap -m-4">
            {artPieces.map((piece) => (
              <PortfolioItem
                piece={piece}
                key={piece.id}
                onUpdate={handlePieceUpdate}
                onDelete={handlePieceDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioPage;
