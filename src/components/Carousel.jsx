import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

export default function Carousel({ media }) {
  let [current, setCurrent] = useState(0);

  const previousSlide = () => {
    if (current === 0) setCurrent(media.length - 1);
    else setCurrent(current - 1);
  };

  const nextSlide = () => {
    if (current === media.length - 1) setCurrent(0);
    else setCurrent(current + 1);
  };

  return (
    <div className="overflow-hidden relative h-full w-full">
      <div
        className="flex transition ease-out duration-400 h-full"
        style={{
          transform: `translateX(-${(current * 100) / media.length}%)`,
          width: `${100 * media.length}%`,
        }}
      >
        {media.map((file, index) => (
          <div
            key={index}
            style={{
              width: `${100 / media.length}%`,
            }}
            className="relative"
          >
            {file.locationReference.startsWith("images") ? (
              <>
                <Zoom>
                  <img
                    className={`object-contain object-center h-full mx-auto cursor-zoom-in w-full`}
                    src={`${VITE_BUNNY_CDN_URL}/${file.locationReference}`}
                  />
                </Zoom>
              </>
            ) : file.locationReference.startsWith("videos") ? (
              <video
                className="object-contain object-center h-full mx-auto w-full"
                controls
                muted
                key={index}
                src={`${VITE_BUNNY_CDN_URL}/${file.locationReference}`}
              />
            ) : null}
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      {media.length > 1 && (
        <div className="absolute top-0 h-full w-full justify-between items-center flex text-white px-1 pointer-events-none">
          <button onClick={previousSlide} className="pointer-events-auto">
            <ChevronLeftIcon className="h-10" id="arrow-left" />
          </button>
          <button onClick={nextSlide} className="pointer-events-auto">
            <ChevronRightIcon className="h-10" id="arrow-right" />
          </button>
        </div>
      )}
    </div>
  );
}
