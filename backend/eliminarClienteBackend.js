const express = require('express');
const pool = require('./db'); 
const router = express.Router();

router.post('/eliminarClienteBackend', async (req, res) => {
    console.log('Ruta de borrado alcanzada');
    const { correo } = req.body;
    const pool = req.app.get('pool');
    try {
      const [rows] = await pool.promise().query(
        'SELECT * FROM Cliente WHERE correo = ?',[correo]
      );
      
      console.log('Valor de usuario recibido:', correo);
      console.log('Resultado de la consulta:', rows);
  
      if (rows.length > 0) {
        await pool.promise().query(
            'UPDATE Cliente SET estaEliminado = ? WHERE correo = ?', [true, correo]
          );
  
          res.json({ success: true, message: 'Cliente marcado como eliminado' });
      } else {
        res.status(401).json({ success: false, message: 'Correo incorrecto' });
      }
    } catch (error) {
      console.error('Error al ejecutar la consulta:', error);
      res.status(500).json({ success: false, message: 'Error del servidor' });
    }
  });
  
  
  module.exports = router;
  