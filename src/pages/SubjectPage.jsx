import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ArtPieceManager from "../services/ArtPieceManager";
import { getDownloadURL, ref } from "firebase/storage";
import { imageUploader } from "../services/Firebase";

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
        console.log(artPieces);
      } catch (error) {
        console.error("Error fetching art pieces:", error);
        // Handle error, maybe navigate to an error page
      }
    };

    getData();
  }, [year, module]); // Add dependencies for useEffect

  // Filter art pieces when artPieces state updates
  useEffect(() => {
    console.log(artPieces);
    console.log(werkPraktijkPieces1);
    console.log(werkPraktijkPieces2);
    console.log(theoriePieces);
    console.log(skillsPieces);
    console.log(positioneringPieces);
    if (artPieces.length > 0) {
      setWerkPraktijkPieces1(
        artPieces.filter((item) => item.subject === "WERKPRAKTIJK_1"),
      );
      setWerkPraktijkPieces2(
        artPieces.filter((item) => item.subject === "WERKPRAKTIJK_2"),
      );
      setTheoriePieces(artPieces.filter((item) => item.subject === "THEORIE"));
      setSkillsPieces(artPieces.filter((item) => item.subject === "SKILLS"));
      setPositioneringPieces(
        artPieces.filter((item) => item.subject === "POSITIONERING"),
      );
    }
  }, [artPieces]);

  return (
    <div className="container px-5 py-2 mx-auto">
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
              <div className="p-4 md:w-1/3" key={piece.id}>
                <div className="h-full border-2 border-gray-300 border-opacity-60 rounded-lg overflow-hidden">
                  <img
                    className="lg:h-48 md:h-36 w-full object-cover object-center"
                    src={getDownloadURL(
                      ref(imageUploader, piece.media[0].locationReference),
                    )}
                  />
                  <div className="px-6 pb-2 pt-5">
                    {/* <h2 className="text-xs title-font font-medium text-gray-400">
                      {piece.title}
                    </h2> */}
                    <h1 className="title-font text-lg font-semibold text-gray-800 mb-3">
                      {piece.title}
                    </h1>
                    <p className="leading-relaxed mb-3 text-gray-600">
                      {piece.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <h2 className="mx-auto w-fit font-light">Werkpraktijk 2</h2>
          <div
            className="w-1/5 bg-[#b5bab6] mx-auto landingline mb-5"
            height={2}
          />
          <div className="flex flex-wrap -m-4">
            {/* Render pieces for Werkpraktijk 2 */}
            {werkPraktijkPieces2.map((piece) => (
              <div className="p-4 md:w-1/3" key={piece.id}>
                <div className="h-full border-2 border-gray-300 border-opacity-60 rounded-lg overflow-hidden">
                  <img
                    className="lg:h-48 md:h-36 w-full object-cover object-center"
                    src={getDownloadURL(
                      ref(imageUploader, piece.media[0].locationReference),
                    )}
                  />
                  <div className="px-6 pb-2 pt-5">
                    {/* <h2 className="text-xs title-font font-medium text-gray-400">
                    {piece.title}
                  </h2> */}
                    <h1 className="title-font text-lg font-semibold text-gray-800 mb-3">
                      {piece.title}
                    </h1>
                    <p className="leading-relaxed mb-3 text-gray-600">
                      {piece.description}
                    </p>
                  </div>
                </div>
              </div>
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
              <div className="p-4 md:w-1/3" key={piece.id}>
                <div className="h-full border-2 border-gray-300 border-opacity-60 rounded-lg overflow-hidden">
                  <img
                    className="lg:h-48 md:h-36 w-full object-cover object-center"
                    src={getDownloadURL(
                      ref(imageUploader, piece.media[0].locationReference),
                    )}
                  />
                  <div className="px-6 pb-2 pt-5">
                    {/* <h2 className="text-xs title-font font-medium text-gray-400">
                    {piece.title}
                  </h2> */}
                    <h1 className="title-font text-lg font-semibold text-gray-800 mb-3">
                      {piece.title}
                    </h1>
                    <p className="leading-relaxed mb-3 text-gray-600">
                      {piece.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <h2 className="mx-auto w-fit font-light">Skills</h2>
          <div
            className="w-1/5 bg-[#b5bab6] mx-auto landingline mb-5"
            height={2}
          />
          <div className="flex flex-wrap -m-4">
            {/* Render pieces for Werkpraktijk 2 */}
            {skillsPieces.map((piece) => (
              <div className="p-4 md:w-1/3" key={piece.id}>
                <div className="h-full border-2 border-gray-300 border-opacity-60 rounded-lg overflow-hidden">
                  <img
                    className="lg:h-48 md:h-36 w-full object-cover object-center"
                    src={getDownloadURL(
                      ref(imageUploader, piece.media[0].locationReference),
                    )}
                  />
                  <div className="px-6 pb-2 pt-5">
                    {/* <h2 className="text-xs title-font font-medium text-gray-400">
                    {piece.title}
                  </h2> */}
                    <h1 className="title-font text-lg font-semibold text-gray-800 mb-3">
                      {piece.title}
                    </h1>
                    <p className="leading-relaxed mb-3 text-gray-600">
                      {piece.description}
                    </p>
                  </div>
                </div>
              </div>
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
              <div className="p-4 md:w-1/3" key={piece.id}>
                <div className="h-full border-2 border-gray-300 border-opacity-60 rounded-lg overflow-hidden">
                  <img
                    className="lg:h-48 md:h-36 w-full object-cover object-center"
                    src={getDownloadURL(
                      ref(imageUploader, piece.media[0].locationReference),
                    )}
                  />
                  <div className="px-6 pb-2 pt-5">
                    {/* <h2 className="text-xs title-font font-medium text-gray-400">
                    {piece.title}
                  </h2> */}
                    <h1 className="title-font text-lg font-semibold text-gray-800 mb-3">
                      {piece.title}
                    </h1>
                    <p className="leading-relaxed mb-3 text-gray-600">
                      {piece.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SubjectPage;
