import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ImageOrderPicker from "../../src/components/ImageOrderPicker";

describe("ImageOrderPicker", () => {
  it("should render dropzone and items with index badges", () => {
    const setImages = vi.fn();
    const mockImages = [
      { preview: "blob:test/1", name: "img1.png" },
      { locationReference: "images/img2.jpg", name: "img2.jpg" },
    ];

    render(<ImageOrderPicker images={mockImages} setImages={setImages} />);

    expect(
      screen.getByText(/Sleep foto's en video's hierheen/),
    ).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();

    const deleteButtons = screen.getAllByRole("button", {
      name: "Verwijder media",
    });
    expect(deleteButtons).toHaveLength(2);

    fireEvent.click(deleteButtons[0]);
    expect(setImages).toHaveBeenCalledWith([mockImages[1]]);
  });

  it("should show helper text when images are present", () => {
    const mockImages = [{ preview: "blob:test/1", name: "img1.png" }];
    const { unmount } = render(
      <ImageOrderPicker images={mockImages} setImages={vi.fn()} />,
    );

    expect(
      screen.getByText("Sleep afbeeldingen om de weergavevolgorde aan te passen"),
    ).toBeInTheDocument();
    unmount();
  });

  it("should handle dropping valid files", async () => {
    const setImages = vi.fn();
    const { container } = render(
      <ImageOrderPicker images={[]} setImages={setImages} />,
    );

    const dropzone = container.querySelector(".dropzone")!;
    const file = new File(["test-content"], "photo.jpg", { type: "image/jpeg" });

    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [file],
        items: [{ kind: "file", type: file.type, getAsFile: () => file }],
        types: ["Files"],
      },
    });

    await waitFor(() => {
      expect(setImages).toHaveBeenCalled();
    });
  });
});
