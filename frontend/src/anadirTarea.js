import React, { useState } from 'react';
import './anadirTarea.css';
import './editarTarea.css';
import ReactDOM from 'react-dom/client';
import InicioAdmin from './inicioAdmin';

function AnadirTarea({proyectoId}) {
  const [nombreTarea, setNombreTarea] = useState('');
  const [esfuerzo, setEsfuerzo] = useState(0);
  const [tiempoHoras, setTiempoHoras] = useState(0);
  const [tiempoMinutos, setTiempoMinutos] = useState(0);
  const [prioridad, setPrioridad] = useState(0);
  const [error, setError] = useState('');
  const [mensajeExito, setMensajeExito] = useState(''); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (esfuerzo < 0) {
      setError('El esfuerzo no puede ser negativo.');
      return;
    }
    if (prioridad < 0) {
      setError('La prioridad no puede ser negativa.');
      return;
    }

    if (tiempoMinutos < 0) {
      setError('El tiempo en minutos no puede ser negativo.');
      return;
    }

    try {
      const response = await fetch(`/api/anadirTarea/${proyectoId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombreTarea,
          esfuerzo,
          tiempoMinutos,
          prioridad,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setNombreTarea('');
        setEsfuerzo(0);
        setTiempoMinutos(0);
        setPrioridad(0);
        setError('');
        handleVolver();
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      setError('Error de conexión');
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

  return (

    <div className='fondo-editar-tarea'>
      <button className='boton-volver' onClick={handleVolver}>Volver</button>
      <div className='contenedor-editar-tarea'>
        <div className='cuadrado-editar-tarea'>
          <h1>Añadir Tarea</h1>
          <form onSubmit={handleSubmit}>
          <div>
            <label>Nombre de la Tarea:</label>
            <input
              type="text"
              value={nombreTarea}
              onChange={(e) => setNombreTarea(e.target.value)}
              required
            />
            </div>

            <div>
            <label>Esfuerzo:</label>
            <input
              type="number"
              min="0"
              value={esfuerzo}
              onChange={(e) => setEsfuerzo(Number(e.target.value))}
              required
            />
            </div>
            
            <div>
            <label>Tiempo en Minutos:</label>
            <input
              type="number"
              min="0"
              value={tiempoMinutos}
              onChange={(e) => setTiempoMinutos(Number(e.target.value))}
              required
            />
            </div>
            <label>Prioridad:</label>
            <input
              type="number"
              min="0"
              value={prioridad}
              onChange={(e) => setPrioridad(Number(e.target.value))}
              required
            />
            <button type="submit"> Añadir  Tarea</button>
            {error && <p style={{ color: 'red' }} className="error">{error}</p>}
            {mensajeExito && <p style={{ color: 'green' }} className="mensaje-exito">{mensajeExito}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default AnadirTarea;
