import React, { useState, useEffect } from 'react';
import './vistaListaDeProyectoAnadirCliente.css';
import ReactDOM from 'react-dom/client';
import InicioAdmin from './inicioAdmin';

function VistaListaDeProyectoAnadirCliente() {
  const [proyectos, setProyectos] = useState([]);
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [peso, setPeso] = useState(0);
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
    fetch(`/api/verProyectosSinCliente/${id}`,{
      method:'GET'
    })
      .then(response => response.json())
      .then(data => setClientes(data.clientes))
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
          Añadir Cliente
        </button>
    );
  };

  const handleSelectCliente = (idCliente) => {
    setClienteSeleccionado(idCliente);
  };

  const llamadasFunciones = () => {
    if (!clienteSeleccionado) return;

    if (peso < 0 || peso > 5) {
      setError('El peso debe ser un número entre 0 y 5');
      return;
    }

    relacionClienteProyecto();
  };

  const relacionClienteProyecto = async () => {
    if (!proyectoSeleccionado || !clienteSeleccionado) return;
    
    try {
      const response = await fetch('/api/anadirClienteProyecto', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              proyecto: proyectoSeleccionado,
              cliente: clienteSeleccionado,
              peso: peso
          })
      });

      if (!response.ok) {
          throw new Error('Error al agregar el cliente al proyecto');
      }
      const data = await response.json();
      console.log('Cliente agregado exitosamente:', data);
    } catch (error) {
      console.error('Error:', error);
      setError('Error al agregar el cliente al proyecto');
    }

      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(
        <React.StrictMode>
          <VistaListaDeProyectoAnadirCliente />
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
          <div>
              <p>
                  Peso del cliente en el proyecto: 
              </p>
              <input type="number" min="0" max="5" step="1" placeholder="Introduzque entre 0 y 5" style={{ width: '24%' }} value={peso} onChange={(e) => setPeso(e.target.value)}></input>
            </div>
          <button 
             onClick={llamadasFunciones} 
             disabled={!clienteSeleccionado}
             className={clienteSeleccionado ? 'boton-proyecto-seleccionado' : 'boton-proyecto'}
          >
            Añadir Cliente
          </button>
        </div>
      </div>
    </div>
  );
}

export default VistaListaDeProyectoAnadirCliente;
