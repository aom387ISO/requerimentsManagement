const express = require('express');
const pool = require('./db'); 
const router = express.Router();

router.put('/eliminarTarea/:id', async (req, res) => {
    console.log('Ruta de borrado alcanzada');
    const { id } = req.params;
    const { estaEliminado } = req.body; 
    const pool = req.app.get('pool');
    try {
      const [rows] = await pool.promise().query(
        'SELECT * FROM Tarea WHERE idTarea = ?',[id]
      );
      
      console.log('Resultado de la consulta:', rows);
  
      if (rows.length > 0) {
        await pool.promise().query(
          'UPDATE Tarea SET estaEliminado = ? WHERE idTarea = ?', [estaEliminado, id]
        );
  
          res.json({ success: true, message: 'Tarea marcado como eliminada' });
      } else {
        res.status(401).json({ success: false, message: 'ID incorrecto' });
      }
    } catch (error) {
      console.error('Error al ejecutar la consulta:', error);
      res.status(500).json({ success: false, message: 'Error del servidor' });
    }
  });
  
  
  module.exports = router;
  