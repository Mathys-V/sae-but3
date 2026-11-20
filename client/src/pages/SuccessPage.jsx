import { useEffect, useMemo, useState } from "react";
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

function TrophyCard({ course, achievement, selected, onSelect }) {
  const [iconUnavailable, setIconUnavailable] = useState(false);
  const unlocked = Boolean(achievement?.unlocked);
  const label = course?.tag || course?.nom || achievement?.game_name || "Succès général";
  return (
    <button
      type="button"
      className={`success-badge ${unlocked ? "is-unlocked" : "is-locked"} ${selected ? "is-selected" : ""} ${onSelect ? "is-selectable" : ""}`}
      onClick={onSelect}
      aria-label={`${achievement?.name || label}, ${unlocked ? "débloqué" : "verrouillé"}`}
      title={achievement?.name || label}
      aria-pressed={selected}
    >
      {achievement?.icon_url && !iconUnavailable ? (
        <img
          className="success-badge-sprite"
          src={achievement.icon_url}
          alt=""
          onError={() => setIconUnavailable(true)}
        />
      ) : (
        <span className="success-badge-sprite success-trophy-emoji" aria-hidden="true">🏆</span>
      )}
    </button>
  );
}

function SuccessPage() {
  const [foundDucks, setFoundDucks] = useState(readFoundDucks);
  const [skillsRevealed, setSkillsRevealed] = useState(false);
  const [achievements, setAchievements] = useState([]);
  const [achievementsError, setAchievementsError] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("R1.06");
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
  const duckPercent = Math.min(100, (foundDucks / DUCKS_TOTAL) * 100);

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
          setAchievementsError(error.message || "Impossible de charger les succès.");
        }
      });
    return () => {
      active = false;
    };
  }, [token]);

  useEffect(() => {
    setDetailIconUnavailable(false);
  }, [selectedAchievementId]);

  const selectedCourse =
    developedCourses.find((course) => course.id === selectedCourseId) ||
    developedCourses[0];
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
          (achievement) => achievement.achievement_id === selectedAchievement.achievement_id,
        ),
      )
    : null;
  const selectedCourseAchievements = selectedCourse
    ? getCourseAchievements(selectedCourse)
    : [];
  const detailDescription = selectedAchievement
    ? selectedAchievement.description
    : selectedCourseAchievements[0]?.description;
  const selectedCourseUnlocked = selectedCourseAchievements.some(
    (achievement) => achievement.unlocked,
  );
  const courseAchievementIds = new Set(
    developedCourses.flatMap((course) =>
      getCourseAchievements(course).map((achievement) => achievement.achievement_id),
    ),
  );
  const otherAchievements = achievements.filter(
    (achievement) => !courseAchievementIds.has(achievement.achievement_id),
  );
  const achievementGroups = [1, 2, 3].map((year) => ({
    year,
    items: developedCourses.filter((course) => course.cursusYear === year),
  }));

  return (
    <main className="success-page pixel-page-dungeon">
      <section className="success-hero pixel-banner">
        <div className="success-hero-copy">
          <div className="success-ribbon">
            <h1>
              <span>Mes succès</span>
            </h1>
          </div>
        </div>
      </section>

      <section
        className="success-ducks pixel-panel"
        aria-labelledby="duck-heading"
      >
        <div
          className="success-duck-art"
          aria-label="Emplacement pour le sprite du canard"
        >
          <span aria-hidden="true">🦆</span>
        </div>
        <div className="success-duck-info">
          <div className="success-duck-heading">
            <div>
              <span className="success-kicker">COLLECTION SECRÈTE</span>
              <h2 id="duck-heading">Canards cachés</h2>
            </div>
            <strong>
              {foundDucks}
              <span> / {DUCKS_TOTAL}</span>
            </strong>
          </div>
          <p>Explore les jeux pour tous les retrouver.</p>
          <div
            className="success-progress"
            role="progressbar"
            aria-label="Canards trouvés"
            aria-valuemin="0"
            aria-valuemax={DUCKS_TOTAL}
            aria-valuenow={foundDucks}
          >
            <span style={{ width: `${duckPercent}%` }} />
          </div>
          <small>{DUCKS_TOTAL - foundDucks} canards encore cachés</small>
        </div>
      </section>

      <section
        className="success-trophies"
        id="trophees"
        aria-labelledby="trophies-heading"
      >
        <div className="success-section-heading">
          <div>
            <span className="success-kicker">PARCOURS ACADÉMIQUE</span>
            <h2 id="trophies-heading">Jeux par matière</h2>
          </div>
          <span className="success-available-count">2 jeux développés</span>
        </div>
        <div className="success-games-layout">
          <aside className="success-game-detail" aria-live="polite">
            {selectedCourse && (
              <>
                <div
                  className={`success-detail-sprite ${selectedAchievement ? (selectedAchievement.unlocked ? "is-unlocked" : "is-locked") : (selectedCourseUnlocked ? "is-unlocked" : "is-locked")}`}
                  aria-label={selectedAchievement?.name || "Détail du jeu"}
                >
                  {selectedAchievement?.icon_url && !detailIconUnavailable && (
                    <img
                      src={selectedAchievement.icon_url}
                      alt=""
                      onError={() => setDetailIconUnavailable(true)}
                    />
                  )}
                  {(!selectedAchievement?.icon_url || detailIconUnavailable) && (
                    <span aria-hidden="true">🏆</span>
                  )}
                </div>
                <span className="success-kicker">
                  {(selectedAchievement ? selectedAchievement.unlocked : selectedCourseUnlocked)
                    ? "SUCCÈS DÉBLOQUÉ"
                    : "SUCCÈS À DÉBLOQUER"}
                </span>
                <h3>{selectedAchievement?.name || selectedCourse.tag || selectedCourse.nom}</h3>
                <p>
                  {selectedAchievement
                    ? selectedAchievement.game_name || "Succès général"
                    : selectedCourse.nom}
                  {selectedAchievement?.game_name && selectedAchievementCourse
                    ? ` · ${selectedAchievementCourse.tag || selectedAchievementCourse.nom}`
                    : ""}
                </p>
                {detailDescription && <small>{detailDescription}</small>}
                {(!selectedAchievement || selectedAchievementCourse) && selectedCourse && (
                  <Link
                    className="success-course-link"
                    to={selectedAchievementCourse?.path || selectedCourse.path}
                  >
                    Jouer
                  </Link>
                )}
              </>
            )}
          </aside>
          <div
            className="success-badge-sections"
            aria-label="Jeux développés par année de BUT"
          >
            {achievementsError && (
              <p className="success-achievements-error" role="alert">
                {achievementsError}
              </p>
            )}
            {achievementGroups
              .filter(({ items }) => items.length > 0)
              .map(({ year, items }) => (
                <section
                  className="success-badge-year"
                  key={year}
                  aria-labelledby={`success-games-but${year}`}
                >
                  <h3 id={`success-games-but${year}`}>BUT {year}</h3>
                  <div className="success-badge-grid">
                    {items.flatMap((course) =>
                      getCourseAchievements(course).map((achievement) => (
                        <TrophyCard
                          key={achievement.achievement_id}
                          course={course}
                          achievement={achievement}
                          selected={selectedAchievementId === achievement.achievement_id}
                          onSelect={() => {
                            setSelectedAchievementId(achievement.achievement_id);
                            setSelectedCourseId(course.id);
                          }}
                        />
                      )),
                    )}
                  </div>
                </section>
              ))}
            {otherAchievements.length > 0 && (
              <section className="success-badge-year" aria-labelledby="success-other-achievements">
                <h3 id="success-other-achievements">Autres succès</h3>
                <div className="success-badge-grid">
                  {otherAchievements.map((achievement) => (
                    <TrophyCard
                      key={achievement.achievement_id}
                      achievement={achievement}
                      selected={selectedAchievementId === achievement.achievement_id}
                      onSelect={() => setSelectedAchievementId(achievement.achievement_id)}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </section>

      <section
        className="success-hidden-skills"
        aria-label="Compétences cachées"
      >
        <button
          className="success-hidden-trigger"
          type="button"
          aria-expanded={skillsRevealed}
          aria-controls="hidden-skills-content"
          onClick={() => setSkillsRevealed((revealed) => !revealed)}
        >
          {skillsRevealed ? "Refermer" : "Psst... il y a quelque chose ici..."}
        </button>
        {skillsRevealed && (
          <div className="success-hidden-content" id="hidden-skills-content">
            <h2>Compétences cachées</h2>
            <p className="success-hidden-copy">
              Elles se révèleront au fil de tes aventures.
            </p>
            <div
              className="success-hidden-slots"
              aria-label="Compétences à découvrir"
            >
              {[1, 2, 3].map((slot) => (
                <div className="success-hidden-slot" key={slot}>
                  <img src={cadenas} alt="" />
                  <span>Inconnue</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <Link className="success-back" to="/evil">
        ← Retour à l’accueil
      </Link>
    </main>
  );
}

export default SuccessPage;
