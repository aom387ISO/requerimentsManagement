const express = require('express');
const pool = require('./db'); 
const router = express.Router();

router.post('/anadirTarea/:proyectoId', async (req, res) => {
    console.log('Ruta de borrado alcanzada');
    const { proyectoId } = req.params;
    const { nombreTarea, esfuerzo, tiempoMinutos, prioridad } = req.body;
    const pool = req.app.get('pool');

    try {
      const [rows] = await pool.promise().query(
        'SELECT * FROM Proyecto WHERE idProyecto = ?',[id]
      );
      
      console.log('Resultado de la consulta:', rows);
  
      if (rows.length > 0) {
        await pool.promise().query(
          'UPDATE Proyecto SET estaEliminado = ? WHERE idProyecto = ?', [estaEliminado, id]
        );
  
          res.json({ success: true, message: 'Proyecto marcado como eliminado' });
      } else {
        res.status(401).json({ success: false, message: 'ID incorrecto' });
      }
    } catch (error) {
      console.error('Error al ejecutar la consulta:', error);
      res.status(500).json({ success: false, message: 'Error del servidor' });
    }
  });
  
  
  module.exports = router;
  