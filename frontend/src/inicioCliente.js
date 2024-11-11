import React, { useState, useEffect } from 'react';  // Importa React y los hooks una sola vez
import './incioCliente.css';
import ReactDOM from 'react-dom/client';
import './iniciarSesion';
import IniciarSesion from './iniciarSesion';

function InicioCliente({idCliente}) {
  const [expandedRows, setExpandedRows] = useState({});
  const [showSquare, setShowSquareState] = useState(false);
  const [selectedWeight, setSelectedWeight] = useState(null);
  const [data, setData] = useState([]);
  
  console.log('idCliente es:', idCliente);
  
  useEffect(() => {
    fetch(`/api/verProyectosCliente/${idCliente}`, {
      method: 'GET', // Cambiar a GET para obtener los datos
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Datos JSON obtenidos:', data); 
        if (data.success) {
          setData(data.proyectos); // Cambié 'setProjects' a 'setData' para usar el estado correcto
        } else {
          console.log(data.message);
        }
      })
      .catch((error) => console.error('Error al obtener datos:', error));
  }, [idCliente]);

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
              <span className="weight">{project.peso}</span>
              <span className="effort">{project.esfuerzo}€</span>
              <span></span> {/* Empty cell for project time */}
              <span className={`priority-client priority-${project.prioridad}`}>{project.prioridad}</span>
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
                <span className={`priority-client priority-${req.prioridad}`}>{req.prioridad}</span>
              </div>
            ))}
          </React.Fragment>
        ))}

        {showSquare && (
          <div className="square-client">
            <div className="big-text-client">Modificación del peso del requisito actual</div>
            <div className="weight-label-client">Peso actual: {selectedWeight}</div>
            <div className="button-container-client">
              <button className="close-button-client" onClick={closeSquare}>Cancelar</button>
              <button className="accept-button-client" onClick={acceptSquare}>Aceptar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default InicioCliente;
