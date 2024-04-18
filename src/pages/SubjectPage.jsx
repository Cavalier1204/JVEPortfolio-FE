import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ArtPieceManager from "../services/ArtPieceManager";
import { getDownloadURL, ref } from "firebase/storage";
import { imageUploader } from "../services/Firebase";
import PortfolioItem from "../components/PortfolioItemCard";

const SubjectPage = () => {
  const { year, module, subject } = useParams();
  const [artPieces, setArtPieces] = useState([]);
  const [werkPraktijkPieces1, setWerkPraktijkPieces1] = useState([]);
  const [werkPraktijkPieces2, setWerkPraktijkPieces2] = useState([]);
  const [theoriePieces, setTheoriePieces] = useState([]);
  const [skillsPieces, setSkillsPieces] = useState([]);
  const [positioneringPieces, setPositioneringPieces] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await ArtPieceManager.getManyArtPieces({ year, module });
        setArtPieces(res.data);
      } catch (error) {
        console.error("Error fetching art pieces:", error);
        // Handle error, maybe navigate to an error page
      }
    };

    getData();
  }, [year, module]);

  useEffect(() => {
    const fetchDownloadURLs = async (piece) => {
      // if (piece.media.length > 0) {
      const downloadURLs = await Promise.all(
        piece.media.map(async (mediaItem) => {
          return getDownloadURL(
            ref(imageUploader, mediaItem.locationReference),
          );
        }),
      );
      return { ...piece, downloadURLs };
    };

    // Filter art pieces when artPieces state updates
    const filterArtPieces = async () => {
      const filteredWerkPraktijkPieces1 = [];
      const filteredWerkPraktijkPieces2 = [];
      const filteredTheoriePieces = [];
      const filteredSkillsPieces = [];
      const filteredPositioneringPieces = [];

      // Fetch download URLs for all pieces and filter them accordingly
      await Promise.all(
        artPieces.map(async (piece) => {
          const pieceWithDownloadURL = await fetchDownloadURLs(piece);
          switch (pieceWithDownloadURL.subject) {
            case "WERKPRAKTIJK_1":
              filteredWerkPraktijkPieces1.push(pieceWithDownloadURL);
              break;
            case "WERKPRAKTIJK_2":
              filteredWerkPraktijkPieces2.push(pieceWithDownloadURL);
              break;
            case "THEORIE":
              filteredTheoriePieces.push(pieceWithDownloadURL);
              break;
            case "SKILLS":
              filteredSkillsPieces.push(pieceWithDownloadURL);
              break;
            case "POSITIONERING":
              filteredPositioneringPieces.push(pieceWithDownloadURL);
              break;
            default:
              break;
          }
        }),
      );

      // Update state with filtered pieces
      setWerkPraktijkPieces1(filteredWerkPraktijkPieces1);
      setWerkPraktijkPieces2(filteredWerkPraktijkPieces2);
      setTheoriePieces(filteredTheoriePieces);
      setSkillsPieces(filteredSkillsPieces);
      setPositioneringPieces(filteredPositioneringPieces);
    };

    // Call the filtering function only when artPieces state updates
    if (artPieces.length > 0) {
      filterArtPieces();
    }
  }, [artPieces]);

  return (
    <div className="container px-5 pt-2 pb-10 mx-auto">
      {subject === "werkpraktijk" && (
        <>
          <h2 className="mx-auto w-fit font-light">Werkpraktijk 1</h2>
          <div
            className="w-1/5 bg-[#b5bab6] mx-auto landingline mb-5"
            height={2}
          />
          <div className="flex flex-wrap -m-4">
            {/* Render pieces for Werkpraktijk 1 */}
            {werkPraktijkPieces1.map((piece) => (
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
            {werkPraktijkPieces2.map((piece) => (
              <PortfolioItem piece={piece} key={piece.id} />
            ))}
          </div>
        </>
      )}
      {subject === "kennis" && (
        <>
          <h2 className="mx-auto w-fit font-light">Theorie</h2>
          <div
            className="w-1/5 bg-[#b5bab6] mx-auto landingline mb-5"
            height={2}
          />
          <div className="flex flex-wrap -m-4">
            {/* Render pieces for Werkpraktijk 1 */}
            {theoriePieces.map((piece) => (
              <PortfolioItem piece={piece} key={piece.id} />
            ))}
          </div>
          <h2 className="mx-auto w-fit font-light mt-10">Skills</h2>
          <div
            className="w-1/5 bg-[#b5bab6] mx-auto landingline mb-5"
            height={2}
          />
          <div className="flex flex-wrap -m-4">
            {/* Render pieces for Werkpraktijk 2 */}
            {skillsPieces.map((piece) => (
              <PortfolioItem piece={piece} key={piece.id} />
            ))}
          </div>
        </>
      )}
      {subject === "positionering" && (
        <>
          <h2 className="mx-auto w-fit font-light">Positionering</h2>
          <div
            className="w-1/5 bg-[#b5bab6] mx-auto landingline mb-5"
            height={2}
          />
          <div className="flex flex-wrap -m-4">
            {/* Render pieces for Positionering */}
            {positioneringPieces.map((piece) => (
              <PortfolioItem piece={piece} key={piece.id} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SubjectPage;
