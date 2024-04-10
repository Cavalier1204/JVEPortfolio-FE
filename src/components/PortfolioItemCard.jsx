import Carousel from "../components/Carousel.component";

const PortfolioItem = (props) => {
  let slides = [
    "https://flowbite.com/docs/images/carousel/carousel-1.svg",
    "https://flowbite.com/docs/images/carousel/carousel-2.svg",
    "https://flowbite.com/docs/images/carousel/carousel-3.svg",
    "https://flowbite.com/docs/images/carousel/carousel-4.svg",
    "https://flowbite.com/docs/images/carousel/carousel-5.svg",
  ];
  return (
    <div className="p-4 md:w-1/3" key={props.piece.id}>
      <div className="h-fit border-2 border-gray-300 border-opacity-60 rounded-lg">
        {props.piece.media.length > 0 && (
          <div className="lg:h-56 md:h-40">
            {props.piece.media.length === 1 ? (
              <>
                {props.piece.media[0].locationReference.startsWith("images") ? (
                  <img
                    className="object-contain object-center w-full h-full"
                    src={props.piece.downloadURLs[0]}
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
                    <source
                      src={props.piece.downloadURLs[0]}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                ) : null}
              </>
            ) : (
              <Carousel slides={props.piece.media} piece={props.piece} />
            )}
          </div>
        )}
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
    // <div className="w-64 m-auto">
    //   <Carousel slides={slides} />
    // </div>
  );
};

export default PortfolioItem;
