const express = require('express');
const pool = require('./db'); 
const router = express.Router();

router.get('/obtenerProyectos', async (req, res) => {
  const pool = req.app.get('pool');
  try {
    const [rows] = await pool.promise().query(
      'SELECT * FROM Proyecto WHERE estaEliminado = ?', [false]
    );

    if (rows.length > 0) {
      res.json({ success: true, proyectos: rows });
    } else {
      res.json({ success: false, message: 'No se encontraron proyectos activos' });
    }
  } catch (error) {
    console.error('Error al ejecutar la consulta:', error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});


module.exports = router;
