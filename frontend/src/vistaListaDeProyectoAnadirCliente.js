import React, { useState, useEffect } from 'react';
import './vistaListaDeProyectoAnadirCliente.css';

function VistaListaDeProyectoAnadirCliente() {
  const [proyectos, setProyectos] = useState([]);
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('useEffect ejecutado'); 
    fetch('/api/obtenerProyectos', {
      method: 'POST',
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
  
  
  const handleSelectProyecto = (idProyecto) => {
    console.log("Proyecto seleccionado:", idProyecto);
    setProyectoSeleccionado(idProyecto);
  };
  
  const handleBotonProyecto= async () => {
    if (!proyectoSeleccionado) return;

    //Investigar como pasar proyecto
  };

  const listaProyecto =proyectos.map(proyecto => (
    <li
      key={proyecto.idProyecto}
      onClick={() => handleSelectProyecto(proyecto.idProyecto)}
      className={proyectoSeleccionado === proyecto.idProyecto ? 'seleccionado' : ''}
    >
      {proyecto.nombreProyecto}
    </li>
  ))

  return (
    <div className='fondo-lista-proyecto'>
      <div className='contenedor-formulario-central'>
        <div className='cuadrado-formulario-central'>
          <h1>Seleccione un proyecto</h1>
          {error && <p style={{ color: 'red' }} className="error">{error}</p>}
          <ul>
          {listaProyecto}
          </ul>
          <button 
            onClick={handleBotonProyecto} 
            disabled={!proyectoSeleccionado}
            className={proyectoSeleccionado ? 'boton-proyecto-seleccionado' : 'boton-proyecto'}
          >
            Añadir Cliente
          </button>
        </div>
      </div>
    </div>
  );
}

export default VistaListaDeProyectoAnadirCliente;
