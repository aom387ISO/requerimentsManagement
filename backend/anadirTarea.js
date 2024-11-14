const express = require('express');
const pool = require('./db'); 
const router = express.Router();

router.post('/anadirTarea/:proyectoId', async (req, res) => {
    console.log('Ruta de añadido alcanzada');
    const { proyectoId } = req.params;
    const { nombreTarea, esfuerzo, tiempoMinutos, prioridad } = req.body;
    const pool = req.app.get('pool');

    try {
      const [rows] = await pool.promise().query('SELECT MAX(idTarea) as maxId FROM Tarea');
      const maxId = rows[0].maxId || 0;
      const id = maxId + 1;

      await pool.promise().query(
        'INSERT INTO Tarea (idTarea, nombreTarea, esfuerzo, tiempoMinutos, prioridad, proyecto_idProyecto, estaEliminado) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [id, nombreTarea, esfuerzo, tiempoMinutos, prioridad, proyectoId, false]
    );
  
    res.json({ success: true, message: 'Tarea añadida' });    
    } catch (error) {
      console.error('Error al ejecutar la consulta:', error);
      res.status(500).json({ success: false, message: 'Error del servidor' });
    }
  });
  
  
  module.exports = router;
  