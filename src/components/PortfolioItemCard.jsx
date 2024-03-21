const PortfolioItem = (props) => {
  return (
    <div className="border-solid rounded border-black border-2 flex w-full">
      <img src="https://picsum.photos/200" />
      <div className="p-2 w-full">
        <h1 className="font-bold">{props.title}</h1>
        <h2>Made on: {props.time}</h2>
        {props.description}
      </div>
    </div>
  );
};

export default PortfolioItem;
