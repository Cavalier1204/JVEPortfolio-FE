import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import CreatePage from "../../src/pages/CreateArtPiecePage";
import ArtPieceManager from "../../src/services/ArtPieceManager";
import { imageUploader } from "../../src/services/MediaUtils";
import { useAuth } from "../../src/modules/useAuth";

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
    saveArtPiece: vi.fn(),
  },
}));

vi.mock("../../src/services/MediaUtils", () => ({
  imageUploader: vi.fn().mockImplementation(async (media, onProgress) => {
    onProgress?.({ message: "Uploading...", percent: 50 });
    return {
      mediaFiles: [{ locationReference: "images/uploaded.jpg", order: 1 }],
    };
  }),
}));

vi.mock("../../src/modules/useAuth");

describe("CreateArtPiecePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should redirect to /login if user is unauthenticated", () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      authState: { isAuthenticated: false, user: null, claims: null, isLoading: false },
      login: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
    });

    render(
      <BrowserRouter>
        <CreatePage />
      </BrowserRouter>,
    );

    expect(mockNavigate).toHaveBeenCalledWith("/login", { replace: true });
  });

  it("should submit new artpiece and navigate to module page for development piece", async () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      user: { id: "1", username: "admin", role: "admin" },
      isLoading: false,
      authState: { isAuthenticated: true, user: null, claims: null, isLoading: false },
      login: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
    });

    vi.mocked(ArtPieceManager.saveArtPiece).mockResolvedValueOnce({
      data: {
        id: "new-1",
        title: "Created Piece",
        year: 1,
        module: 1,
        subject: "WERKPRAKTIJK_1",
        media: [],
        createdAt: "2026-01-01",
      },
    });

    render(
      <BrowserRouter>
        <CreatePage />
      </BrowserRouter>,
    );

    fireEvent.change(screen.getByTestId("titleInput"), {
      target: { value: "Created Piece" },
    });
    fireEvent.change(screen.getByTestId("descriptionInput"), {
      target: { value: "Some description" },
    });

    // Attach file
    const file = new File(["dummy content"], "test-art.png", {
      type: "image/png",
    });
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fireEvent.change(fileInput, { target: { files: [file] } });
      await waitFor(() => {
        expect(screen.getByText("1")).toBeInTheDocument();
      });
    }

    fireEvent.click(screen.getByTestId("submitButton"));

    await waitFor(() => {
      expect(imageUploader).toHaveBeenCalled();
      expect(ArtPieceManager.saveArtPiece).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Created Piece",
          description: "Some description",
          subject: "WERKPRAKTIJK_1",
          media: [{ locationReference: "images/uploaded.jpg", order: 1 }],
        }),
      );
      expect(mockNavigate).toHaveBeenCalledWith(
        "/module/1/1/werkpraktijk",
      );
    });
  });

  it("should navigate to /portfolio when OFFICIAL portfolio type is chosen", async () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      user: { id: "1", username: "admin", role: "admin" },
      isLoading: false,
      authState: { isAuthenticated: true, user: null, claims: null, isLoading: false },
      login: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
    });

    vi.mocked(ArtPieceManager.saveArtPiece).mockResolvedValueOnce({
      data: {
        id: "new-2",
        title: "Official Piece",
        year: 1,
        module: 1,
        subject: "PORTFOLIO",
        media: [],
        createdAt: "2026-01-01",
      },
    });

    render(
      <BrowserRouter>
        <CreatePage />
      </BrowserRouter>,
    );

    fireEvent.change(screen.getByTestId("titleInput"), {
      target: { value: "Official Piece" },
    });
    fireEvent.change(screen.getByTestId("descriptionInput"), {
      target: { value: "Official description" },
    });

    fireEvent.change(screen.getByTestId("portfolioTypeSelect"), {
      target: { value: "OFFICIAL" },
    });

    fireEvent.click(screen.getByTestId("submitButton"));

    await waitFor(() => {
      expect(ArtPieceManager.saveArtPiece).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Official Piece",
          subject: "PORTFOLIO",
        }),
      );
      expect(mockNavigate).toHaveBeenCalledWith("/portfolio");
    });
  });

  it("should handle cancellation when clean and dirty with confirm", () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      user: { id: "1", username: "admin", role: "admin" },
      isLoading: false,
      authState: { isAuthenticated: true, user: null, claims: null, isLoading: false },
      login: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
    });

    const { unmount } = render(
      <BrowserRouter>
        <CreatePage />
      </BrowserRouter>,
    );

    // Clean form cancel
    fireEvent.click(screen.getByText("Annuleren"));
    expect(mockNavigate).toHaveBeenCalledWith(-1);

    unmount();

    // Dirty form cancel
    render(
      <BrowserRouter>
        <CreatePage />
      </BrowserRouter>,
    );

    fireEvent.change(screen.getByTestId("titleInput"), {
      target: { value: "Dirty Title" },
    });

    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);
    fireEvent.click(screen.getByText("Annuleren"));
    expect(confirmSpy).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith(-1);
    confirmSpy.mockRestore();
  });

  it("should show error alert when saveArtPiece rejects", async () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      user: { id: "1", username: "admin", role: "admin" },
      isLoading: false,
      authState: { isAuthenticated: true, user: null, claims: null, isLoading: false },
      login: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
    });

    vi.mocked(ArtPieceManager.saveArtPiece).mockRejectedValueOnce(
      new Error("Database error"),
    );

    render(
      <BrowserRouter>
        <CreatePage />
      </BrowserRouter>,
    );

    fireEvent.change(screen.getByTestId("titleInput"), {
      target: { value: "Broken Piece" },
    });
    fireEvent.change(screen.getByTestId("descriptionInput"), {
      target: { value: "Desc" },
    });

    fireEvent.click(screen.getByTestId("submitButton"));

    await waitFor(() => {
      expect(
        screen.getByText(/Er is een fout opgetreden bij het aanmaken van het portfolio item/),
      ).toBeInTheDocument();
    });
  });
});
