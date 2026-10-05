import { Link } from "react-router-dom";

function SiteHeader() {
  return (
    <header className="site-header">
      <Link
        className="brand"
        to="/connexionMCJV"
        aria-label="MesCoursJV, accueil"
      >
        <img
          src="https://mescoursjv.u-picardie.fr/moodle/alternate/assets/logos.svg"
          alt="Mes CoursJV"
        />
      </Link>
      <Link className="header-login" to="/connexionMCJV#connexion">
        <span aria-hidden="true">⇥</span> Connexion
      </Link>
    </header>
  );
}

export default SiteHeader;
