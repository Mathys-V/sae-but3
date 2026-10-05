import { Navigate, Route, Routes } from "react-router-dom";
import ConnexionMCJV from "./pages/ConnexionMCJV.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import SiteLayout from "./layouts/SiteLayout.jsx";
import "./App.css";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<Navigate to="/connexionMCJV" replace />} />
        <Route path="connexionMCJV" element={<ConnexionMCJV />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
