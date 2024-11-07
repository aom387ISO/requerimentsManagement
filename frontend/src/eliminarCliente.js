import React, { useState } from 'react';
import './eliminarCliente.css';
import ListadoClientes from './listadoClientes';

function EliminarCliente({ cliente, onEliminar }) {
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [mensaje, setMensaje] = useState('');

  const handleSelectCliente = (cliente) => {
    setClienteSeleccionado(cliente);
  };

  const handleEliminar = async () => {
    try {
      const response = await fetch('/api/eliminarClienteBackend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: cliente.correo })
      });
      
      const data = await response.json();
      if (data.success) {
        alert('Cliente marcado como eliminado');
        onEliminar(cliente);
      } else {
        alert('Error al eliminar el cliente');
      }
    } catch (error) {
      console.error('Error al eliminar el cliente:', error);
    }
  };
  
  return (
    <div className="eliminar-cliente">
      <h2>Eliminar Cliente</h2>
      {clienteSeleccionado ? (
        <div>
          <p>¿Estás seguro de que deseas eliminar a {clienteSeleccionado.nombre}?</p>
          <button onClick={handleEliminar}>Eliminar</button>
          <button onClick={() => setClienteSeleccionado(null)}>Cancelar</button>
          {mensaje && <p>{mensaje}</p>}
        </div>
      ) : (
        <ListadoClientes onSelectCliente={handleSelectCliente} />
      )}
    </div>
  );
}

export default EliminarCliente;
