import React, { useState, useEffect } from 'react';
import './eliminarCliente.css';

function EliminarCliente() {
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('useEffect ejecutado'); 
    fetch('/api/obtenerClientes', {
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
  
  const handleEliminarCliente = async () => {
    if (!clienteSeleccionado) return;

    try {
      const response = await fetch(`/api/eliminarCliente/${clienteSeleccionado}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estaEliminado: true })
      });

      const data = await response.json();
      console.log(data);

      if (data.success) {
        setClientes(clientes.filter(cliente => cliente.id !== clienteSeleccionado));
        console.log(clientes); 
        setClienteSeleccionado(null);
        alert('Cliente eliminado exitosamente.');
      } else {
        setError(data.message || 'Error al eliminar el cliente');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      setError('Error de conexión al eliminar el cliente');
    }
  };

  return (
    <div className='fondo-eliminar-cliente'>
      <div className='contenedor-formulario-central'>
        <div className='cuadrado-formulario-central'>
          <h1>Eliminación de un cliente</h1>
          {error && <p style={{ color: 'red' }} className="error">{error}</p>}
          <ul>
            {clientes.map(cliente => (
              <li
                key={cliente.id}
                onClick={() => handleSelectCliente(cliente.idCliente)}
                className={clienteSeleccionado === cliente.id ? 'seleccionado' : ''}
              >
                {cliente.correo}
              </li>
            ))}
          </ul>
          <button 
            onClick={handleEliminarCliente} 
            disabled={!clienteSeleccionado}
            className={clienteSeleccionado ? 'boton-eliminar-seleccionado' : 'boton-eliminar'}
          >
            Eliminar Cliente
          </button>
        </div>
      </div>
    </div>
  );
}

export default EliminarCliente;
