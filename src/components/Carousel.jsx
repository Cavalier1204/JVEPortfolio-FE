import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

export default function Carousel({ media }) {
  let [current, setCurrent] = useState(0);
  const [loadingStates, setLoadingStates] = useState(
    new Array(media.length).fill(true), // Initialize loading state for each item
  );

  const previousSlide = () => {
    if (current === 0) setCurrent(media.length - 1);
    else setCurrent(current - 1);
  };

  const nextSlide = () => {
    if (current === media.length - 1) setCurrent(0);
    else setCurrent(current + 1);
  };

  const handleLoad = (index) => {
    setLoadingStates((prev) => {
      const newLoadingStates = [...prev];
      newLoadingStates[index] = false;
      return newLoadingStates;
    });
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
            {/* Loading spinner */}
            {loadingStates[index] && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="w-8 h-8 border-4 border-t-transparent border-gray-300 rounded-full animate-spin"></div>
              </div>
            )}
            {file.locationReference.startsWith("images") ? (
              <>
                <Zoom>
                  <img
                    loading="lazy"
                    className={`object-contain object-center h-full mx-auto cursor-zoom-in w-full ${
                      loadingStates[index] ? "invisible" : "visible"
                    }`}
                    src={file.url}
                    alt={`Image ${index + 1}`}
                    onLoad={() => handleLoad(index)}
                  />
                </Zoom>
              </>
            ) : file.locationReference.startsWith("videos") ? (
              <video
                loading="lazy"
                className="object-contain object-center h-full mx-auto w-full"
                controls
                muted
                key={index}
                src={file.url}
                onLoadedData={() => handleLoad(index)}
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
