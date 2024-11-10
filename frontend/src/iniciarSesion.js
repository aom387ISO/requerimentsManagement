import React, { useState } from 'react';
import './iniciarSesion.css';
import InicioCliente from './inicioCliente';
import InicioAdmin from './inicioAdmin';
import ReactDOM from 'react-dom/client';
import './index.css';

function IniciarSesion() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [idCliente, setIdCliente] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: correo, contrasena: password })
      });
            
      const data = await response.json();
      const root = ReactDOM.createRoot(document.getElementById('root'));

      if (data.success) {
        console.log('Usuario autenticado:', data.user);
        console.log('id de prueba');
        setIdCliente(data.user.idCliente);

        if(data.user.idCliente !== 0){
          root.render(
            <React.StrictMode>
              <InicioCliente idCliente={data.user.idCliente} /> 
            </React.StrictMode>
          );
        }else{
          root.render(
            <React.StrictMode>
              <InicioAdmin/>
            </React.StrictMode>
          );
        }
        
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
          <input type="text" value={correo} onChange={(e) => setCorreo(e.target.value)} />
          <label>Contraseña:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit">Iniciar Sesión</button>
          {error && <p style={{ color: 'red' }}  className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default IniciarSesion;
