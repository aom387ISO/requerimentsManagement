const express = require('express');
const pool = require('./db'); 
const router = express.Router();

router.post('/insertarInterdependencia', async (req, res) => {
    console.log('Ruta crear interdependencia alcanzada');
    const { tareaInterdependeA, tareaEsInterdependidaPor } = req.body;
    const pool = req.app.get('pool');
    try {
        
        await pool.promise().query(
            'INSERT INTO Interdependencia (idTareaInterdependeA, idTareaEsInterdependidaPor) VALUES (?, ?)',
            [tareaInterdependeA, tareaEsInterdependidaPor]
        )

        res.status(201).json({
            success: true,
            message: 'Relación creada correctamente.'
        });

      
    } catch (error) {
      console.error('Error al ejecutar la consulta:', error);
      res.status(500).json({ success: false, message: 'Error del servidor' });
    }
  });
  
  
  module.exports = router;
  