import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './solucionManual.css';
import InicioAdmin from './inicioAdmin';
import SolucionAutomatica from './solucionAutomatica';
import SolucionManual from './solucionManual';

function SolucionEditarManual({proyectoId}) {
  const [tareas, setTareas] = useState([]);
  const [tareasSeleccionadas, setTareasSeleccionadas] = useState([])
  const [error, setError] = useState('');
  console.log("Id del proyecto en solucion automatica:",proyectoId);

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
  };

  const handleSolucionAutomatica = () => {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
        <React.StrictMode>
        <SolucionAutomatica proyectoId={proyectoId} />
      </React.StrictMode>
    );
  };

  const handleSolucionManual = () => {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
        <React.StrictMode>
        <SolucionManual proyectoId={proyectoId} />
      </React.StrictMode>
    );
  };

  const handleEditarSolucionManual = () => {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
        <React.StrictMode>
        <SolucionEditarManual proyectoId={proyectoId} />
      </React.StrictMode>
    );
  };

  const handleGuardarSolucion = async () => {
    if (!tareasSeleccionadas) return;

    try {
      const response = await fetch(`/api/editarSolucion`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({tareasSeleccionadas, proyectoId})
      });

      const data = await response.json();
      console.log(data);

      if (data.success) {
        
        <React.StrictMode>
            <SolucionManual proyectoId={proyectoId} />
        </React.StrictMode>

      } else {
        setError(data.message || 'Error al crear la solucion');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      setError('Error de conexión al editar la solución');
    }
  };

  const handleSelectTarea = (tareaId) => {
    if (tareasSeleccionadas.includes(tareaId)) {
      setTareasSeleccionadas(tareasSeleccionadas.filter(id => id !== tareaId));
    } else {
      setTareasSeleccionadas([...tareasSeleccionadas, tareaId]);
    }
  };

  const listaTareas =tareas.map(tarea => (
    <li
      key={tarea.idTarea}
      className={tareasSeleccionadas.includes(tarea.idTarea) ? 'seleccionado' : ''}
      onClick={() => handleSelectTarea(tarea.idTarea)}
    >
      {tarea.nombreTarea + "‎ ‎ ‎ Satisfacción:‎ "+ tarea.prioridad + "‎ ‎ ‎ Productividad:‎ " + tarea.productividad + "‎ ‎ ‎ Esfuerzo:‎ "+tarea.esfuerzo} 
    </li>
  ))

  return (
    <div className='fondo-solucion-automatica'>
      <button className='boton-volver' onClick={handleVolver}>Volver</button>
      <div className='contenedor-central-solucion'>
        <div className='cuadrado-central-solucion'>
          <div className='contenedor-botones'>
            <button className='botones-superiores'onClick={handleSolucionAutomatica}>Solucion Automática</button>
            <button className='botones-superiores'onClick={handleSolucionManual}>Solucion Manual</button>
            <button className='botones-superiores'onClick={handleEditarSolucionManual}>Editar solucion Manual</button>
          </div>
          
          <div className='cuadro-formulario-central-lista'>
            <h1>Editar solucion manual de tareas</h1>
            {error && <p style={{ color: 'red' }} className="error">{error}</p>}
            <ul>
                {listaTareas}
            </ul>
          </div>
          
          <button 
            onClick={handleGuardarSolucion} 
            disabled={tareasSeleccionadas == null}
            className={tareasSeleccionadas ? 'boton-eliminar-seleccionado' : 'boton-eliminar'}
          >
            Guardar solución
          </button>
        </div>
      </div>
    </div>
  );
}

export default SolucionEditarManual;
