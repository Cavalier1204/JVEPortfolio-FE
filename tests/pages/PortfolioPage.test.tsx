import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import PortfolioPage from "../../src/pages/PortfolioPage";
import ArtPieceManager from "../../src/services/ArtPieceManager";
import { ArtPiece } from "../../src/types";

vi.mock("../../src/services/ArtPieceManager", () => ({
  default: {
    getPortfolioPieces: vi.fn(),
  },
}));

vi.mock("../../src/components/PortfolioItemCard", () => ({
  default: ({ piece, onUpdate, onDelete }: any) => (
    <div data-testid="portfolioItemMock">
      <span>{piece.title}</span>
      <button
        onClick={() => onUpdate({ ...piece, title: "Updated in page" })}
      >
        Update Piece
      </button>
      <button onClick={() => onDelete(piece.id)}>Delete Piece</button>
    </div>
  ),
}));

const mockPiece: ArtPiece = {
  id: "p1",
  title: "Official Art 1",
  year: 1,
  module: 1,
  subject: "PORTFOLIO",
  media: [],
  createdAt: "2026-01-01",
};

describe("PortfolioPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should display loading state then render portfolio cards", async () => {
    vi.mocked(ArtPieceManager.getPortfolioPieces).mockResolvedValueOnce({
      data: [mockPiece],
    });

    render(
      <BrowserRouter>
        <PortfolioPage />
      </BrowserRouter>,
    );

    expect(screen.getByText("Laden...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Official Art 1")).toBeInTheDocument();
    });
  });

  it("should handle piece update and delete state changes", async () => {
    vi.mocked(ArtPieceManager.getPortfolioPieces).mockResolvedValueOnce({
      data: [mockPiece],
    });

    render(
      <BrowserRouter>
        <PortfolioPage />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Official Art 1")).toBeInTheDocument();
    });

    // Update
    fireEvent.click(screen.getByText("Update Piece"));
    expect(screen.getByText("Updated in page")).toBeInTheDocument();

    // Delete
    fireEvent.click(screen.getByText("Delete Piece"));
    expect(screen.queryByText("Updated in page")).not.toBeInTheDocument();
    expect(
      screen.getByText("Geen portfolio items gevonden in het portfolio."),
    ).toBeInTheDocument();
  });

  it("should show empty state message when no items returned", async () => {
    vi.mocked(ArtPieceManager.getPortfolioPieces).mockResolvedValueOnce({
      data: [],
    });

    render(
      <BrowserRouter>
        <PortfolioPage />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(
        screen.getByText("Geen portfolio items gevonden in het portfolio."),
      ).toBeInTheDocument();
    });
  });

  it("should display error message and allow retry on failure", async () => {
    vi.mocked(ArtPieceManager.getPortfolioPieces).mockRejectedValueOnce(
      new Error("API failure"),
    );

    render(
      <BrowserRouter>
        <PortfolioPage />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Er is een fout opgetreden bij het laden van het portfolio/),
      ).toBeInTheDocument();
    });

    vi.mocked(ArtPieceManager.getPortfolioPieces).mockResolvedValueOnce({
      data: [mockPiece],
    });

    fireEvent.click(screen.getByText("Opnieuw proberen"));

    await waitFor(() => {
      expect(screen.getByText("Official Art 1")).toBeInTheDocument();
    });
  });
});
