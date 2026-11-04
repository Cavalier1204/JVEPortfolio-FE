import { describe, it, expect, vi, beforeEach } from "vitest";
import { imageUploader } from "../../src/services/MediaUtils";
import axios from "axios";
import imageCompression from "browser-image-compression";

vi.mock("axios");
vi.mock("browser-image-compression");
vi.mock("uuid", () => ({
  v4: () => "mock-uuid-1234",
}));

describe("MediaUtils - imageUploader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return empty mediaFiles when media is null or empty", async () => {
    expect(await imageUploader(null)).toEqual({ mediaFiles: [] });
    expect(await imageUploader([])).toEqual({ mediaFiles: [] });
  });

  it("should compress and upload images with progress reporting", async () => {
    const mockFile = new File(["dummy"], "photo.png", { type: "image/png" });
    const compressedFile = new File(["compressed"], "photo.png", {
      type: "image/jpeg",
    });

    vi.mocked(imageCompression).mockImplementation(
      async (file, options: any) => {
        if (options?.onProgress) {
          options.onProgress(50);
        }
        return compressedFile;
      },
    );

    vi.mocked(axios.put).mockImplementation(
      async (_url, _data, config: any) => {
        if (config?.onUploadProgress) {
          config.onUploadProgress({ loaded: 50, total: 100 });
        }
        return { status: 201 };
      },
    );

    const onProgress = vi.fn();
    const result = await imageUploader([mockFile], onProgress);

    expect(imageCompression).toHaveBeenCalled();
    expect(axios.put).toHaveBeenCalledWith(
      expect.stringContaining("images/mock-uuid-1234.jpg"),
      compressedFile,
      expect.objectContaining({
        headers: expect.objectContaining({
          "Content-Type": "application/octet-stream",
        }),
      }),
    );
    expect(onProgress).toHaveBeenCalled();
    expect(result.mediaFiles).toEqual([
      {
        locationReference: "images/mock-uuid-1234.jpg",
        order: 1,
      },
    ]);
  });

  it("should upload video files directly without compression", async () => {
    const mockVideo = new File(["video"], "clip.mp4", { type: "video/mp4" });
    vi.mocked(axios.put).mockResolvedValue({ status: 201 });

    const onProgress = vi.fn();
    const result = await imageUploader([mockVideo], onProgress);

    expect(imageCompression).not.toHaveBeenCalled();
    expect(axios.put).toHaveBeenCalledWith(
      expect.stringContaining("videos/mock-uuid-1234.mp4"),
      mockVideo,
      expect.any(Object),
    );
    expect(result.mediaFiles).toEqual([
      {
        locationReference: "videos/mock-uuid-1234.mp4",
        order: 1,
      },
    ]);
  });

  it("should ignore unsupported file types", async () => {
    const pdfFile = new File(["pdf"], "doc.pdf", { type: "application/pdf" });
    const result = await imageUploader([pdfFile]);

    expect(imageCompression).not.toHaveBeenCalled();
    expect(axios.put).not.toHaveBeenCalled();
    expect(result.mediaFiles).toEqual([]);
  });

  it("should continue if image compression fails", async () => {
    const mockFile = new File(["dummy"], "bad.jpg", { type: "image/jpeg" });
    vi.mocked(imageCompression).mockRejectedValue(new Error("Corrupt image"));

    const result = await imageUploader([mockFile]);
    expect(axios.put).not.toHaveBeenCalled();
    expect(result.mediaFiles).toEqual([]);
  });

  it("should continue if axios upload fails", async () => {
    const mockFile = new File(["dummy"], "photo.jpg", { type: "image/jpeg" });
    vi.mocked(imageCompression).mockResolvedValue(mockFile);
    vi.mocked(axios.put).mockRejectedValue(new Error("Upload failed"));

    const result = await imageUploader([mockFile]);
    expect(result.mediaFiles).toEqual([]);
  });
});
