import React, { useEffect, useState, useMemo } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDropzone } from "react-dropzone";
import { TrashIcon, ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { env } from "../config/env";

interface SortableItemProps {
  id: string;
  value: any;
  itemIndex: number;
  onDelete: (val: any) => void;
}

const SortableItem: React.FC<SortableItemProps> = ({
  id,
  value,
  itemIndex,
  onDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 30 : 10,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="image-item relative group/item flex flex-col items-center cursor-grab active:cursor-grabbing select-none"
    >
      <span className="absolute top-1 left-1 bg-black/70 text-white text-[11px] font-sans px-1.5 py-0.5 rounded pointer-events-none z-20">
        {itemIndex + 1}
      </span>
      <img
        src={
          value.preview ?? `${env.BUNNY_NET.CDN_URL}/${value.locationReference}`
        }
        alt="Preview"
        className="image-preview w-[100px] h-[100px] object-cover rounded-md border border-gray-300 shadow-sm pointer-events-none"
      />
      <button
        type="button"
        aria-label="Verwijder media"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onDelete(value);
        }}
        className="bg-red-600 hover:bg-red-700 text-white p-1.5 rounded border border-black shadow trash-icon cursor-pointer transition-colors mt-1 z-20"
      >
        <TrashIcon
          className="h-4 w-4 trash-icon pointer-events-none"
          aria-hidden="true"
        />
      </button>
    </div>
  );
};

interface ImageOrderPickerProps {
  images: any[];
  setImages: (images: any[]) => void;
}

const getItemId = (img: any, index: number): string => {
  return img.id
    ? String(img.id)
    : img.preview || img.locationReference || `item-${index}`;
};

const ImageOrderPicker: React.FC<ImageOrderPickerProps> = ({
  images,
  setImages,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const imagesRef = React.useRef(images);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

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

  const itemsWithId = useMemo(
    () =>
      images.map((img, idx) => ({
        value: img,
        id: getItemId(img, idx),
        itemIndex: idx,
      })),
    [images],
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = itemsWithId.findIndex((item) => item.id === active.id);
      const newIndex = itemsWithId.findIndex((item) => item.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        setImages(arrayMove(images, oldIndex, newIndex));
      }
    }
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
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={itemsWithId.map((i) => i.id)}
              strategy={rectSortingStrategy}
            >
              <div className="image-list flex flex-wrap gap-3 justify-center mt-3">
                {itemsWithId.map(({ id, value, itemIndex }) => (
                  <SortableItem
                    key={id}
                    id={id}
                    value={value}
                    itemIndex={itemIndex}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </>
      )}
    </div>
  );
};

export default ImageOrderPicker;
