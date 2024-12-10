import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './solucionManual.css';
import InicioAdmin from './inicioAdmin';
import SolucionAutomatica from './solucionAutomatica';
import SolucionManual from './solucionManual';
import SolucionEditarManual from './solucionEditarManual';

function Dependencia({idTarea, proyectoId}) {

  const [tareas, setTareas] = useState([]);
  const [tareaSeleccionada, setTareaSeleccionada] = useState(null)
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('useEffect ejecutado'); 
    console.log("Id del proyecto cuando el useeffect:",proyectoId);

    fetch(`/api/obtenerTareas/${proyectoId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(response => response.json())
      .then(data => {
        if (data.success && Array.isArray(data.tareas)) {
          console.log('tareas cargados:', data.tareas);
          setTareas(data.tareas);
        } else {
          setError(data.message || 'Error al cargar las tareas');
        }
      })
      .catch(error => {
        console.error('Error al obtener las tareas:', error);
        setError('Error al cargar las tareas');
      });
  }, []);

const handleVolver = () => {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <InicioAdmin />
    </React.StrictMode>
  );
}

const handleDependencia = () => {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
        <React.StrictMode>
        <SolucionAutomatica proyectoId={proyectoId} />
      </React.StrictMode>
    );
  };

  const handleExclusion = () => {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
        <React.StrictMode>
        <SolucionManual proyectoId={proyectoId} />
      </React.StrictMode>
    );
  };

  const handleInterdependencia = () => {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
        <React.StrictMode>
        <SolucionEditarManual proyectoId={proyectoId} />
      </React.StrictMode>
    );
  };

  const handleBotonDependencia = async () => {
   
  };

  const handleSelectTarea = (tareaId) => {
    console.log("tarea seleccionada:", tareaId);
    setTareaSeleccionada(tareaId);
  };

  const listaTareas =tareas.map(tarea => (
    <li
      key={tarea.idTarea}
      onClick={() => handleSelectTarea(tarea.idTarea)}
      className={tareaSeleccionada === tarea.idTarea ? 'seleccionado' : ''}
    >
      {tarea.nombreTarea} 
    </li>
  ))


  return (
    <div className='fondo-solucion-automatica'>
      <button className='boton-volver' onClick={handleVolver}>Volver</button>
      <div className='contenedor-central-solucion'>
        <div className='cuadrado-central-solucion'>
          <div className='contenedor-botones'>
            <button className='botones-superiores'onClick={handleDependencia}>Añadir dependencias</button>
            <button className='botones-superiores'onClick={handleExclusion}>Añadir exclusiones</button>
            <button className='botones-superiores'onClick={handleInterdependencia}>Añadir interdependencias</button>
          </div>
          
          <div className='cuadro-formulario-central-lista'>
            <h1>Añadir dependencias entre tareas</h1>
            {error && <p style={{ color: 'red' }} className="error">{error}</p>}
            <ul>
                {listaTareas}
            </ul>
          </div>
          
          <button 
            onClick={handleBotonDependencia} 
            disabled={!tareaSeleccionada}
            className={tareaSeleccionada ? 'boton-eliminar-seleccionado' : 'boton-eliminar'}
          >
            Guardar solución
          </button>
        </div>
      </div>
    </div>
  );
}


export default Dependencia;
