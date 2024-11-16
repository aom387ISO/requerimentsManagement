import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import IniciarSesion from './iniciarSesion';
import './inicioAdmin.css';
import CrearProyecto from './crearProyecto';
import CrearCliente from './crearCliente';
import EliminarCliente from './eliminarCliente';
import EliminarProyecto from './eliminarProyecto';
import AnadirTarea from './anadirTarea';
import VistaListaDeProyectoAnadirCliente from './vistaListaDeProyectoAnadirCliente';
import EditarTarea from './editarTarea';
import EditarProyecto from './editarProyecto';

function InicioAdmin() {
  const [expandedRows, setExpandedRows] = useState({});
  const [showSquare, setShowSquareState] = useState(false);
  const [selectedWeight, setSelectedWeight] = useState(null);
  const [nuevoPeso, setNuevoPeso] = useState(null);
  const [cuadroEliminar, setCuadroEliminar] = useState(false);
  const [tareaAEliminar, setTareaAEliminar] = useState(null);
  const [tareaId, setTareaId] = useState(null);

  const [data, setData] = useState([]);
  useEffect(() => {
    fetch('/api/verProyectos', {
      method: 'GET', 
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
  const cancelarEliminar = () => {
    setCuadroEliminar(false);
    setTareaAEliminar(null); 
    setTareaId(null);
  };


  const handleSetShowSquare = (show, weight, tareaId) => {
    setShowSquareState(show);
    setSelectedWeight(weight);
    setNuevoPeso(weight);
    setTareaId(tareaId);
  };

  const handleEliminarTarea = (requisitoId) => {
    setTareaAEliminar(requisitoId);
    setCuadroEliminar(true); 
  };

  const confirmarEliminarTarea = () => {
    if (tareaAEliminar !== null) {
      fetch(`/api/eliminarTarea/${tareaAEliminar}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estaEliminado: true })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          console.log('Tarea eliminada correctamente');
          setData(prevData => { 
            return prevData.map(project => {
              const updatedRequirements = project.requirements.filter(req => req.idTarea !== tareaAEliminar);
              return {
                ...project,
                requirements: updatedRequirements
              };
            });
          });
        }else {
          console.log('Error al eliminar la tarea:', data.message);
        }
      })
      .catch(error => console.error('Error al eliminar tarea:', error))
      .finally(() => {
        setCuadroEliminar(false);
        setTareaAEliminar(null);
      });
    }
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
  const handleAnadirCliente = () => {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      <React.StrictMode>
        <VistaListaDeProyectoAnadirCliente/>
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

  const handleEliminarProyecto = () => {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      <React.StrictMode>
        <EliminarProyecto/>
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
  
  const handleEditarProyecto = (proyectoId) => {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      <React.StrictMode>
        <EditarProyecto proyectoId={proyectoId} />
      </React.StrictMode>
    );
  };

  const handleEditarTarea = (tareaId) => {
    console.log('tarea en inicioAdmin ',tareaId);
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      <React.StrictMode>
        <EditarTarea tareaId={tareaId} />
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
        <div className='contenedor-botones-izquierda'>
          <button className='boton-cabecera' onClick={handleCrearProyecto}>Crear Proyecto</button>
          <button className='boton-cabecera' onClick={handleCrearCliente}>Crear Cliente</button>
          <button className='boton-cabecera' onClick={handleAnadirCliente}>Añadir Cliente a un proyecto</button>
          <button className='boton-cabecera' onClick={handleEliminarCliente}>Eliminar Cliente</button>
          <button  className='boton-cabecera' onClick={handleEliminarProyecto}>Eliminar proyecto</button>
        </div>
        
        <div>
          <button className='boton-cerrar-sesion' onClick={handleCerrarSesion}>Cerrar sesión</button>
        </div>

      </div>

      <div className="table-container">
        <div className="table-header">
          <div className='contenedor-nombre'>
              <p>Nombre</p>
          </div>

            <div>
              <p>Peso</p>
            </div>
            <div>
              <p>Esfuerzo</p>
            </div>
            <div>
              <p>Tiempo</p>
            </div>

          <div>
            <p>Prioridad</p>
          </div>
        </div>
        {data.map((project, index) => (
          <React.Fragment key={index}>
            <div className="project-row">
              <div className='contenedor-proyecto-nombre-botones'>
                <div className='contenedor-proyecto-nombre'>
                  <button onClick={() => toggleRow(index)}>
                    {expandedRows[index] ? '−' : '+'}
                  </button>
                  <p>{project.nombreProyecto}</p>
                </div>
              
                <span>
                  <button className="boton-anadir-tarea" onClick={() => handleEditarProyecto(project.idProyecto)}>
                    Editar proyecto
                  </button>
                </span>
                <span>
                  <button className="boton-anadir-tarea" onClick={() => handleAnadirTarea(project.idProyecto)}>
                    Añadir tarea
                  </button>
                </span>
              </div>
              
              <span className="weight">{project.peso}</span>
              <span className="effort">{project.esfuerzo}€</span>
              <span></span>
              <span className={`priority priority-${project.prioridad}`}>{project.prioridad}</span>

            </div>

            {expandedRows[index] && project.requirements.map((req, reqIndex) => (
              <div key={reqIndex} className="requirement-row">
                <button 
                className="delete-requirement"
                onClick={() => handleEliminarTarea(req.idTarea)}
                >
                X
                </button>
                <span className="requirement-name">{req.nombreTarea}</span>
                <span><button className="boton-anadir-tarea" onClick={() => handleEditarTarea(req.idTarea)}>
              Editar tarea
              </button></span>
                <span className="weight">
                  {req.peso}
                  <button className="edit-weight" onClick={() => handleSetShowSquare(true, req.peso, req.idTarea)}>
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
          {cuadroEliminar  && (
          <div className="square">
            <div className="big-text">¿De verdad vas a eliminar la tarea?</div>
            <div className="button-container">
              <button className="close-button" onClick={cancelarEliminar}>Cancelar</button>
              <button className="accept-button" onClick={confirmarEliminarTarea}>Aceptar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default InicioAdmin;
