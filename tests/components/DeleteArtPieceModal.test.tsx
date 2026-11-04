import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DeleteArtPieceModal from "../../src/components/DeleteArtPieceModal";
import ArtPieceManager from "../../src/services/ArtPieceManager";
import { ArtPiece } from "../../src/types";

vi.mock("../../src/services/ArtPieceManager", () => ({
  default: {
    deleteArtPiece: vi.fn(),
  },
}));

const mockPiece: ArtPiece = {
  id: "del-123",
  title: "Painting to delete",
  year: 1,
  module: 1,
  subject: "WERKPRAKTIJK_1",
  media: [],
  createdAt: "2026-01-01",
};

describe("DeleteArtPieceModal", () => {
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

  it("should return null if isOpen is false", () => {
    const { container } = render(
      <DeleteArtPieceModal
        isOpen={false}
        onClose={vi.fn()}
        piece={mockPiece}
        onDeleted={vi.fn()}
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("should call deleteArtPiece, onDeleted, and onClose upon submission", async () => {
    vi.mocked(ArtPieceManager.deleteArtPiece).mockResolvedValueOnce({
      message: "deleted",
    });
    const onClose = vi.fn();
    const onDeleted = vi.fn();

    render(
      <DeleteArtPieceModal
        isOpen={true}
        onClose={onClose}
        piece={mockPiece}
        onDeleted={onDeleted}
      />,
    );

    expect(screen.getByText("Portfolio item verwijderen")).toBeInTheDocument();
    const deleteBtn = screen.getByTestId("confirmDeleteButton");

    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(ArtPieceManager.deleteArtPiece).toHaveBeenCalledWith("del-123");
      expect(onDeleted).toHaveBeenCalledWith("del-123");
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("should display error message when deletion fails", async () => {
    vi.mocked(ArtPieceManager.deleteArtPiece).mockRejectedValueOnce(
      new Error("Fail"),
    );

    render(
      <DeleteArtPieceModal
        isOpen={true}
        onClose={vi.fn()}
        piece={mockPiece}
        onDeleted={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByTestId("confirmDeleteButton"));

    await waitFor(() => {
      expect(
        screen.getByText(/Er is een fout opgetreden bij het verwijderen/),
      ).toBeInTheDocument();
    });
  });
});
