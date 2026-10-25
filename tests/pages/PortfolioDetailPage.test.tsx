import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import PortfolioDetailPage from "../../src/pages/PortfolioDetailPage";
import ArtPieceManager from "../../src/services/ArtPieceManager";
import { useAuth } from "../../src/modules/useAuth";
import { ArtPiece } from "../../src/types";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../../src/services/ArtPieceManager", () => ({
  default: {
    getArtPiece: vi.fn(),
  },
}));

vi.mock("../../src/modules/useAuth");

vi.mock("../../src/components/EditArtPieceModal", () => ({
  default: ({ isOpen, onClose, onSaved }: any) =>
    isOpen ? (
      <div data-testid="editModalMock">
        <button
          onClick={() =>
            onSaved({ ...mockPiece, title: "Saved From Edit Modal" })
          }
        >
          Save From Modal
        </button>
        <button onClick={onClose}>Close Edit Modal</button>
      </div>
    ) : null,
}));

vi.mock("../../src/components/DeleteArtPieceModal", () => ({
  default: ({ isOpen, onClose, onDeleted }: any) =>
    isOpen ? (
      <div data-testid="deleteModalMock">
        <button onClick={onDeleted}>Confirm Delete Mock</button>
        <button onClick={onClose}>Close Delete Modal</button>
      </div>
    ) : null,
}));

const mockPiece: ArtPiece = {
  id: "item-10",
  title: "Detail Piece Title",
  description: "Detailed description here",
  year: 2,
  module: 5,
  subject: "THEORIE",
  media: [
    {
      id: "1",
      artPieceId: "item-10",
      locationReference: "images/detail.jpg",
      order: 1,
      createdAt: "2026-01-01",
    },
  ],
  createdAt: "2026-01-01",
};

describe("PortfolioDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render loading state and then display piece details", async () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      authState: { isAuthenticated: false, user: null, claims: null, isLoading: false },
      login: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
    });

    vi.mocked(ArtPieceManager.getArtPiece).mockResolvedValueOnce({
      data: mockPiece,
    });

    render(
      <MemoryRouter initialEntries={["/portfolio/item-10"]}>
        <Routes>
          <Route path="/portfolio/:id" element={<PortfolioDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        screen.getByRole("heading", {
          name: "Detail Piece Title",
          level: 1,
        }),
      ).toBeInTheDocument();
      expect(screen.getByText("Detailed description here")).toBeInTheDocument();
    });

    expect(screen.queryByTestId("editButton")).not.toBeInTheDocument();
    expect(screen.queryByTestId("deleteButton")).not.toBeInTheDocument();
  });

  it("should open edit modal and update piece on saved", async () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      user: { id: "1", username: "admin", role: "admin" },
      isLoading: false,
      authState: {
        isAuthenticated: true,
        user: { id: "1", username: "admin", role: "admin" },
        claims: null,
        isLoading: false,
      },
      login: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
    });

    vi.mocked(ArtPieceManager.getArtPiece).mockResolvedValueOnce({
      data: mockPiece,
    });

    render(
      <MemoryRouter initialEntries={["/portfolio/item-10"]}>
        <Routes>
          <Route path="/portfolio/:id" element={<PortfolioDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("editButton")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("editButton"));
    expect(screen.getByTestId("editModalMock")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Save From Modal"));
    expect(screen.getAllByText("Saved From Edit Modal")[0]).toBeInTheDocument();
  });

  it("should open delete modal and navigate away on deleted", async () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      user: { id: "1", username: "admin", role: "admin" },
      isLoading: false,
      authState: {
        isAuthenticated: true,
        user: { id: "1", username: "admin", role: "admin" },
        claims: null,
        isLoading: false,
      },
      login: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
    });

    vi.mocked(ArtPieceManager.getArtPiece).mockResolvedValueOnce({
      data: mockPiece,
    });

    render(
      <MemoryRouter initialEntries={["/portfolio/item-10"]}>
        <Routes>
          <Route path="/portfolio/:id" element={<PortfolioDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("deleteButton")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("deleteButton"));
    expect(screen.getByTestId("deleteModalMock")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Confirm Delete Mock"));
    expect(mockNavigate).toHaveBeenCalledWith("/module/2/5/kennis", {
      replace: true,
    });
  });

  it("should display error state when piece not found or request fails", async () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      authState: { isAuthenticated: false, user: null, claims: null, isLoading: false },
      login: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
    });

    vi.mocked(ArtPieceManager.getArtPiece).mockRejectedValueOnce(
      new Error("404"),
    );

    render(
      <MemoryRouter initialEntries={["/portfolio/bad-id"]}>
        <Routes>
          <Route path="/portfolio/:id" element={<PortfolioDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Er is een fout opgetreden bij het laden van het portfolio item/),
      ).toBeInTheDocument();
    });
  });
});
