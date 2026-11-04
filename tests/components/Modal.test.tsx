import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Modal from "../../src/components/Modal";

describe("Modal", () => {
  let modalRoot: HTMLElement;

  beforeEach(() => {
    modalRoot = document.createElement("div");
    modalRoot.setAttribute("id", "modal");
    document.body.appendChild(modalRoot);
  });

  afterEach(() => {
    if (document.body.contains(modalRoot)) {
      document.body.removeChild(modalRoot);
    }
  });

  it("should render content into modal root portal", () => {
    render(
      <Modal>
        <div>Modal Content</div>
      </Modal>,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Modal Content")).toBeInTheDocument();
  });

  it("should call onClose when Escape key is pressed", () => {
    const onClose = vi.fn();
    render(
      <Modal onClose={onClose}>
        <div>Modal Content</div>
      </Modal>,
    );

    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalled();
  });

  it("should call onClose when backdrop is clicked", () => {
    const onClose = vi.fn();
    render(
      <Modal onClose={onClose}>
        <div>Modal Content</div>
      </Modal>,
    );

    fireEvent.click(modalRoot);
    expect(onClose).toHaveBeenCalled();
  });
});
