const express = require('express');
const pool = require('./db'); 
const router = express.Router();

router.post('/insertarDependencia', async (req, res) => {
    console.log('Ruta crear proyecto alcanzada');
    const { tareaPrecedente, tareaSucesiva } = req.body;
    const pool = req.app.get('pool');
    try {
        const [rows] = await pool.promise().query(
            'SELECT * FROM Dependencia WHERE  idTareaPrecedente = ? AND idTareaSucesiva = ?',[tareaPrecedente, tareaSucesiva]
          );

        if(rows.length === 0 ){
        await pool.promise().query(
            'INSERT INTO Dependencia (idTareaPrecedente, idTareaSucesiva) VALUES (?, ?)',
            [tareaPrecedente, tareaSucesiva]
        )
    }else{
        await pool.promise().query(
          'DELETE FROM Dependencia WHERE idTareaPrecedente = ? AND idTareaSucesiva = ?',
          [tareaPrecedente, tareaSucesiva]
      );
    }
        res.status(201).json({
            success: true,
            message: 'Relación modificada correctamente.'
        });

      
    } catch (error) {
      console.error('Error al ejecutar la consulta:', error);
      res.status(500).json({ success: false, message: 'Error del servidor' });
    }
  });
  
  
  module.exports = router;
  