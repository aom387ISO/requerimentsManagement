import React, { useState, useEffect } from 'react';
import './vistaListaDeProyectoAnadirCliente.css';
import VistaListaDeClienteEnProyecto from './vistaListaDeClienteEnProyecto';
import ReactDOM from 'react-dom/client';
import InicioAdmin from './inicioAdmin';

function VistaListaDeProyectoAnadirCliente() {
  const [proyectos, setProyectos] = useState([]);
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
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
  
  
  const handleSelectProyecto = (idProyecto) => {
    console.log("Proyecto seleccionado:", idProyecto);
    setProyectoSeleccionado(idProyecto);
    setClientes([]);
    handleVerProyectosCliente(idProyecto);
  };

  const handleVolver = () => {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      <React.StrictMode>
        <InicioAdmin />
      </React.StrictMode>
    );
}

  const handleBotonProyecto= async () => {
    if (!proyectoSeleccionado) return;
    return (
        <button
          onClick={handleBotonProyecto}
          disabled={!proyectoSeleccionado}
          className={proyectoSeleccionado ? 'boton-proyecto-seleccionado' : 'boton-proyecto'}
        >
          Añadir Cliente
        </button>
    );
  };

  const handleSelectCliente = (idCliente) => {
    setClienteSeleccionado(idCliente);
  };

  const handleVerProyectosCliente = () => {
    if (!proyectoSeleccionado) return;

    fetch(`/api/verProyectosSinCliente/${proyectoSeleccionado}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setClientes(data.clientes);
        } else {
          setError(data.message || 'Error al cargar clientes');
        }
      })
      .catch(error => {
        console.error('Error al obtener los clientes sin proyecto:', error);
        setError('Error al cargar los clientes');
      });
  };

  const llamadasFunciones = () => {
    handleBotonProyecto();
    relacionClienteProyecto();
  };

  const relacionClienteProyecto = () => {
    if (!proyectoSeleccionado || !clienteSeleccionado) return;

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

  const listaClientes = clientes.map(cliente => (
    <li
      key={cliente.idCliente}
      onClick={() => handleSelectCliente(cliente.idCliente)}
      className={clienteSeleccionado === cliente.idCliente ? 'seleccionado' : ''}
    >
      {cliente.nombre} {cliente.apellido}
    </li>
  ))

  return (
    <div className='fondo-lista-proyecto'>
      <button className='boton-volver' onClick={handleVolver}>Volver</button>
      <div className='contenedor-formulario-central'>
        <div className='cuadrado-formulario-central'>
          <h1>Seleccione un proyecto</h1>
          {error && <p style={{ color: 'red' }} className="error">{error}</p>}
          <ul>{listaProyecto}</ul>
          <h1>Seleccione un cliente</h1>
          <ul>{listaClientes}</ul>
          <button 
            onClick={llamadasFunciones} 
            disabled={!proyectoSeleccionado || !clienteSeleccionado}
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
