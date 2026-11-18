import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import {
  changeUserRole,
  fetchAdminGameStats,
  fetchAdminOverviewStats,
  fetchAdminRetentionStats,
  fetchAdminUsers,
  toggleUserBan,
} from "../services/api";

function getAbandonRateColor(rate) {
  if (rate < 25) return "text-green-400";
  if (rate < 40) return "text-yellow-400";
  return "text-red-400";
}

function getHourlyBarClass(isPeak, sessionCount) {
  if (isPeak) return "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]";
  if (sessionCount > 0) return "bg-cyan-600 group-hover:bg-cyan-500";
  return "bg-gray-800";
}

function getGameHealthBadge(totalPlayed, healthStatus) {
  if (totalPlayed === 0) {
    return {
      text: "⚪ En attente de parties",
      className: "bg-gray-800 text-gray-400 border border-gray-700",
    };
  }
  if (healthStatus === "healthy") {
    return {
      text: "🟢 Rétention Optimale",
      className: "bg-green-950 text-green-300 border border-green-800",
    };
  }
  if (healthStatus === "warning") {
    return {
      text: "🟡 Frustration Modérée",
      className: "bg-yellow-950 text-yellow-300 border border-yellow-800",
    };
  }
  return {
    text: "🔴 Point de Friction Critique",
    className: "bg-red-950 text-red-300 border border-red-800",
  };
}

function getGameRateColor(totalPlayed, rate) {
  if (totalPlayed === 0) return "text-gray-500";
  if (rate < 25) return "text-green-400";
  if (rate < 40) return "text-yellow-400";
  return "text-red-400";
}

