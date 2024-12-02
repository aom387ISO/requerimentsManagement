const express = require('express');
const pool = require('./db');
const router = express.Router();

router.get('/calculoCobertura', async (req, res) => {
  const { idCliente, idProyecto } = req.body;

  try {
    // Obtener el peso total de las tareas del proyecto
    const [resultPesoTareas] = await pool.promise().query(
      'SELECT SUM(peso) as pesoTotal FROM Tareacliente WHERE Tarea_idTarea IN (SELECT idTarea FROM Tarea WHERE Proyecto_idProyecto = ? AND estaEliminado = 0)',
      [idProyecto]
    );
    const pesoTareas = resultPesoTareas[0].pesoTotal || 0;

    // Obtener el peso total de las tareas asignadas al cliente en el proyecto
    const [resultPesoClientes] = await pool.promise().query(
      'SELECT SUM(peso) as pesoTotal FROM Tareacliente WHERE Cliente_idCliente = ? AND Tarea_idTarea IN (SELECT idTarea FROM Tarea WHERE Proyecto_idProyecto = ? AND estaEliminado = 0)',
      [idCliente, idProyecto]
    );
    const pesoClientes = resultPesoClientes[0].pesoTotal || 0;

    if (pesoTareas === 0) {
        pesoTareas = 1;
    }
    // Calcular la cobertura
    const cobertura = pesoClientes / pesoTareas;

    res.json({ success: true, cobertura });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al calcular la cobertura' });
  }
});

module.exports = router;