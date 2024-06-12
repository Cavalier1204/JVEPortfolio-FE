import Carousel from "./Carousel";
import TokenManager from "../services/TokenManager";
import { PencilIcon } from "@heroicons/react/24/outline";
import { TrashIcon } from "@heroicons/react/24/outline";
import Modal from "./Modal";
import { useEffect, useState } from "react";
import { v4 } from "uuid";
import { imageUploader } from "../services/Firebase";
import { deleteObject, ref, uploadBytes } from "firebase/storage";
import ArtPieceManager from "../services/ArtPieceManager";
import { useLocation, useNavigate } from "react-router-dom";
import SubjectEnumToPath from "../services/SubjectParser";
import ArtPieceForm from "./ArtPieceForm";
import Zoom from "react-medium-image-zoom";
import "../styles.css";
import { fetchPreviewURL } from "../services/MediaUtils";

const PortfolioItem = (props) => {
  const titleHook = useState(props.piece.title);
  const descriptionHook = useState(props.piece.description);
  const yearHook = useState(props.piece.year);
  const moduleHook = useState(props.piece.module);
  const mediaHook = useState(props.piece.media);
  const subjectHook = useState(props.piece.subject);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isMediaConverted, setIsMediaConverted] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const loadingHook = useState(false);

  useEffect(() => {
    if (!isMediaConverted) {
      const convertMedia = async () => {
        const updatedMedia = await Promise.all(
          props.piece.media.map(async (mediaItem) => {
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
        setIsMediaConverted(true);
        props.piece.media = updatedMedia;
        mediaHook[1](updatedMedia);
      };

      if (props.piece.media.length > 0) {
        convertMedia();
      }
    }
  }, [props.piece.media]);

  useEffect(() => {
    mediaHook[1](props.piece.media);
  }, [props.piece.media]);

  const openEditModal = () => {
    titleHook[1](props.piece.title);
    descriptionHook[1](props.piece.description);
    yearHook[1](props.piece.year);
    moduleHook[1](props.piece.module);
    mediaHook[1](props.piece.media);
    subjectHook[1](props.piece.subject);
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

    props.piece.media.forEach((item) => {
      if (!mediaHook[0].includes(item)) {
        const imageRef = ref(imageUploader, item.locationReference);
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
          if (fileType === "image") {
            storageRef = ref(imageUploader, `images/${v4()}.jpg`);
          } else if (fileType === "video") {
            storageRef = ref(imageUploader, `videos/${v4()}.mp4`);
          } else {
            return;
          }

          try {
            const uploadTask = await uploadBytes(storageRef, mediaItem);
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

    const id = props.piece.id;
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

    const subjectParam = SubjectEnumToPath(props.piece.subject);

    await ArtPieceManager.deleteArtPiece(
      props.piece.id,
      TokenManager.getAccessToken(),
    )
      .then(
        props.piece.media.forEach((item) => {
          const imageRef = ref(imageUploader, item.locationReference);
          deleteObject(imageRef).catch((e) => console.error(e));
        }),
      )
      .then(() => {
        const url = `/module/${props.piece.year}/${props.piece.module}/${subjectParam}`;
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
    <div className="p-4 md:w-1/3" key={props.piece.id}>
      <div className="h-fit border-2 border-gray-300 border-opacity-60 rounded-lg group">
        {props.piece.media.length > 0 && (
          <div className="lg:h-56 md:h-40 bg-gray-100">
            {props.piece.media.length === 1 ? (
              <>
                {props.piece.media[0].locationReference.startsWith("images") ? (
                  <Zoom>
                    <img
                      loading="lazy"
                      className="object-contain object-center w-full h-full"
                      src={props.piece.media[0].url}
                      alt={`Image 1`}
                    />
                  </Zoom>
                ) : props.piece.media[0].locationReference.startsWith(
                    "videos",
                  ) ? (
                  <video
                    loading="lazy"
                    className="object-contain object-center w-full h-full"
                    controls
                    muted
                    src={props.piece.media[0].url}
                  />
                ) : null}
              </>
            ) : (
              <Carousel slides={props.piece.media} />
            )}
          </div>
        )}
        <div className="px-6 pb-6 pt-5 relative">
          <h1 className="title-font text-lg font-semibold text-gray-800 mb-3">
            {props.piece.title}
          </h1>
          <p className="leading-relaxed mb-0 text-gray-600">
            {props.piece.description}
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
