const express = require('express');
const pool = require('./db'); 
const router = express.Router();

router.post('/crearProyecto', async (req, res) => {
    console.log('Ruta crear proyecto alcanzada');
    const { nombre, peso, esfuerzo } = req.body;
    const pool = req.app.get('pool');
    try {
      const [rows] = await pool.promise().query(
        'SELECT * FROM Proyecto WHERE nombreProyecto = ? ',[nombre]
      );
      
      console.log('Valor de nombre recibido:', nombre);
      console.log('Valor del peso recibido', peso);
      console.log('Valor del esfuerzo recibido', esfuerzo);
      console.log('Resultado de la consulta:', rows);
  
      if (rows.length > 0) {
        res.status(401).json({ success: false, message: 'Credenciales inválidas' });

      } else {
        const [rows] = await pool.promise().query('SELECT MAX(idProyecto) as maxId FROM Proyecto');
        const maxId = rows[0].maxId || 0;

        
        await pool.promise().query(
            'INSERT INTO Proyecto (idProyecto, nombreProyecto, peso, prioridad, esfuerzo, estaEliminado) VALUES (?, ?, ?, ?, ?, ?)',
            [maxId + 1, nombre, peso, -1, esfuerzo, false]
        )

        res.status(201).json({
            success: true,
            message: 'Proyecto creado correctamente.'
        });

      }
    } catch (error) {
      console.error('Error al ejecutar la consulta:', error);
      res.status(500).json({ success: false, message: 'Error del servidor' });
    }
  });
  
  
  module.exports = router;
  