import React, { useState } from 'react';
import "./crearProyecto.css";
import ReactDOM from 'react-dom/client';
import InicioAdmin from './inicioAdmin';

function CrearProyecto() {
    const [nombre, setNombre] = useState('');
    const [peso, setPeso] = useState(0);
    const [esfuerzo, setEsfuerzo] = useState(0);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await fetch('/api/crearProyecto', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: nombre, peso: peso, esfuerzo: esfuerzo })
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

    return(
        <div className = "fondo-crear-proyecto">
            <button className='boton-volver' onClick={handleVolver}>Volver</button>

            <div className='contenedor-formulario'>
                <div className='cuadrado-formulario'>
                    <h1>Formulario de creación de un proyecto</h1>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <p>
                                Nombre del proyecto:
                            </p>
                            <input type="text" placeholder="Introduzca el nombre del proyecto" style={{ width: '90%' }} value={nombre} onChange={(e) => setNombre(e.target.value)}></input>
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

                        <button type="submit">Crear proyecto</button>
                        {error && <p style={{ color: 'red' }}  className="error">{error}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
    
    
}

export default CrearProyecto;