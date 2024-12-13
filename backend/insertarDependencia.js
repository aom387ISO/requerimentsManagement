const express = require('express');
const pool = require('./db'); 
const router = express.Router();

router.post('/insertarDependencia', async (req, res) => {
    console.log('Ruta crear proyecto alcanzada');
    const { tareaPrecedente, tareaSucesiva } = req.body;
    const pool = req.app.get('pool');
    try {
        const [rows] = await pool.promise().query(
            'SELECT * FROM Dependencias WHERE (idTareaPrimaria = ? AND idTareaSecundaria = ?) OR (idTareaPrimaria = ? AND idTareaSecundaria = ?)',
            [tareaPrecedente, tareaSucesiva, tareaSucesiva, tareaPrecedente]
          );

        if (rows.length > 0) {
            const { exclusion, interdependencia } = rows[0];
            if (exclusion === 1 || interdependencia === 1) {
                return res.status(400).json({
                    success: false,
                    message: 'Ya existe otra dependencia para esta relación de tareas.'
                });
            }
        }

        if(rows.length === 0 ){
        await pool.promise().query(
            'INSERT INTO Dependencias (idTareaPrimaria, idTareaSecundaria, dependencia, exclusion, interdependencia) VALUES (?, ?, ?, ?, ?)',
            [tareaPrecedente, tareaSucesiva, 1, 0, 0]
        )
        }else{
            await pool.promise().query(
              'DELETE FROM Dependencias WHERE (idTareaPrimaria = ? AND idTareaSecundaria = ?) OR (idTareaPrimaria = ? AND idTareaSecundaria = ?)',
              [tareaPrecedente, tareaSucesiva, tareaSucesiva, tareaPrecedente]
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
  