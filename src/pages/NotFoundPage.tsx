import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  return (
    <div className="md:container md:mx-auto flex flex-col items-center justify-center pt-20 px-4 text-center">
      <h2 className="font-light text-2xl lg:text-3xl text-gray-800 mb-2">
        Pagina niet gevonden
      </h2>
      <div
        className="w-16 bg-[#b5bab6] mx-auto mb-6"
        style={{ height: "2px" }}
      />
      <p className="text-gray-600 mb-8 max-w-md">
        De opgevraagde pagina bestaat niet of is verplaatst.
      </p>
      <Link
        to="/"
        className="bg-[#b5bab6] hover:bg-[#a1a6a2] text-white px-6 py-2.5 rounded border-2 border-[#a1a6a2] shadow-md transition-colors"
      >
        Terug naar home
      </Link>
    </div>
  );
};

export default NotFoundPage;
