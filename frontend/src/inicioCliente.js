import React, { useState, useEffect } from 'react';  // Importa React y los hooks una sola vez
import './inicioCliente.css';
import ReactDOM from 'react-dom/client';
import './iniciarSesion';
import IniciarSesion from './iniciarSesion';

function InicioCliente({idCliente}) {
  const [expandedRows, setExpandedRows] = useState({});
  const [showSquare, setShowSquareState] = useState(false);
  const [selectedWeight, setSelectedWeight] = useState(null);
  const [nuevoPeso, setNuevoPeso] = useState(null);
  const [data, setData] = useState([]);
  const [tareaId, setTareaId] = useState(null);

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
    fetch('/api/modificarPesoTarea', {
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({Tarea_idTarea: tareaId,  Cliente_idCliente: 0, peso : nuevoPeso})

    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setData(data.proyectos);
        } else {
          console.log(data.message);
        }
      })
      .catch((error) => console.error('Error al cambiar los datos:', error));


    setShowSquareState(false);
  
  };

  const handleSetShowSquare = (show, weight, tareaId) => {
    setShowSquareState(show);
    setSelectedWeight(weight);
    setNuevoPeso(weight);
    setTareaId(tareaId);
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
        <button onClick={handleCerrarSesion}>Cerrar sesión</button>
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
              <span></span>
              <span className={`priority-client priority-${project.prioridad}`}>{project.prioridad}</span>
            </div>

            {expandedRows[index] && project.requirements.map((req, reqIndex) => (
              <div key={reqIndex} className="requirement-row">
                <span className="requirement-name">{req.nombreTarea}</span>
                <span className="weight">
                  {req.peso}
                  <button className="edit-weight" onClick={() => handleSetShowSquare(true, req.peso, req.idTarea)}>
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
          <div className="square">
            <div className="big-text">Modificación del peso del requisito actual</div>
            <div className="weight-label">Peso actual: {selectedWeight}</div>
            <input
              type="number"
              value={nuevoPeso}
              onChange={(e) => setNuevoPeso(e.target.value)}
              placeholder="Introduce el nuevo peso"
            />
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
