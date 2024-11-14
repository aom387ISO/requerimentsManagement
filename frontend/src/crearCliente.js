import React, { useState } from 'react';
import "./clienteCrear.css";
import ReactDOM from 'react-dom/client';
import InicioAdmin from './inicioAdmin';

function CrearCliente() {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [contrasena2, setContrasena2] = useState('');
    const [error, setError] = useState('');

    const validarEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
      };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nombre || !apellido || !correo || !contrasena || !contrasena2) {
            setError('Todos los campos son obligatorios.');
            return;
          }

        if  
        (!validarEmail(correo)) {
             setError('El correo electrónico introducido no es válido.');
             return;
        }
       
        try {
          const response = await fetch('/api/crearCliente', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: nombre, apellido: apellido, correo: correo, contrasena: contrasena, contrasena2: contrasena2 })
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
        <div className = "fondo-crear-cliente">
            <button className='boton-volver' onClick={handleVolver}>Volver</button>

            <div className="contenedor-formulario-central">
                <div className='cuadrado-formulario-central'>
                <h1>Formulario de creación de un cliente</h1>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <p>
                                Nombre del cliente:
                            </p>
                            <input type="text" placeholder="Introduzca el nombre del cliente" style={{ width: '90%' }} value={nombre} onChange={(e) => setNombre(e.target.value)}></input>
                        </div>
                        <div>
                            <p>
                                Apellidos del cliente:
                            </p>
                            <input type="text" placeholder="Introduzca los apellidos del cliente" style={{ width: '90%' }} value={apellido} onChange={(e) => setApellido(e.target.value)}></input>
                        </div>
                        <div>
                            <p>
                                Correo del cliente:
                            </p>
                            <input type="text" placeholder="Introduzca el correo electrónico del cliente" style={{ width: '90%' }} value={correo} onChange={(e) => setCorreo(e.target.value)}></input>
                        </div>
                        <div>
                            <p>
                                Contraseña del cliente:
                            </p>
                            <input type="password" placeholder="Introduzca la contraseña del cliente" style={{ width: '25%' }} value={contrasena} onChange={(e) => setContrasena(e.target.value)}></input>
                        </div>
                        <div>
                            <p>
                                Introduzca de nuevo la contraseña:
                            </p>
                            <input type="password" placeholder="Introduzca de nuevo la contraseña" style={{ width: '25%' }} value={contrasena2} onChange={(e) => setContrasena2(e.target.value)}></input>
                        </div>
                        <button type="submit">Crear cliente</button>
                        {error && <p style={{ color: 'red' }}  className="error">{error}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
    
    
}

export default CrearCliente;