function GameStatCard({ game }) {
  const badge = getGameHealthBadge(game.total_played, game.health_status);
  const rateColor = getGameRateColor(game.total_played, game.abandon_rate);
  const completionPercent =
    game.total_played > 0
      ? Math.round((game.completed / game.total_played) * 100)
      : 0;

  return (
    <div className="bg-gray-900/80 border border-gray-700 rounded-xl p-4 flex flex-col justify-between space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-bold text-gray-100 text-sm">{game.game_name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] bg-gray-800 text-gray-300 px-2 py-0.5 rounded uppercase font-semibold">
              Difficulté : {game.difficulty}
            </span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded font-bold ${badge.className}`}
            >
              {badge.text}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-400">Taux d'abandon</div>
          <div className={`text-xl font-black ${rateColor}`}>
            {game.total_played > 0 ? `${game.abandon_rate}%` : "--"}
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-[11px] text-gray-400 mb-1">
          <span>Complétées : {game.completed}</span>
          <span>Abandons : {game.abandoned}</span>
        </div>
        {game.total_played > 0 ? (
          <div className="h-2 w-full bg-red-950/80 rounded-full overflow-hidden flex">
            <div
              className="bg-green-500 h-full transition-all"
              style={{ width: `${completionPercent}%` }}
              title={`Complétion : ${completionPercent}%`}
            />
          </div>
        ) : (
          <div className="h-2 w-full bg-gray-800 rounded-full" />
        )}
      </div>

      <div className="pt-2 border-t border-gray-800 grid grid-cols-3 gap-2 text-center text-xs">
        <div>
          <div className="text-gray-400 text-[10px]">Total Joué</div>
          <div className="font-bold text-gray-200">{game.total_played}</div>
        </div>
        <div>
          <div className="text-gray-400 text-[10px]">Durée Moy.</div>
          <div className="font-bold text-cyan-300">
            {game.avg_time_seconds > 0 ? `${game.avg_time_seconds}s` : "--"}
          </div>
        </div>
        <div>
          <div className="text-gray-400 text-[10px]">Record</div>
          <div className="font-bold text-amber-300">
            {game.high_score > 0 ? game.high_score : "--"}
          </div>
        </div>
      </div>
    </div>
  );
}

function UsersTableBody({
  loadingUsers,
  usersCount,
  filteredUsers,
  currentUser,
  actionLoadingId,
  onToggleBan,
  onChangeRole,
}) {
  if (loadingUsers && usersCount === 0) {
    return (
      <tr>
        <td colSpan="7" className="py-12 text-center text-gray-400">
          Chargement des données...
        </td>
      </tr>
    );
  }

  if (filteredUsers.length === 0) {
    return (
      <tr>
        <td colSpan="7" className="py-12 text-center text-gray-400">
          Aucun joueur trouvé.
        </td>
      </tr>
    );
  }

  return filteredUsers.map((u) => {
    const isCurrentAdmin = u.pseudo === currentUser;
    const isBusy = actionLoadingId === u.user_id;

    return (
      <tr
        key={u.user_id}
        className={`hover:bg-gray-700/30 transition ${
          u.banned_flag ? "bg-red-950/20" : ""
        }`}
      >
        <td className="py-3.5 px-4 font-mono text-xs text-gray-500">
          #{u.user_id}
        </td>
        <td className="py-3.5 px-4 font-semibold text-gray-100 flex items-center gap-2">
          <span>{u.pseudo}</span>
          {isCurrentAdmin && (
            <span className="text-[10px] bg-red-900/60 text-red-300 border border-red-700/80 px-1.5 py-0.5 rounded">
              Vous
            </span>
          )}
        </td>
        <td className="py-3.5 px-4 text-gray-400 text-xs">{u.email}</td>
        <td className="py-3.5 px-4">
          {u.role === "admin" ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-yellow-950/70 text-yellow-300 border border-yellow-700/80">
              ⭐ Admin
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-gray-700/60 text-gray-300">
              🎮 Joueur
            </span>
          )}
        </td>
        <td className="py-3.5 px-4">
          {u.banned_flag ? (
            <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-red-950 text-red-400 border border-red-700/80">
              🔴 Banni
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-green-950/60 text-green-400 border border-green-800/60">
              🟢 Actif
            </span>
          )}
        </td>
        <td className="py-3.5 px-4 text-xs text-gray-400">
          {u.last_login
            ? new Date(u.last_login).toLocaleString("fr-FR", {
                dateStyle: "short",
                timeStyle: "short",
              })
            : "Jamais connecté"}
        </td>
        <td className="py-3.5 px-4 text-right">
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              disabled={isCurrentAdmin || isBusy}
              onClick={() => onToggleBan(u)}
              className={`px-3 py-1.5 text-xs font-bold rounded transition disabled:opacity-30 disabled:cursor-not-allowed ${
                u.banned_flag
                  ? "bg-green-700 hover:bg-green-600 text-white"
                  : "bg-red-800 hover:bg-red-700 text-white"
              }`}
            >
              {u.banned_flag ? "Débannir" : "Bannir"}
            </button>
            <button
              type="button"
              disabled={isCurrentAdmin || isBusy}
              onClick={() => onChangeRole(u)}
              className="px-2.5 py-1.5 text-xs font-medium rounded bg-gray-700 hover:bg-gray-600 text-gray-200 border border-gray-600 transition disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {u.role === "admin" ? "Rétrograder" : "Promouvoir"}
            </button>
          </div>
        </td>
      </tr>
    );
  });
}

function AdminModerationTab({
  modStats,
  errorUsers,
  setErrorUsers,
  searchQuery,
  setSearchQuery,
  filterRole,
  setFilterRole,
  filterStatus,
  setFilterStatus,
  users,
  loadingUsers,
  filteredUsers,
  user,
  actionLoadingId,
  handleToggleBan,
  handleChangeRole,
}) {
  return (
    <section className="space-y-6 animate-fade-in">
      {/* Cartes stats modération */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800/70 border border-gray-700 rounded-xl p-4">
          <div className="text-xs text-gray-400 font-medium uppercase">Total Joueurs</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-gray-100 mt-1">
            {modStats.total}
          </div>
        </div>
        <div className="bg-gray-800/70 border border-green-900/40 rounded-xl p-4">
          <div className="text-xs text-green-400 font-medium uppercase">Comptes Actifs</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-green-400 mt-1">
            {modStats.active}
          </div>
        </div>
        <div className="bg-gray-800/70 border border-red-900/50 rounded-xl p-4">
          <div className="text-xs text-red-400 font-medium uppercase">Comptes Bannis</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-red-400 mt-1">
            {modStats.banned}
          </div>
        </div>
        <div className="bg-gray-800/70 border border-yellow-900/40 rounded-xl p-4">
          <div className="text-xs text-yellow-400 font-medium uppercase">Administrateurs</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-yellow-400 mt-1">
            {modStats.admins}
          </div>
        </div>
      </div>

      {errorUsers && (
        <div className="bg-red-950/60 border border-red-600 text-red-200 p-4 rounded-xl text-sm flex items-center justify-between">
          <span>⚠️ {errorUsers}</span>
          <button
            type="button"
            onClick={() => setErrorUsers("")}
            className="text-red-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Recherche & Filtres */}
      <div className="bg-gray-800/80 border border-gray-700 rounded-xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="w-full md:w-80">
          <input
            type="text"
            placeholder="🔍 Rechercher par pseudo ou email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-red-600"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Rôle :</span>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="bg-gray-900 border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-red-600"
            >
              <option value="all">Tous les rôles</option>
              <option value="player">Joueurs</option>
              <option value="admin">Admins</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Statut :</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-gray-900 border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-red-600"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actifs uniquement</option>
              <option value="banned">Bannis uniquement</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table des utilisateurs */}
      <div className="bg-gray-800/60 border border-gray-700 rounded-xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-base font-bold text-gray-100 flex items-center gap-2">
            <span>🛡️</span>
            <span>Liste des Joueurs & Modération</span>
          </h2>
          <span className="text-xs text-gray-400">
            {filteredUsers.length} sur {users.length} compte(s)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-gray-900/80 text-xs uppercase text-gray-400 border-b border-gray-700">
              <tr>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Joueur</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Rôle</th>
                <th className="py-3 px-4">Statut</th>
                <th className="py-3 px-4">Dernière Connexion</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/60">
              <UsersTableBody
                loadingUsers={loadingUsers}
                usersCount={users.length}
                filteredUsers={filteredUsers}
                currentUser={user}
                actionLoadingId={actionLoadingId}
                onToggleBan={handleToggleBan}
                onChangeRole={handleChangeRole}
              />
            </tbody>
          </table>
        </div>
      </div>

      {/* Section réservée pour le module chat (Jeanne) */}
      <section className="bg-gray-900/60 border border-dashed border-gray-700 rounded-xl p-6 text-gray-400">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xl">💬</span>
          <h2 className="text-lg font-bold text-gray-200">
            Signalements en direct & Modération du Chat
          </h2>
          <span className="text-xs bg-yellow-900/60 text-yellow-300 border border-yellow-700/60 px-2 py-0.5 rounded-full font-semibold">
            Module Réseau en attente
          </span>
        </div>
        <p className="text-sm">
          Cette section affichera les alertes et messages signalés dès que le serveur Socket.IO de Jeanne sera branché.
        </p>
      </section>
    </section>
  );
}

function AdminStatsTab({
  errorStats,
  setErrorStats,
  overviewStats,
  retentionStats,
  gameStats,
}) {
  const hourlyBars = retentionStats?.hourly_activity || [];
  const maxHourlyCount = Math.max(
    1,
    ...hourlyBars.map((h) => h.session_count || 0),
  );
  return (
    <section className="space-y-6 animate-fade-in">
      {errorStats && (
        <div className="bg-red-950/60 border border-red-600 text-red-200 p-4 rounded-xl text-sm flex items-center justify-between">
          <span>⚠️ {errorStats}</span>
          <button
            type="button"
            onClick={() => setErrorStats("")}
            className="text-red-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* 1. Bandeau de KPIs Rétention Clés */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Temps moyen */}
        <div className="bg-gray-800/80 border border-gray-700 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-gray-400 font-semibold uppercase">
            <span>Temps Moyen / Session</span>
            <span className="text-base">⏱️</span>
          </div>
          <div className="text-3xl font-black text-cyan-400 mt-2">
            {overviewStats ? `${overviewStats.avg_session_duration_minutes} min` : "--"}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Total joué : {retentionStats ? `${retentionStats.total_time_played_hours} h` : "--"}
          </div>
        </div>

        {/* Taux d'abandon */}
        <div className="bg-gray-800/80 border border-gray-700 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-gray-400 font-semibold uppercase">
            <span>Taux d'Abandon Global</span>
            <span className="text-base">🚪</span>
          </div>
          <div
            className={`text-3xl font-black mt-2 ${getAbandonRateColor(overviewStats?.global_abandon_rate || 0)}`}
          >
            {overviewStats ? `${overviewStats.global_abandon_rate} %` : "--"}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {overviewStats && overviewStats.global_abandon_rate < 25
              ? "🟢 Excellent engagement"
              : "🔴 Frustration élevée détectée"}
          </div>
        </div>

        {/* Sessions aujourd'hui */}
        <div className="bg-gray-800/80 border border-gray-700 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-gray-400 font-semibold uppercase">
            <span>Parties Aujourd'hui</span>
            <span className="text-base">🎮</span>
          </div>
          <div className="text-3xl font-black text-purple-400 mt-2">
            {overviewStats ? overviewStats.sessions_today : "--"}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Sur {overviewStats ? overviewStats.total_sessions : 0} parties totales
          </div>
        </div>

        {/* Taux de retour / Rétention */}
        <div className="bg-gray-800/80 border border-gray-700 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-gray-400 font-semibold uppercase">
            <span>Taux de Rétention</span>
            <span className="text-base">📈</span>
          </div>
          <div className="text-3xl font-black text-green-400 mt-2">
            {overviewStats ? `${overviewStats.retention_rate} %` : "--"}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Joueurs avec au moins 2 sessions
          </div>
        </div>
      </div>

      {/* 2. Analyse par Mini-jeu : Taux d'abandon & Points de Friction */}
      <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-gray-100 flex items-center gap-2">
              <span>🎯</span>
              <span>Analyse de Rétention & Abandon par Mini-Jeu</span>
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Identifie les jeux avec un taux d'abandon anormalement haut (frustration ou difficulté trop rude).
            </p>
          </div>
          <span className="text-xs text-gray-400">
            {gameStats.length} jeux surveillés
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gameStats.map((game) => (
            <GameStatCard key={game.game_id} game={game} />
          ))}
        </div>
      </div>

      {/* 3. Analyse Temporelle : Heures de pointe & Typologie des abandons */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graphique horaire */}
        <div className="lg:col-span-2 bg-gray-800/60 border border-gray-700 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-gray-100 flex items-center gap-2">
                <span>🕒</span>
                <span>Affluence Horaire des Joueurs (24h)</span>
              </h3>
              <p className="text-xs text-gray-400">
                Moments clés d'engagement de la communauté.
              </p>
            </div>
            {retentionStats && (
              <span className="text-xs bg-red-950 text-red-300 border border-red-800 px-2 py-0.5 rounded font-semibold">
                Pic : {retentionStats.peak_hour}h
              </span>
            )}
          </div>

          <div className="h-44 flex items-end gap-1 sm:gap-2 pt-6 pb-2 px-2 bg-gray-900/60 border border-gray-800 rounded-lg">
            {hourlyBars.map((h) => {
              const heightPercent =
                maxHourlyCount > 0
                  ? Math.max(8, Math.round((h.session_count / maxHourlyCount) * 100))
                  : 8;
              const isPeak = h.session_count === maxHourlyCount && maxHourlyCount > 0;

              return (
                <div
                  key={h.hour}
                  className="flex-1 flex flex-col items-center justify-end h-full group relative"
                >
                  {/* Tooltip au survol */}
                  <div className="absolute -top-7 hidden group-hover:flex bg-gray-900 border border-gray-700 text-gray-200 text-[10px] px-1.5 py-0.5 rounded shadow z-10 whitespace-nowrap">
                    {h.hour}h : {h.session_count} partie(s)
                  </div>

                  {/* Barre */}
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t transition-all ${getHourlyBarClass(isPeak, h.session_count)}`}
                  />
                  <span className="text-[9px] text-gray-500 mt-1 select-none">
                    {h.hour % 3 === 0 ? `${h.hour}h` : ""}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Typologie des Abandons */}
        <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-gray-100 flex items-center gap-2">
              <span>⚡</span>
              <span>Typologie des Abandons</span>
            </h3>
            <p className="text-xs text-gray-400">
              Détection du moment où le joueur quitte.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="bg-gray-900/70 border border-red-900/60 rounded-lg p-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-red-400">Ragequit Précoce (&lt; 1 min)</span>
                <span className="font-mono font-bold text-gray-200">
                  {retentionStats?.abandon_breakdown?.early_drop || 0}
                </span>
              </div>
              <p className="text-[11px] text-gray-400 mt-1">
                Quitte immédiatement. Signe d'une difficulté injuste ou d'un bug bloquant.
              </p>
            </div>

            <div className="bg-gray-900/70 border border-yellow-900/50 rounded-lg p-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-yellow-400">Abandon en Cours (1 - 5 min)</span>
                <span className="font-mono font-bold text-gray-200">
                  {retentionStats?.abandon_breakdown?.mid_game || 0}
                </span>
              </div>
              <p className="text-[11px] text-gray-400 mt-1">
                Perte de patience ou manque d'intérêt en milieu de niveau.
              </p>
            </div>

            <div className="bg-gray-900/70 border border-green-900/40 rounded-lg p-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-green-400">Parties Prolongées (&gt; 5 min)</span>
                <span className="font-mono font-bold text-gray-200">
                  {retentionStats?.abandon_breakdown?.late_game || 0}
                </span>
              </div>
              <p className="text-[11px] text-gray-400 mt-1">
                Excellente immersion et persévérance du joueur.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function EvilAdminPanel() {
  const { user, role, token } = useAuthStore();

  // Navigation par onglets stricts
  const [activeTab, setActiveTab] = useState("moderation"); // 'moderation' | 'stats'

  // État Modération
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(
    () => role === "admin" && Boolean(token),
  );
  const [errorUsers, setErrorUsers] = useState("");
  const [successToast, setSuccessToast] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // État Statistiques & Rétention
  const [loadingStats, setLoadingStats] = useState(false);
  const [errorStats, setErrorStats] = useState("");
  const [overviewStats, setOverviewStats] = useState(null);
  const [gameStats, setGameStats] = useState([]);
  const [retentionStats, setRetentionStats] = useState(null);

  useEffect(() => {
    document.title = "EvilJV | Panel Administrateur";
  }, []);

  const showToast = (message) => {
    setSuccessToast(message);
    setTimeout(() => {
      setSuccessToast("");
    }, 4000);
  };

  // Chargement des utilisateurs (Modération)
  const handleRefreshUsers = async () => {
    if (!token) return;
    setLoadingUsers(true);
    setErrorUsers("");
    const result = await fetchAdminUsers(token, { limit: 100 });
    if (result.success) {
      setUsers(result.data.users || []);
    } else {
      setErrorUsers(result.error || "Impossible de charger la liste des utilisateurs");
    }
    setLoadingUsers(false);
  };

  // Chargement des statistiques (Analytics & Rétention)
  const handleRefreshStats = async () => {
    if (!token) return;
    setLoadingStats(true);
    setErrorStats("");

    const [resOverview, resGames, resRetention] = await Promise.all([
      fetchAdminOverviewStats(token),
      fetchAdminGameStats(token),
      fetchAdminRetentionStats(token),
    ]);

    if (resOverview.success) setOverviewStats(resOverview.data);
    if (resGames.success) setGameStats(resGames.data);
    if (resRetention.success) setRetentionStats(resRetention.data);

    if (!resOverview.success || !resGames.success || !resRetention.success) {
      setErrorStats("Certaines statistiques n'ont pas pu être actualisées.");
    }
    setLoadingStats(false);
  };

  // Chargement initial des données selon rôle
  useEffect(() => {
    let isCancelled = false;
    if (role !== "admin" || !token) return undefined;

    async function fetchInitialData() {
      const [resUsers, resOverview, resGames, resRetention] = await Promise.all([
        fetchAdminUsers(token, { limit: 100 }),
        fetchAdminOverviewStats(token),
        fetchAdminGameStats(token),
        fetchAdminRetentionStats(token),
      ]);

      if (!isCancelled) {
        if (resUsers.success) setUsers(resUsers.data.users || []);
        if (resOverview.success) setOverviewStats(resOverview.data);
        if (resGames.success) setGameStats(resGames.data);
        if (resRetention.success) setRetentionStats(resRetention.data);
        setLoadingUsers(false);
      }
    }

    void fetchInitialData();
    return () => {
      isCancelled = true;
    };
  }, [role, token]);

  // Actions de modération
  const handleToggleBan = async (targetUser) => {
    const newBannedState = !targetUser.banned_flag;
    const confirmMsg = newBannedState
      ? `Êtes-vous sûr de vouloir bannir ${targetUser.pseudo} ? L'accès lui sera immédiatement bloqué.`
      : `Voulez-vous débannir ${targetUser.pseudo} ?`;

    if (!window.confirm(confirmMsg)) return;

    setActionLoadingId(targetUser.user_id);
    const res = await toggleUserBan(token, targetUser.user_id, newBannedState);
    if (res.success) {
      setUsers((prev) =>
        prev.map((u) =>
          u.user_id === targetUser.user_id ? { ...u, banned_flag: newBannedState } : u,
        ),
      );
      showToast(
        newBannedState
          ? `L'utilisateur ${targetUser.pseudo} a été banni.`
          : `L'utilisateur ${targetUser.pseudo} a été débanni.`,
      );
    } else {
      setErrorUsers(res.error || "Erreur lors du bannissement.");
    }
    setActionLoadingId(null);
  };

  const handleChangeRole = async (targetUser) => {
    const newRole = targetUser.role === "admin" ? "player" : "admin";
    const confirmMsg =
      newRole === "admin"
        ? `Promouvoir ${targetUser.pseudo} au rang d'Administrateur ?`
        : `Rétrograder ${targetUser.pseudo} au rang de Joueur ?`;

    if (!window.confirm(confirmMsg)) return;

    setActionLoadingId(targetUser.user_id);
    const res = await changeUserRole(token, targetUser.user_id, newRole);
    if (res.success) {
      setUsers((prev) =>
        prev.map((u) =>
          u.user_id === targetUser.user_id ? { ...u, role: newRole } : u,
        ),
      );
      showToast(
        newRole === "admin"
          ? `${targetUser.pseudo} est maintenant Administrateur.`
          : `${targetUser.pseudo} a été rétrogradé au rang de Joueur.`,
      );
    } else {
      setErrorUsers(res.error || "Erreur lors du changement de rôle.");
    }
    setActionLoadingId(null);
  };

  // Filtrage modération
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.pseudo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchRole = filterRole === "all" || u.role === filterRole;
      const matchStatus =
        filterStatus === "all" ||
        (filterStatus === "banned" ? u.banned_flag : !u.banned_flag);
      return matchSearch && matchRole && matchStatus;
    });
  }, [users, searchQuery, filterRole, filterStatus]);

  // Statistiques calculées pour l'onglet modération
  const modStats = useMemo(() => {
    const total = users.length;
    const banned = users.filter((u) => u.banned_flag).length;
    const admins = users.filter((u) => u.role === "admin").length;
    const active = total - banned;
    return { total, banned, admins, active };
  }, [users]);

  // Si non-admin, écran d'accès refusé
  if (role !== "admin") {
    return (
      <main className="max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="bg-red-950/40 border border-red-700/80 rounded-xl p-8 backdrop-blur shadow-2xl">
          <div className="text-6xl mb-4">⛔</div>
          <h1 className="text-3xl font-extrabold text-red-500 mb-2">Accès Refusé</h1>
          <p className="text-gray-300 mb-6">
            Cette section est strictement réservée aux administrateurs du serveur EvilJV.
          </p>
          <Link
            to="/evil"
            className="inline-block px-6 py-2.5 bg-red-800 hover:bg-red-700 text-white font-bold rounded-lg transition"
          >
            Retourner au Dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="space-y-6 animate-fade-in pb-16">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-green-900 border border-green-500 text-green-100 px-5 py-3 rounded-lg shadow-xl flex items-center gap-3">
          <span>✅</span>
          <p className="text-sm font-medium">{successToast}</p>
        </div>
      )}

      {/* En-tête Principal */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-red-900/60 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">🛡️</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-red-500 tracking-wide">
              Panel d'Administration
            </h1>
          </div>
          <p className="text-gray-400 mt-1 text-sm">
            Gestion de la modération des joueurs et analyse de rétention en temps réel.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={activeTab === "moderation" ? handleRefreshUsers : handleRefreshStats}
            disabled={loadingUsers || loadingStats}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm font-semibold rounded-lg border border-gray-700 flex items-center gap-2 transition disabled:opacity-50"
          >
            <span>🔄</span>
            {loadingUsers || loadingStats ? "Chargement..." : "Actualiser"}
          </button>
          <Link
            to="/evil"
            className="px-4 py-2 bg-red-950/60 hover:bg-red-900/80 text-red-300 text-sm font-semibold rounded-lg border border-red-800/80 transition"
          >
            ← Dashboard
          </Link>
        </div>
      </div>

      {/* Barre de navigation entre les 2 onglets stricts */}
      <div className="flex border-b border-gray-800 gap-3">
        <button
          type="button"
          onClick={() => setActiveTab("moderation")}
          className={`flex items-center gap-2.5 px-6 py-3 font-bold text-sm transition-all border-b-2 ${
            activeTab === "moderation"
              ? "border-red-500 text-red-400 bg-red-950/30"
              : "border-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-800/40"
          }`}
        >
          <span>🛡️</span>
          <span>Modération & Comptes</span>
          <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-300">
            {users.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("stats")}
          className={`flex items-center gap-2.5 px-6 py-3 font-bold text-sm transition-all border-b-2 ${
            activeTab === "stats"
              ? "border-red-500 text-red-400 bg-red-950/30"
              : "border-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-800/40"
          }`}
        >
          <span>📊</span>
          <span>Statistiques & Rétention</span>
          {overviewStats && (
            <span
              className={`ml-1 text-xs px-2 py-0.5 rounded-full font-semibold ${
                overviewStats.global_abandon_rate < 25
                  ? "bg-green-950 text-green-300 border border-green-700"
                  : "bg-red-950 text-red-300 border border-red-700"
              }`}
            >
              {overviewStats.global_abandon_rate}% abandon
            </span>
          )}
        </button>
      </div>

      {activeTab === "moderation" ? (
        <AdminModerationTab
          modStats={modStats}
          errorUsers={errorUsers}
          setErrorUsers={setErrorUsers}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterRole={filterRole}
          setFilterRole={setFilterRole}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          users={users}
          loadingUsers={loadingUsers}
          filteredUsers={filteredUsers}
          user={user}
          actionLoadingId={actionLoadingId}
          handleToggleBan={handleToggleBan}
          handleChangeRole={handleChangeRole}
        />
      ) : (
        <AdminStatsTab
          errorStats={errorStats}
          setErrorStats={setErrorStats}
          overviewStats={overviewStats}
          retentionStats={retentionStats}
          gameStats={gameStats}
        />
      )}
    </main>
  );
}

export default EvilAdminPanel;
