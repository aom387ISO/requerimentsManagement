import React, { useState, useEffect } from 'react';  // Importa React y los hooks una sola vez
import './incioCliente.css';
import ReactDOM from 'react-dom/client';
import './iniciarSesion';
import IniciarSesion from './iniciarSesion';

function InicioCliente() {
  const [expandedRows, setExpandedRows] = useState({});
  const [showSquare, setShowSquareState] = useState(false);
  const [selectedWeight, setSelectedWeight] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/api/verProyectos', {
      method: 'GET', // Cambiar a GET para obtener los datos
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setData(data.proyectos); // Cambié 'setProjects' a 'setData' para usar el estado correcto
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
        <button className="logout-button" onClick={handleCerrarSesion}>Cerrar sesión</button>
      </div>

      <div className="table-container">
        <div className="table-header">
          <div className="title">Nombre</div>
          <div className="title">Peso</div>
          <div className="title">Tiempo</div>
          <div className="title">Prioridad</div>
        </div>

        {data.map((project, index) => (
          <div key={index} className="row">
            <div className="project-row">
              <button onClick={() => toggleRow(index)}>
                {expandedRows[index] ? '-' : '+'}
              </button>
              <span className="project-name">{project.projectName}</span>
            </div>

            {expandedRows[index] && project.requirements.map((req, reqIndex) => (
              <div key={reqIndex} className="requirement-row">
                <span className="requirement-name">{req.name}</span>
                <span className="weight">
                  {req.weight}
                  <button className="edit-weight" onClick={() => handleSetShowSquare(true, req.weight)}>
                    Modificar peso
                  </button>
                </span>
                <span>{req.time}</span>
                <span className={`priority priority-${req.priority}`}>{req.priority}</span>
              </div>
            ))}
          </div>
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

export default InicioCliente;
