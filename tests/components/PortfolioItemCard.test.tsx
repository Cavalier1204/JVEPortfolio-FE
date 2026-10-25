import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import PortfolioItem from "../../src/components/PortfolioItemCard";
import { ArtPiece } from "../../src/types";

const mockPiece: ArtPiece = {
  id: "item-1",
  title: "Test Artpiece Title",
  description: "Test description",
  year: 1,
  module: 2,
  subject: "WERKPRAKTIJK_1",
  media: [],
  createdAt: "2026-01-01",
};

describe("PortfolioItemCard", () => {
  it("should render title and not render placeholder when no media is present", () => {
    render(
      <BrowserRouter>
        <PortfolioItem piece={mockPiece} />
      </BrowserRouter>,
    );

    expect(screen.getByTestId("artpieceTitle")).toHaveTextContent(
      "Test Artpiece Title",
    );
    expect(screen.queryByText("Geen afbeelding")).not.toBeInTheDocument();
    expect(screen.getByTestId("artpieceCard")).toBeInTheDocument();
  });

  it("should render image when image media is present", () => {
    const pieceWithImage: ArtPiece = {
      ...mockPiece,
      media: [
        {
          id: "1",
          artPieceId: "item-1",
          locationReference: "images/photo.jpg",
          order: 1,
          createdAt: "2026-01-01",
        },
      ],
    };

    render(
      <BrowserRouter>
        <PortfolioItem piece={pieceWithImage} />
      </BrowserRouter>,
    );

    const img = screen.getByRole("img");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute(
      "src",
      expect.stringContaining("images/photo.jpg"),
    );
    expect(screen.getByTestId("artpieceTitle")).toHaveTextContent(
      "Test Artpiece Title",
    );
  });

  it("should render video when video media is present", () => {
    const pieceWithVideo: ArtPiece = {
      ...mockPiece,
      media: [
        {
          id: "1",
          artPieceId: "item-1",
          locationReference: "videos/clip.mp4",
          order: 1,
          createdAt: "2026-01-01",
        },
      ],
    };

    const { container } = render(
      <BrowserRouter>
        <PortfolioItem piece={pieceWithVideo} />
      </BrowserRouter>,
    );

    const video = container.querySelector("video");
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute(
      "src",
      expect.stringContaining("videos/clip.mp4"),
    );
  });

  it("should sort media items by order and pick the first one", () => {
    const pieceWithMultipleMedia: ArtPiece = {
      ...mockPiece,
      media: [
        {
          id: "2",
          artPieceId: "item-1",
          locationReference: "images/second.jpg",
          order: 2,
          createdAt: "2026-01-01",
        },
        {
          id: "1",
          artPieceId: "item-1",
          locationReference: "images/first.jpg",
          order: 1,
          createdAt: "2026-01-01",
        },
      ],
    };

    render(
      <BrowserRouter>
        <PortfolioItem piece={pieceWithMultipleMedia} />
      </BrowserRouter>,
    );

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute(
      "src",
      expect.stringContaining("images/first.jpg"),
    );
  });

  it("should use preview url when provided on media item", () => {
    const pieceWithPreview: any = {
      ...mockPiece,
      media: [
        {
          id: 1,
          artPieceId: "item-1",
          preview: "blob:custom-preview-url",
          locationReference: "other/custom.png",
          order: 1,
          createdAt: "2026-01-01",
        },
      ],
    };

    render(
      <BrowserRouter>
        <PortfolioItem piece={pieceWithPreview} />
      </BrowserRouter>,
    );

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "blob:custom-preview-url");
  });
});
