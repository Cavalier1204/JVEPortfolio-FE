import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ArtPieceManager from "../services/ArtPieceManager";
import PortfolioItem from "../components/PortfolioItemCard";
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
  const [, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getData = async () => {
      if (!year || !module || !subject) return;
      setLoading(true);
      try {
        const res = await ArtPieceManager.getArtPiecesByYearByModuleBySubject({
          year,
          module,
          subject,
        });
        setArtPieces(res.data);
      } catch (error) {
        console.error("Error fetching art pieces:", error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [year, module, subject]);

  if (
    !subject ||
    artPieces == null ||
    artPieces.length === 0 ||
    !(subject in modules)
  ) {
    return (
      <div className="md:container md:mx-auto flex justify-center pt-5">
        <p>Geen portfolio items gevonden.</p>
      </div>
    );
  }

  return (
    <div className="md:container md:mx-auto flex justify-center pt-5">
      <div className="px-5 pb-10 w-full">
        {modules[subject].subjects.map(({ enumName, displayName }, index) => (
          <div key={index} className="pt-5">
            <h2 className="mx-auto w-fit font-light">{displayName}</h2>
            <div
              className="w-1/5 bg-[#b5bab6] mx-auto landingline mb-5"
              style={{ height: "2px" }}
            />
            <div className="flex flex-wrap -m-4 justify-center">
              {artPieces
                .filter((piece) => piece.subject === enumName)
                .map((piece) => (
                  <PortfolioItem piece={piece} key={piece.id} />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectPage;
