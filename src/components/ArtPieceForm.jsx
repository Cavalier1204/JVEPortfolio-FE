import ImageOrderPicker from "./ImageOrderPicker";

export default function ArtPieceForm({
  onSubmit,
  headerText,
  titleHook,
  descriptionHook,
  yearHook,
  moduleHook,
  subjectHook,
  mediaHook,
  onClose,
}) {
  return (
    <form onSubmit={onSubmit}>
      <h3>{headerText}</h3>
      <label htmlFor="title" className="block text-gray-500 font-bold mb-5">
        Titel
        <input
          type="text"
          name="title"
          id="title"
          value={titleHook[0]}
          onChange={(e) => titleHook[1](e.target.value)}
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
          value={descriptionHook[0]}
          onChange={(e) => descriptionHook[1](e.target.value)}
          required
          className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
        />
      </label>

      <label htmlFor="year" className="block text-gray-500 font-bold mb-5">
        Leerjaar
        <input
          type="text"
          name="year"
          id="year"
          value={yearHook[0]}
          onChange={(e) => yearHook[1](e.target.value)}
          required
          className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
        />
      </label>

      <label htmlFor="module" className="block text-gray-500 font-bold mb-5">
        Module
        <input
          type="text"
          name="module"
          id="module"
          value={moduleHook[0]}
          onChange={(e) => moduleHook[1](e.target.value)}
          required
          className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
        />
      </label>

      <label htmlFor="subject" className="block text-gray-500 font-bold mb-5">
        Vak
        <select
          name="subject"
          id="subject"
          onChange={(e) => subjectHook[1](e.target.value)}
          value={subjectHook[0]}
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

      <label htmlFor="media" className="block text-gray-500 font-bold mb-5">
        Media
        <ImageOrderPicker images={mediaHook[0]} setImages={mediaHook[1]} />
      </label>

      <div className="flex justify-between">
        <button
          onClick={onClose}
          className="bg-[#b5bab6] text-white px-4 py-2 rounded border-2 border-[#a1a6a2] shadow-md md:w-1/4"
        >
          Annuleren
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded border-2 border-blue-700 shadow-md md:w-1/4"
          type="submit"
        >
          Opslaan
        </button>
      </div>
    </form>
  );
}
