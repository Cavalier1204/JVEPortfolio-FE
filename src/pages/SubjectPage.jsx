import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ArtPieceManager from "../services/ArtPieceManager";
import PortfolioItem from "../components/PortfolioItemCard";
import modules from "../data/modules";

const SubjectPage = () => {
  const { year, module, subject } = useParams();
  const [artPieces, setArtPieces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
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
        // Handle error, maybe navigate to an error page
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [year, module, subject]);

  if (artPieces == null || artPieces.length === 0 || !(subject in modules)) {
    return <p>Geen portfolio items gevonden.</p>;
  }

  return (
    <div className="container px-5 pt-2 pb-10 mx-auto">
      {modules[subject].subjects.map(({ enumName, displayName }, index) => (
        <div key={index}>
          <h2 className="mx-auto w-fit font-light">{displayName}</h2>
          <div
            className="w-1/5 bg-[#b5bab6] mx-auto landingline mb-5"
            height={2}
          />
          <div className="flex flex-wrap -m-4 justify-center">
            {artPieces
              .filter((piece) => piece.subject == enumName)
              .map((piece) => (
                <PortfolioItem piece={piece} key={piece.id} />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SubjectPage;
