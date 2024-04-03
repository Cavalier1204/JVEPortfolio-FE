const PortfolioItem = (props) => {
  return (
    <div className="p-4 md:w-1/3" key={props.piece.id}>
      <div className="h-full border-2 border-gray-300 border-opacity-60 rounded-lg overflow-hidden">
        <img
          className="lg:h-56 md:h-44 w-full object-cover object-center"
          src={props.piece.downloadUrl}
        />
        <div className="px-6 pb-2 pt-5">
          <h1 className="title-font text-lg font-semibold text-gray-800 mb-3">
            {props.piece.title}
          </h1>
          <p className="leading-relaxed mb-3 text-gray-600">
            {props.piece.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PortfolioItem;
