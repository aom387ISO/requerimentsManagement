import React, { useState } from 'react';
import './anadirTarea.css';


function EditarTarea() {
  const [nombreTarea, setNombreTarea] = useState('');
  const [esfuerzo, setEsfuerzo] = useState(0);
  const [tiempoHoras, setTiempoHoras] = useState(0);
  const [tiempoMinutos, setTiempoMinutos] = useState(0);
  const [proyectoId, setProyectoId] = useState('');
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
      const response = await fetch('/api/editarTarea', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombreTarea: nombreTarea,
          esfuerzo: esfuerzo,
          tiempoHoras:tiempoHoras,
          tiempoMinutos: tiempoMinutos
        }),
      });


      const data = await response.json();
    } catch (error) {
      console.error('Error en la solicitud:', error);
      setError('Error de conexión');
    }
  };


  return (
    <div className="fondo-crear-tarea">
      <div className="contenedor-formulario">
        <div className="cuadrado-formulario">
          <h1>Modificar Tarea</h1>
          <form onSubmit={handleSubmit}>
            <label>Nombre de la Tarea:</label>
            <input
              type="text"
              value={nombreTarea}
              onChange={(e) => setNombreTarea(e.target.value)}
              required
            />


            <label>Esfuerzo:</label>
            <input
              type="number"
              value={esfuerzo}
              onChange={(e) => setEsfuerzo(e.target.value)}
              required
            />


            <label>Tiempo en horas:</label>
            <input
              type="number"
              min="0"
              value={tiempoHoras}
              onChange={(e) => setTiempoHoras(e.target.value)}
              required
            />


            <label>Tiempo en Minutos:</label>
            <input
              type="number"
              min="0"
              value={tiempoMinutos}
              onChange={(e) => setTiempoMinutos(Number(e.target.value))}
              required
            />


            <button type="submit">Modificar Tarea</button>
            {error && <p style={{ color: 'red' }} className="error">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}


export default EditarTarea;
