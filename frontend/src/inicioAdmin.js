import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import IniciarSesion from './iniciarSesion';
import './inicioAdmin.css';

const data = [
  {
    projectName: 'Nombre del proyecto 1',
    weight: 5,
    effort: '1000€',
    priority: 1,
    requirements: [
      { name: 'Nombre del requisito 1', weight: 5, effort: '500€', time: '4h30m', priority: 1 },
      { name: 'Nombre del requisito 2', weight: 2, effort: '300€', time: '2h30m', priority: 2 },
      { name: 'Nombre del requisito 3', weight: 3, effort: '200€', time: '7h', priority: 3 },
    ],
  },
  {
    projectName: 'Nombre del proyecto 2',
    weight: 2,
    effort: '2750€',
    priority: 2,
    requirements: [],
  },
  // Add more projects as needed
];

function InicioAdmin() {
  const [expandedRows, setExpandedRows] = useState({});
  const [showSquare, setShowSquareState] = useState(false);
  const [selectedWeight, setSelectedWeight] = useState(null);

  const toggleRow = (index) => {
    setExpandedRows({
      ...expandedRows,
      [index]: !expandedRows[index],
    });
  };

  const closeSquare = () => {
    setShowSquareState(false);
  };

  const acceptSquare = () => {
    setShowSquareState(false);
  };

  const handleSetShowSquare = (show, weight) => {
    setShowSquareState(show);
    setSelectedWeight(weight);
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
        <button>Crear proyecto</button>
        <button>Crear cliente</button>
        <button>Añadir cliente a un proyecto</button>
        <button className="delete-button">Eliminar un cliente</button>
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
              <span className="project-name">{project.projectName}</span>
              <span className="weight">{project.weight}</span>
              <span className="effort">{project.effort}</span>
              <span></span> {/* Empty cell for project time */}
              <span className={`priority priority-${project.priority}`}>{project.priority}</span>
            </div>

            {expandedRows[index] && project.requirements.map((req, reqIndex) => (
              <div key={reqIndex} className="requirement-row">
                <button className="delete-requirement">X</button>
                <span className="requirement-name">{req.name}</span>
                <span className="weight">
                  {req.weight}
                  <button className="edit-weight" onClick={() => handleSetShowSquare(true, req.weight)}>
                    Modificar peso
                  </button>
                </span>
                <span className="effort">{req.effort}</span>
                <span>{req.time}</span>
                <span className={`priority priority-${req.priority}`}>{req.priority}</span>
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
