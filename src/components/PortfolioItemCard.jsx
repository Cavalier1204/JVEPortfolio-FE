import Carousel from "./Carousel";
import TokenManager from "../services/TokenManager";
import { PencilIcon } from "@heroicons/react/24/outline";
import { TrashIcon } from "@heroicons/react/24/outline";
import Modal from "./Modal";
import { useEffect, useState } from "react";
import ImageOrderPicker from "./ImageOrderPicker";
import { v4 } from "uuid";
import { imageUploader } from "../services/Firebase";
import { deleteObject, ref, uploadBytes } from "firebase/storage";
import ArtPieceManager from "../services/ArtPieceManager";
import { useLocation, useNavigate } from "react-router-dom";
import SubjectEnumToPath from "../services/SubjectParser";

const PortfolioItem = (props) => {
  const [title, setTitle] = useState(props.piece.title);
  const [description, setDescription] = useState(props.piece.description);
  const [year, setYear] = useState(props.piece.year);
  const [module, setModule] = useState(props.piece.module);
  const [media, setMedia] = useState(props.piece.media);
  const [subject, setSubject] = useState(props.piece.subject);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setMedia(props.piece.media);
  }, [props.piece.media]);

  const openEditModal = () => {
    setTitle(props.piece.title);
    setDescription(props.piece.description);
    setYear(props.piece.year);
    setModule(props.piece.module);
    setMedia(props.piece.media);
    setSubject(props.piece.subject);
    setShowEditModal(true);
  };

  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    let deletedMedia = [];
    let newMedia = [];

    props.piece.media.forEach((item) => {
      if (!media.includes(item)) {
        const imageRef = ref(imageUploader, item.locationReference);
        deleteObject(imageRef)
          .then(() => {
            deletedMedia.push(item.id);
          })
          .catch((e) => console.error(e));
      }
    });

    const unfilteredUpdatedMedia = await Promise.all(
      media.map(async (mediaItem, index) => {
        if (mediaItem instanceof File) {
          const fileType = mediaItem.type.split("/")[0];

          let storageRef;
          if (fileType === "image") {
            storageRef = ref(imageUploader, `images/${v4()}`);
          } else if (fileType === "video") {
            storageRef = ref(imageUploader, `videos/${v4()}`);
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

    await ArtPieceManager.updateArtPiece(
      { id, title, description, year, module, subject },
      TokenManager.getAccessToken(),
    ).catch((error) => console.error(error));

    const subjectParam = SubjectEnumToPath(subject);

    await ArtPieceManager.updateMedia(
      id,
      updatedMedia,
      deletedMedia,
      newMedia,
      TokenManager.getAccessToken(),
    )
      .then(() => {
        const url = `/module/${props.piece.year}/${props.piece.module}/${subjectParam}`;
        if (location.pathname === url) {
          window.location.reload();
        } else {
          navigate(url);
        }
      })
      .catch((error) => console.error(error));
  };

  const handleDelete = async (e) => {
    e.preventDefault();

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
        console.log("Error deleting artpiece or media:", e);
        alert("Een is een fout opgetreden bij het verwijderen van het item.");
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
                  <img
                    className="object-contain object-center w-full h-full"
                    src={props.piece.media[0].url}
                    alt={`Image 1`}
                  />
                ) : props.piece.media[0].locationReference.startsWith(
                    "videos",
                  ) ? (
                  <video
                    className="object-contain object-center w-full h-full"
                    controls
                    muted
                  >
                    <source src={props.piece.media[0].url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : null}
              </>
            ) : (
              <Carousel slides={props.piece.media} piece={props.piece} />
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
              <h3>Edit portfolio item</h3>
              <form onSubmit={handleUpdate}>
                <label
                  htmlFor="title"
                  className="block text-gray-500 font-bold mb-5"
                >
                  Titel
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  />
                </label>

                <label
                  htmlFor="description"
                  className="block text-gray-500 font-bold mb-5"
                >
                  Beschrijving
                  <textarea
                    type="text"
                    name="description"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  />
                </label>

                <label
                  htmlFor="year"
                  className="block text-gray-500 font-bold mb-5"
                >
                  Leerjaar
                  <input
                    type="text"
                    name="year"
                    id="year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    required
                    className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  />
                </label>

                <label
                  htmlFor="module"
                  className="block text-gray-500 font-bold mb-5"
                >
                  Module
                  <input
                    type="text"
                    name="module"
                    id="module"
                    value={module}
                    onChange={(e) => setModule(e.target.value)}
                    required
                    className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  />
                </label>

                <label
                  htmlFor="subject"
                  className="block text-gray-500 font-bold mb-5"
                >
                  Vak
                  <select
                    name="subject"
                    id="subject"
                    onChange={(e) => setSubject(e.target.value)}
                    value={subject}
                    className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  >
                    <option value="WERKPRAKTIJK_1">Werkpraktijk 1</option>
                    <option value="WERKPRAKTIJK_2">Werkpraktijk 2</option>
                    <option value="THEORIE">Theorie</option>
                    <option value="SKILLS">Skills</option>
                    <option value="POSITIONERING">Positionering</option>
                    <option value="PORTFOLIO">Officieel portfolio</option>
                  </select>
                </label>

                <label
                  htmlFor="media"
                  className="block text-gray-500 font-bold mb-5"
                >
                  Media
                  <ImageOrderPicker images={media} setImages={setMedia} />
                </label>

                <div className="flex justify-between">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="bg-[#b5bab6] text-white px-4 py-2 rounded border-2 border-[#a1a6a2] shadow-md md:w-1/4"
                  >
                    Sluiten
                  </button>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded border-2 border-blue-700 shadow-md md:w-1/4"
                    type="submit"
                  >
                    Opslaan
                  </button>
                </div>
              </form>
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
                  <button
                    className="border-black border-solid bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded border-2 shadow-md md:w-fit"
                    type="submit"
                  >
                    Verwijderen
                  </button>
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
