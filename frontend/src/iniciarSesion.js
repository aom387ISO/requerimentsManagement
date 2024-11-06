import React, { useState } from 'react';
import './iniciarSesion.css';

function IniciarSesion() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
            
      const data = await response.json();

      if (data.success) {
        console.log('Usuario autenticado:', data.user);
        // Redirige o guarda el estado de sesión del usuario aquí
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      setError('Error de conexión');
    }
  };

  return (
    <div className="fondo-login">
      <div className="cuadrado-central">
        <h1>Iniciar Sesión</h1>
        <form className="formulario-central" onSubmit={handleSubmit}>
          <label>Usuario:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          <label>Contraseña:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit">Iniciar Sesión</button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default IniciarSesion;
