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
import VistaCambiarPesoCliente from './vistaCambiarPesoCliente';
import EliminarClienteProyecto from './eliminarClienteProyecto';
import SolucionAutomatica from './solucionAutomatica';
import Dependencia from './dependencia';

function InicioAdmin() {
  const [expandedRows, setExpandedRows] = useState({});
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
  const cancelarEliminar = () => {
    setCuadroEliminar(false);
    setTareaAEliminar(null); 
    setTareaId(null);
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

  const handlePesoClienteProyecto = () => {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      <React.StrictMode>
        <VistaCambiarPesoCliente/>
      </React.StrictMode>
    );
  };

  const handleEliminarClienteProyecto = () => {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      <React.StrictMode>
        <EliminarClienteProyecto/>
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

  const handleSolucion = (proyectoId) => {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    console.log("Id del proyecto cuando hago el handle:",proyectoId);
    root.render(
      <React.StrictMode>
        <SolucionAutomatica proyectoId={proyectoId} />
      </React.StrictMode>
    );
  };

  const handleEditarTarea = (tareaId, idProyecto) => {
    console.log('tarea en inicioAdmin ',);
    console.log('handleEditarTarea llamada');
  console.log('idTarea:', tareaId, 'idProyecto:', idProyecto);
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      <React.StrictMode>
        <EditarTarea tareaId={tareaId} idProyecto={idProyecto}/>
      </React.StrictMode>
    );
  };

  const handleDependencia = (idProyecto) => {
    console.log('tarea en inicioAdmin ',);
    console.log('handleEditarTarea llamada');
    console.log('idProyecto:', idProyecto);
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      <React.StrictMode>
        <Dependencia idProyecto={idProyecto}/>
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
          <button  className='boton-cabecera' onClick={handlePesoClienteProyecto}>Modificar peso de un cliente</button>
          <button  className='boton-cabecera' onClick={handleEliminarClienteProyecto}>Elimina un cliente de un proyecto</button>
        </div>
        
        <div>
          <button className='boton-cerrar-sesion' onClick={handleCerrarSesion}>Cerrar sesión</button>
        </div>

      </div>

      <div className="table-container">
        <div className="table-header">
          <div className='contenedor-nombre'>
              <p>Nombre</p>
              

              <div className='header-linea'></div>
          </div>

          <div className='header-datos-derecha'>

            <div className='header-linea' style={{ marginRight: '16px' }}></div>

            <div className='header-dato-esfuerzo-proyecto'>
              <p>Esfuerzo</p>
            </div>

            <div className='header-linea' style={{ marginRight: '8px' }}></div>

            <div className='header-dato-tiempo-proyecto'>
              <p>Tiempo</p>
            </div>

            <div className='header-linea'></div>

            <div className='header-dato-prioridad-proyecto'>
              <p>Prioridad</p>
            </div>
          </div>     
        </div>
  
        {data.map((project, index) => (
          <React.Fragment key={index}>
            <div className="project-row">
              <div className='contenedor-proyecto-nombre-botones'>
                <div className='contenedor-proyecto-nombre'>
                  <button className='simbolo-nombre-proyecto-boton' onClick={() => toggleRow(index)}>
                    {expandedRows[index] ? '-' : '+'}
                  </button>
                  <button className='nombre-proyecto-boton' onClick={() => toggleRow(index)}>
                    {project.nombreProyecto}
                  </button>
                </div>
                <div className='contenedor-proyecto-botones'>  
                  <button className="boton-proyecto-nombre" onClick={() => handleEditarProyecto(project.idProyecto)}>
                    Editar proyecto
                  </button>
                  <div className='linea-boton'></div>
                  <button className="boton-proyecto-nombre" onClick={() => handleAnadirTarea(project.idProyecto)}>
                    Añadir tarea
                  </button>
                  <div className='linea-boton'></div>
                  <button className="boton-proyecto-nombre" onClick={() => handleSolucion(project.idProyecto)}>
                    Solucion
                  </button>
                  <div className='linea-boton'></div>
                  <button className="boton-proyecto-nombre" onClick={() => handleDependencia(project.idProyecto)}>
                      Relacionar Tareas
                  </button>
                </div>
                <div className='linea'></div>
              </div>
              

              <div className='datos-derecha-proyecto'>

                <div className='dato-esfuerzo-proyecto'>
                  <p>{project.esfuerzo}€</p>
                </div>

                <div className='dato-tiempo-proyecto'></div>

                <div className='dato-prioridad-proyecto'>
                  <p>{project.prioridad}</p>
                </div>

              </div>
            </div>

            {expandedRows[index] && project.requirements.map((req, reqIndex) => (
              <div key={reqIndex} className="tarea-fila">
                <div className='contenedor-tarea-nombre-botones'>
                  <div className='contenedor-tarea-nombre'>
                    <button className="eliminar-tarea" onClick={() => handleEliminarTarea(req.idTarea)}>
                      X
                    </button>
                    <p>{req.nombreTarea}</p>
                  </div>

                  <div className='contenedor-tarea-botones'>                                   
                    <button className="boton-tarea-nombre"  onClick={() => handleEditarTarea(req.idTarea, project.idProyecto)}>
                      Editar tarea
                    </button>
                    <div className='linea'></div>
                  </div>
                </div>
                
                <div className='datos-derecha-tarea'>
                <div className='dato-esfuerzo-tarea'>
                  <p>{req.esfuerzo}€</p>
                </div>

                <div className='dato-tiempo-tarea'>
                  <p>{Math.floor(req.tiempoMinutos / 60)}h{req.tiempoMinutos % 60}m</p>
                </div>



                <div className='dato-prioridad-tarea'>
                  <p>{req.prioridad}</p>
                </div>

              </div>
            </div>
            ))}
          </React.Fragment>
        ))}
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
