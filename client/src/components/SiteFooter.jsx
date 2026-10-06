function SiteFooter() {
  function resetPreferences() {
    localStorage.removeItem("mescoursjv-institution");
    window.dispatchEvent(new Event("mescoursjv-preferences-reset"));
  }

  return (
    <footer className="site-footer">
      <a href="https://www.u-picardie.fr/">
        Projet étudiant - ceci n'est pas la plateforme officielle
      </a>
    </footer>
  );
}

export default SiteFooter;
