import "./App.css";
import { Routes, Route, HashRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import CreatePage from "./pages/CreateArtPiecePage";
import ModulePage from "./pages/ModulePage";
import PortfolioPage from "./pages/PortfolioPage";
import LoginPage from "./pages/LoginPage";
import SubjectPage from "./pages/SubjectPage";

function App() {
  return (
    <>
      <HashRouter>
        <Navbar />
        <div className="md:container md:mx-auto flex justify-center pt-5">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/upload" element={<CreatePage />} />
            <Route path="/module/:year/:module" element={<ModulePage />} />
            <Route
              path="/module/:year/:module/:subject"
              element={<SubjectPage />}
            />
            <Route path="/portfolio" element={<PortfolioPage />} />
          </Routes>
        </div>
      </HashRouter>
    </>
  );
}

export default App;
