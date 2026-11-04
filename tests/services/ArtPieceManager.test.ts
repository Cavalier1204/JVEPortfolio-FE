import { describe, it, expect, vi } from "vitest";
import ArtPieceManager from "../../src/services/ArtPieceManager";
import apiClient from "../../src/services/apiClient";

vi.mock("../../src/services/apiClient", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("ArtPieceManager", () => {
  it("getArtPiece should call /artPiece/:id", async () => {
    const mockData = { data: { id: "1", title: "Piece 1" } };
    vi.mocked(apiClient.get).mockResolvedValue({ data: mockData });

    const res = await ArtPieceManager.getArtPiece("1");
    expect(apiClient.get).toHaveBeenCalledWith("/artPiece/1");
    expect(res).toEqual(mockData);
  });

  it("getArtPiecesByYearByModule should parse strings and call /artPiece/module", async () => {
    const mockData = { data: [{ id: "1" }] };
    vi.mocked(apiClient.get).mockResolvedValue({ data: mockData });

    const res = await ArtPieceManager.getArtPiecesByYearByModule({
      year: "2",
      module: "4",
    });
    expect(apiClient.get).toHaveBeenCalledWith("/artPiece/module", {
      params: { year: 2, module: 4 },
    });
    expect(res).toEqual(mockData);
  });

  it("getArtPiecesByYearByModuleBySubject should call /artPiece/subject", async () => {
    const mockData = { data: [{ id: "1" }] };
    vi.mocked(apiClient.get).mockResolvedValue({ data: mockData });

    const res = await ArtPieceManager.getArtPiecesByYearByModuleBySubject({
      year: "1",
      module: "2",
      subject: "WERKPRAKTIJK_1",
    });
    expect(apiClient.get).toHaveBeenCalledWith("/artPiece/subject", {
      params: { year: 1, module: 2, subject: "WERKPRAKTIJK_1" },
    });
    expect(res).toEqual(mockData);
  });

  it("getPortfolioPieces should call /artPiece/portfolio", async () => {
    const mockData = { data: [{ id: "p1" }] };
    vi.mocked(apiClient.get).mockResolvedValue({ data: mockData });

    const res = await ArtPieceManager.getPortfolioPieces();
    expect(apiClient.get).toHaveBeenCalledWith("/artPiece/portfolio");
    expect(res).toEqual(mockData);
  });

  it("saveArtPiece should format payload and call POST /artPiece", async () => {
    const mockData = { data: { id: "new1" } };
    vi.mocked(apiClient.post).mockResolvedValue({ data: mockData });

    const res = await ArtPieceManager.saveArtPiece({
      title: "Art 1",
      description: "Desc",
      year: "1" as unknown as number,
      module: "2" as unknown as number,
      subject: "THEORIE",
      media: [
        { locationReference: "ref1" } as any,
        { locationReference: "ref2", order: 5 },
      ],
    });

    expect(apiClient.post).toHaveBeenCalledWith("/artPiece", {
      title: "Art 1",
      description: "Desc",
      year: 1,
      module: 2,
      subject: "THEORIE",
      media: [
        { locationReference: "ref1", order: 1 },
        { locationReference: "ref2", order: 5 },
      ],
    });
    expect(res).toEqual(mockData);
  });

  it("deleteArtPiece should call DELETE /artPiece/:id", async () => {
    const mockData = { message: "deleted" };
    vi.mocked(apiClient.delete).mockResolvedValue({ data: mockData });

    const res = await ArtPieceManager.deleteArtPiece("123");
    expect(apiClient.delete).toHaveBeenCalledWith("/artPiece/123");
    expect(res).toEqual(mockData);
  });

  it("updateArtPiece should pass defined fields to PUT /artPiece/:id", async () => {
    const mockData = { data: { id: "123", title: "Updated" } };
    vi.mocked(apiClient.put).mockResolvedValue({ data: mockData });

    const res = await ArtPieceManager.updateArtPiece({
      id: "123",
      title: "Updated",
      year: "3" as unknown as number,
      module: "7" as unknown as number,
      subject: "SKILLS",
      deletedMedia: ["del1"],
      updatedMedia: [{ id: "up1", order: 2 }],
      newMedia: [{ locationReference: "new1", order: 1 }],
    });

    expect(apiClient.put).toHaveBeenCalledWith("/artPiece/123", {
      title: "Updated",
      year: 3,
      module: 7,
      subject: "SKILLS",
      deletedMedia: ["del1"],
      updatedMedia: [{ id: "up1", order: 2 }],
      newMedia: [{ locationReference: "new1", order: 1 }],
    });
    expect(res).toEqual(mockData);

    // Call with empty params and number year/module
    await ArtPieceManager.updateArtPiece({
      id: "123",
      year: 2,
      module: 5,
    });
    expect(apiClient.put).toHaveBeenCalledWith("/artPiece/123", {
      year: 2,
      module: 5,
    });
  });

  it("updateMedia should format deletedMedia, updatedMedia, and newMedia", async () => {
    vi.mocked(apiClient.put).mockResolvedValue({ data: undefined });

    await ArtPieceManager.updateMedia(
      "art-1",
      [{ id: 1 as unknown as string, order: 2 }, { id: 2 as unknown as string }],
      [10, "20"],
      [{ locationReference: "img1" } as any],
    );

    expect(apiClient.put).toHaveBeenCalledWith("/media/art-1", {
      deletedMedia: ["10", "20"],
      updatedMedia: [{ id: "1", order: 2 }, { id: "2" }],
      newMedia: [{ locationReference: "img1", order: 1 }],
    });

    // Call without optional arguments
    await ArtPieceManager.updateMedia("art-1");
    expect(apiClient.put).toHaveBeenCalledWith("/media/art-1", {});
  });
});
