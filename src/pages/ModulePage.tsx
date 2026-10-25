import React from "react";
import { Link, useParams } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";
import rawSchoolYears from "../data/year-structure.json";
import { SchoolYears } from "../types";

const schoolYears = rawSchoolYears as SchoolYears;

const ModulePage: React.FC = () => {
  const { year, module } = useParams<{ year: string; module: string }>();

  const validYear = year && year in schoolYears;
  const validModule =
    validYear &&
    module &&
    schoolYears[year]?.includes(Number(module));

  if (!validYear || !validModule) {
    return (
      <div className="md:container md:mx-auto flex justify-center pt-5">
        <div className="container p-5 mx-auto text-center py-16 text-gray-600">
          <Breadcrumbs
            items={[
              { label: "Home", to: "/" },
              { label: "Module niet gevonden" },
            ]}
          />
          <p className="mt-8 mb-4">Module niet gevonden.</p>
          <Link
            to="/"
            className="bg-[#b5bab6] hover:bg-[#a1a6a2] text-white px-4 py-2 rounded border-2 border-[#a1a6a2] shadow-md transition-colors inline-block text-sm"
          >
            Terug naar home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="md:container md:mx-auto flex justify-center">
      <div className="container p-5 mx-auto">
        <Breadcrumbs
          items={[
            { label: "Home", to: "/" },
            { label: `Leerjaar ${year}` },
            { label: `Module ${module}` },
          ]}
        />
        <div className="flex flex-row pt-4 gap-5">
          <Link
            className="md:w-1/3"
            to={`/module/${year}/${module}/werkpraktijk`}
          >
            <div className="h-full border-2 border-gray-300 border-opacity-60 rounded-lg overflow-hidden">
              <img
                className="lg:h-48 md:h-36 w-full object-cover object-center"
                src="/werkpraktijk.jpg"
                alt="Werkpraktijk vak"
              />
              <div className="px-6 pb-2 pt-5">
                <h2 className="text-xs title-font font-medium text-gray-400">
                  Jaar {year}, M{module}
                </h2>
                <h1 className="title-font text-lg font-semibold text-gray-800 mb-3">
                  Werkpraktijk
                </h1>
                <p className="leading-relaxed mb-3 text-gray-600">
                  Werkpraktijk 1 en Werkprakijk 2
                </p>
              </div>
            </div>
          </Link>
          <Link className="md:w-1/3" to={`/module/${year}/${module}/kennis`}>
            <div className="h-full border-2 border-gray-300 border-opacity-60 rounded-lg overflow-hidden">
              <img
                className="lg:h-48 md:h-36 w-full object-cover object-center"
                src="/kennisvaardigheden.jpg"
                alt="Kennis en vaardigheden vak"
              />
              <div className="px-6 pb-2 pt-5">
                <h2 className="text-xs title-font font-medium text-gray-400">
                  Jaar {year}, M{module}
                </h2>
                <h1 className="title-font text-lg font-semibold text-gray-800 mb-3">
                  Kennis en Vaardigheden
                </h1>
                <p className="leading-relaxed mb-3 text-gray-600">
                  Theorie en Skills
                </p>
              </div>
            </div>
          </Link>
          <Link
            className="md:w-1/3"
            to={`/module/${year}/${module}/positionering`}
          >
            <div className="h-full border-2 border-gray-300 border-opacity-60 rounded-lg overflow-hidden">
              <img
                className="lg:h-48 md:h-36 w-full object-cover object-center"
                src="/positionering.jpg"
                alt="Positionering vak"
              />
              <div className="px-6 pb-2 pt-5">
                <h2 className="text-xs title-font font-medium text-gray-400">
                  Jaar {year}, M{module}
                </h2>
                <h1 className="title-font text-lg font-semibold text-gray-800 mb-3">
                  Positionering
                </h1>
                <p className="leading-relaxed mb-3 text-gray-600">
                  Positionering
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ModulePage;
