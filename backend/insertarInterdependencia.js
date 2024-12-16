const express = require('express');
const pool = require('./db'); 
const router = express.Router();

router.post('/insertarInterdependencia', async (req, res) => {
    console.log('Ruta crear interdependencia alcanzada');
    const { tareaInterdependeA, tareaEsInterdependidaPor } = req.body;
    const pool = req.app.get('pool');
    try {
        const [rows] = await pool.promise().query(
            'SELECT * FROM Dependencias WHERE (idTareaPrimaria = ? AND idTareaSecundaria = ?) OR (idTareaPrimaria = ? AND idTareaSecundaria = ?)',
            [tareaInterdependeA, tareaEsInterdependidaPor, tareaEsInterdependidaPor, tareaInterdependeA]
          );

        if (rows.length > 0) {
            const { dependencia, exclusion } = rows[0];
            if (dependencia === 1 || exclusion === 1) {
                return res.status(400).json({
                    success: false,
                    message: 'Ya existe otra dependencia para esta relación de tareas.'
                });
            }
        }

        if(rows.length === 0 ){
                await pool.promise().query(
                'INSERT INTO Dependencias (idTareaPrimaria, idTareaSecundaria, dependencia, exclusion, interdependencia) VALUES (?, ?, ?, ?, ?)',
                [tareaInterdependeA, tareaEsInterdependidaPor, 0, 0, 1]
                )
                await pool.promise().query(
                'INSERT INTO Dependencias (idTareaPrimaria, idTareaSecundaria, dependencia, exclusion, interdependencia) VALUES (?, ?, ?, ?, ?)',
                [tareaEsInterdependidaPor, tareaInterdependeA, 0, 0, 1]
                )
        }else{
            await pool.promise().query(
                'DELETE FROM Dependencias WHERE (idTareaPrimaria = ? AND idTareaSecundaria = ?)',
                [tareaInterdependeA, tareaEsInterdependidaPor]
            );
            await pool.promise().query(
                'DELETE FROM Dependencias WHERE (idTareaPrimaria = ? AND idTareaSecundaria = ?)',
                [tareaEsInterdependidaPor, tareaInterdependeA]
            );
        }
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
  