import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import IniciarSesion from './iniciarSesion';
import './inicioAdmin.css';
import CrearProyecto from './crearProyecto';
import CrearCliente from './crearCliente';
import EliminarCliente from './eliminarCliente';
import AnadirTarea from './anadirTarea';

function InicioAdmin() {
  const [expandedRows, setExpandedRows] = useState({});
  const [showSquare, setShowSquareState] = useState(false);
  const [selectedWeight, setSelectedWeight] = useState(null);
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch('/api/verProyectos', {
      method: 'GET', // Cambiar a GET en lugar de POST
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setData(data.proyectos);
        } else {
          console.log(data.message);
        }
      })
      .catch((error) => console.error('Error al obtener datos:', error));
  }, []);
  

  const toggleRow = (index) => {
    setExpandedRows({
      ...expandedRows,
      [index]: !expandedRows[index],
    });
  };

  const closeSquare = () => setShowSquareState(false);
  const acceptSquare = () => setShowSquareState(false);

  const handleSetShowSquare = (show, weight) => {
    setShowSquareState(show);
    setSelectedWeight(weight);
  };
  const handleCrearProyecto = () => {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      <React.StrictMode>
        <CrearProyecto/>
      </React.StrictMode>
    );
  };
  const handleCrearCliente = () => {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      <React.StrictMode>
        <CrearCliente/>
      </React.StrictMode>
    );
  };
  const handleAñadirCliente = () => {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      <React.StrictMode>
        <CrearCliente/> //cambiar cuando este hecha
      </React.StrictMode>
    );
  };
  const handleEliminarCliente = () => {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      <React.StrictMode>
        <EliminarCliente/>
      </React.StrictMode>
    );
  };

  const handleAnadirTarea = (proyectoId) => {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      <React.StrictMode>
        <AnadirTarea proyectoId={proyectoId} />
      </React.StrictMode>
    );
  };

  const handleCerrarSesion = () => {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      <React.StrictMode>
        <IniciarSesion />
      </React.StrictMode>
    );
  };

  return (
    <div className="main-container">
      <div className="header">
        <button className="CrearProyecto-button" onClick={handleCrearProyecto}>Crear Proyecto</button>
        <button className="CrearCliente-button" onClick={handleCrearCliente}>Crear Cliente</button>
        <button className="AñadirCliente-button" onClick={handleAñadirCliente}>Añadir Cliente</button>
        <button className="EliminarCliente-button" onClick={handleEliminarCliente}>Eliminar Cliente</button>
        <button className="logout-button" onClick={handleCerrarSesion}>Cerrar sesión</button>
      </div>

      <div className="table-container">
      <div className="table-header">
          <div className="title">Nombre</div>
          <div className="title">Peso</div>
          <div className="title">Esfuerzo</div>
          <div className="title">Tiempo</div>
          <div className="title">Prioridad</div>
        </div>
        {data.map((project, index) => (
          <React.Fragment key={index}>
            <div className="project-row">
              <button onClick={() => toggleRow(index)}>
                {expandedRows[index] ? '−' : '+'}
              </button>
              <span className="project-name">{project.nombreProyecto}</span>
              <button className="anadirTarea" onClick={() => handleAnadirTarea(project.idProyecto)}>
                Añadir tarea
              </button>
              <span className="weight">{project.peso}</span>
              <span className="effort">{project.esfuerzo}€</span>
              <span></span>
              <span className={`priority priority-${project.prioridad}`}>{project.prioridad}</span>

            </div>

            {expandedRows[index] && project.requirements.map((req, reqIndex) => (
              <div key={reqIndex} className="requirement-row">
                <button className="delete-requirement">X</button>
                <span className="requirement-name">{req.nombreTarea}</span>
                <span className="weight">
                  {req.peso}
                  <button className="edit-weight" onClick={() => handleSetShowSquare(true, req.peso)}>
                    Modificar peso
                  </button>
                </span>
                <span className="effort">{req.esfuerzo}€</span>
                <span>{Math.floor(req.tiempoMinutos / 60)}h{req.tiempoMinutos % 60}m</span>
                <span className={`priority priority-${req.prioridad}`}>{req.prioridad}</span>
              </div>
            ))}
          </React.Fragment>
        ))}
        {showSquare && (
          <div className="square">
            <div className="big-text">Modificación del peso del requisito actual</div>
            <div className="weight-label">Peso actual: {selectedWeight}</div>
            <div className="button-container">
              <button className="close-button" onClick={closeSquare}>Cancelar</button>
              <button className="accept-button" onClick={acceptSquare}>Aceptar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default InicioAdmin;
