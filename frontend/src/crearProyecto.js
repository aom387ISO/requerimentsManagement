import React, { useState } from 'react';
import "./crearProyecto.css"

function CrearProyecto() {



    return(
        <div className = "fondo-crear-proyecto">
            <button className='boton-volver'>Volver</button>

            <div className='contenedor-formulario'>
                <div className='cuadrado-formulario'>
                    <h1>Formulario de creación de un proyecto</h1>
                    <form>
                        <div>
                            <p>
                                Nombre del proyecto:
                            </p>
                            <input type="text" placeholder="Introduzca el nombre del proyecto" style={{ width: '90%' }}></input>
                        </div>
                        <div>
                            <p>
                                Peso del proyecto: 
                            </p>
                            <input type="number" min="0" max="5" step="1" placeholder="Introduzque entre 0 y 5" style={{ width: '24%' }}></input>
                        </div>
                        <div>
                            <p>
                                Esfuerzo del proyecto: 
                            </p>
                            <input type="number" placeholder="Introduzque el esfuerzo del proyecto" style={{ width: '90%' }}></input>
                        </div>

                        <button type="submit">Crear proyecto</button>
                    </form>
                </div>
            </div>
        </div>
    );
    
    
}

export default CrearProyecto;