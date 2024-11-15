import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './eliminarProyecto.css';
import InicioAdmin from './inicioAdmin';

function EliminarProyecto() {
  const [proyectos, setProyectos] = useState([]);
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);
  const [error, setError] = useState('');
  
  useEffect(() => {
    console.log('useEffect ejecutado'); 
    fetch('/api/obtenerProyectos', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(response => response.json())
      .then(data => {
        if (data.success && Array.isArray(data.proyectos)) {
          console.log('Proyectos cargados:', data.proyectos);
          setProyectos(data.proyectos);
        } else {
          setError(data.message || 'Error al cargar los proyectos');
        }
      })
      .catch(error => {
        console.error('Error al obtener los proyectos:', error);
        setError('Error al cargar los proyectos');
      });
  }, []);
  


  const handleSelectProyecto = (proyectoId) => {
    console.log("Proyecto seleccionado:", proyectoId);
    setProyectoSeleccionado(proyectoId);
  };
  
  const handleEliminarProyecto = async () => {
    if (!proyectoSeleccionado) return;

    try {
      const response = await fetch(`/api/eliminarProyecto/${proyectoSeleccionado}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estaEliminado: true })
      });

      const data = await response.json();
      console.log(data);

      if (data.success) {
        setProyectos(proyectos.filter(proyecto => proyecto.idProyecto !== proyectoSeleccionado));
        console.log(proyectos); 
        setProyectoSeleccionado(null);
        alert('proyecto eliminado exitosamente.');
      } else {
        setError(data.message || 'Error al eliminar el proyecto');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      setError('Error de conexión al eliminar el proyecto');
    }
  };

  const handleVolver = () => {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      <React.StrictMode>
        <InicioAdmin />
      </React.StrictMode>
    );
  };

  const listaProyectos =proyectos.map(proyecto => (
    <li
      key={proyecto.idProyecto}
      onClick={() => handleSelectProyecto(proyecto.idProyecto)}
      className={proyectoSeleccionado === proyecto.idProyecto ? 'seleccionado' : ''}
    >
      {proyecto.nombreProyecto}
    </li>
  ))

  return (
    <div className='fondo-eliminar-proyecto'>
      <button className='boton-volver' onClick={handleVolver}>Volver</button>
      <div className='contenedor-formulario-central'>
        <div className='cuadrado-formulario-central'>
          <h1>Eliminación de un proyecto</h1>
          {error && <p style={{ color: 'red' }} className="error">{error}</p>}
          <ul>
          {listaProyectos}
          </ul>
          <button 
            onClick={handleEliminarProyecto} 
            disabled={!proyectoSeleccionado}
            className={proyectoSeleccionado ? 'boton-eliminar-seleccionado' : 'boton-eliminar'}
          >
            Eliminar Proyecto
          </button>
        </div>
      </div>
    </div>
  );
}

export default EliminarProyecto;
