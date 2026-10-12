import React from "react";
import { arrayMoveImmutable } from "array-move";
import { useDropzone } from "react-dropzone";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { TrashIcon } from "@heroicons/react/24/outline";

interface SortableItemProps {
  value: any;
  onDelete: (val: any) => void;
}

const SortableItem = SortableElement<SortableItemProps>(
  ({ value, onDelete }: SortableItemProps) => (
    <div className="image-item z-10">
      <img
        src={
          value.preview ??
          `${import.meta.env.VITE_BUNNY_CDN_URL}/${value.locationReference}`
        }
        alt="Preview"
        className="image-preview"
      />
      <div
        onClick={() => onDelete(value)}
        className="bg-red-600 text-white p-2 rounded border-2 border-black shadow-md trash-icon w-fit mx-auto cursor-pointer"
      >
        <TrashIcon className="h-5 trash-icon" />
      </div>
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
      <div className="image-list">
        {items.map((value, index) => (
          <SortableItem
            key={`item-${index}`}
            index={index}
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
  const onDrop = (acceptedFiles: File[]) => {
    const newImages = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      }),
    );
    setImages([...images, ...newImages]);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

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
    <div className="image-order-picker">
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <p>
          Sleep foto&apos;s en video&apos;s hierheen, of klik om te uploaden
        </p>
      </div>
      <SortableList
        items={images}
        onDelete={onDelete}
        onSortEnd={onSortEnd}
        axis="xy"
        shouldCancelStart={shouldCancelStart}
      />
    </div>
  );
};

export default ImageOrderPicker;
