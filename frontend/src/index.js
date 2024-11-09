import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import IniciarSesion from './iniciarSesion';
import CrearProyecto from "./crearProyecto"
import CrearCliente from './crearCliente';
import EliminarCliente from './eliminarCliente';
import InicioAdmin from './inicioAdmin';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <IniciarSesion/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
