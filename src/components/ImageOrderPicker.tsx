import React, { useEffect, useState } from "react";
import { arrayMoveImmutable } from "array-move";
import { useDropzone } from "react-dropzone";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { TrashIcon, ArrowUpTrayIcon } from "@heroicons/react/24/outline";

interface SortableItemProps {
  value: any;
  itemIndex: number;
  onDelete: (val: any) => void;
}

const SortableItem = SortableElement<SortableItemProps>(
  ({ value, itemIndex, onDelete }: SortableItemProps) => (
    <div className="image-item relative z-10 group/item flex flex-col items-center">
      <span className="absolute top-1 left-1 bg-black/70 text-white text-[11px] font-sans px-1.5 py-0.5 rounded pointer-events-none z-20">
        {itemIndex + 1}
      </span>
      <img
        src={
          value.preview ??
          `${import.meta.env.VITE_BUNNY_CDN_URL}/${value.locationReference}`
        }
        alt="Preview"
        className="image-preview w-[100px] h-[100px] object-cover rounded-md border border-gray-300 shadow-sm"
      />
      <button
        type="button"
        aria-label="Verwijder media"
        onClick={() => onDelete(value)}
        className="bg-red-600 hover:bg-red-700 text-white p-1.5 rounded border border-black shadow trash-icon cursor-pointer transition-colors mt-1"
      >
        <TrashIcon
          className="h-4 w-4 trash-icon pointer-events-none"
          aria-hidden="true"
        />
      </button>
    </div>
  ),
);

interface SortableListProps {
  items: any[];
  onDelete: (val: any) => void;
}

const SortableList = SortableContainer<SortableListProps>(
  ({ items, onDelete }: SortableListProps) => {
    return (
      <div className="image-list flex flex-wrap gap-3 justify-center mt-3">
        {items.map((value, index) => (
          <SortableItem
            key={`item-${index}`}
            index={index}
            itemIndex={index}
            value={value}
            onDelete={onDelete}
          />
        ))}
      </div>
    );
  },
);

interface ImageOrderPickerProps {
  images: any[];
  setImages: (images: any[]) => void;
}

const ImageOrderPicker: React.FC<ImageOrderPickerProps> = ({
  images,
  setImages,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const imagesRef = React.useRef(images);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  // Revoke any created object URLs on unmount
  useEffect(() => {
    return () => {
      imagesRef.current.forEach((img) => {
        if (
          img?.preview &&
          typeof img.preview === "string" &&
          img.preview.startsWith("blob:")
        ) {
          URL.revokeObjectURL(img.preview);
        }
      });
    };
  }, []);

  const onDrop = (acceptedFiles: File[]) => {
    setErrorMessage(null);
    const newImages = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      }),
    );
    setImages([...images, ...newImages]);
  };

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept: {
        "image/*": [".jpg", ".jpeg", ".png", ".webp", ".gif"],
        "video/*": [".mp4", ".webm", ".mov"],
      },
      maxSize: 100 * 1024 * 1024,
    });

  useEffect(() => {
    if (fileRejections.length > 0) {
      setErrorMessage(
        "Niet alle bestanden konden worden toegevoegd. Alleen afbeeldingen en video's zijn toegestaan (max 100MB).",
      );
    }
  }, [fileRejections]);

  const onSortEnd = ({
    oldIndex,
    newIndex,
  }: {
    oldIndex: number;
    newIndex: number;
  }) => {
    setImages(arrayMoveImmutable(images, oldIndex, newIndex));
  };

  const onDelete = (imageToDelete: any) => {
    if (
      imageToDelete?.preview &&
      typeof imageToDelete.preview === "string" &&
      imageToDelete.preview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(imageToDelete.preview);
    }
    const updatedImages = images.filter((image) => image !== imageToDelete);
    setImages(updatedImages);
  };

  const shouldCancelStart = (event: any) => {
    if (event.target.closest && event.target.closest(".trash-icon")) {
      return true;
    }
    return false;
  };

  return (
    <div className="image-order-picker w-full flex flex-col items-center">
      <div
        {...getRootProps({
          className: `dropzone w-full p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-all ${
            isDragActive
              ? "border-blue-600 bg-blue-50/60"
              : "border-gray-400 hover:border-gray-600 bg-gray-50/50"
          }`,
        })}
      >
        <input {...getInputProps()} />
        <ArrowUpTrayIcon className="h-8 w-8 text-gray-500 mx-auto mb-2" />
        <p className="text-sm text-gray-700 font-medium">
          {isDragActive
            ? "Laat los om bestanden toe te voegen..."
            : "Sleep foto's en video's hierheen, of klik om te uploaden"}
        </p>
        <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP of MP4</p>
      </div>

      {errorMessage && (
        <p className="text-red-600 text-xs mt-2 text-center" role="alert">
          {errorMessage}
        </p>
      )}

      {images.length > 0 && (
        <>
          <p className="text-xs text-gray-500 mt-3 text-center">
            Sleep afbeeldingen om de weergavevolgorde aan te passen
          </p>
          <SortableList
            items={images}
            onDelete={onDelete}
            onSortEnd={onSortEnd}
            axis="xy"
            shouldCancelStart={shouldCancelStart}
          />
        </>
      )}
    </div>
  );
};

export default ImageOrderPicker;
