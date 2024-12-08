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
  const [coberturas, setCoberturas] = useState([]);
  const [error, setError] = useState('');
  console.log("Id del proyecto en solucion automatica:",proyectoId);

  useEffect(() => {
    const fetchData = async () => {
      console.log('useEffect ejecutado')
      console.log("Id del proyecto cuando el useEffect:", proyectoId)

      try {
        const responseTareas = await fetch(`/api/obtenerTareasLimiteEsfuerzo/${proyectoId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
        const dataTareas = await responseTareas.json()

        if (dataTareas.success && Array.isArray(dataTareas.tareas)) {
          console.log('tareas cargadas:', dataTareas.tareas)
          setTareas(dataTareas.tareas)

          const responseClientes = await fetch(`/api/obtenerClientesCobertura`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tareas: dataTareas.tareas })
          })
          const dataClientes = await responseClientes.json()

          if (dataClientes.success && Array.isArray(dataClientes.clientes)) {
            console.log('clientes cargados:', dataClientes.clientes)
            setClientes(dataClientes.clientes)


            const responseCobertura = await fetch(`/api/calculoCobertura`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ tareas: dataTareas.tareas, clientes:dataClientes.clientes })
            })
            const dataCobertura = await responseCobertura.json()

            if (dataCobertura.success && Array.isArray(dataCobertura.coberturas)) {
              console.log('coberturas cargadas:', dataCobertura.coberturas)
              setCoberturas(dataCobertura.coberturas)


            } else {
              setError(dataCobertura.message || 'Error al cargar las coberturas')
            }

          } else {
            setError(dataClientes.message || 'Error al cargar los clientes')
          }
        } else {
          setError(dataTareas.message || 'Error al cargar las tareas')
        }
      } catch (error) {
        console.error('Error en las peticiones:', error)
        setError('Error al cargar los datos')
      }
    }

    fetchData()
  }, [proyectoId])
  

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

          </div>

        </div>
      </div>
    </div>
  );
}

export default SolucionAutomatica;
