import React, { useState } from 'react';
import './anadirTarea.css';
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

    <div className='fondo-anadir-tarea'>
      <button className='boton-volver' onClick={handleVolver}>Volver</button>
      <div className='contenedor-anadir-tarea'>
        <div className='cuadrado-anadir-tarea'>
          <h1>Añadir Tarea</h1>
          <form onSubmit={handleSubmit}>
            <div>
            <p>Nombre de la Tarea:</p>
            <input
              type="text"
              value={nombreTarea}
              onChange={(e) => setNombreTarea(e.target.value)}
              required
            />
            </div>
            <div>
            <p>Esfuerzo:</p>
            <input
              type="number"
              value={esfuerzo}
              onChange={(e) => setEsfuerzo(e.target.value)}
              required
            />
            </div>

            <div className='cuadro-hora'>
              <div>
                <p>Tiempo en horas:</p>
                <input
                  type="number"
                  min="0"
                  value={tiempoHoras}
                  onChange={(e) => setTiempoHoras(e.target.value)}
                  required
                />
              </div>
            <div>
            <p>Tiempo en Minutos:</p>
            <input
              type="number"
              min="0"
              value={tiempoMinutos}
              onChange={(e) => setTiempoMinutos(Number(e.target.value))}
              required
            />
            </div>
          </div>
            
            <button type="submit"> Añadir Tarea</button>
            {error && <p style={{ color: 'red' }} className="error">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default AnadirTarea;
