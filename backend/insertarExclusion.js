const express = require('express');
const pool = require('./db'); 
const router = express.Router();

router.post('/insertarExclusion', async (req, res) => {
    console.log('Ruta crear exclusión alcanzada');
    const { tareaExcluyeA, tareaEsExcluidaPor } = req.body;
    const pool = req.app.get('pool');
    try {
        
        await pool.promise().query(
            'INSERT INTO Exclusion (idTareaExluyeA, idTareaEsExcluidaPor) VALUES (?, ?)',
            [tareaExcluyeA, tareaEsExcluidaPor]
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
  