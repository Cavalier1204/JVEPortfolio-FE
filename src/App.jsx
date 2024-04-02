import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/Landingpage";
import CreatePage from "./pages/CreateArtPiecePage";
import ModulePage from "./pages/ModulePage";

function App() {
  return (
    <>
      <Navbar />
      <BrowserRouter>
        <div className="md:container md:mx-auto flex justify-center pt-5">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/upload" element={<CreatePage />} />
            <Route path="/module/:year/:module" element={<ModulePage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
