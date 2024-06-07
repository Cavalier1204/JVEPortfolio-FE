import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

export default function Carousel({ slides }) {
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
        className="flex transition ease-out duration-400 h-full"
        style={{
          transform: `translateX(-${(current * 100) / slides.length}%)`,
          width: `${100 * slides.length}%`,
        }}
      >
        {slides.map((file, index) => (
          <div
            key={index}
            style={{
              width: `${100 / slides.length}%`,
            }}
          >
            {file.locationReference.startsWith("images") ? (
              <Zoom>
                <img
                  className="object-contain object-center h-full mx-auto cursor-zoom-in"
                  src={file.url}
                  alt={`Image ${index + 1}`}
                  key={index}
                />
              </Zoom>
            ) : file.locationReference.startsWith("videos") ? (
              <video
                className="object-contain object-center h-full mx-auto"
                controls
                muted
                key={index}
                src={file.url}
              />
            ) : //   <source  type="video/mp4" />
            //   Your browser does not support the video tag.
            // </video>
            null}
          </div>
        ))}
      </div>

      <div className="absolute top-0 h-full w-full justify-between items-center flex text-white px-1 pointer-events-none">
        <button onClick={previousSlide} className="pointer-events-auto">
          <ChevronLeftIcon className="h-10" id="arrow-left" />
        </button>
        <button onClick={nextSlide} className="pointer-events-auto">
          <ChevronRightIcon className="h-10" id="arrow-right" />
        </button>
      </div>
    </div>
  );
}
