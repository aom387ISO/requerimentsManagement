const express = require('express');
const pool = require('./db'); 
const router = express.Router();

router.get('/obtenerTareasLimiteEsfuerzo/:proyectoId', async (req, res) => {
  const { proyectoId } = req.params;
  const pool = req.app.get('pool');

  console.log('Valor de proyecto en obtenerTareasLimiteEsfuerzo recibido:', proyectoId);
  try {
    const [rows] = await pool.promise().query(
      'SELECT * FROM Tarea WHERE Proyecto_idProyecto = ? AND estaEliminado = ?', [proyectoId, false]
    );

    const [proyectos] = await pool.promise().query(
        'SELECT * FROM Proyecto WHERE idProyecto = ? AND estaEliminado = ?', [proyectoId, false]
      );

    if (rows.length > 0) {

        const updatePromises = rows.map(tarea => {
            productividad = tarea.prioridad / tarea.esfuerzo;
            return pool.promise().query(
              'UPDATE Tarea SET productividad = ? WHERE idTarea = ?',
              [productividad, tarea.idTarea]
            );
          });
      
          try {
            await Promise.all(updatePromises);

            const [rows2] = await pool.promise().query(
                'SELECT * FROM Tarea WHERE Proyecto_idProyecto = ? AND estaEliminado = ? ORDER BY productividad DESC', [proyectoId, false]
            );

            const tareasFiltradas = rows2.filter(tarea => {
                return tarea.esfuerzo <= proyectos[0].esfuerzo;
            });

            res.json({ success: true, tareas: tareasFiltradas });
          } catch (error) {
            console.error('Error al actualizar las tareas:', error);
            res.status(500).json({ success: false, message: 'Error del servidor' });
          }
    } else {
      res.json({ success: false, message: 'No se encontraron proyectos activos' });
    }
  } catch (error) {
    console.error('Error al ejecutar la consulta:', error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});


module.exports = router;
