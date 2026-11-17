import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { changeUserRole, fetchAdminUsers, toggleUserBan } from "../services/api";

function EvilAdminPanel() {
  const { user, role, token } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(() => role === "admin" && Boolean(token));
  const [error, setError] = useState("");
  const [successToast, setSuccessToast] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all"); // 'all' | 'player' | 'admin'
  const [filterStatus, setFilterStatus] = useState("all"); // 'all' | 'active' | 'banned'
  const [actionLoadingId, setActionLoadingId] = useState(null);

  useEffect(() => {
    document.title = "EvilJV | Panel Administrateur";
  }, []);

  const handleRefresh = async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    const result = await fetchAdminUsers(token, { limit: 100 });
    if (result.success) {
      setUsers(result.data.users || []);
    } else {
      setError(result.error || "Impossible de charger la liste des utilisateurs");
    }
    setLoading(false);
  };

  useEffect(() => {
    let isCancelled = false;

    if (role !== "admin" || !token) {
      return undefined;
    }

    async function fetchInitialUsers() {
      setError("");
      const result = await fetchAdminUsers(token, { limit: 100 });
      if (!isCancelled) {
        if (result.success) {
          setUsers(result.data.users || []);
        } else {
          setError(result.error || "Impossible de charger la liste des utilisateurs");
        }
        setLoading(false);
      }
    }

    fetchInitialUsers();

    return () => {
      isCancelled = true;
    };
  }, [role, token]);

  const showToast = (message) => {
    setSuccessToast(message);
    setTimeout(() => {
      setSuccessToast("");
    }, 4000);
  };

  // Actions de modération
  const handleToggleBan = async (targetUser) => {
    const newBannedState = !targetUser.banned_flag;
    const confirmMsg = newBannedState
      ? `Êtes-vous sûr de vouloir bannir ${targetUser.pseudo} ? L'utilisateur sera immédiatement déconnecté.`
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
          : `L'utilisateur ${targetUser.pseudo} a été débanni avec succès.`,
      );
    } else {
      setError(res.error || "Erreur lors de la mise à jour du bannissement.");
    }
    setActionLoadingId(null);
  };

  const handleChangeRole = async (targetUser) => {
    const newRole = targetUser.role === "admin" ? "player" : "admin";
    const confirmMsg =
      newRole === "admin"
        ? `Promouvoir ${targetUser.pseudo} au rang d'Administrateur ? Il aura accès aux outils de modération.`
        : `Rétrograder ${targetUser.pseudo} au rang de Joueur standard ?`;

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
          ? `${targetUser.pseudo} est désormais Administrateur.`
          : `${targetUser.pseudo} a été rétrogradé au rang de Joueur.`,
      );
    } else {
      setError(res.error || "Erreur lors du changement de rôle.");
    }
    setActionLoadingId(null);
  };

  // Statistiques calculées
  const stats = useMemo(() => {
    const total = users.length;
    const banned = users.filter((u) => u.banned_flag).length;
    const admins = users.filter((u) => u.role === "admin").length;
    const active = total - banned;
    return { total, banned, admins, active };
  }, [users]);

  // Filtrage des utilisateurs
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

  // Si l'utilisateur n'est pas admin, accès refusé
  if (role !== "admin") {
    return (
      <main className="max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="bg-red-950/40 border border-red-700/80 rounded-xl p-8 backdrop-blur shadow-2xl">
          <div className="text-6xl mb-4">⛔</div>
          <h1 className="text-3xl font-extrabold text-red-500 mb-2">Accès Refusé</h1>
          <p className="text-gray-300 mb-6">
            Cette zone de haute sécurité est strictement réservée aux administrateurs du serveur EvilJV.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Utilisateur actuel : <strong className="text-gray-200">{user || "Non connecté"}</strong> (Rôle : {role || "invité"})
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
    <main className="space-y-8 animate-fade-in pb-12">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-green-900 border border-green-500 text-green-100 px-5 py-3 rounded-lg shadow-xl flex items-center gap-3">
          <span>✅</span>
          <p className="text-sm font-medium">{successToast}</p>
        </div>
      )}

      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-red-900/60 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">🛡️</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-red-500 tracking-wide">
              Panel d'Administration & Modération
            </h1>
          </div>
          <p className="text-gray-400 mt-1 text-sm">
            Gestion centralisée des comptes, permissions et bannissements (PostgreSQL & FastAPI).
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm font-semibold rounded-lg border border-gray-700 flex items-center gap-2 transition disabled:opacity-50"
          >
            <span>🔄</span>
            {loading ? "Chargement..." : "Rafraîchir"}
          </button>
          <Link
            to="/evil"
            className="px-4 py-2 bg-red-950/60 hover:bg-red-900/80 text-red-300 text-sm font-semibold rounded-lg border border-red-800/80 transition"
          >
            ← Retour Dashboard
          </Link>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800/70 border border-gray-700 rounded-xl p-4">
          <div className="text-xs text-gray-400 font-medium uppercase">Total Joueurs</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-gray-100 mt-1">{stats.total}</div>
        </div>
        <div className="bg-gray-800/70 border border-green-900/40 rounded-xl p-4">
          <div className="text-xs text-green-400 font-medium uppercase">Comptes Actifs</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-green-400 mt-1">{stats.active}</div>
        </div>
        <div className="bg-gray-800/70 border border-red-900/50 rounded-xl p-4">
          <div className="text-xs text-red-400 font-medium uppercase">Comptes Bannis</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-red-400 mt-1">{stats.banned}</div>
        </div>
        <div className="bg-gray-800/70 border border-yellow-900/40 rounded-xl p-4">
          <div className="text-xs text-yellow-400 font-medium uppercase">Administrateurs</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-yellow-400 mt-1">{stats.admins}</div>
        </div>
      </div>

      {/* Message d'erreur global */}
      {error && (
        <div className="bg-red-950/60 border border-red-600 text-red-200 p-4 rounded-xl text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => setError("")}
            className="text-red-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Barre de recherche et filtres */}
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

      {/* Tableau des utilisateurs */}
      <div className="bg-gray-800/60 border border-gray-700 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-gray-950/80 text-xs uppercase text-gray-400 border-b border-gray-700">
              <tr>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Utilisateur</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Rôle</th>
                <th className="py-3 px-4">Statut</th>
                <th className="py-3 px-4">Dernière Connexion</th>
                <th className="py-3 px-4 text-right">Actions de Modération</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/60">
              {loading && users.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-gray-400">
                    Chargement des données utilisateurs en cours...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-gray-400">
                    Aucun utilisateur ne correspond aux critères de recherche.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isCurrentAdmin = u.pseudo === user;
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
                      <td className="py-3.5 px-4 text-gray-400 text-xs">
                        {u.email}
                      </td>
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
                          {/* Bouton Bannir / Débannir */}
                          <button
                            type="button"
                            disabled={isCurrentAdmin || isBusy}
                            onClick={() => handleToggleBan(u)}
                            className={`px-3 py-1.5 text-xs font-bold rounded transition disabled:opacity-30 disabled:cursor-not-allowed ${
                              u.banned_flag
                                ? "bg-green-700 hover:bg-green-600 text-white"
                                : "bg-red-800 hover:bg-red-700 text-white"
                            }`}
                            title={
                              isCurrentAdmin
                                ? "Vous ne pouvez pas vous bannir vous-même"
                                : u.banned_flag
                                ? "Débannir ce joueur"
                                : "Bannir ce joueur"
                            }
                          >
                            {u.banned_flag ? "Débannir" : "Bannir"}
                          </button>

                          {/* Bouton Rôle */}
                          <button
                            type="button"
                            disabled={isCurrentAdmin || isBusy}
                            onClick={() => handleChangeRole(u)}
                            className="px-2.5 py-1.5 text-xs font-medium rounded bg-gray-700 hover:bg-gray-600 text-gray-200 border border-gray-600 transition disabled:opacity-30 disabled:cursor-not-allowed"
                            title={
                              isCurrentAdmin
                                ? "Vous ne pouvez pas modifier votre propre rôle"
                                : u.role === "admin"
                                ? "Rétrograder en Joueur"
                                : "Promouvoir en Admin"
                            }
                          >
                            {u.role === "admin" ? "Rétrograder" : "Promouvoir"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section future pour le chat et les salons (Pôle Réseau Jeanne) */}
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
          Cette section intégrera le flux d'alertes en temps réel et l'historique des signalements
          dès que le pôle réseau (Jeanne) aura déployé le serveur WebSockets / Socket.IO dédié aux salons et au chat multijoueur.
        </p>
      </section>
    </main>
  );
}

export default EvilAdminPanel;
