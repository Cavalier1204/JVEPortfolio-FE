import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import SubjectPage from "../../src/pages/SubjectPage";
import ArtPieceManager from "../../src/services/ArtPieceManager";
import { ArtPiece } from "../../src/types";

vi.mock("../../src/services/ArtPieceManager", () => ({
  default: {
    getArtPiecesByYearByModuleBySubject: vi.fn(),
  },
}));

vi.mock("../../src/components/PortfolioItemCard", () => ({
  default: ({ piece, onUpdate, onDelete }: any) => (
    <div data-testid="portfolioItemMock">
      <span>{piece.title}</span>
      <button
        onClick={() => onUpdate({ ...piece, title: "Updated Subject Piece" })}
      >
        Update Subject Piece
      </button>
      <button onClick={() => onDelete(piece.id)}>Delete Subject Piece</button>
    </div>
  ),
}));

const mockPiece: ArtPiece = {
  id: "sp-1",
  title: "Subject Piece 1",
  year: 1,
  module: 1,
  subject: "WERKPRAKTIJK_1",
  media: [],
  createdAt: "2026-01-01",
};

describe("SubjectPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render artpieces and handle piece update and delete", async () => {
    vi.mocked(
      ArtPieceManager.getArtPiecesByYearByModuleBySubject,
    ).mockResolvedValueOnce({
      data: [mockPiece],
    });

    render(
      <MemoryRouter initialEntries={["/module/1/1/werkpraktijk"]}>
        <Routes>
          <Route
            path="/module/:year/:module/:subject"
            element={<SubjectPage />}
          />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Subject Piece 1")).toBeInTheDocument();
      expect(screen.getByText("Werkpraktijk 1")).toBeInTheDocument();
    });

    // Update
    fireEvent.click(screen.getByText("Update Subject Piece"));
    expect(screen.getByText("Updated Subject Piece")).toBeInTheDocument();

    // Delete
    fireEvent.click(screen.getByText("Delete Subject Piece"));
    expect(
      screen.getByText(/Geen portfolio items gevonden voor dit onderdeel/),
    ).toBeInTheDocument();
  });

  it("should display empty message if no pieces match", async () => {
    vi.mocked(
      ArtPieceManager.getArtPiecesByYearByModuleBySubject,
    ).mockResolvedValueOnce({
      data: [],
    });

    render(
      <MemoryRouter initialEntries={["/module/1/1/werkpraktijk"]}>
        <Routes>
          <Route
            path="/module/:year/:module/:subject"
            element={<SubjectPage />}
          />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Geen portfolio items gevonden voor dit onderdeel/),
      ).toBeInTheDocument();
    });
  });

  it("should show error on fetch failure", async () => {
    vi.mocked(
      ArtPieceManager.getArtPiecesByYearByModuleBySubject,
    ).mockRejectedValueOnce(new Error("Subject load fail"));

    render(
      <MemoryRouter initialEntries={["/module/1/1/werkpraktijk"]}>
        <Routes>
          <Route
            path="/module/:year/:module/:subject"
            element={<SubjectPage />}
          />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Er is een fout opgetreden bij het laden van de portfolio items/),
      ).toBeInTheDocument();
    });
  });
});
