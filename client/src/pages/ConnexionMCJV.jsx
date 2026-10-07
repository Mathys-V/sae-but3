import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const staffFaq = [
  {
    question:
      "Rupture totale de café à la machine du hall, que dois-je faire ?",
    answer: (
      <p>
        {" "}
        Oh non, la machine est ENCORE HS ????? Pas de souci, vous pouvez
        toujours vous rendre <a>ici</a> pour une pause gourmande.
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
        comme si vous n'avez rien vu et <a>cliquez ici</a> pour vous détendre.
      </p>
    ),
  },
  {
    question: "Ne me clique pas",
    answer: <a>Ne clique pas sur moi, suuuurtout pas.</a>,
  },
  {
    question: "Je ne trouve pas la réponse à mon problème.",
    answer: (
      <p>
        {" "}
        Ca tombe bien, <a>cliquez ici</a> et vous aurez toutes les réponses à
        vos questions.
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
          existe un site bien meilleur ? Clique <a>ici</a>.
        </p>
      </>
    ),
  },
  {
    question: "Le pare-feu de mon établissement bloque Roblox, que faire ?",
    answer: (
      <p>
        Laissez tomber Roblox, c'est un jeu pour les enfants. Vous pouvez
        toujours rejoindre la cour des grands <a>ici</a>.
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
        Clique <a>ici</a> pour te faire de nouveaux amis et t'intégrer dans ton
        groupe de travail.
      </p>
    ),
  },
  {
    question: "Je ne trouve pas la réponse à mon problème.",
    answer: (
      <p>
        {" "}
        Ca tombe bien, <a>cliquez ici</a> et vous aurez toutes les réponses à
        vos questions.
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

function secureRandom() {
  const value = new Uint32Array(1);
  crypto.getRandomValues(value);
  return value[0] / 0x100000000;
}

function ConnexionMCJV() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("enseignants");
  const [selectedInstitution, setSelectedInstitution] = useState(
    () => localStorage.getItem("PasMesCoursJV-institution") || institutions[0],
  );
  const [loginMessage, setLoginMessage] = useState("");
  const [isEvil, setIsEvil] = useState(false);
  const [evilIdentifier, setEvilIdentifier] = useState("");
  const [evilPassword, setEvilPassword] = useState("");
  const [showEvilPassword, setShowEvilPassword] = useState(false);
  const [evilProfile, setEvilProfile] = useState("Étudiant");
  const [loginButtonPosition, setLoginButtonPosition] = useState(null);
  const [popUpButtons, setPopUpButtons] = useState([]);
  const loginButtonRef = useRef(null);
  const lastButtonFleeAt = useRef(0);

  useEffect(() => {
    document.documentElement.classList.toggle("evil-transformation", isEvil);
    return () =>
      document.documentElement.classList.remove("evil-transformation");
  }, [isEvil]);

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
      const angle = secureRandom() * Math.PI * 2;
      const distanceFromCurrent = 340 + secureRandom() * 220;
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
    if (isEvil) return undefined;
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
  }, [isEvil]);

  useEffect(() => {
    if (isEvil) return undefined;
    const interval = window.setInterval(() => {
      const width = Math.min(190, window.innerWidth - 24);
      const height = 48;
      const margin = 12;
      setPopUpButtons((buttons) => [
        ...buttons,
        {
          id: crypto.randomUUID(),
          x:
            margin +
            secureRandom() *
              Math.max(0, window.innerWidth - width - margin * 2),
          y:
            margin +
            secureRandom() *
              Math.max(0, window.innerHeight - height - margin * 2),
          hue: Math.floor(secureRandom() * 360),
        },
      ]);
    }, 5000);
    return () => window.clearInterval(interval);
  }, [isEvil]);
  const questions = activeTab === "enseignants" ? staffFaq : studentFaq;

  function activateEvil(event) {
    event.preventDefault();
    setPopUpButtons([]);
    setLoginButtonPosition(null);
    setIsEvil(true);
  }

  function activateEvilFromFaq(event) {
    if (!event.target.closest("a")) return;
    activateEvil(event);
  }

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
    <main id="accueil" className={isEvil ? "is-evil" : ""}>
      {!isEvil && (
        <section className="page-banner" aria-labelledby="page-title">
          <h1 id="page-title">PasMesCoursJV / Connexion</h1>
        </section>
      )}
      <div className="page-content">
        <section
          className={`login-panel${isEvil ? " evil-auth-panel" : ""}`}
          id="connexion"
          aria-labelledby={isEvil ? "login-title" : "pmcjv-login-title"}
        >
          {isEvil && (
            <div className="evil-login-screen">
              <div
                className="evil-login-emblem"
                id="login-title"
                aria-label="EvilJV"
              >
                ?????
              </div>
              <form
                className="evil-login-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  navigate("/evil");
                }}
              >
                <label htmlFor="evil-identifier">Identifiant *</label>
                <input
                  id="evil-identifier"
                  type="text"
                  autoComplete="username"
                  value={evilIdentifier}
                  onChange={(event) => setEvilIdentifier(event.target.value)}
                />
                <label htmlFor="evil-password">Mot de passe *</label>
                <div className="evil-password-field">
                  <input
                    id="evil-password"
                    type={showEvilPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={evilPassword}
                    onChange={(event) => setEvilPassword(event.target.value)}
                  />
                  <button
                    type="button"
                    className="evil-password-toggle"
                    aria-label={
                      showEvilPassword
                        ? "Masquer le mot de passe"
                        : "Afficher le mot de passe"
                    }
                    aria-pressed={showEvilPassword}
                    onClick={() => setShowEvilPassword((visible) => !visible)}
                  >
                    {showEvilPassword ? "🙈" : "👁"}
                  </button>
                </div>
                <button className="evil-submit-button" type="submit">
                  SE CONNECTER
                </button>
              </form>
            </div>
          )}
          <h2 id="pmcjv-login-title">PasMesCoursJV</h2>
          <form
            className="pmcjv-login-form"
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
                onClick={() => {
                  setPopUpButtons([]);
                  setLoginButtonPosition(null);
                  setIsEvil(true);
                }}
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
            <a onClick={activateEvil}>ici</a>
          </p>
        </section>
        {!isEvil && (
          <section
            className="faq-section"
            aria-labelledby="faq-title"
            onClick={activateEvilFromFaq}
          >
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
        )}
      </div>
    </main>
  );
}

export default ConnexionMCJV;
