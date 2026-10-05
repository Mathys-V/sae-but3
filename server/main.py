from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import socketio

# 1. Initialisation de l'application FastAPI
app = FastAPI(
    title="Evil MesCoursJV API", 
    description="API REST et Serveur Temps Réel pour le jeu"
)

# 2. Configuration de CORS pour autoriser le client React local
# Vite tourne par défaut sur le port 5173
origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Initialisation du serveur Socket.IO (Mode Asynchrone)
# On autorise également le port 5173 pour les WebSockets
sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins="http://localhost:5173")

# 4. Fusion de FastAPI et Socket.IO dans une seule application ASGI
# C'est cette variable 'socket_app' que le serveur Uvicorn va lancer
socket_app = socketio.ASGIApp(sio, other_asgi_app=app)

# --- ÉvénEMENTS SOCKET.IO ---

@sio.event
async def connect(sid, environ):
    print(f"[Socket.IO] Nouveau joueur connecté. ID de session : {sid}")
    # On envoie un message de bienvenue au joueur qui vient de se connecter
    await sio.emit('server_message', {'data': 'Connexion au serveur Evil MesCours établie.'}, to=sid)

@sio.event
async def disconnect(sid):
    print(f"[Socket.IO] Joueur déconnecté. ID de session : {sid}")

# --- ROUTES FASTAPI (HTTP Classique) ---

@app.get("/")
async def root():
    return {"status": "ok", "message": "Le serveur FastAPI et Socket.IO est opérationnel."}