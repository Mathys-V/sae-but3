import { useEffect, useState } from "react";

const staffFaq = [
  {
    question: "Comment accéder à la plateforme MesCoursJV ?",
    answer: (
      <>
        <p>
          Si vous possédez un compte institutionnel, choisissez l’établissement
          correspondant à votre adresse e-mail dans « Compte de connexion » :
        </p>
        <ul>
          <li>@u-picardie.fr : Université de Picardie Jules Verne</li>
          <li>@chu-amiens.fr : CHU Amiens Picardie</li>
          <li>@univ-artois.fr : Université d’Artois</li>
          <li>@univ-littoral.fr : Université du Littoral Côte d’Opale</li>
        </ul>
        <p>Pour toute autre adresse, choisissez « Autre utilisateur ».</p>
      </>
    ),
  },
  {
    question:
      "Je n’ai pas d’identifiant, mais je souhaite accéder à MesCoursJV afin de mettre des cours à disposition des étudiants. Que dois-je faire ?",
    answer: (
      <p>
        Si vos identifiants institutionnels ne vous ont pas encore été
        attribués, veuillez patienter ou contacter le service des ressources
        humaines de votre établissement. Si vous n’êtes pas concerné par leur
        attribution, créez un compte avec le lien « En créer un ici ».
      </p>
    ),
  },
  {
    question:
      "Je me connecte, mais je ne retrouve pas mes cours. Que dois-je faire ?",
    answer: (
      <p>
        Vérifiez que vous utilisez vos identifiants habituels. Vous pouvez
        disposer de deux adresses institutionnelles distinctes, par exemple une
        adresse UPJV et une adresse CHU, associées à des accès différents.
      </p>
    ),
  },
  {
    question:
      "Je ne me souviens plus de mon identifiant ou de mon mot de passe. Que faire ?",
    answer: (
      <>
        <p>
          Pour réinitialiser vos identifiants, utilisez le service de votre
          établissement :
        </p>
        <ul>
          <li>
            UPJV :{" "}
            <a href="https://extra.u-picardie.fr/LUp/staffs/">
              réinitialiser mon mot de passe
            </a>
          </li>
          <li>CHU : contactez la hotline au 14000</li>
          <li>
            Université d’Artois :{" "}
            <a href="https://monmotdepasse.univ-artois.fr/">
              monmotdepasse.univ-artois.fr
            </a>
          </li>
          <li>ULCO : contactez assistance-compte-numerique@univ-littoral.fr</li>
        </ul>
        <p>
          Vous pouvez aussi sélectionner votre établissement puis cliquer sur «
          Connexion » pour afficher l’aide de connexion.
        </p>
      </>
    ),
  },
  {
    question: "Je ne trouve pas la réponse à mon problème.",
    answer: (
      <p>
        Posez votre question sur le{" "}
        <a href="https://extra.u-picardie.fr/glpi/marketplace/formcreator/front/wizard.php">
          centre d’assistance
        </a>
        .
      </p>
    ),
  },
];

const studentFaq = [
  {
    question: "Comment accéder à la plateforme MesCoursJV ?",
    answer: (
      <>
        <p>
          Vérifiez que votre inscription à l’université est validée. Après
          validation, la synchronisation peut prendre jusqu’à 24 heures. Activez
          ensuite votre compte pour accéder à MesCoursJV, à votre ENT et à votre
          boîte mail :
        </p>
        <ul>
          <li>
            UPJV :{" "}
            <a href="https://webmail.etud.u-picardie.fr/validation/">
              activer mon compte
            </a>
          </li>
          <li>
            ULCO :{" "}
            <a href="https://formulaire.extranet.univ-littoral.fr/validate.php">
              valider mon compte
            </a>
          </li>
          <li>
            Université d’Artois :{" "}
            <a href="https://monmotdepasse.univ-artois.fr/">
              gérer mon mot de passe
            </a>
          </li>
        </ul>
      </>
    ),
  },
  {
    question:
      "Je n’arrive pas à me connecter et un message « Identifiants erronés » s’affiche.",
    answer: (
      <p>
        Vérifiez que vous sélectionnez le bon établissement dans « Compte de
        connexion » et que vous utilisez les identifiants fournis par celui-ci.
        L’adresse étudiante UPJV doit être activée avant la première connexion.
      </p>
    ),
  },
  {
    question:
      "Je me connecte, mais je ne retrouve pas mes cours. Que dois-je faire ?",
    answer: (
      <p>
        Assurez-vous d’utiliser le bon identifiant : pour l’UPJV, la première
        lettre de votre nom suivie de votre numéro étudiant (ex. r12345678) ;
        pour le CHU, vos identifiants CHU ; pour l’Artois, votre identifiant
        institutionnel ; pour l’ULCO, votre identifiant de portail suivi de
        @etu.univ-littoral.fr.
      </p>
    ),
  },
  {
    question:
      "Je ne me souviens plus de mon identifiant ou de mon mot de passe. Que faire ?",
    answer: (
      <p>
        Sélectionnez votre établissement, puis cliquez sur « Connexion » pour
        accéder aux instructions de récupération. Les utilisateurs du CHU
        peuvent modifier leur mot de passe avec les outils internes ou contacter
        la hotline au 14000.
      </p>
    ),
  },
  {
    question: "Je ne trouve pas la réponse à mon problème.",
    answer: (
      <p>
        Posez votre question via le{" "}
        <a href="https://extra.u-picardie.fr/glpi/marketplace/formcreator/front/formdisplay.php?id=54">
          formulaire de contact
        </a>
        .
      </p>
    ),
  },
];

