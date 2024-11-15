import React, { useState } from 'react';
import './editarTarea.css';
import InicioAdmin from './inicioAdmin';
import ReactDOM from 'react-dom/client';

function EditarTarea({idTarea}) {
  const [nombreTarea, setNombreTarea] = useState('');
  const [esfuerzo, setEsfuerzo] = useState(0);
  const [tiempoHoras, setTiempoHoras] = useState(0);
  const [tiempoMinutos, setTiempoMinutos] = useState(0);
  const [tareaId, setTareaId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (esfuerzo < 0) {
      setError('El esfuerzo debe ser positivo');
      return;
    }

    if (tiempoHoras < 0) {
      setError('El tiempo en horas no puede ser negativo.');
      return;
    }

    if (tiempoMinutos < 0) {
      setError('El tiempo en minutos no puede ser negativo.');
      return;
    }

    try {
      setTareaId(idTarea);
    
      const response = await fetch('/api/editarTarea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombreTarea: nombreTarea, esfuerzo: esfuerzo, tiempoHoras: tiempoHoras, tiempoMinutos: tiempoMinutos, tareaId: tareaId })
      });
           
      const data = await response.json();

      if (data.success) {
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(
            <React.StrictMode>
                <InicioAdmin/>
            </React.StrictMode>
        );
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
}


  return (
    <div className='fondo-editar-tarea'>
      <button className='boton-volver' onClick={handleVolver}>Volver</button>
      <div className='contenedor-editar-tarea'>
        <div className='cuadrado-editar-tarea'>
          <h1>Modificar Tarea</h1>
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
            
            <button type="submit"> Modificar Tarea</button>
            {error && <p style={{ color: 'red' }} className="error">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}


export default EditarTarea;
