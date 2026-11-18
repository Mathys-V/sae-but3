// client/src/components/LoginForm.jsx
import { useState } from 'react';
import { loginUser } from '../services/api';
import { useAuthStore } from '../store/authStore';

export default function LoginForm() {
  const [pseudo, setPseudo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // On récupère notre fonction globale depuis Zustand
  const { login, user, logout } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const result = await loginUser(pseudo, password);
    if (result.success) {
      // Si la connexion réussit, on met à jour Zustand
      login(result.data);
    } else {
      setError(result.error || "Échec de la connexion. Vérifiez vos identifiants.");
    }
  };

  // Si le joueur est déjà connecté, on affiche un message de bienvenue
  if (user) {
    return (
      <div style={{ padding: '20px', border: '1px solid green', margin: '20px 0' }}>
        <h2>Bienvenue, {user} !</h2>
        <button onClick={logout}>Se déconnecter</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', border: '1px solid gray', margin: '20px 0' }}>
      <h2>Connexion à MesCours</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '250px' }}>
        <input 
          type="text" 
          placeholder="Pseudo" 
          value={pseudo}
          onChange={(e) => setPseudo(e.target.value)}
          required 
        />
        <input 
          type="password" 
          placeholder="Mot de passe (indice: azerty)" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required 
        />
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
}