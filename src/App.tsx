import React from "react";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import CreatePage from "./pages/CreateArtPiecePage";
import ModulePage from "./pages/ModulePage";
import PortfolioPage from "./pages/PortfolioPage";
import LoginPage from "./pages/LoginPage";
import SubjectPage from "./pages/SubjectPage";
import { AuthProvider } from "./modules/AuthProvider";
import { useAuth } from "./modules/useAuth";

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return null;
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const LoginRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return null;
  }
  return isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginRoute />} />
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <CreatePage />
              </ProtectedRoute>
            }
          />
          <Route path="/module/:year/:module" element={<ModulePage />} />
          <Route
            path="/module/:year/:module/:subject"
            element={<SubjectPage />}
          />
          <Route path="/portfolio" element={<PortfolioPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
