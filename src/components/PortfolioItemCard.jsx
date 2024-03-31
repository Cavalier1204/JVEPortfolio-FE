const PortfolioItem = (props) => {
  return (
    <div className="border-solid rounded border-black border-2 flex w-full">
      <img src={props.image} />
      <div className="p-2 w-full">
        <h1 className="font-bold">{props.title}</h1>
        {props.description}
      </div>
    </div>
  );
};

export default PortfolioItem;
