const express = require('express');
const pool = require('./db'); 
const router = express.Router();

router.post('/anadirClienteProyecto', async (req, res) => {
  console.log('Ruta de login alcanzada');
  const { proyecto, cliente, peso } = req.body;
  const pool = req.app.get('pool');
  try {
    const [rows] = await pool.promise().query(
      'INSERT INTO Proyectocliente (Proyecto_idProyecto, Cliente_idCliente, peso) VALUES (?, ?, ?)', [proyecto, cliente, peso]
    );
    
    console.log('Valor de usuario recibido:', proyecto);
    console.log('Valor de la contrasena recibida', cliente)

    res.status(201).json({ success: true, message: 'Cliente agregado al proyecto exitosamente' });

  } catch (error) {
    console.error('Error al ejecutar la consulta:', error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});


module.exports = router;