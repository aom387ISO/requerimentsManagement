const express = require('express');
const pool = require('./db'); 
const router = express.Router();

router.get('/obtenerClientes', async (req, res) => {
  const pool = req.app.get('pool');
  try {
    const [rows] = await pool.promise().query(
      'SELECT * FROM Cliente WHERE idCliente != ? && estaEliminado = ?', [0,false]
    );

    if (rows.length > 0) {
      res.json({ success: true, clientes: rows });
    } else {
      res.json({ success: false, message: 'No se encontraron clientes activos' });
    }
  } catch (error) {
    console.error('Error al ejecutar la consulta:', error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});


module.exports = router;
