import { Link } from "react-router-dom";
import logo from "../assets/logos.svg";

function SiteHeader() {
  return (
    <header className="site-header">
      <Link
        className="brand"
        to="/connexionMCJV"
        aria-label="MesCoursJV, accueil"
      >
        <img src={logo} alt="Mes CoursJV" />
      </Link>
      <p className="header-warn">
        Projet étudiant - Ceci n'est pas la plateforme officielle
      </p>
    </header>
  );
}

export default SiteHeader;
