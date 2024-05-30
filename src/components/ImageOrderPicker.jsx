import { arrayMoveImmutable, arrayMoveMutable } from "array-move";
import { useDropzone } from "react-dropzone";
import { SortableContainer, SortableElement } from "react-sortable-hoc";

const SortableItem = SortableElement(({ value, onDelete }) => (
  <div className="image-item">
    <img src={value.preview} alt="Preview" className="image-preview" />
    <button
      onClick={() => onDelete(value)}
      className="bg-red-600 text-white px-4 py-2 rounded border-2 border-black shadow-md"
    >
      Delete
    </button>
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
      />
    </div>
  );
};

export default ImageOrderPicker;
