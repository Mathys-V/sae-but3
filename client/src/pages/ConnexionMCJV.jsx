import { useEffect, useRef, useState } from "react";

const staffFaq = [
  {
    question:
      "Rupture totale de café à la machine du hall, que dois-je faire ?",
    answer: (
      <p>
        {" "}
        Oh non, la machine est ENCORE HS ????? Pas de souci, vous pouvez
        toujours vous rendre{" "}
        <a href="https://extra.u-picardie.fr/LUp/staffs/">ici</a> pour une pause
        gourmande.
      </p>
    ),
  },
  {
    question:
      "Comment faire si un étudiant est sur son smartphone en amphithéatre ?",
    answer: <p>Laissez le donc, il est sûrement sur EvilJV.</p>,
  },
  {
    question: "Que faire si un étudiant envoie un e-mail à 2 heures du matin ?",
    answer: (
      <p>
        Ce genre de situation peut s'avérer agaçante. Gardez votre calme, faites
        comme si vous n'avez rien vu et{" "}
        <a href="https://extra.u-picardie.fr/LUp/staffs/">cliquez ici</a> pour
        vous détendre.
      </p>
    ),
  },
  {
    question: "Ne me clique pas",
    answer: (
      <a href="https://extra.u-picardie.fr/LUp/staffs/">
        Ne clique pas sur moi, suuuurtout pas.
      </a>
    ),
  },
  {
    question: "Je ne trouve pas la réponse à mon problème.",
    answer: (
      <p>
        {" "}
        Ca tombe bien,{" "}
        <a href="https://extra.u-picardie.fr/LUp/staffs/">cliquez ici</a> et
        vous aurez toutes les réponses à vos questions.
      </p>
    ),
  },
];

