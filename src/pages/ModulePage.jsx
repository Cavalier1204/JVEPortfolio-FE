import { Link, useParams } from "react-router-dom";

const ModulePage = () => {
  const { year, module } = useParams();

  return (
    <div className="container px-5 py-6 mx-auto">
      <div className="flex flex-wrap -m-4">
        <Link
          className="p-4 md:w-1/3"
          to={`/module/${year}/${module}/werkpraktijk`}
        >
          <div className="h-full border-2 border-gray-300 border-opacity-60 rounded-lg overflow-hidden">
            <img
              className="lg:h-48 md:h-36 w-full object-cover object-center"
              src="/werkpraktijk.png"
              alt="blog"
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
        <Link className="p-4 md:w-1/3" to={`/module/${year}/${module}/kennis`}>
          <div className="h-full border-2 border-gray-300 border-opacity-60 rounded-lg overflow-hidden">
            <img
              className="lg:h-48 md:h-36 w-full object-cover object-center"
              src="/kennisvaardigheden.jpg"
              alt="blog"
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
          className="p-4 md:w-1/3"
          to={`/module/${year}/${module}/positionering`}
        >
          <div className="h-full border-2 border-gray-300 border-opacity-60 rounded-lg overflow-hidden">
            <img
              className="lg:h-48 md:h-36 w-full object-cover object-center"
              src="/positionering.jpg"
              alt="blog"
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
  );
};

export default ModulePage;
