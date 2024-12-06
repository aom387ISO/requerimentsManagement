const express = require('express');
const router = express.Router();

router.post('/obtenerClientesCobertura', async (req, res) => {
  const pool = req.app.get('pool');
  const { tareas } = req.body;

  try {
    console.log('Tareas recibidas:', tareas);

    if (!Array.isArray(tareas) || tareas.length === 0) {
      return res.status(400).json({ success: false, message: 'No se proporcionaron tareas válidas' });
    }

    const idsTareas = tareas.map(tarea => tarea.idTarea);

    const [clienteIds] = await pool.promise().query(
      'SELECT DISTINCT Cliente_IdCliente FROM Tareacliente WHERE Tarea_idTarea IN (?)',
      [idsTareas]
    );

    console.log('IDs de clientes encontrados:', clienteIds);

    if (clienteIds.length === 0) {
      return res.json({ success: false, message: 'No se encontraron clientes asociados a las tareas' });
    }

    const [clientes] = await pool.promise().query(
      'SELECT * FROM Cliente WHERE idCliente IN (?)',
      [clienteIds.map(row => row.Cliente_IdCliente)]
    );

    console.log('Clientes encontrados:', clientes);

    if (clientes.length > 0) {
      res.json({ success: true, clientes: clientes });
    } else {
      res.json({ success: false, message: 'No se encontraron clientes activos' });
    }
  } catch (error) {
    console.error('Error al ejecutar la consulta:', error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});

module.exports = router;