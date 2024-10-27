import { arrayMoveImmutable } from "array-move";
import { useDropzone } from "react-dropzone";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { TrashIcon } from "@heroicons/react/24/outline";

const SortableItem = SortableElement(({ value, onDelete }) => (
  <div className="image-item z-10">
    <img src={value.preview} alt="Preview" className="image-preview" />
    <div
      onClick={() => onDelete(value)}
      className="bg-red-600 text-white p-2 rounded border-2 border-black shadow-md trash-icon w-fit mx-auto"
    >
      <TrashIcon className="h-5 trash-icon" />
    </div>
  </div>
));

const SortableList = SortableContainer(({ items, onDelete }) => {
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
});

const ImageOrderPicker = ({ images, setImages }) => {
  const onDrop = (acceptedFiles) => {
    const newImages = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      }),
    );
    setImages([...images, ...newImages]);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const onSortEnd = ({ oldIndex, newIndex }) => {
    setImages(arrayMoveImmutable(images, oldIndex, newIndex));
  };

  const onDelete = (imageToDelete) => {
    const updatedImages = images.filter((image) => image !== imageToDelete);
    setImages(updatedImages);
  };

  const shouldCancelStart = (event) => {
    if (event.target.closest(".trash-icon")) {
      return true;
    }
    return false;
  };

  return (
    <div className="image-order-picker">
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <p>Sleep foto's en video's hierheen, of klik om te uploaden</p>
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
