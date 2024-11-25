import React, { useState, useEffect } from 'react';
import './eliminarClienteProyecto.css';
import ReactDOM from 'react-dom/client';
import InicioAdmin from './inicioAdmin';

function EliminarClienteProyecto() {
  const [proyectos, setProyectos] = useState([]);
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/obtenerProyectos',{
      method: 'GET'
    })
      .then(response => response.json())
      .then(data => {
        setProyectos(data.proyectos);
        setError(data.message || '');
      })
      .catch(() => setError('Error al cargar los proyectos'));
  }, []);
  
  
  const handleSelectProyecto = id => {
    setProyectoSeleccionado(id);
    setClientes([]);
    fetch(`/api/verProyectosConCliente/${id}`,{
      method:'GET'
    })
      .then(response => response.json())
      .then(data =>   setClientes(data?.clientes || []))
      .catch(() => setError('Error al cargar clientes'));
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
          Modificar peso
        </button>
    );
  };

  const handleSelectCliente = (idCliente) => {
    setClienteSeleccionado(idCliente);
  };

  const llamadasFunciones = () => {
    if (!clienteSeleccionado) return;

    relacionClienteProyecto();
  };

  const relacionClienteProyecto = async () => {
    if (proyectoSeleccionado == null || !clienteSeleccionado) return;
    
    try {
      const response = await fetch('/api/eliminarClienteProyecto', {
          method: 'put',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            idProyecto: proyectoSeleccionado,
            idCliente: clienteSeleccionado,
          })
      });

      if (!response.ok) {
          throw new Error('Error al eliminar el cliente del proyecto');
      }
      const data = await response.json();
      console.log('Cliente eliminado exitosamente:', data);
    } catch (error) {
      console.error('Error:', error);
      setError('Error al eliminar el cliente del proyecto');
    }

      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(
        <React.StrictMode>
          <EliminarClienteProyecto />
        </React.StrictMode>
      );
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
             disabled={!clienteSeleccionado}
             className={clienteSeleccionado ? 'boton-proyecto-seleccionado' : 'boton-proyecto'}
          >
            Eliminar cliente
          </button>
        </div>
      </div>
    </div>
  );
}

export default EliminarClienteProyecto;
