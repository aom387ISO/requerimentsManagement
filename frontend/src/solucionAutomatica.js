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



            const responseContribucion = await fetch(`/api/calculoContribucion`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ tareas: dataTareas.tareas, clientes:dataClientes.clientes })
            })
            const dataContribucion = await responseContribucion.json()
            if (dataContribucion.success && Array.isArray(dataContribucion.contribucion)) {
              console.log('contribuciones cargadas:', dataContribucion.contribucion)
              setContribucion(dataContribucion.contribucion)
            } else {
              setError(dataContribucion.message || 'Error al cargar las contribuciones')
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

  const listaTareas =tareas.map(tarea => (
    <li
      key={tarea.idTarea}
      className={''}
    >
      {tarea.nombreTarea + "‎ ‎ ‎ Satisfacción:‎ "+ tarea.prioridad + "‎ ‎ ‎ Productividad:‎ " + tarea.productividad + "‎ ‎ ‎ Esfuerzo:‎ "+tarea.esfuerzo} 
    </li>
  ))
  const sumaSatisfaccion = tareas.reduce((suma, tarea) => suma + (tarea.prioridad || 0), 0);
  const sumaProductividad = tareas.reduce((suma, tarea) => suma + (tarea.productividad || 0), 0);

  const listaCliente = clientes.map((cliente, index) => {
    const coberturaValor = coberturas[index] !== undefined ? coberturas[index].toFixed(2) : 'N/A';
    const contribucionCliente = contribucion[index] !== undefined ? contribucion[index].toFixed(2) : 'N/A';
    console.log(contribucion);
    console.log("contribución en index "+contribucion[index]);
    return (
      <li key={cliente.idCliente}>
        {cliente.correo + " - Cobertura: " + coberturaValor+ " - Contribución: " + contribucionCliente}
      </li>
    );
  });

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
            <p style={{ fontWeight: 'bold', marginTop: '10px' }}>
            Satisfacción total: {sumaSatisfaccion}
            </p>
            <p style={{ fontWeight: 'bold', marginTop: '10px' }}>
            Productividad total: {sumaProductividad}
            </p>
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
