import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ArtPieceManager from "../services/ArtPieceManager";
import { getDownloadURL, ref } from "firebase/storage";
import { imageUploader } from "../services/Firebase";

const SubjectPage = () => {
  const { year, module, subject } = useParams();
  const [artPieces, setArtPieces] = useState([]);
  const [werkPraktijkPieces, setWerkPraktijkPieces] = useState(null);
  const [kennisVaardighedenPieces, setKennisVaardighedenPieces] =
    useState(null);
  const [positioneringPieces, setPositioneringPieces] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      const artPiecesData = await ArtPieceManager.getManyArtPieces({
        year,
        module,
      });

      setArtPieces(artPiecesData);
      console.log(artPieces);

      if (artPieces) {
        switch (subject) {
          case "werkpraktijk":
            setWerkPraktijkPieces(
              artPieces.filter(
                (item) =>
                  item.subject === "WERKPRAKTIJK_1" ||
                  item.subject === "WERKPRAKTIJK_2",
              ),
            );
            break;
          case "kennis":
            setKennisVaardighedenPieces(
              artPieces.filter(
                (item) =>
                  item.subject === "THEORIE" || item.subject === "SKILLS",
              ),
            );
            break;
          case "positionering":
            setPositioneringPieces(
              artPieces.filter((item) => item.subject === "POSITIONERING"),
            );
            break;
          default:
            navigate("/");
            break;
        }
      }
    };

    getData();
  }, []);

  return (
    <div className="container px-5 py-6 mx-auto">
      <div className="flex flex-wrap -m-4">
        <a
          className="p-4 md:w-1/3"
          href={`/module/${year}/${module}/werkpraktijk`}
        >
          <div className="h-full border-2 border-gray-300 border-opacity-60 rounded-lg overflow-hidden">
            <img
              className="lg:h-48 md:h-36 w-full object-cover object-center"
              src="/werkpraktijk.png"
              alt="blog"
            />
            <div className="px-6 pb-2 pt-5">
              <h2 className="text-xs title-font font-medium text-gray-400">
                Jaar {year}, M{module}
              </h2>
              <h1 className="title-font text-lg font-semibold text-gray-800 mb-3">
                Werkpraktijk
              </h1>
              <p className="leading-relaxed mb-3 text-gray-600">
                Werkpraktijk 1 en Werkprakijk 2
              </p>
            </div>
          </div>
        </a>
        <a className="p-4 md:w-1/3" href={`/module/${year}/${module}/kennis`}>
          <div className="h-full border-2 border-gray-300 border-opacity-60 rounded-lg overflow-hidden">
            <img
              className="lg:h-48 md:h-36 w-full object-cover object-center"
              src="/kennisvaardigheden.jpg"
              alt="blog"
            />
            <div className="px-6 pb-2 pt-5">
              <h2 className="text-xs title-font font-medium text-gray-400">
                Jaar {year}, M{module}
              </h2>
              <h1 className="title-font text-lg font-semibold text-gray-800 mb-3">
                Kennis en Vaardigheden
              </h1>
              <p className="leading-relaxed mb-3 text-gray-600">
                Theorie en Skills
              </p>
            </div>
          </div>
        </a>
        <a
          className="p-4 md:w-1/3"
          href={`/module/${year}/${module}/positionering`}
        >
          <div className="h-full border-2 border-gray-300 border-opacity-60 rounded-lg overflow-hidden">
            <img
              className="lg:h-48 md:h-36 w-full object-cover object-center"
              src="/positionering.jpg"
              alt="blog"
            />
            <div className="px-6 pb-2 pt-5">
              <h2 className="text-xs title-font font-medium text-gray-400">
                Jaar {year}, M{module}
              </h2>
              <h1 className="title-font text-lg font-semibold text-gray-800 mb-3">
                Positionering
              </h1>
              <p className="leading-relaxed mb-3 text-gray-600">
                Positionering
              </p>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
};

export default SubjectPage;
