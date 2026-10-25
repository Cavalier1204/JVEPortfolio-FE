import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Carousel from "../../src/components/Carousel";
import { MediaItem } from "../../src/types";

const mockMedia: MediaItem[] = [
  {
    id: "1",
    artPieceId: "art-1",
    locationReference: "images/img1.jpg",
    order: 1,
    createdAt: "2026-01-01",
  },
  {
    id: "2",
    artPieceId: "art-1",
    locationReference: "videos/video1.mp4",
    order: 2,
    createdAt: "2026-01-01",
  },
];

describe("Carousel", () => {
  it("should render media items and navigate using next and previous buttons", () => {
    const { container } = render(<Carousel media={mockMedia} />);

    // Multi items show counter
    expect(screen.getByText("1 / 2")).toBeInTheDocument();

    const nextBtn = screen.getByLabelText("Volgende afbeelding");
    const prevBtn = screen.getByLabelText("Vorige afbeelding");
    const transitionContainer = container.querySelector(".flex.h-full") as HTMLElement;

    // Click next
    fireEvent.click(nextBtn);
    expect(screen.getByText("2 / 2")).toBeInTheDocument();
    fireEvent.transitionEnd(transitionContainer);

    // Click previous
    fireEvent.click(prevBtn);
    expect(screen.getByText("1 / 2")).toBeInTheDocument();
    fireEvent.transitionEnd(transitionContainer);

    // Keyboard arrow keys
    const carouselRoot = container.firstChild as HTMLElement;
    fireEvent.keyDown(carouselRoot, { key: "ArrowRight" });
    expect(screen.getByText("2 / 2")).toBeInTheDocument();
    fireEvent.transitionEnd(transitionContainer);

    fireEvent.keyDown(carouselRoot, { key: "ArrowLeft" });
    expect(screen.getByText("1 / 2")).toBeInTheDocument();
  });

  it("should render single item without counter or navigation arrows", () => {
    render(<Carousel media={[mockMedia[0]]} />);

    expect(screen.queryByLabelText("Volgende afbeelding")).not.toBeInTheDocument();
    expect(screen.queryByText(/1 \/ 1/)).not.toBeInTheDocument();
  });
});
