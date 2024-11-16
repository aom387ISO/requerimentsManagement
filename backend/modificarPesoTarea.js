const express = require('express');
const pool = require('./db'); 
const router = express.Router();


router.post('/modificarPesoTarea', async (req, res) => {
    const { Tarea_idTarea, idCliente, peso } = req.body;

    const pool = req.app.get('pool');
    
    try {
      const [rows] = await pool.promise().query(
        'SELECT * FROM tareacliente WHERE Tarea_idTarea = ?',[Tarea_idTarea]
        );
  
    if (rows.length > 0) {
      await pool.promise().query(
      'UPDATE tareacliente SET peso = ? WHERE Tarea_idTarea = ?', [peso, idCliente]
      );
        res.json({ success: true, message: 'Peso de tarea actualizado correctamente para el cliente' });
      } else {
        await pool.promise().query(
        'INSERT INTO tareacliente (Tarea_idTarea, Cliente_idCliente, peso) VALUES (?, ?, ?)',[Tarea_idTarea, idCliente, peso]
        );
        res.json({ success: false, message: 'Se ha insertado el nuevo peso' });
      }
    } catch (error) {
      console.error('Error al actualizar el peso de tarea:', error);
      res.status(500).json({ success: false, message: 'Error del servidor' });
    }
  });
  
  
  module.exports = router;
  