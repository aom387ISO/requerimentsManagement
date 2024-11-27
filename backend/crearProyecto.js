const express = require('express');
const pool = require('./db'); 
const router = express.Router();

router.post('/crearProyecto', async (req, res) => {
    console.log('Ruta crear proyecto alcanzada');
    const { nombre, esfuerzo } = req.body;
    const pool = req.app.get('pool');
    try {
      console.log('Valor de nombre recibido:', nombre);
      console.log('Valor del esfuerzo recibido', esfuerzo);
  

        const [rows] = await pool.promise().query('SELECT MAX(idProyecto) as maxId FROM Proyecto');
        const maxId = rows[0].maxId || 0;
        const id = maxId + 1;
        
        await pool.promise().query(
            'INSERT INTO Proyecto (idProyecto, nombreProyecto, peso, prioridad, esfuerzo, estaEliminado) VALUES (?, ?, ?, ?, ?, ?)',
            [id, nombre, -1, -1, esfuerzo, false]
        )

        res.status(201).json({
            success: true,
            message: 'Proyecto creado correctamente.'
        });

      
    } catch (error) {
      console.error('Error al ejecutar la consulta:', error);
      res.status(500).json({ success: false, message: 'Error del servidor' });
    }
  });
  
  
  module.exports = router;
  