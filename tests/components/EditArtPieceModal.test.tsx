import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import EditArtPieceModal from "../../src/components/EditArtPieceModal";
import ArtPieceManager from "../../src/services/ArtPieceManager";
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
    updateArtPiece: vi.fn(),
    updateMedia: vi.fn(),
    getArtPiece: vi.fn(),
  },
}));

vi.mock("../../src/services/MediaUtils", () => ({
  imageUploader: vi.fn().mockImplementation(async (_media, onProgress) => {
    onProgress?.({ message: "Uploading...", percent: 100 });
    return {
      mediaFiles: [{ locationReference: "images/new-upload.jpg", order: 1 }],
    };
  }),
}));

const mockPiece: ArtPiece = {
  id: "piece-1",
  title: "Original Title",
  description: "Original Description",
  year: 1,
  module: 1,
  subject: "WERKPRAKTIJK_1",
  media: [
    {
      id: "101",
      artPieceId: "piece-1",
      locationReference: "images/1.jpg",
      order: 1,
      createdAt: "2026-01-01",
    },
  ],
  createdAt: "2026-01-01",
};

describe("EditArtPieceModal", () => {
  let modalRoot: HTMLElement;

  beforeEach(() => {
    modalRoot = document.createElement("div");
    modalRoot.setAttribute("id", "modal");
    document.body.appendChild(modalRoot);
    vi.clearAllMocks();
  });

  afterEach(() => {
    if (document.body.contains(modalRoot)) {
      document.body.removeChild(modalRoot);
    }
  });

  it("should return null when isOpen is false", () => {
    const { container } = render(
      <BrowserRouter>
        <EditArtPieceModal
          isOpen={false}
          onClose={vi.fn()}
          piece={mockPiece}
          onSaved={vi.fn()}
        />
      </BrowserRouter>,
    );
    expect(container.firstChild).toBeNull();
  });

  it("should populate fields and submit updates", async () => {
    vi.mocked(ArtPieceManager.updateArtPiece).mockResolvedValueOnce({
      data: { ...mockPiece, title: "Updated Title" },
    });
    vi.mocked(ArtPieceManager.updateMedia).mockResolvedValueOnce(undefined);
    vi.mocked(ArtPieceManager.getArtPiece).mockResolvedValueOnce({
      data: { ...mockPiece, title: "Updated Title" },
    });

    const onSaved = vi.fn();
    const onClose = vi.fn();

    render(
      <BrowserRouter>
        <EditArtPieceModal
          isOpen={true}
          onClose={onClose}
          piece={mockPiece}
          onSaved={onSaved}
        />
      </BrowserRouter>,
    );

    const titleInput = screen.getByTestId("titleInput");
    expect(titleInput).toHaveValue("Original Title");

    fireEvent.change(titleInput, { target: { value: "Updated Title" } });
    fireEvent.click(screen.getByTestId("submitButton"));

    await waitFor(() => {
      expect(ArtPieceManager.updateArtPiece).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "piece-1",
          title: "Updated Title",
        }),
      );
      expect(ArtPieceManager.updateMedia).toHaveBeenCalled();
      expect(onSaved).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Updated Title" }),
      );
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("should handle switching to PORTFOLIO and navigating to /portfolio", async () => {
    const portfolioPiece: ArtPiece = {
      ...mockPiece,
      subject: "PORTFOLIO",
    };

    vi.mocked(ArtPieceManager.updateArtPiece).mockResolvedValueOnce({
      data: portfolioPiece,
    });
    vi.mocked(ArtPieceManager.updateMedia).mockResolvedValueOnce(undefined);
    vi.mocked(ArtPieceManager.getArtPiece).mockRejectedValueOnce(
      new Error("fresh fail"),
    );

    render(
      <BrowserRouter>
        <EditArtPieceModal
          isOpen={true}
          onClose={vi.fn()}
          piece={portfolioPiece}
          onSaved={vi.fn()}
        />
      </BrowserRouter>,
    );

    fireEvent.click(screen.getByTestId("submitButton"));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/portfolio");
    });
  });

  it("should display error message on update failure", async () => {
    vi.mocked(ArtPieceManager.updateArtPiece).mockRejectedValueOnce(
      new Error("Server error"),
    );

    render(
      <BrowserRouter>
        <EditArtPieceModal
          isOpen={true}
          onClose={vi.fn()}
          piece={mockPiece}
          onSaved={vi.fn()}
        />
      </BrowserRouter>,
    );

    fireEvent.click(screen.getByTestId("submitButton"));

    await waitFor(() => {
      expect(
        screen.getByText(/Er is een fout opgetreden bij het opslaan/),
      ).toBeInTheDocument();
    });
  });
});
