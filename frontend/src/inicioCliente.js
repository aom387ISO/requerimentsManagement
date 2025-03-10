import React, { useState, useEffect } from 'react';  // Importa React y los hooks una sola vez
import './inicioCliente.css';
import ReactDOM from 'react-dom/client';
import './iniciarSesion';
import IniciarSesion from './iniciarSesion';
import CambiarPesoTarea from './cambiarPesoTarea'; 

function InicioCliente({idCliente}) {
  const [expandedRows, setExpandedRows] = useState({});
  const [data, setData] = useState([]);

  console.log('idCliente es:', idCliente);
  
  useEffect(() => {
    fetch(`/api/verProyectosCliente/${idCliente}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Datos JSON obtenidos:', data.proyectos); 
        if (data.success) {
          setData(data.proyectos);
        } else {
          console.log(data.message);
        }
      })
      .catch((error) => console.error('Error al obtener datos:', error));
  }, [idCliente]);

  const toggleRow = (index) => {
    setExpandedRows({
      ...expandedRows,
      [index]: !expandedRows[index],
    });
  };

  const handleCerrarSesion = () => {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      <React.StrictMode>
        <IniciarSesion />
      </React.StrictMode>
    );
  };

  function cambiarPesoTarea({ idCliente, tareaId }) {
    console.log("ID cliente en llamada ", idCliente);
    console.log("ID tarea en llamada ", tareaId)
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      <React.StrictMode>
        <CambiarPesoTarea idCliente={idCliente} tareaId={tareaId} />
      </React.StrictMode>
    );
  }
  

  return (
    <div className="main-container">
      <div className="header">
        <div></div>
        <div>
          <button className='boton-cerrar-sesion' onClick={handleCerrarSesion}>Cerrar sesión</button>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <div className='contenedor-nombre'>
              <p>Nombre</p>
              <div className='header-linea'></div>
          </div>

          <div className='header-datos-derecha'>
            <div className='header-linea' style={{ marginRight: '10px' }}></div>
            <div className='header-dato-peso-proyecto'>
              <p>Peso</p>
            </div>

            <div className='header-linea' style={{ marginRight: '16px' }}></div>
            <div className='header-dato-esfuerzo-proyecto'>
              <p>Esfuerzo</p>
            </div>

            <div className='header-linea' style={{ marginRight: '8px' }}></div>
            <div className='header-dato-tiempo-proyecto'>
              <p>Tiempo</p>
            </div>

            <div className='header-linea'></div>
            <div className='header-dato-prioridad-proyecto'>
              <p>Prioridad</p>
            </div>
          </div>     
        </div>

        {Array.isArray(data) && data.map((project, index) => (
          <React.Fragment key={index}>
             <div className="project-row">
              <div className='contenedor-proyecto-nombre-botones'>
                <div className='contenedor-proyecto-nombre-cliente'>
                  <button className='simbolo-nombre-proyecto-boton' onClick={() => toggleRow(index)}>
                    {expandedRows[index] ? '-' : '+'}
                  </button>
                  <button className='nombre-proyecto-boton' onClick={() => toggleRow(index)}>
                    {project.nombreProyecto}
                  </button>
                </div>
              </div>
              

              <div className='datos-derecha-proyecto'>

                <div className='dato-esfuerzo-proyecto'>
                  <p>{project.esfuerzo}€</p>
                </div>

                <div className='dato-tiempo-proyecto'>
                 {/* <p>{Math.floor(project.tiempoTotal / 60)}h {project.tiempoTotal % 60}m</p> */}
                </div>

                <div className='dato-prioridad-proyecto'>
                  <p>{project.prioridad}</p>
                </div>

              </div>
            </div>

            {expandedRows[index] && project.requirements.map((req, reqIndex) => (
              <div key={reqIndex} className="tarea-fila">
                <div className='contenedor-tarea-nombre-botones'>
                  <div className='contenedor-tarea-nombre'>
                    <p>{req.nombreTarea}</p>
                  </div>

                  <div className='contenedor-tarea-botones'>                                   
                    <button className="boton-tarea-nombre" onClick={() => cambiarPesoTarea({ idCliente, tareaId: req.idTarea })}>
                      Modificar peso
                    </button>
                    <div className='linea' style={{ marginRight: '8px' }}></div>
                  </div>
                </div>

                <div className='datos-derecha-tarea'>
                  <div className='dato-peso-tarea'></div>
                  <p>{req.pesoCliente}</p>
                <div className='dato-esfuerzo-tarea'>
                  <p>{req.esfuerzo}€</p>
                </div>

                <div className='dato-tiempo-tarea'>
                  <p>{Math.floor(req.tiempoMinutos / 60)}h{req.tiempoMinutos % 60}m</p>
                </div>

                <div className='dato-prioridad-tarea'>
                  <p>{req.prioridad}</p>
                </div>

              </div>
            </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default InicioCliente;