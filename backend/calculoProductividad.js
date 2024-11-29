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
        let prorj = 0;

        res.json({ success: true, message : 'Cálculado con éxito' });
    } else {
        res.json({ success: false, message: 'No se encontraron tareas activas para el proyecto especificado' });
    }
} catch (error) {
    console.error('Error al ejecutar la consulta:', error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
}
});


module.exports = router;