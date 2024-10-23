import Carousel from "./Carousel";
import TokenManager from "../services/TokenManager";
import { PencilIcon } from "@heroicons/react/24/outline";
import { TrashIcon } from "@heroicons/react/24/outline";
import Modal from "./Modal";
import { useEffect, useState } from "react";
import { v4 } from "uuid";
import {
  firebaseService,
  deleteObject,
  ref,
  uploadBytes,
} from "../services/Firebase";
import ArtPieceManager from "../services/ArtPieceManager";
import { useLocation, useNavigate } from "react-router-dom";
import SubjectEnumToPath from "../services/SubjectParser";
import ArtPieceForm from "./ArtPieceForm";
import "../styles.css";
import { fetchPreviewURL } from "../services/MediaUtils";
import imageCompression from "browser-image-compression";

const PortfolioItem = ({ piece }) => {
  const titleHook = useState(piece.title);
  const descriptionHook = useState(piece.description);
  const yearHook = useState(piece.year);
  const moduleHook = useState(piece.module);
  const mediaHook = useState(piece.media);
  const subjectHook = useState(piece.subject);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isMediaConverted, setIsMediaConverted] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const loadingHook = useState(false);

  useEffect(() => {
    if (!isMediaConverted) {
      const convertMedia = async () => {
        const updatedMedia = [];
        for (const mediaItem of piece.media) {
          const { preview, url } = await fetchPreviewURL(
            mediaItem.locationReference,
          );
          updatedMedia.push({
            ...mediaItem,
            preview,
            url,
          });
        }

        setIsMediaConverted(true);
        piece.media = updatedMedia;
        mediaHook[1](updatedMedia);
      };

      if (piece.media.length > 0) {
        convertMedia();
      }
    }
  }, [piece.media]);

  useEffect(() => {
    mediaHook[1](piece.media);
  }, [piece.media]);

  const openEditModal = () => {
    titleHook[1](piece.title);
    descriptionHook[1](piece.description);
    yearHook[1](piece.year);
    moduleHook[1](piece.module);
    mediaHook[1](piece.media);
    subjectHook[1](piece.subject);
    setShowEditModal(true);
  };

  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    loadingHook[1](true);

    let deletedMedia = [];
    let newMedia = [];

    piece.media.forEach((item) => {
      if (!mediaHook[0].includes(item)) {
        const imageRef = ref(firebaseService, item.locationReference);
        deleteObject(imageRef)
          .then(() => {
            deletedMedia.push(item.id);
          })
          .catch((e) => console.error(e));
      }
    });

    const unfilteredUpdatedMedia = await Promise.all(
      mediaHook[0].map(async (mediaItem, index) => {
        if (mediaItem instanceof File) {
          const fileType = mediaItem.type.split("/")[0];

          let storageRef;
          let resizedFile = file;

          if (fileType === "image") {
            const options = {
              maxWidthOrHeight: 1920,
              useWebWorker: true,
            };

            try {
              resizedFile = await imageCompression(file, options);
            } catch (error) {
              console.error("Error resizing the image:", error);
            }
          } else if (fileType === "video") {
            storageRef = ref(firebaseService, `videos/${v4()}.mp4`);
          } else {
            return;
          }

          try {
            const uploadTask = await uploadBytes(storageRef, resizedFile);
            const relativePath = storageRef.fullPath;

            newMedia.push({
              locationReference: relativePath,
              order: index + 1,
            });
            return null;
          } catch (error) {
            console.error("Error uploading file:", error);
          }
        } else {
          return {
            id: mediaItem.id,
            artPieceId: mediaItem.artPieceId,
            createdAt: mediaItem.createdAt,
            locationReference: mediaItem.locationReference,
            order: index + 1,
          };
        }
      }),
    );

    const updatedMedia = unfilteredUpdatedMedia.filter((item) => item !== null);

    const id = piece.id;
    const title = titleHook[0];
    const description = descriptionHook[0];
    const year = parseInt(yearHook[0]);
    const module = parseInt(moduleHook[0]);
    const subject = subjectHook[0];

    await ArtPieceManager.updateArtPiece(
      { id, title, description, year, module, subject },
      TokenManager.getAccessToken(),
    ).catch((error) => {
      console.error(error);
      loadingHook[1](false);
    });

    const subjectParam = SubjectEnumToPath(subject);

    await ArtPieceManager.updateMedia(
      id,
      updatedMedia,
      deletedMedia,
      newMedia,
      TokenManager.getAccessToken(),
    )
      .then(() => {
        const url = `/module/${year}/${module}/${subjectParam}`;
        if (location.pathname === url) {
          window.location.reload();
        } else {
          navigate(url);
        }
      })
      .catch((error) => {
        console.error(error);
        loadingHook[1](false);
      });
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    loadingHook[1](true);

    const subjectParam = SubjectEnumToPath(piece.subject);

    await ArtPieceManager.deleteArtPiece(
      piece.id,
      TokenManager.getAccessToken(),
    )
      .then(
        piece.media.forEach((item) => {
          const imageRef = ref(firebaseService, item.locationReference);
          deleteObject(imageRef).catch((e) => console.error(e));
        }),
      )
      .then(() => {
        const url = `/module/${piece.year}/${piece.module}/${subjectParam}`;
        if (location.pathname === url) {
          window.location.reload();
        } else {
          navigate(url);
        }
      })
      .catch((e) => {
        console.error("Error deleting artpiece or media:", e);
        loadingHook[1](false);
        alert(
          "Een is een fout opgetreden bij het verwijderen van het item. Probeer het later opnieuw.",
        );
      });
  };

  return (
    <div className="p-4 md:w-1/3" key={piece.id}>
      <div className="h-fit border-2 border-gray-300 border-opacity-60 rounded-lg group">
        {piece.media.length > 0 && (
          <div className="lg:h-56 md:h-40 bg-gray-100">
            <Carousel slides={piece.media} />
          </div>
        )}
        <div className="px-6 pb-6 pt-5 relative">
          <h1 className="title-font text-lg font-semibold text-gray-800 mb-3">
            {piece.title}
          </h1>
          <p className="leading-relaxed mb-0 text-gray-600 whitespace-pre-line">
            {piece.description}
          </p>
          {TokenManager.getClaims() ? (
            <>
              <div
                className="hidden group-hover:block absolute p-2 border-black border-solid border-2 rounded bg-red-600 hover:bg-red-700 bottom-6 left-6 text-white"
                onClick={() => openDeleteModal()}
              >
                <TrashIcon className="h-6" />
              </div>
              <div
                className="hidden group-hover:block absolute p-2 border-gray-200 border-solid border-2 rounded bg-white hover:bg-gray-200 bottom-6 right-6"
                onClick={() => openEditModal()}
              >
                <PencilIcon className="h-6" />
              </div>
            </>
          ) : null}
          {showEditModal ? (
            <Modal>
              <ArtPieceForm
                onSubmit={handleUpdate}
                headerText="Portfolio item aanpassen"
                titleHook={titleHook}
                descriptionHook={descriptionHook}
                yearHook={yearHook}
                moduleHook={moduleHook}
                subjectHook={subjectHook}
                mediaHook={mediaHook}
                onClose={() => setShowEditModal(false)}
                loadingHook={loadingHook}
              />
            </Modal>
          ) : null}
          {showDeleteModal ? (
            <Modal>
              <h3>Portfolio item verwijderen</h3>
              <form onSubmit={handleDelete}>
                <h4 className="font-normal my-5">
                  Weet je zeker dat je dit item wilt verwijderen?
                </h4>
                <div className="flex justify-between">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="bg-[#b5bab6] text-white px-4 py-2 rounded border-2 border-[#a1a6a2] shadow-md md:w-fit"
                  >
                    Annuleren
                  </button>
                  {loadingHook[0] ? (
                    <button
                      type="button"
                      className="border-black border-solid bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded border-2 shadow-md md:w-fit flex cursor-not-allowed"
                      disabled
                    >
                      <svg
                        className="animate-spin h-5 w-5 mr-3"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                      </svg>
                      Verwijderen...
                    </button>
                  ) : (
                    <button
                      className="border-black border-solid bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded border-2 shadow-md md:w-fit"
                      type="submit"
                    >
                      Verwijderen
                    </button>
                  )}
                </div>
              </form>
            </Modal>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default PortfolioItem;
