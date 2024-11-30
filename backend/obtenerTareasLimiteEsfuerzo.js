const express = require('express');
const pool = require('./db'); 
const router = express.Router();

router.get('/obtenerTareasLimiteEsfuerzo/:proyectoId', async (req, res) => {
  const { proyectoId } = req.params;
  const pool = req.app.get('pool');

  console.log('Valor de proyecto en obtenerTareasLimiteEsfuerzo recibido:', proyectoId);
  try {
    const [rows] = await pool.promise().query(
      'SELECT * FROM Tarea WHERE Proyecto_idProyecto AND estaEliminado = ?', [proyectoId, false]
    );

    if (rows.length > 0) {
      res.json({ success: true, tareas: rows });
    } else {
      res.json({ success: false, message: 'No se encontraron proyectos activos' });
    }
  } catch (error) {
    console.error('Error al ejecutar la consulta:', error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});


module.exports = router;
