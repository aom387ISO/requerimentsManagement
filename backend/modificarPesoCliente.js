const express = require('express');
const pool = require('./db'); 
const router = express.Router();

router.put('/modificarPesoCliente', async (req, res) => {
  console.log('Ruta de modificar alcanzada');
  const { proyecto, cliente, peso } = req.body;
  const pool = req.app.get('pool');
  try {
    const [rows] = await pool.promise().query(
        'UPDATE proyectocliente SET peso = ? WHERE Proyecto_idProyecto = ? AND Cliente_idCliente = ?', [peso, proyecto, cliente]
    );
    
    console.log('Valor de usuario recibido:', proyecto);
    console.log('Valor de la contrasena recibida', cliente)

    res.status(201).json({ success: true, message: 'Cliente modificado al proyecto exitosamente' });

  } catch (error) {
    console.error('Error al ejecutar la consulta:', error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});


module.exports = router;