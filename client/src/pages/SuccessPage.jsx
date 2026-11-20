import { useEffect, useMemo, useState } from "react";
import { LayoutGroup, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ressourcesBUT } from "../data/ressources.js";
import cadenas from "../assets/icons/cadenas.png";
import { fetchAchievements } from "../services/api.js";
import { useAuthStore } from "../store/authStore.js";
import "./SuccessPage.css";

const DUCKS_TOTAL = 20;
const DUCKS_STORAGE_KEY = "evil_ducks_found";
const LEVELS = ["BUT1", "BUT2", "BUT3"];
const DEVELOPED_COURSE_IDS = new Set(["R1.06", "R5.A.06"]);

function readFoundDucks() {
  try {
    const saved = JSON.parse(localStorage.getItem(DUCKS_STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved.length : Number(saved) || 0;
  } catch {
    return 0;
  }
}

function TrophyCard({
  course,
  achievement,
  selected,
  onSelect,
  variant = "medal",
}) {
  const [iconUnavailable, setIconUnavailable] = useState(false);
  const unlocked = Boolean(achievement?.unlocked);
  const label =
    course?.tag || course?.nom || achievement?.game_name || "Succès général";
  return (
    <button
      type="button"
      className={`success-exhibit success-exhibit-${variant} ${unlocked ? "is-unlocked" : "is-locked"} ${selected ? "is-selected" : ""}`}
      onClick={onSelect}
      aria-label={`${achievement?.name || label}, ${unlocked ? "débloqué" : "verrouillé"}`}
      title={achievement?.name || label}
      aria-pressed={selected}
    >
      {variant === "medal" && (
        <span className="success-medal-ribbons" aria-hidden="true" />
      )}
      <motion.span
        className="success-exhibit-icon"
        layoutId={`achievement-icon-${achievement?.achievement_id}`}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
      >
        {variant === "secret" ? (
          <span aria-hidden="true">🏆</span>
        ) : achievement?.icon_url && !iconUnavailable ? (
          <img
            src={achievement.icon_url}
            alt=""
            onError={() => setIconUnavailable(true)}
          />
        ) : (
          <span aria-hidden="true">🏅</span>
        )}
      </motion.span>
      <span className="success-exhibit-label">
        {achievement?.name || label}
      </span>
    </button>
  );
}

function SuccessPage() {
  const [foundDucks, setFoundDucks] = useState(readFoundDucks);
  const [skillsRevealed, setSkillsRevealed] = useState(false);
  const [achievements, setAchievements] = useState([]);
  const [achievementsError, setAchievementsError] = useState("");
  const [selectedAchievementId, setSelectedAchievementId] = useState(null);
  const [detailIconUnavailable, setDetailIconUnavailable] = useState(false);
  const token = useAuthStore((state) => state.token);
  const developedCourses = useMemo(
    () =>
      LEVELS.flatMap((item) =>
        (ressourcesBUT[item] || [])
          .filter((course) => DEVELOPED_COURSE_IDS.has(course.id))
          .map((course) => ({ ...course, cursusYear: Number(item.slice(-1)) })),
      ),
    [],
  );
  useEffect(() => {
    document.title = "Succès - Evil MesCoursJV";
    const refresh = () => setFoundDucks(readFoundDucks());
    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  useEffect(() => {
    let active = true;
    fetchAchievements(token)
      .then((items) => {
        if (active) {
          setAchievements(items);
          setAchievementsError("");
        }
      })
      .catch((error) => {
        if (active) {
          setAchievements([]);
          setAchievementsError(
            error.message || "Impossible de charger les succès.",
          );
        }
      });
    return () => {
      active = false;
    };
  }, [token]);

  useEffect(() => {
    setDetailIconUnavailable(false);
  }, [selectedAchievementId]);

  const selectedAchievement = achievements.find(
    (achievement) => achievement.achievement_id === selectedAchievementId,
  );
  const getCourseAchievements = (course) =>
    achievements.filter((achievement) =>
      course.path === "/casino"
        ? achievement.game_name?.toLowerCase().includes("casino")
        : course.path.includes("plongee")
          ? achievement.game_name?.toLowerCase().includes("plong")
          : false,
    );
  const selectedAchievementCourse = selectedAchievement
    ? developedCourses.find((course) =>
        getCourseAchievements(course).some(
          (achievement) =>
            achievement.achievement_id === selectedAchievement.achievement_id,
        ),
      )
    : null;
  const detailDescription = selectedAchievement
    ? selectedAchievement.description
    : null;
  const wallAchievements = achievements.filter(
    (achievement) => !achievement.hidden,
  );
  const secretAchievements = achievements.filter(
    (achievement) => achievement.hidden,
  );
  const leftWallAchievements = wallAchievements.slice(
    0,
    Math.ceil(wallAchievements.length / 2),
  );
  const rightWallAchievements = wallAchievements.slice(
    Math.ceil(wallAchievements.length / 2),
  );
  const selectAchievement = (achievement) => {
    setSelectedAchievementId(achievement.achievement_id);
  };
  const renderAchievement = (achievement, variant) =>
    selectedAchievementId === achievement.achievement_id ? (
      <div
        key={achievement.achievement_id}
        className={`success-exhibit-placeholder success-exhibit-placeholder-${variant}`}
        aria-hidden="true"
      />
    ) : (
      <TrophyCard
        key={achievement.achievement_id}
        course={developedCourses.find((course) =>
          getCourseAchievements(course).some(
            (item) => item.achievement_id === achievement.achievement_id,
          ),
        )}
        achievement={achievement}
        variant={variant}
        selected={false}
        onSelect={() => selectAchievement(achievement)}
      />
    );

  return (
    <main className="success-page pixel-page-dungeon">
      <LayoutGroup id="success-room-achievements">
        <section className="success-room" aria-label="Salle des succès">
          <header className="success-hero pixel-banner">
            <div className="success-hero-copy">
              <div className="success-ribbon">
                <h1>
                  <span>Mes succès</span>
                </h1>
              </div>
            </div>
          </header>

          <section
            className="success-wall-zone success-wall-zone-left"
            aria-label="Médailles obtenues ou à débloquer"
          >
            {leftWallAchievements.map((achievement) =>
              renderAchievement(achievement, "medal"),
            )}
          </section>
          <section
            className="success-wall-zone success-wall-zone-right"
            aria-label="Autres médailles"
          >
            {rightWallAchievements.map((achievement) =>
              renderAchievement(achievement, "medal"),
            )}
          </section>

          <section
            className="success-diploma"
            aria-label="Espace réservé au diplôme de BUT"
          ></section>

          {achievementsError && (
            <p className="success-achievements-error" role="alert">
              {achievementsError}
            </p>
          )}

          {selectedAchievement && (
            <aside
              className="success-room-detail is-focused"
              aria-live="polite"
            >
              <button
                className="success-detail-close"
                type="button"
                aria-label="Fermer le résumé du succès"
                onClick={() => setSelectedAchievementId(null)}
              >
                ×
              </button>
              <motion.div
                layoutId={`achievement-icon-${selectedAchievement.achievement_id}`}
                transition={{ type: "spring", stiffness: 280, damping: 28 }}
                className={`success-detail-sprite ${selectedAchievement.unlocked ? "is-unlocked" : "is-locked"}`}
                aria-label={selectedAchievement.name}
              >
                {selectedAchievement.icon_url && !detailIconUnavailable && (
                  <img
                    src={selectedAchievement.icon_url}
                    alt=""
                    onError={() => setDetailIconUnavailable(true)}
                  />
                )}
                {(!selectedAchievement.icon_url || detailIconUnavailable) && (
                  <span aria-hidden="true">🏆</span>
                )}
              </motion.div>
              <span className="success-kicker">
                {selectedAchievement.unlocked
                  ? "SUCCÈS DÉBLOQUÉ"
                  : "SUCCÈS À DÉBLOQUER"}
              </span>
              <h3>{selectedAchievement.name}</h3>
              <p>
                {selectedAchievement.game_name || "Succès général"}
                {selectedAchievement.game_name && selectedAchievementCourse
                  ? ` · ${selectedAchievementCourse.tag || selectedAchievementCourse.nom}`
                  : ""}
              </p>
              {detailDescription && <small>{detailDescription}</small>}
              {selectedAchievementCourse && (
                <Link
                  className="success-course-link"
                  to={selectedAchievementCourse.path}
                >
                  Jouer
                </Link>
              )}
            </aside>
          )}

          <div
            className="success-room-duck"
            aria-label={`Canards cachés : ${foundDucks} sur ${DUCKS_TOTAL}`}
          >
            <span aria-hidden="true">🦆</span>
            <strong>
              {foundDucks}
              <small> / {DUCKS_TOTAL}</small>
            </strong>
          </div>

          <section
            className="success-secret-table"
            aria-label="Succès secrets exposés sur la table"
          >
            <div className="success-secret-trophies">
              {secretAchievements.length
                ? secretAchievements.map((achievement) =>
                    renderAchievement(achievement, "secret"),
                  )
                : [1, 2, 3].map((slot) => (
                    <div
                      className="success-secret-placeholder"
                      key={slot}
                      role="img"
                      aria-label="Emplacement de succès secret"
                    >
                      ?
                    </div>
                  ))}
            </div>
          </section>
        </section>
      </LayoutGroup>
    </main>
  );
}

export default SuccessPage;
