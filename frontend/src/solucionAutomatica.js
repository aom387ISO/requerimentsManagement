import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './solucionAutomatica.css';
import InicioAdmin from './inicioAdmin';
import SolucionManual from './solucionManual';
import SolucionEditarManual from './solucionEditarManual';
import Cobertura from './cobertura';

function SolucionAutomatica({proyectoId}) {
  const [tareas, setTareas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [contribucion, setContribucion] = useState([]);
  const [cobertura, setCobertura] = useState([]);
  const [error, setError] = useState('');
  console.log("Id del proyecto en solucion automatica:",proyectoId);

  useEffect(() => {
    console.log('useEffect ejecutado'); 
    console.log("Id del proyecto cuando el useeffect:",proyectoId);

    fetch(`/api/obtenerTareasLimiteEsfuerzo/${proyectoId}`, {
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



      fetch(`/api/obtenerClientes`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
        .then(response => response.json())
        .then(data => {
          if (data.success && Array.isArray(data.clientes)) {
            console.log('tareas cargados:', data.clientes);
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

  const handleSelectCliente = (clienteId) => {
    console.log("Cliente seleccionado:", clienteId);
    setClienteSeleccionado(clienteId);
  };

  const handleCobertura = async () => {
    if (!clienteSeleccionado) return;

    try {
      const response = await fetch(`/api/calculoCobertura`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            clienteSeleccionado,
            tareas
         })
      });

      const data = await response.json();
      console.log(data);

      if (data.success) {
        console.log(clientes); 
        setClienteSeleccionado(null);

      } else {
        setError(data.message || 'Error al calcular la cobertura');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      setError('Error de conexión al calcular la cobertura del cliente');
    }
  };


  const listaTareas =tareas.map(tarea => (
    <li
      key={tarea.idTarea}
      className={''}
    >
      {tarea.nombreTarea + "‎ ‎ ‎ Satisfacción:‎ "+ tarea.prioridad + "‎ ‎ ‎ Productividad:‎ " + tarea.productividad + "‎ ‎ ‎ Esfuerzo:‎ "+tarea.esfuerzo} 
    </li>
  ))

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
            <h1>Solución automática de tareas</h1>
            {error && <p style={{ color: 'red' }} className="error">{error}</p>}
            <ul>
                {listaTareas}
            </ul>
          </div>
          

          <div className='cuadro-formulario-central-lista'>
            <h1>
              Lista de clientes
            </h1>

            <ul>
                {listaCliente}
            </ul>

            <button 
             onClick={handleCobertura} 
             disabled={!clienteSeleccionado}
             className={clienteSeleccionado ? 'boton-proyecto-seleccionado' : 'boton-proyecto'}
          >
            Calcular cobertura
          </button>

          </div>

        </div>
      </div>
    </div>
  );
}

export default SolucionAutomatica;
