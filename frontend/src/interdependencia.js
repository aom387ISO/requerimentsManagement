import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './solucionManual.css';
import InicioAdmin from './inicioAdmin';
import Dependencia from './dependencia';
import Exclusion from './exclusion';

function Interdependencia({idProyecto}) {

  const [tareas, setTareas] = useState([]);
  const [tareaSeleccionada, setTareaSeleccionada] = useState(null);
  const [tareaSeleccionada2, settareaSeleccionada2] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('useEffect ejecutado'); 
    console.log("Id del proyecto cuando el useeffect:",idProyecto);

    fetch(`/api/obtenerTareas/${idProyecto}`, {
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
        <Dependencia idProyecto={idProyecto} />
      </React.StrictMode>
    );
  };

  const handleExclusion = () => {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
        <React.StrictMode>
        <Exclusion idProyecto={idProyecto} />
      </React.StrictMode>
    );
  };

  const handleInterdependencia = () => {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
        <React.StrictMode>
        <Interdependencia idProyecto={idProyecto} />
      </React.StrictMode>
    );
  };

  const handleBotonDependencia = async () => {
    if(tareaSeleccionada === tareaSeleccionada2){
      setError('No se pueden seleccionar tareas iguales');
      return;
    } 

    try {
      const response = await fetch('/api/insertarInterdependencia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tareaInterdependeA: tareaSeleccionada, tareaEsInterdependidaPor: tareaSeleccionada2 })
      });
            
      const data = await response.json();

      if (data.success) {
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(
            <React.StrictMode>
                <InicioAdmin/>
            </React.StrictMode>
        );
      } else {
        setError(data.message);
      }

    } catch (error) {
      console.error('Error en la solicitud:', error);
      setError('Error de conexión');
    }

  };

  const handleSelectTarea = (tareaId) => {
    console.log("tarea seleccionada:", tareaId);
    setTareaSeleccionada(tareaId);
  };
  
  const handleSelectTarea2 = (tareaId) => {
    console.log("tarea seleccionada:", tareaId);
    settareaSeleccionada2(tareaId);
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

  const listaTareas2 =tareas.map(tarea => (
    <li
      key={tarea.idTarea}
      onClick={() => handleSelectTarea2(tarea.idTarea)}
      className={tareaSeleccionada2 === tarea.idTarea ? 'seleccionado' : ''}
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
            <h1>Añadir interdependencias entre tareas</h1>
            {error && <p style={{ color: 'red' }} className="error">{error}</p>}
            <ul>
            <h2>La tarea:</h2>
                {listaTareas}
            </ul>
            <ul>
            <h2>Interdependiente de:</h2>
                {listaTareas2}
            </ul>
          </div>
          
          <button 
            onClick={handleBotonDependencia} 
            disabled={tareaSeleccionada === null || tareaSeleccionada2 === null}
            className={tareaSeleccionada !== null && tareaSeleccionada2 !== null ? 'boton-eliminar-seleccionado' : 'boton-eliminar'}
          >
            Guardar solución
          </button>
        </div>
      </div>
    </div>
  );
}


export default Interdependencia;
