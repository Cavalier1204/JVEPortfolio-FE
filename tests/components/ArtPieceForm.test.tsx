import { describe, it, expect, vi } from "vitest";
import React, { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ArtPieceForm from "../../src/components/ArtPieceForm";

// Helper wrapper to manage state
const FormWrapper: React.FC<{
  onSubmit?: any;
  onClose?: any;
  initialSubject?: string;
  initialYear?: number;
  initialModule?: number;
  loading?: boolean;
  progressMessage?: string;
  progressPercent?: number;
}> = ({
  onSubmit = vi.fn((e) => e.preventDefault()),
  onClose = vi.fn(),
  initialSubject = "WERKPRAKTIJK_1",
  initialYear = 1,
  initialModule = 1,
  loading = false,
  progressMessage = "",
  progressPercent = 0,
}) => {
  const titleHook = useState<string>("My Title");
  const descriptionHook = useState<string>("My Description");
  const yearHook = useState<number | string>(initialYear);
  const moduleHook = useState<number | string>(initialModule);
  const subjectHook = useState<string>(initialSubject);
  const mediaHook = useState<any[]>([]);
  const loadingHook = useState<boolean>(loading);

  return (
    <ArtPieceForm
      onSubmit={onSubmit}
      headerText="Create Artpiece"
      titleHook={titleHook}
      descriptionHook={descriptionHook}
      yearHook={yearHook}
      moduleHook={moduleHook}
      subjectHook={subjectHook}
      mediaHook={mediaHook}
      onClose={onClose}
      loadingHook={loadingHook}
      dataTestId="uploadForm"
      progressMessage={progressMessage}
      progressPercent={progressPercent}
    />
  );
};

describe("ArtPieceForm", () => {
  it("should render form fields in DEVELOPMENT mode", () => {
    render(<FormWrapper />);

    expect(screen.getByText("Create Artpiece")).toBeInTheDocument();
    expect(screen.getByTestId("titleInput")).toHaveValue("My Title");
    expect(screen.getByTestId("descriptionInput")).toHaveValue(
      "My Description",
    );
    expect(screen.getByTestId("portfolioTypeSelect")).toHaveValue(
      "DEVELOPMENT",
    );
    expect(screen.getByTestId("yearSelect")).toBeInTheDocument();
    expect(screen.getByTestId("moduleSelect")).toBeInTheDocument();
    expect(screen.getByTestId("subjectSelect")).toBeInTheDocument();

    // Verify PORTFOLIO is not in subjectSelect
    const options = screen
      .getAllByRole("option")
      .map((opt) => opt.getAttribute("value"));
    expect(options).not.toContain("PORTFOLIO");
  });

  it("should switch to OFFICIAL mode and hide year, module, subject selects", () => {
    render(<FormWrapper />);

    const portfolioSelect = screen.getByTestId("portfolioTypeSelect");
    fireEvent.change(portfolioSelect, { target: { value: "OFFICIAL" } });

    expect(screen.queryByTestId("yearSelect")).not.toBeInTheDocument();
    expect(screen.queryByTestId("moduleSelect")).not.toBeInTheDocument();
    expect(screen.queryByTestId("subjectSelect")).not.toBeInTheDocument();

    // Switch back to DEVELOPMENT
    fireEvent.change(portfolioSelect, { target: { value: "DEVELOPMENT" } });
    expect(screen.getByTestId("yearSelect")).toBeInTheDocument();
    expect(screen.getByTestId("moduleSelect")).toBeInTheDocument();
    expect(screen.getByTestId("subjectSelect")).toBeInTheDocument();
  });

  it("should initialize in OFFICIAL mode when initialSubject is PORTFOLIO", () => {
    render(<FormWrapper initialSubject="PORTFOLIO" />);

    expect(screen.getByTestId("portfolioTypeSelect")).toHaveValue("OFFICIAL");
    expect(screen.queryByTestId("yearSelect")).not.toBeInTheDocument();
    expect(screen.queryByTestId("subjectSelect")).not.toBeInTheDocument();
  });

  it("should update year and calculate default module when year changes", () => {
    render(<FormWrapper />);

    const yearSelect = screen.getByTestId("yearSelect");
    fireEvent.change(yearSelect, { target: { value: "2" } });

    expect(yearSelect).toHaveValue("2");
    // Year 2 module default is 2 * 4 - 3 = 5
    expect(screen.getByTestId("moduleSelect")).toHaveValue("5");
  });

  it("should render progress indicator and disabled button when loading", () => {
    render(
      <FormWrapper
        loading={true}
        progressMessage="Uploading 50%..."
        progressPercent={50}
      />,
    );

    expect(screen.getAllByText("Uploading 50%...")).toHaveLength(2);
    expect(screen.getByText("50%")).toBeInTheDocument();
    expect(screen.getByText("Annuleren")).toBeDisabled();
  });

  it("should trigger onClose when cancel button clicked", () => {
    const onClose = vi.fn();
    render(<FormWrapper onClose={onClose} />);

    fireEvent.click(screen.getByText("Annuleren"));
    expect(onClose).toHaveBeenCalled();
  });
});
