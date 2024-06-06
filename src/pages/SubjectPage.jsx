import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ArtPieceManager from "../services/ArtPieceManager";
import PortfolioItem from "../components/PortfolioItemCard";

const SubjectPage = () => {
  const { year, module, subject } = useParams();
  const [artPieces, setArtPieces] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await ArtPieceManager.getArtPiecesByYearByModuleBySubject({
          year,
          module,
          subject,
        });
        setArtPieces(res.data);
      } catch (error) {
        console.error("Error fetching art pieces:", error);
        // Handle error, maybe navigate to an error page
      }
    };

    getData();
  }, [year, module, subject]);

  return (
    <div className="container px-5 pt-2 pb-10 mx-auto">
      {subject === "werkpraktijk" ? (
        <>
          <h2 className="mx-auto w-fit font-light">Werkpraktijk 1</h2>
          <div
            className="w-1/5 bg-[#b5bab6] mx-auto landingline mb-5"
            height={2}
          />
          <div className="flex flex-wrap -m-4">
            {/* Render pieces for Werkpraktijk 1 */}
            {artPieces
              .filter((piece) => piece.subject == "WERKPRAKTIJK_1")
              .map((piece) => (
                <PortfolioItem piece={piece} key={piece.id} />
              ))}
          </div>
          <h2 className="mx-auto w-fit font-light mt-10">Werkpraktijk 2</h2>
          <div
            className="w-1/5 bg-[#b5bab6] mx-auto landingline mb-5"
            height={2}
          />
          <div className="flex flex-wrap -m-4">
            {/* Render pieces for Werkpraktijk 2 */}
            {artPieces
              .filter((piece) => piece.subject == "WERKPRAKTIJK_2")
              .map((piece) => (
                <PortfolioItem piece={piece} key={piece.id} />
              ))}
          </div>
        </>
      ) : null}
      {subject === "kennis" ? (
        <>
          <h2 className="mx-auto w-fit font-light">Theorie</h2>
          <div
            className="w-1/5 bg-[#b5bab6] mx-auto landingline mb-5"
            height={2}
          />
          <div className="flex flex-wrap -m-4">
            {/* Render pieces for Theorie */}
            {artPieces
              .filter((piece) => piece.subject == "THEORIE")
              .map((piece) => (
                <PortfolioItem piece={piece} key={piece.id} />
              ))}
          </div>
          <h2 className="mx-auto w-fit font-light mt-10">Skills</h2>
          <div
            className="w-1/5 bg-[#b5bab6] mx-auto landingline mb-5"
            height={2}
          />
          <div className="flex flex-wrap -m-4">
            {/* Render pieces for Skills */}
            {artPieces
              .filter((piece) => piece.subject == "SKILLS")
              .map((piece) => (
                <PortfolioItem piece={piece} key={piece.id} />
              ))}
          </div>
        </>
      ) : null}
      {subject === "positionering" ? (
        <>
          <h2 className="mx-auto w-fit font-light">Positionering</h2>
          <div
            className="w-1/5 bg-[#b5bab6] mx-auto landingline mb-5"
            height={2}
          />
          <div className="flex flex-wrap -m-4">
            {/* Render pieces for Positionering */}
            {artPieces
              .filter((piece) => piece.subject == "POSITIONERING")
              .map((piece) => (
                <PortfolioItem piece={piece} key={piece.id} />
              ))}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default SubjectPage;
