import React, { useState } from 'react';
import './anadirTarea.css';

function AnadirTarea() {
  const [nombreTarea, setNombreTarea] = useState('');
  const [esfuerzo, setEsfuerzo] = useState(0);
  const [tiempoMinutos, setTiempoMinutos] = useState(0);
  const [prioridad, setPrioridad] = useState(0);
  const [proyectoId, setProyectoId] = useState('');
  const [dependeDe, setDependeDe] = useState('');
  const [precedeA, setPrecedeA] = useState('');
  const [excluye, setExcluye] = useState('');
  const [interdependeDe, setInterdependeDe] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (esfuerzo < 0 || esfuerzo > 5) {
      setError('El esfuerzo debe estar entre 0 y 5.');
      return;
    }
    if (prioridad < 0 || prioridad > 5) {
      setError('La prioridad debe estar entre 0 y 5.');
      return;
    }
    if (tiempoMinutos < 0) {
      setError('El tiempo en minutos no puede ser negativo.');
      return;
    }
    if (!/^\d+$/.test(proyectoId)) {
      setError('El ID de proyecto debe ser un número no negativo.');
      return;
    }

    try {
      const response = await fetch('/api/agregarTarea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombreTarea,
          esfuerzo,
          tiempoMinutos,
          prioridad,
          proyectoId: Number(proyectoId),
          dependeDe,
          precedeA,
          excluye,
          interdependeDe,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setNombreTarea('');
        setEsfuerzo(0);
        setTiempoMinutos(0);
        setPrioridad(0);
        setProyectoId('');
        setDependeDe('');
        setPrecedeA('');
        setExcluye('');
        setInterdependeDe('');
        setError('');
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      setError('Error de conexión');
    }
  };

  return (
    <div className="fondo-crear-tarea">
      <div className="contenedor-formulario">
        <div className="cuadrado-formulario">
          <h1>Añadir Tarea</h1>
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
              min="0"
              max="5"
              value={esfuerzo}
              onChange={(e) => setEsfuerzo(Number(e.target.value))}
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

            <label>Prioridad:</label>
            <input
              type="number"
              min="0"
              max="5"
              value={prioridad}
              onChange={(e) => setPrioridad(Number(e.target.value))}
              required
            />

            <label>Proyecto ID:</label>
            <input
              type="text"
              value={proyectoId}
              onChange={(e) => {
                if (/^\d*$/.test(e.target.value)) {
                  setProyectoId(e.target.value);
                }
              }}
              required
            />

            <label>Depende de:</label>
            <select value={dependeDe} onChange={(e) => setDependeDe(e.target.value)}>
              <option value="">Seleccionar</option>
            </select>

            <label>Precede a:</label>
            <select value={precedeA} onChange={(e) => setPrecedeA(e.target.value)}>
              <option value="">Seleccionar</option>
            </select>

            <label>Excluye:</label>
            <select value={excluye} onChange={(e) => setExcluye(e.target.value)}>
              <option value="">Seleccionar</option>
            </select>

            <label>Interdependiente de:</label>
            <select value={interdependeDe} onChange={(e) => setInterdependeDe(e.target.value)}>
              <option value="">Seleccionar</option>
            </select>

            <button type="submit">Añadir Tarea</button>
            {error && <p style={{ color: 'red' }} className="error">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default AnadirTarea;