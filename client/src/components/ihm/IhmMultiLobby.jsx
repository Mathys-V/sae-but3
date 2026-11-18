// client/src/components/ihm/IhmMultiLobby.jsx
import { useState } from "react";
import { useAuthStore } from "../../store/authStore";

export default function IhmMultiLobby({ onStartBattle }) {
  const { user, avatar } = useAuthStore();
  const [roomCode, setRoomCode] = useState("");
  const [isInRoom, setIsInRoom] = useState(false);
  const [activeCode, setActiveCode] = useState("");
  const [players, setPlayers] = useState([]);

  // Génération d'un salon 4 joueurs (simulation d'attente réseau)
  const handleCreateRoom = () => {
    const code = `IHM${Math.floor(10 + Math.random() * 90)}`;
    setActiveCode(code);
    setIsInRoom(true);

    const hostPlayer = {
      pseudo: user || "Vous",
      avatar: avatar || "Icon1",
      isHost: true,
      isMe: true,
    };

    // Pour tester le terrain de l'IHM, on prépare les 3 places de camarades
    const botOpponents = [
      { pseudo: "Lucas_DevWeb", avatar: "Icon12", isHost: false, isMe: false },
      { pseudo: "Camille_CSS", avatar: "Icon7", isHost: false, isMe: false },
      { pseudo: "Maxime_S3", avatar: "Icon24", isHost: false, isMe: false },
    ];

    setPlayers([hostPlayer, ...botOpponents]);
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (!roomCode.trim()) return;

    const code = roomCode.trim().toUpperCase();
    setActiveCode(code);
    setIsInRoom(true);

    const me = {
      pseudo: user || "Vous",
      avatar: avatar || "Icon1",
      isHost: false,
      isMe: true,
    };

    const existingHost = {
      pseudo: "Hote_MasterS3",
      avatar: "Icon18",
      isHost: true,
      isMe: false,
    };

    setPlayers([existingHost, me]);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 font-sans">
      {!isInRoom ? (
        <div className="pixel-panel p-6 space-y-6 text-center">
          <div>
            <h2 className="text-xl font-bold text-red-500 uppercase tracking-wider font-sans">
              SALON MULTIJOUEUR (2 À 4 JOUEURS)
            </h2>
            <p className="text-xs text-gray-300 mt-1 leading-relaxed">
              Affrontez jusqu'à 3 autres étudiants en simultané. Les mêmes interfaces au même moment, chacun pour soi avec classement final !
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Créer un salon */}
            <div className="p-4 bg-gray-950/80 border-2 border-gray-800 flex flex-col justify-between space-y-4 rounded">
              <div>
                <span className="text-2xl">👑</span>
                <h3 className="text-sm font-bold text-gray-100 mt-1">CRÉER UN SALON</h3>
                <p className="text-[11px] text-gray-400 mt-1">
                  Créez une arène pour 4 joueurs et partagez le code d'accès.
                </p>
              </div>
              <button
                type="button"
                onClick={handleCreateRoom}
                className="pixel-btn w-full !bg-red-700 hover:!bg-red-600 !text-white !font-sans font-bold"
              >
                GÉNÉRER LE SALON
              </button>
            </div>

            {/* Rejoindre un salon */}
            <div className="p-4 bg-gray-950/80 border-2 border-gray-800 flex flex-col justify-between space-y-4 rounded">
              <div>
                <span className="text-2xl">🚪</span>
                <h3 className="text-sm font-bold text-gray-100 mt-1">REJOINDRE UN SALON</h3>
                <p className="text-[11px] text-gray-400 mt-1">
                  Entrez le code à 4 lettres du salon de votre camarade.
                </p>
              </div>

              <form onSubmit={handleJoinRoom} className="space-y-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="EX: IHM42"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  className="w-full text-center py-2 px-3 bg-gray-900 border border-gray-700 text-sm font-bold text-amber-400 tracking-widest uppercase focus:border-red-500 outline-none rounded"
                />
                <button
                  type="submit"
                  disabled={!roomCode.trim()}
                  className="pixel-btn w-full !font-sans font-bold"
                >
                  REJOINDRE
                </button>
              </form>
            </div>
          </div>

          <p className="text-[11px] text-gray-400 font-mono bg-gray-950/60 p-2 rounded border border-gray-800/80">
            ℹ️ Note d'architecture : Terrain d'interface prêt à être interconnecté aux WebSockets du Pôle Réseau.
          </p>
        </div>
      ) : (
        <div className="pixel-panel p-6 space-y-5 text-center border-2 border-red-700">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <div className="text-left">
              <span className="text-xs text-gray-400 uppercase font-mono">CODE DU SALON</span>
              <p className="text-xl font-bold text-amber-400 tracking-widest font-mono">{activeCode}</p>
            </div>
            <span className="px-3 py-1 bg-red-950 text-red-300 border border-red-700 text-xs font-bold rounded">
              {players.length} / 4 JOUEURS MAX
            </span>
          </div>

          {/* Liste des joueurs dans le salon */}
          <div className="space-y-2.5">
            {players.map((p, idx) => (
              <div
                key={idx}
                className="p-3 bg-gray-950/80 border border-gray-800 rounded flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={`/assets/ui/Barre-de-Navigation/Icones_profil/${p.avatar || "Icon1"}.png`}
                    alt={p.pseudo}
                    className="w-9 h-9 pixelated bg-gray-900 border border-gray-700 rounded"
                  />
                  <div className="text-left">
                    <p className="text-sm font-bold text-gray-200">
                      {p.pseudo} {p.isMe && <span className="text-xs text-amber-400 font-mono">(VOUS)</span>}
                    </p>
                    <p className="text-[11px] text-gray-400">
                      {p.isHost ? "👑 Hôte de la partie" : "Participant prêt"}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 border border-emerald-700 rounded font-mono">
                  PRÊT
                </span>
              </div>
            ))}
          </div>

          {/* Bouton de démarrage de la battle */}
          <div className="pt-3 border-t border-gray-800 flex gap-3">
            <button
              type="button"
              onClick={() => setIsInRoom(false)}
              className="pixel-btn w-1/3 !bg-gray-800 hover:!bg-gray-700 !text-gray-300 !font-sans font-bold"
            >
              QUITTER
            </button>
            <button
              type="button"
              onClick={() => onStartBattle(players)}
              className="pixel-btn w-2/3 !bg-red-700 hover:!bg-red-600 !text-white text-sm !font-sans font-bold"
            >
              ⚔️ LANCER LA BATTLE !
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
