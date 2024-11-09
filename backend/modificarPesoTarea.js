const express = require('express');
const pool = require('./db'); 
const router = express.Router();


router.post('/modificarPesoTarea', async (req, res) => {
    const { Tarea_idTarea, Cliente_idCliente, peso } = req.body;

    const pool = req.app.get('pool');
    
    try {
      const [rows] = await pool.promise().query(
        'UPDATE tareacliente SET peso = ? WHERE Tarea_idTarea = ? AND Cliente_idCliente = ?', [peso, Tarea_idTarea, Cliente_idCliente]     
    );
  
    if (result.affectedRows > 0) {
        res.json({ success: true, message: 'Peso de tarea actualizado correctamente para el cliente' });
      } else {
        res.json({ success: false, message: 'No se encontró la tarea o cliente especificado' });
      }
    } catch (error) {
      console.error('Error al actualizar el peso de tarea:', error);
      res.status(500).json({ success: false, message: 'Error del servidor' });
    }
  });
  
  
  module.exports = router;
  