const institutions = [
  "Compte de connexion",
  "Université de Picardie Jules Verne",
  "CHU Amiens Picardie",
  "Université d’Artois",
  "Université du Littoral Côte d’Opale",
  "Autre utilisateur",
];

function ConnexionMCJV() {
  const [activeTab, setActiveTab] = useState("enseignants");
  const [showNotice, setShowNotice] = useState(true);
  const [selectedInstitution, setSelectedInstitution] = useState(
    () => localStorage.getItem("mescoursjv-institution") || institutions[0],
  );
  const [loginMessage, setLoginMessage] = useState("");
  const questions = activeTab === "enseignants" ? staffFaq : studentFaq;

  useEffect(() => {
    function resetInstitution() {
      setSelectedInstitution(institutions[0]);
      setLoginMessage("");
    }
    window.addEventListener("mescoursjv-preferences-reset", resetInstitution);
    return () =>
      window.removeEventListener(
        "mescoursjv-preferences-reset",
        resetInstitution,
      );
  }, []);

  return (
    <main id="accueil">
      <section className="page-banner" aria-labelledby="page-title">
        <h1 id="page-title">MesCoursJV / Connexion</h1>
      </section>
      <div className="page-content">
        {showNotice && (
          <aside className="notice" role="status">
            <div>
              <h2>Amélioration de l’interface de connexion</h2>
              <p>
                Votre choix de connexion est désormais mémorisé pour votre
                prochaine visite, vous permettant ainsi d’accéder plus
                rapidement à la plateforme.
              </p>
              <p>
                <strong>⚠ Mise à jour importante :</strong> En cas de
                dysfonctionnement ou d’affichage incorrect, actualisez la page
                avec <strong>Ctrl+F5</strong> (PC) ou{" "}
                <strong>Cmd+Shift+R</strong> (Mac) pour vider le cache de votre
                navigateur.
              </p>
              <p>
                La section « Autre utilisateur » a été intégrée directement dans
                le sélecteur principal.
              </p>
            </div>
            <button
              className="close-notice"
              type="button"
              aria-label="Fermer l’alerte"
              onClick={() => setShowNotice(false)}
            >
              ×
            </button>
          </aside>
        )}
        <section
          className="login-panel"
          id="connexion"
          aria-labelledby="login-title"
        >
          <h2 id="login-title">MesCoursJV</h2>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setLoginMessage(
                selectedInstitution === institutions[0]
                  ? "Veuillez sélectionner votre compte de connexion."
                  : "La connexion est disponible depuis la plateforme MesCoursJV.",
              );
            }}
          >
            <label htmlFor="institution">
              Sélectionner un compte pour vous connecter :
            </label>
            <select
              id="institution"
              value={selectedInstitution}
              onChange={(event) => {
                setSelectedInstitution(event.target.value);
                localStorage.setItem(
                  "mescoursjv-institution",
                  event.target.value,
                );
              }}
            >
              {institutions.map((institution) => (
                <option key={institution} value={institution}>
                  {institution}
                </option>
              ))}
            </select>
            <button className="primary-button" type="submit">
              Connexion <span aria-hidden="true">→</span>
            </button>
            <button
              className="guest-button"
              type="button"
              onClick={() =>
                setLoginMessage(
                  "L’accès sans compte est proposé directement sur la plateforme MesCoursJV.",
                )
              }
            >
              Accès sans compte
            </button>
            {loginMessage && (
              <p className="login-message" role="status">
                {loginMessage}
              </p>
            )}
          </form>
          <p className="signup-copy">
            Vous n’avez pas de compte ? En créer un{" "}
            <a href="https://mescoursjv.u-picardie.fr/moodle/login/signup.php">
              ici
            </a>
          </p>
        </section>
        <section className="faq-section" aria-labelledby="faq-title">
          <div className="faq-heading">
            <span className="faq-kicker">Aide et assistance</span>
            <h2 id="faq-title">
              Un problème de connexion ? Consultez la FAQ ci-dessous.
            </h2>
          </div>
          <div
            className="faq-tabs"
            role="tablist"
            aria-label="Choisir un profil"
          >
            <button
              id="tab-enseignants"
              type="button"
              role="tab"
              aria-selected={activeTab === "enseignants"}
              aria-controls="faq-panel"
              onClick={() => setActiveTab("enseignants")}
            >
              Enseignants
            </button>
            <button
              id="tab-etudiants"
              type="button"
              role="tab"
              aria-selected={activeTab === "etudiants"}
              aria-controls="faq-panel"
              onClick={() => setActiveTab("etudiants")}
            >
              Étudiants
            </button>
          </div>
          <div
            className="faq-list"
            id="faq-panel"
            role="tabpanel"
            aria-labelledby={`tab-${activeTab}`}
          >
            {questions.map(({ question, answer }) => (
              <details className="faq-item" key={question}>
                <summary>
                  {question}
                  <span className="faq-plus" aria-hidden="true"></span>
                </summary>
                <div className="faq-answer">{answer}</div>
              </details>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default ConnexionMCJV;
