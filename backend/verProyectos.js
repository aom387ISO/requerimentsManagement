const express = require('express');
const pool = require('./db'); 
const router = express.Router();

router.get('/verProyectos', async (req, res) => {
    const pool = req.app.get('pool');
    try {
      const [proyectos] = await pool.promise().query(
        'SELECT * FROM Proyecto WHERE estaEliminado = 0'
      );
  
      if (proyectos.length > 0) {
        const [tareas] = await pool.promise().query(
          `SELECT *
          FROM Tarea
          WHERE estaEliminado = 0
          ORDER BY Tarea.prioridad DESC`

        );
  
        const proyectosConTareas = proyectos.map((proyecto) => ({
          ...proyecto,
          requirements: tareas.filter(
            (tarea) => tarea.Proyecto_idProyecto === proyecto.idProyecto
          ),
        }));
  
        res.json({ success: true, proyectos: proyectosConTareas });
      } else {
        res.json({ success: false, message: 'No se encontraron proyectos activos' });
      }
    } catch (error) {
      console.error('Error al ejecutar la consulta:', error);
      res.status(500).json({ success: false, message: 'Error del servidor' });
    }
  });  
module.exports = router;
