import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './vistaListaDeClienteEnProyecto.css';
import InicioAdmin from './inicioAdmin';


function VistaListaDeClienteEnProyecto({ idProyecto }) {
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(idProyecto);
  const [error, setError] = useState('');


  
  useEffect(() => {
    console.log('useEffect ejecutado'); 
    fetch('/api/listaClientesEnProyecto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(response => response.json())
      .then(data => {
        if (data.success && Array.isArray(data.clientes)) {
          console.log('Clientes cargados:', data.clientes);
          setClientes(data.clientes);
        } else {
          setError(data.message || 'Error al cargar los clientes');
        }
      })
      .catch(error => {
        console.error('Error al obtener los clientes:', error);
        setError('Error al cargar los clientes');
      });
  }, []);
  


  const handleSelectCliente = (clienteId) => {
    console.log("Cliente seleccionado:", clienteId);
    setClienteSeleccionado(clienteId);
  };
  
  const handleAnadirCliente = async () => {
    if (!clienteSeleccionado) return;

    try {
      const response = await fetch(`/api/anadirClienteProyecto/${clienteSeleccionado}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      console.log(data);

      if (data.success) {
        setClientes(clientes.filter(cliente => cliente.idCliente !== clienteSeleccionado));
        console.log(clientes); 
      } else {
        setError(data.message || 'Error al añadir el cliente');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      setError('Error de conexión al eliminar el cliente');
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

  const listaCliente =clientes.map(cliente => (
    <li
      key={cliente.idCliente}
      onClick={() => handleSelectCliente(cliente.idCliente)}
      className={clienteSeleccionado === cliente.idCliente ? 'seleccionado' : ''}
    >
      {cliente.correo}
    </li>
  ))

  return (
    <div className='fondo-anadir-cliente'>
      <button className='boton-volver' onClick={handleVolver}>Volver</button>
      <div className='contenedor-formulario-central'>
        <div className='cuadrado-formulario-central'>
          <h1>Añadir un cliente a un proyecto.</h1>
          {error && <p style={{ color: 'red' }} className="error">{error}</p>}
          <ul>
          {listaCliente}
          </ul>
          <button 
            onClick={handleAnadirCliente} 
            disabled={!clienteSeleccionado}
            className={clienteSeleccionado ? 'boton-anadir-seleccionado' : 'boton-anadir'}
          >
            Añadir Cliente
          </button>
        </div>
      </div>
    </div>
  );
}

export default VistaListaDeClienteEnProyecto;