const express = require('express');
const pool = require('./db'); 
const router = express.Router();

router.get('/calculoProductividad', async (req, res) => {
  console.log('Ruta de productividad alcanzada');
  const {idCliente, idProyecto} = req.params.id;
  const pool = req.app.get('pool');

  try {
    const [tareas] = await pool.promise().query(
        `SELECT idTarea, prioridad, esfuerzo, seleccionado
         FROM Tarea
         WHERE Proyecto_idProyecto = ? AND estaEliminado = 0`,
        [idProyecto]
      );

    if (tareas.length > 0) {
        let sj = 0;
        let ej = 0;

        tareas.forEach((tarea) => {
        const { prioridad, esfuerzo, seleccionado } = tarea;

        ej += prioridad * esfuerzo;

        if (seleccionado === 1) {
          sj += prioridad * esfuerzo;
        }
        });

      const prorj = ej > 0 ? (sj / ej) * 100 : 0;

      res.json({success: true, sj, ej, prorj: prorj.toFixed(2)});
      } else {
        res.json({ success: false, message: 'No se encontraron tareas activas para el proyecto especificado' });
    }
} catch (error) {
    console.error('Error al ejecutar la consulta:', error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
}
});


module.exports = router;