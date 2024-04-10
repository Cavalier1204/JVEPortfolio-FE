import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/20/solid";
import { useState } from "react";

export default function Carousel({ slides, piece }) {
  let [current, setCurrent] = useState(0);

  let previousSlide = () => {
    if (current === 0) setCurrent(slides.length - 1);
    else setCurrent(current - 1);
  };

  let nextSlide = () => {
    if (current === slides.length - 1) setCurrent(0);
    else setCurrent(current + 1);
  };

  return (
    <div className="overflow-hidden relative h-full w-full">
      <div
        className={`flex transition ease-out duration-400 h-full`}
        style={{
          transform: `translateX(-${(current * 100) / slides.length}%)`,
          width: `${100 * slides.length}%`,
        }}
      >
        {piece.downloadURLs.map((downloadURL, index) => (
          <>
            {piece.media[index].locationReference.startsWith("images") ? (
              <img
                className="object-contain object-center h-auto"
                src={downloadURL}
                alt={`Image ${index + 1}`}
                key={index}
                style={{
                  width: `${100 / slides.length}%`,
                }}
              />
            ) : piece.media[index].locationReference.startsWith("videos") ? (
              <video
                className="object-contain object-center w-full h-auto"
                controls
                muted
                key={index}
              >
                <source src={downloadURL} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : null}
          </>
        ))}
      </div>

      <div className="absolute top-0 h-full w-full justify-between items-center flex text-white px-1">
        <button onClick={previousSlide}>
          <ChevronLeftIcon className="h-5" />
        </button>
        <button onClick={nextSlide}>
          <ChevronRightIcon className="h-5" />
        </button>
      </div>
    </div>
  );
}
