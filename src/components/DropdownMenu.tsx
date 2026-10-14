import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Bars3Icon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { SchoolYears } from "../types";

interface DropdownMenuProps {
  schoolYears: SchoolYears;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ schoolYears }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openYear, setOpenYear] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
    setOpenYear(null);
  };

  const closeDropdown = () => {
    setIsOpen(false);
    setOpenYear(null);
  };

  const toggleYear = (year: string) => {
    setOpenYear((prev) => (prev === year ? null : year));
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        closeDropdown();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Navigatiemenu openen"
        className="h-16 w-16 bg-[#a1a6a2] hover:bg-[#8f9490] rounded flex justify-center items-center transition-colors focus:outline-none focus:ring-2 focus:ring-white"
      >
        <Bars3Icon className="h-12 w-12 text-white" aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-[72px] mt-2 z-30 w-64 max-w-[calc(100vw-2rem)] origin-top-left rounded-md bg-white shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-2">
            {Object.entries(schoolYears).map(([year, modules]) => {
              const isYearOpen = openYear === year;
              return (
                <div
                  key={year}
                  className="border-b border-gray-100 last:border-b-0"
                >
                  <button
                    type="button"
                    onClick={() => toggleYear(year)}
                    aria-expanded={isYearOpen}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 text-left font-medium transition-colors"
                  >
                    <span>Leerjaar {year}</span>
                    <ChevronDownIcon
                      className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                        isYearOpen ? "rotate-180 text-gray-700" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  {isYearOpen && (
                    <div className="bg-gray-50 py-1 px-2 space-y-0.5">
                      {modules.map((module) => (
                        <Link
                          key={module}
                          to={`/module/${year}/${module}`}
                          className="block px-4 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200/70 rounded transition-colors"
                          onClick={closeDropdown}
                        >
                          Module {module}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            <div className="pt-1 mt-1 border-t border-gray-100">
              <Link
                to="/portfolio"
                className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 font-medium transition-colors"
                onClick={closeDropdown}
              >
                Officieel portfolio
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
