function SiteFooter() {
  function resetPreferences() {
    localStorage.removeItem("mescoursjv-institution");
    window.dispatchEvent(new Event("mescoursjv-preferences-reset"));
  }

  return (
    <footer className="site-footer">
      <a href="https://www.u-picardie.fr/">
        Université de Picardie Jules Verne
      </a>
      <nav aria-label="Liens institutionnels">
        <a href="https://www.u-picardie.fr/disi/charte-info-personnel/public/charte-personnels-UPJV.pdf">
          Charte informatique
        </a>
        <a href="https://cdn.u-picardie.fr/cnil/CGU_UPJV_Moodle.pdf">CGU</a>
      </nav>
      <button type="button" onClick={resetPreferences}>
        Réinitialiser les données de navigation
      </button>
    </footer>
  );
}

export default SiteFooter;
