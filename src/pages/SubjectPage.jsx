import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ArtPieceManager from "../services/ArtPieceManager";
import { getBytes, ref } from "firebase/storage";
import { imageUploader } from "../services/Firebase";
import PortfolioItem from "../components/PortfolioItemCard";

const SubjectPage = () => {
  const { year, module, subject } = useParams();
  const [artPieces, setArtPieces] = useState([]);
  const [isMediaConverted, setIsMediaConverted] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await ArtPieceManager.getArtPiecesByYearByModuleBySubject({
          year,
          module,
          subject,
        });
        setArtPieces(res.data);
        setIsMediaConverted(false);
      } catch (error) {
        console.error("Error fetching art pieces:", error);
        // Handle error, maybe navigate to an error page
      }
    };

    getData();
  }, [year, module, subject]);

  const fetchPreviewURL = async (locationReference) => {
    const mediaRef = ref(imageUploader, locationReference);
    const bytes = await getBytes(mediaRef);
    const blob = new Blob([bytes]);

    let url;
    let canvas;

    if (locationReference.startsWith("images/")) {
      url = URL.createObjectURL(blob);

      const img = document.createElement("img");
      img.src = url;

      await new Promise((resolve) => {
        img.onload = resolve;
      });

      canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = 100;
      canvas.height = 100;
      ctx.drawImage(img, 0, 0, 100, 100);
    } else if (locationReference.startsWith("videos/")) {
      url = URL.createObjectURL(blob);

      const video = document.createElement("video");
      video.src = url;

      await new Promise((resolve) => {
        video.onloadeddata = () => {
          video.currentTime = 1; // seek to 1 second for the thumbnail
          video.onseeked = resolve;
        };
      });

      canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = 100;
      canvas.height = 100;
      ctx.drawImage(video, 0, 0, 100, 100);
    }

    const preview = canvas.toDataURL("image/jpeg");

    return { preview, url };
  };

  useEffect(() => {
    if (!isMediaConverted) {
      const convertMedia = async () => {
        const updatedArtPieces = await Promise.all(
          artPieces.map(async (piece) => {
            const updatedMedia = await Promise.all(
              piece.media.map(async (mediaItem) => {
                const { preview, url } = await fetchPreviewURL(
                  mediaItem.locationReference,
                );
                return {
                  ...mediaItem,
                  preview,
                  url,
                };
              }),
            );
            return {
              ...piece,
              media: updatedMedia.sort((a, b) => a.order - b.order),
            };
          }),
        );
        setIsMediaConverted(true);
        setArtPieces(updatedArtPieces);
      };

      if (artPieces.length > 0) {
        convertMedia();
      }
    }
  }, [artPieces]);

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
