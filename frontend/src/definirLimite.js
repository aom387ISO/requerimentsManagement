import React, { useState, useEffect } from 'react';
import './editarProyecto.css';
import './definirLimite.css';
import ReactDOM from 'react-dom/client';
import IniciarSesion from './iniciarSesion';
import InicioCliente from './inicioCliente';

function DefinirLimite({ idCliente }) {
    const [proyectos, setProyectos] = useState([]);
    const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);
    const [limiteEsfuerzo, setLimiteEsfuerzo] = useState(0);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch(`/api/verProyectosCliente/${idCliente}`, {
            method: 'GET',
        })
            .then((response) => response.json())
            .then((data) => {
                setProyectos(data.proyectos);
                setError(data.message || '');
            })
            .catch(() => setError('Error al cargar los proyectos'));
    }, [idCliente]);

    const handleSelectProyecto = (idProyecto) => {
        setProyectoSeleccionado(idProyecto);
    };

    const handleDefinirLimite = () => {
        
        if (proyectoSeleccionado == null){
            setError('Necesitas seleccionar un proyecto.');
            return;
        }
        
        if(limiteEsfuerzo < 0) {
            setError('Necesitas un esfuerzo positivo.');
            return;
        }

        fetch('/api/cortarPorEsfuerzo', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                idProyecto: proyectoSeleccionado,
                limite: limiteEsfuerzo,
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Error al actualizar el límite de esfuerzo');
                }
                console.log('Límite de esfuerzo actualizado correctamente');
            })
            .catch((error) => console.error('Error:', error));
    };

    const listaProyecto = proyectos.map((proyecto) => (
        <li
            key={proyecto.idProyecto}
            onClick={() => handleSelectProyecto(proyecto.idProyecto)}
            className={proyectoSeleccionado === proyecto.idProyecto ? 'seleccionado' : ''}
        >
            {proyecto.nombreProyecto}
        </li>
    ));

    const handleVolver = () => {
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(
            <React.StrictMode>
                <InicioCliente idCliente={idCliente} />
            </React.StrictMode>
        );
    };

    return (
        <div className='fondo-lista-proyecto'>
            <button className='boton-volver' onClick={handleVolver}>
                Volver
            </button>
            <div className='contenedor-formulario-central'>
                <div className='cuadrado-formulario-central'>
                    <h1>Seleccione un proyecto</h1>
                    {error && <p style={{ color: 'red' }} className="error">{error}</p>}
                    <ul>{listaProyecto}</ul>
                    <div>
                        <p>Defina el límite de esfuerzo para el proyecto:</p>
                        <input type="number" min="0" step="1"  placeholder="Introduzca un número positivo" style={{ width: '24%' }}value={limiteEsfuerzo} 
                        onChange={(e) => setLimiteEsfuerzo(e.target.value)}/>
                    </div>
                    <button
                        onClick={handleDefinirLimite}
                        disabled={proyectoSeleccionado == null}
                        className={proyectoSeleccionado ? 'boton-proyecto-seleccionado' : 'boton-proyecto'}
                    >
                        Definir Límite
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DefinirLimite;
