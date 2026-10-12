import React, { useEffect, useState } from "react";
import ArtPieceManager from "../services/ArtPieceManager";
import PortfolioItem from "../components/PortfolioItemCard";
import { ArtPiece } from "../types";

const PortfolioPage: React.FC = () => {
  const [artPieces, setArtPieces] = useState<ArtPiece[]>([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await ArtPieceManager.getPortfolioPieces();
        setArtPieces(res.data);
      } catch (error) {
        console.error("Error fetching art pieces:", error);
      }
    };

    getData();
  }, []);

  return (
    <div className="md:container md:mx-auto flex justify-center pt-5">
      <div className="container px-5 pt-2 pb-10 mx-auto">
        <h2 className="mx-auto w-fit font-light">Portfolio</h2>
        <div
          className="w-1/5 bg-[#b5bab6] mx-auto landingline mb-5"
          style={{ height: "2px" }}
        />
        <div className="flex flex-wrap -m-4">
          {artPieces.map((piece) => (
            <PortfolioItem piece={piece} key={piece.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;
