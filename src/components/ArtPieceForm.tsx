import React, { useState, useEffect } from "react";
import ImageOrderPicker from "./ImageOrderPicker";
import rawSchoolYears from "../data/year-structure.json";
import { SchoolYears } from "../types";

const schoolYears = rawSchoolYears as SchoolYears;

export type PortfolioType = "DEVELOPMENT" | "OFFICIAL";

export interface ArtPieceFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  headerText: string;
  titleHook: [string, React.Dispatch<React.SetStateAction<string>>];
  descriptionHook: [string, React.Dispatch<React.SetStateAction<string>>];
  yearHook: [number | string, React.Dispatch<React.SetStateAction<any>>];
  moduleHook: [number | string, React.Dispatch<React.SetStateAction<any>>];
  subjectHook: [string, React.Dispatch<React.SetStateAction<string>>];
  mediaHook: [any[], React.Dispatch<React.SetStateAction<any[]>>];
  onClose: () => void;
  loadingHook: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  dataTestId?: string;
  progressMessage?: string | null;
  progressPercent?: number | null;
}

export default function ArtPieceForm({
  onSubmit,
  headerText,
  titleHook,
  descriptionHook,
  yearHook,
  moduleHook,
  subjectHook,
  mediaHook,
  onClose,
  loadingHook,
  dataTestId,
  progressMessage,
  progressPercent,
}: ArtPieceFormProps) {
  const [selectedYear, setSelectedYear] = yearHook;
  const [selectedSubject, setSelectedSubject] = subjectHook;

  const isOfficialPortfolio = selectedSubject === "PORTFOLIO";
  const portfolioType: PortfolioType = isOfficialPortfolio
    ? "OFFICIAL"
    : "DEVELOPMENT";

  const [lastDevelopmentSubject, setLastDevelopmentSubject] = useState<string>(
    isOfficialPortfolio ? "WERKPRAKTIJK_1" : selectedSubject || "WERKPRAKTIJK_1",
  );

  useEffect(() => {
    if (selectedSubject !== "PORTFOLIO" && selectedSubject) {
      setLastDevelopmentSubject(selectedSubject);
    }
  }, [selectedSubject]);

  const handlePortfolioTypeChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const nextType = e.target.value as PortfolioType;
    if (nextType === "OFFICIAL") {
      if (selectedSubject !== "PORTFOLIO") {
        setLastDevelopmentSubject(selectedSubject);
      }
      setSelectedSubject("PORTFOLIO");
    } else {
      setSelectedSubject(
        lastDevelopmentSubject && lastDevelopmentSubject !== "PORTFOLIO"
          ? lastDevelopmentSubject
          : "WERKPRAKTIJK_1",
      );
    }
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const yearValue = e.target.value;
    setSelectedYear(yearValue);
    moduleHook[1](Number(yearValue) * 4 - 3);
  };

  const currentYearModules = schoolYears[String(selectedYear)] || [];

  return (
    <form onSubmit={onSubmit} data-testid={dataTestId}>
      <h3>{headerText}</h3>
      <label htmlFor="title" className="block text-gray-500 font-bold mb-5">
        Titel
        <input
          type="text"
          name="title"
          id="title"
          value={titleHook[0]}
          onChange={(e) => titleHook[1](e.target.value)}
          required
          className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
          data-testid="titleInput"
        />
      </label>

      <label
        htmlFor="description"
        className="block text-gray-500 font-bold mb-5"
      >
        Beschrijving
        <textarea
          name="description"
          id="description"
          value={descriptionHook[0]}
          onChange={(e) => descriptionHook[1](e.target.value)}
          required
          className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
          data-testid="descriptionInput"
        />
      </label>

      <label
        htmlFor="portfolioType"
        className="block text-gray-500 font-bold mb-5"
      >
        Portfolio
        <select
          name="portfolioType"
          id="portfolioType"
          value={portfolioType}
          onChange={handlePortfolioTypeChange}
          className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
          data-testid="portfolioTypeSelect"
        >
          <option value="DEVELOPMENT">Ontwikkelingsportfolio</option>
          <option value="OFFICIAL">Persoonlijk / officieel portfolio</option>
        </select>
      </label>

      {portfolioType === "DEVELOPMENT" && (
        <>
          <label htmlFor="year" className="block text-gray-500 font-bold mb-5">
            Leerjaar
            <select
              name="year"
              id="year"
              value={selectedYear}
              onChange={handleYearChange}
              required
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              data-testid="yearSelect"
            >
              <option value={1}>Leerjaar 1</option>
              <option value={2}>Leerjaar 2</option>
              <option value={3}>Leerjaar 3</option>
              <option value={4}>Leerjaar 4</option>
            </select>
          </label>

          <label
            htmlFor="module"
            className="block text-gray-500 font-bold mb-5"
          >
            Module
            <select
              name="module"
              id="module"
              value={moduleHook[0]}
              onChange={(e) => moduleHook[1](e.target.value)}
              required
              disabled={!selectedYear}
              className={`bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 ${
                !selectedYear ? "opacity-50 cursor-not-allowed" : ""
              }`}
              data-testid="moduleSelect"
            >
              {selectedYear &&
                currentYearModules.map((module) => (
                  <option key={module} value={module}>
                    Module {module}
                  </option>
                ))}
            </select>
          </label>

          <label
            htmlFor="subject"
            className="block text-gray-500 font-bold mb-5"
          >
            Vak
            <select
              name="subject"
              id="subject"
              onChange={(e) => {
                const val = e.target.value;
                setLastDevelopmentSubject(val);
                setSelectedSubject(val);
              }}
              value={selectedSubject}
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              data-testid="subjectSelect"
            >
              <option value="WERKPRAKTIJK_1">Werkpraktijk 1</option>
              <option value="WERKPRAKTIJK_2">Werkpraktijk 2</option>
              <option value="THEORIE">Theorie</option>
              <option value="SKILLS">Skills</option>
              <option value="POSITIONERING">Positionering</option>
            </select>
          </label>
        </>
      )}

      <label htmlFor="media" className="block text-gray-500 font-bold mb-5">
        Media
        <ImageOrderPicker images={mediaHook[0]} setImages={mediaHook[1]} />
      </label>

      {loadingHook[0] && progressMessage && (
        <div
          className="mb-5 bg-blue-50 border border-blue-200 rounded p-3"
          role="status"
        >
          <div className="flex justify-between items-center text-xs font-medium text-blue-800 mb-1.5">
            <span>{progressMessage}</span>
            {typeof progressPercent === "number" && (
              <span>{progressPercent}%</span>
            )}
          </div>
          <div className="w-full bg-blue-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{
                width:
                  typeof progressPercent === "number"
                    ? `${progressPercent}%`
                    : "100%",
              }}
            />
          </div>
        </div>
      )}

      <div className="flex justify-between items-center gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={loadingHook[0]}
          className="bg-[#b5bab6] hover:bg-[#a1a6a2] text-white px-4 py-2 rounded border-2 border-[#a1a6a2] shadow-md md:w-1/4 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Annuleren
        </button>
        {loadingHook[0] ? (
          <button
            type="button"
            className="bg-blue-500 text-white px-4 py-2 rounded border-2 border-blue-700 shadow-md md:w-fit flex items-center cursor-not-allowed text-sm"
            disabled
          >
            <svg
              className="animate-spin h-4 w-4 mr-2 shrink-0"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            <span>{progressMessage || "Uploaden..."}</span>
          </button>
        ) : (
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded border-2 border-blue-700 shadow-md md:w-1/4 transition-colors"
            type="submit"
            data-testid="submitButton"
          >
            Opslaan
          </button>
        )}
      </div>
    </form>
  );
}
