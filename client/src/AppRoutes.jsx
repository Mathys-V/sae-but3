import { Navigate, Route, Routes } from "react-router-dom";
import SiteLayout from "./layouts/SiteLayout.jsx";
import ConnexionMCJV from "./pages/ConnexionMCJV.jsx";
import EvilLayout from "./layouts/EvilLayout.jsx";
import EvilDashboard from "./pages/EvilDashboard.jsx";
import EvilGames from "./pages/EvilGames.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import MiniGameTuto from "./pages/MiniGameTuto.jsx";
import EvilSettings from "./pages/EvilSettings.jsx";
import CasinoGame from "./pages/CasinoGame.jsx";
import "./App.css";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<Navigate to="/connexionMCJV" replace />} />
        <Route path="connexionMCJV" element={<ConnexionMCJV />} />
      </Route>

      <Route element={<EvilLayout />}>
        <Route path="evil" element={<EvilDashboard />} />
        <Route path="evil/jeux" element={<EvilGames />} />
        <Route path="evil/jeux/tutoriel" element={<MiniGameTuto />} />
        <Route path="evil/jeux/casino" element={<CasinoGame />} />
        <Route path="evil/parametres" element={<EvilSettings />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
