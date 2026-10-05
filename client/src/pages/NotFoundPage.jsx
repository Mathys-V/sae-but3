import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <main className="page-content">
      <section className="login-panel">
        <h1>Page introuvable</h1>
        <p>Cette page n’existe pas ou n’est plus disponible.</p>
        <Link to="/connexionMCJV">Retour à la connexion MesCoursJV</Link>
      </section>
    </main>
  );
}

export default NotFoundPage;