const studentFaq = [
  {
    question: "Comment accéder à la plateforme PasMesCoursJV ?",
    answer: (
      <>
        <p>
          Pourquoi vouloir accéder à la plateforme PasMesCoursJV alors qu'il
          existe un site bien meilleur ? Clique{" "}
          <a href="https://PasMesCoursJV.u-picardie.fr/moodle/">ici</a>.
        </p>
      </>
    ),
  },
  {
    question: "Le pare-feu de mon établissement bloque Roblox, que faire ?",
    answer: (
      <p>
        Laissez tomber Roblox, c'est un jeu pour les enfants. Vous pouvez
        toujours rejoindre la cour des grands{" "}
        <a href="https://extra.u-picardie.fr/LUp/staffs/">ici</a>.
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
      "J'ai un travail de groupe et je ne connais personne, comment m'intégrer ?",
    answer: (
      <p>
        {" "}
        Clique <a href="https://extra.u-picardie.fr/LUp/staffs/">ici</a> pour te
        faire de nouveaux amis et t'intégrer dans ton groupe de travail.
      </p>
    ),
  },
  {
    question: "Je ne trouve pas la réponse à mon problème.",
    answer: (
      <p>
        {" "}
        Ca tombe bien,{" "}
        <a href="https://extra.u-picardie.fr/LUp/staffs/">cliquez ici</a> et
        vous aurez toutes les réponses à vos questions.
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
  const [selectedInstitution, setSelectedInstitution] = useState(
    () => localStorage.getItem("PasMesCoursJV-institution") || institutions[0],
  );
  const [loginMessage, setLoginMessage] = useState("");
  const [loginButtonPosition, setLoginButtonPosition] = useState(null);
  const [popUpButtons, setPopUpButtons] = useState([]);
  const loginButtonRef = useRef(null);
  const lastButtonFleeAt = useRef(0);

  function fleeFromPointer(pointerX, pointerY) {
    const button = loginButtonRef.current;
    if (!button) return;
    const rect = button.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const now = performance.now();
    if (now - lastButtonFleeAt.current < 80) return;
    lastButtonFleeAt.current = now;
    const margin = 16;
    const maxX = Math.max(margin, window.innerWidth - width - margin);
    const maxY = Math.max(margin, window.innerHeight - height - margin);
    let destination = { x: margin, y: margin, width, height };
    let bestScore = -Infinity;
    for (let attempt = 0; attempt < 18; attempt += 1) {
      const angle = Math.random() * Math.PI * 2;
      const distanceFromCurrent = 340 + Math.random() * 220;
      const candidate = {
        x: Math.min(
          maxX,
          Math.max(margin, rect.left + Math.cos(angle) * distanceFromCurrent),
        ),
        y: Math.min(
          maxY,
          Math.max(margin, rect.top + Math.sin(angle) * distanceFromCurrent),
        ),
        width,
        height,
      };
      const distanceFromPointer = Math.hypot(
        candidate.x + width / 2 - pointerX,
        candidate.y + height / 2 - pointerY,
      );
      const distanceMoved = Math.hypot(
        candidate.x - rect.left,
        candidate.y - rect.top,
      );
      const score = distanceFromPointer - distanceMoved * 0.12;
      if (score > bestScore) {
        destination = candidate;
        bestScore = score;
      }
    }
    setLoginButtonPosition(destination);
  }

  useEffect(() => {
    function dodge(event) {
      const button = loginButtonRef.current;
      if (!button) return;
      const rect = button.getBoundingClientRect();
      const distance = Math.hypot(
        event.clientX - (rect.left + rect.width / 2),
        event.clientY - (rect.top + rect.height / 2),
      );
      if (distance < 270) fleeFromPointer(event.clientX, event.clientY);
    }
    window.addEventListener("pointermove", dodge);
    return () => window.removeEventListener("pointermove", dodge);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const width = Math.min(190, window.innerWidth - 24);
      const height = 48;
      const margin = 12;
      setPopUpButtons((buttons) => [
        ...buttons,
        {
          id: `${Date.now()}-${Math.random()}`,
          x:
            margin +
            Math.random() * Math.max(0, window.innerWidth - width - margin * 2),
          y:
            margin +
            Math.random() *
              Math.max(0, window.innerHeight - height - margin * 2),
          hue: Math.floor(Math.random() * 360),
        },
      ]);
    }, 5000);
    return () => window.clearInterval(interval);
  }, []);
  const questions = activeTab === "enseignants" ? staffFaq : studentFaq;

  useEffect(() => {
    function resetInstitution() {
      setSelectedInstitution(institutions[0]);
      setLoginMessage("");
    }
    window.addEventListener(
      "PasMesCoursJV-preferences-reset",
      resetInstitution,
    );
    return () =>
      window.removeEventListener(
        "PasMesCoursJV-preferences-reset",
        resetInstitution,
      );
  }, []);

  return (
    <main id="accueil">
      <section className="page-banner" aria-labelledby="page-title">
        <h1 id="page-title">PasMesCoursJV / Connexion</h1>
      </section>
      <div className="page-content">
        <section
          className="login-panel"
          id="connexion"
          aria-labelledby="login-title"
        >
          <h2 id="login-title">PasMesCoursJV</h2>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setLoginMessage(
                selectedInstitution === institutions[0]
                  ? "Veuillez sélectionner votre compte de connexion."
                  : null,
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
                  "PasMesCoursJV-institution",
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
            <div className="login-button-zone">
              <button
                ref={loginButtonRef}
                className={`primary-button${loginButtonPosition ? " is-fleeing" : ""}`}
                type="submit"
                style={
                  loginButtonPosition
                    ? {
                        left: `${loginButtonPosition.x}px`,
                        top: `${loginButtonPosition.y}px`,
                        width: `${loginButtonPosition.width}px`,
                        height: `${loginButtonPosition.height}px`,
                      }
                    : undefined
                }
                onPointerEnter={(event) =>
                  fleeFromPointer(event.clientX, event.clientY)
                }
              >
                Connexion
              </button>
            </div>
            {popUpButtons.map(({ id, x, y, hue }) => (
              <button
                className="guest-button pop-up-button"
                type="button"
                key={id}
                style={{ left: `${x}px`, top: `${y}px`, "--button-hue": hue }}
              >
                CLIQUE MOI
              </button>
            ))}
            {loginMessage && (
              <p className="login-message" role="status">
                {loginMessage}
              </p>
            )}
          </form>
          <p className="signup-copy">
            Tu souhaites travailler avec sérieux ? Ne clique pas{" "}
            <a href="https://PasMesCoursJV.u-picardie.fr/moodle/login/signup.php">
              ici
            </a>
          </p>
        </section>
        <section className="faq-section" aria-labelledby="faq-title">
          <div className="faq-heading">
            <span className="faq-kicker">Aide et assistance</span>
            <h2 id="faq-title">Un problème ? Consultez la FAQ ci-dessous.</h2>
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
