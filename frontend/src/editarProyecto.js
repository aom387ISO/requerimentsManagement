import React, { useState } from 'react';
import './editarProyecto.css';
import InicioAdmin from './inicioAdmin';
import ReactDOM from 'react-dom/client';

function EditarProyecto({proyectoId}) {
  const [nombreProyecto, setNombreProyecto] = useState('');
  const [peso, setPeso] = useState(0);
  const [esfuerzo, setEsfuerzo] = useState(0);
  const [idProyecto, setIdProyecto] = useState(0);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (esfuerzo < 0) {
      setError('El esfuerzo debe ser positivo');
      return;
    }

    if (peso < 0 || peso > 5) {
      setError('El peso no puede ser negativo o mayor que 5.');
      return;
    }

    try {
      setIdProyecto(proyectoId);
    
      const response = await fetch('/api/editarProyecto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombreProyecto: nombreProyecto, peso: peso, esfuerzo: esfuerzo, idProyecto: proyectoId })
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
    <div className='fondo-editar-proyecto'>
      <button className='boton-volver' onClick={handleVolver}>Volver</button>
      <div className='contenedor-editar-proyecto'>
        <div className='cuadrado-editar-proyecto'>
          <h1>Modificar Proyecto</h1>
          <form onSubmit={handleSubmit}>
            <div>
            <p>Nombre del proyecto:</p>
            <input
              type="text"
              value={nombreProyecto}
              onChange={(e) => setNombreProyecto(e.target.value)}
              required
            />
            </div>
            <div>
                <p>
                    Peso del proyecto: 
                </p>
                <input type="number" min="0" max="5" step="1" placeholder="Introduzque entre 0 y 5" style={{ width: '24%' }} value={peso} onChange={(e) => setPeso(e.target.value)}></input>
            </div>

            <div>
                <p>
                    Esfuerzo del proyecto: 
                </p>
                <input type="number" placeholder="Introduzque el esfuerzo del proyecto" style={{ width: '90%' }} value={esfuerzo} onChange={(e) => setEsfuerzo(e.target.value)}></input>
            </div>
            
            <button type="submit"> Modificar proyecto</button>
            {error && <p style={{ color: 'red' }} className="error">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}


export default EditarProyecto;
