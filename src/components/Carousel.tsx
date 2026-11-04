import React, { useState, useEffect, useRef } from "react";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/20/solid";
import Zoom from "react-medium-image-zoom";
import { MediaItem } from "../types";
import { env } from "../config/env";

interface CarouselProps {
  media: MediaItem[];
}

export default function Carousel({ media }: CarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimatingRef = useRef<boolean>(false);

  // If there's 1 or 0 media items, no endless clone is needed
  const isMulti = media.length > 1;

  // Cloned items for seamless endless loop: [last, ...media, first]
  const extendedMedia = isMulti
    ? [media[media.length - 1], ...media, media[0]]
    : media;

  const [currentIndex, setCurrentIndex] = useState<number>(isMulti ? 1 : 0);
  const [withTransition, setWithTransition] = useState<boolean>(true);

  // Pause videos whenever the current slide changes
  useEffect(() => {
    if (containerRef.current) {
      const videos = containerRef.current.querySelectorAll("video");
      videos.forEach((video) => {
        if (!video.paused) {
          video.pause();
        }
      });
    }
  }, [currentIndex]);

  // Re-enable transition after seamless instant snap
  useEffect(() => {
    if (!withTransition) {
      const timer = setTimeout(() => {
        setWithTransition(true);
        isAnimatingRef.current = false;
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [withTransition]);

  const previousSlide = () => {
    if (!isMulti || isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    setWithTransition(true);
    setCurrentIndex((prev) => prev - 1);
  };

  const nextSlide = () => {
    if (!isMulti || isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    setWithTransition(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleTransitionEnd = () => {
    if (!isMulti) return;

    if (currentIndex === extendedMedia.length - 1) {
      // Reached clone of first -> snap silently to real first (index 1)
      setWithTransition(false);
      setCurrentIndex(1);
    } else if (currentIndex === 0) {
      // Reached clone of last -> snap silently to real last (index media.length)
      setWithTransition(false);
      setCurrentIndex(extendedMedia.length - 2);
    } else {
      isAnimatingRef.current = false;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      previousSlide();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      nextSlide();
    }
  };

  // Active index for display / counter (0-indexed to 1..media.length)
  const activeRealIndex = !isMulti
    ? 0
    : currentIndex === 0
      ? media.length - 1
      : currentIndex === extendedMedia.length - 1
        ? 0
        : currentIndex - 1;

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label="Media galerij"
      className="overflow-hidden relative h-full w-full focus:outline-none rounded-lg bg-gray-100 shadow-[inset_0_2px_10px_rgba(0,0,0,0.08)]"
    >
      {/* Inner shadow overlay to frame empty space behind/around media */}
      <div className="pointer-events-none absolute inset-0 rounded-lg shadow-[inset_0_3px_12px_rgba(0,0,0,0.10)] z-10" />

      <div
        onTransitionEnd={handleTransitionEnd}
        className={`flex h-full ${
          withTransition ? "transition-transform ease-out duration-300" : ""
        }`}
        style={{
          transform: `translateX(-${(currentIndex * 100) / extendedMedia.length}%)`,
          width: `${100 * extendedMedia.length}%`,
        }}
      >
        {extendedMedia.map((file, index) => (
          <div
            key={index}
            style={{ width: `${100 / extendedMedia.length}%` }}
            className="relative h-full"
          >
            {file.locationReference.startsWith("images") ? (
              <Zoom>
                <img
                  className="object-contain object-center h-full mx-auto cursor-zoom-in w-full"
                  src={`${env.BUNNY_NET.CDN_URL}/${file.locationReference}`}
                  alt=""
                  loading="lazy"
                />
              </Zoom>
            ) : file.locationReference.startsWith("videos") ? (
              <video
                className="object-contain object-center h-full mx-auto w-full"
                controls
                muted
                key={index}
                src={`${env.BUNNY_NET.CDN_URL}/${file.locationReference}`}
              />
            ) : null}
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      {isMulti && (
        <div className="absolute top-0 h-full w-full justify-between items-center flex text-white px-1 pointer-events-none z-20">
          <button
            type="button"
            onClick={previousSlide}
            aria-label="Vorige afbeelding"
            className="pointer-events-auto hover:opacity-80 transition-opacity"
          >
            <ChevronLeftIcon
              className="h-10 w-10 drop-shadow-md"
              id="arrow-left"
            />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Volgende afbeelding"
            className="pointer-events-auto hover:opacity-80 transition-opacity"
          >
            <ChevronRightIcon
              className="h-10 w-10 drop-shadow-md"
              id="arrow-right"
            />
          </button>
        </div>
      )}

      {/* Counter indicator */}
      {isMulti && (
        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full pointer-events-none select-none font-sans z-20">
          {activeRealIndex + 1} / {media.length}
        </div>
      )}
    </div>
  );
}
