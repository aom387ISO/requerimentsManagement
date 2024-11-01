import React from 'react';
import './iniciarSesion.css';

function IniciarSesion() {
  return (
    <div className="fondo-login">
        <div className="cuadrado-central">
            <h1>Iniciar Sesión</h1>
            <form className="formulario-central">
                <label>Usuario:</label>
                <input type="text" />
                <label>Contraseña:</label>
                <input type="password" />
                <button type="submit">Iniciar Sesión</button>
            </form>
        </div>
    </div>
  );
}

export default IniciarSesion;