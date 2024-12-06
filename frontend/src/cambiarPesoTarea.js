import React, { useState } from 'react';
import "./cambiarPesoTarea.css";
import ReactDOM from 'react-dom/client';
import InicioCliente from './inicioCliente';

function CambiarPesoTarea({ idCliente, tareaId }) {
    const [nuevoPeso, setNuevoPeso] = useState('');
    const [error, setError] = useState('');
    const [data, setData] = useState([]);

    console.log("ID cliente en CambiarPesoTarea", idCliente);
    console.log("ID tarea en CambiarPesoTarea", tareaId);

    const cambiarPeso = async () => {
        if (!nuevoPeso) {
            setError('Necesitas introducir un nuevo peso.');
            return;
        }

        try {
            const responsePeso = await fetch('/api/modificarPesoTarea', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Tarea_idTarea: tareaId, idCliente, peso: nuevoPeso })
            });

            const dataPeso = await responsePeso.json();
            if (dataPeso.success) {
                setData(dataPeso.proyectos);
            } else {
                console.log(dataPeso.message);
            }
            
            const responsePrioridad = await fetch('/api/actualizarPrioridadTarea', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tareaId })
            });

            const dataPrioridad = await responsePrioridad.json();
            if (dataPrioridad.success) {
            } else {
                console.log(dataPrioridad.message);
            }
            const root = ReactDOM.createRoot(document.getElementById('root'));
            root.render(
                <React.StrictMode>
                    <InicioCliente idCliente={idCliente} />
                </React.StrictMode>
            );
        } catch (error) {
            console.error('Error en la solicitud:', error);
            setError('Error de conexión');
        }
    };

    const handleVolver = () => {
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(
            <React.StrictMode>
                <InicioCliente idCliente={idCliente} />
            </React.StrictMode>
        );
    };

    return (
        <div className="fondo-crear-cliente">
            <button className='boton-volver' onClick={handleVolver}>Volver</button>

            <div className="contenedor-formulario-central">
                <div className='cuadrado-formulario-central'>
                    <h1>Formulario modificación del peso de una tarea</h1>
                    <div>
                        <p>
                            Introduzca el nuevo peso:
                        </p>
                        <input
                            type="text"
                            placeholder="Introduzca de nuevo el peso"
                            style={{ width: '50%' }}
                            value={nuevoPeso}
                            onChange={(e) => setNuevoPeso(e.target.value)}
                        />
                    </div>
                    <button onClick={cambiarPeso}>Cambiar peso</button>
                    {error && <p style={{ color: 'red' }} className="error">{error}</p>}
                </div>
            </div>
        </div>
    );
}

export default CambiarPesoTarea;
