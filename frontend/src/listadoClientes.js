import React, { useState, useEffect } from 'react';

function ListadoClientes({ onSelectCliente }) {
  const [clientes, setClientes] = useState([]);
  
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await fetch('/api/clientes');
        const data = await response.json();
        setClientes(data);
      } catch (error) {
        console.error('Error al cargar los clientes:', error);
      }
    };
    
    fetchClientes();
  }, []);
  
  return (
    <div>
      <h2>Listado de Clientes</h2>
      <ul>
        {clientes.map((cliente) => (
          <li key={cliente.id} onClick={() => onSelectCliente(cliente)}>
            {cliente.nombre} - {cliente.correo}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListadoClientes;
