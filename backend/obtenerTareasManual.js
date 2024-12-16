const express = require('express');
const pool = require('./db'); 
const router = express.Router();

router.get('/obtenerTareasManual/:proyectoId', async (req, res) => {
  const { proyectoId } = req.params;
  const pool = req.app.get('pool');

  try {
    const [tareas] = await pool.promise().query(
      'SELECT * FROM Tarea WHERE Proyecto_idProyecto = ? AND estaEliminado = ? AND seleccionado = ?',
      [proyectoId, false, true]
    );

    const [dependencias] = await pool.promise().query(
      'SELECT * FROM Dependencias'
    );

    let tareasFinales = [];
    let tareasExcluidas = new Set();

    const tareaYaIncluida = (idTarea) => tareasFinales.some(t => t.idTarea === idTarea);

    for (const tarea of tareas) {
      const dependencia = dependencias.find(dep => dep.idTareaSecundaria === tarea.idTarea);

      if (dependencia) {
        if (dependencia.dependencia === 1) {
          const tareaPrincipal = tareasFinales.find(t => t.idTarea === dependencia.idTareaPrimaria);
          if (tareaPrincipal && !tareaYaIncluida(tarea.idTarea)) {
            tareasFinales.push(tarea);
          }
        } else if (dependencia.interdependencia === 1) {
          const tareaPrincipal = tareas.find(t => t.idTarea === dependencia.idTareaPrimaria);
          if (tareaPrincipal && 
              !tareasExcluidas.has(tareaPrincipal.idTarea) && 
              !tareasExcluidas.has(tarea.idTarea) &&
              !tareaYaIncluida(tarea.idTarea) &&
              !tareaYaIncluida(tareaPrincipal.idTarea)) {
            if (!tareasFinales.some(t => t.idTarea === tareaPrincipal.idTarea)) {
              tareasFinales.push(tareaPrincipal);
            }
            tareasFinales.push(tarea);
          }
        } else if (dependencia.exclusion === 1) {
          const tareaExcluyente = tareas.find(t => t.idTarea === dependencia.idTareaPrimaria);
          if (!tareaYaIncluida(tarea.idTarea) && !tareaYaIncluida(tareaExcluyente?.idTarea)) {
            tareasFinales.push(tarea);
          }
          tareasExcluidas.add(dependencia.idTareaPrimaria);
          tareasExcluidas.add(dependencia.idTareaSecundaria);
        }
      } else {
        if (!tareasExcluidas.has(tarea.idTarea) && !tareaYaIncluida(tarea.idTarea)) {
          tareasFinales.push(tarea);
        }
      }
    }

    res.json({ success: true, tareas: tareasFinales });
  } catch (error) {
    console.error('Error al ejecutar la consulta:', error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});

module.exports = router;
