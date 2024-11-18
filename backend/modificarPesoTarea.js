const express = require('express');
const pool = require('./db'); 
const router = express.Router();


router.post('/modificarPesoTarea', async (req, res) => {
    const { Tarea_idTarea, idCliente, peso } = req.body;

    const pool = req.app.get('pool');
    
    try {
      const [rows] = await pool.promise().query(
        'SELECT * FROM tareacliente WHERE Tarea_idTarea = ?  AND Cliente_idCliente = ?',[Tarea_idTarea, idCliente]
        );
  
    if (rows.length > 0) {
      await pool.promise().query(
        'UPDATE tareacliente SET peso = ? WHERE Tarea_idTarea = ? AND Cliente_idCliente = ?', [peso, Tarea_idTarea, idCliente]
      );
      } else {
        await pool.promise().query(
        'INSERT INTO tareacliente (Tarea_idTarea, Cliente_idCliente, peso) VALUES (?, ?, ?)',[Tarea_idTarea, idCliente, peso]
        );
      }
      const [proyectos] = await pool.promise().query(
        `SELECT *
        FROM proyecto p
        JOIN proyectoCliente pc ON p.idProyecto = pc.Proyecto_idProyecto
        JOIN cliente c ON pc.Cliente_idCliente = c.idCliente
        WHERE p.estaEliminado = 0
        AND c.idCliente = ?`,
        [idCliente]
    );
    if (proyectos.length > 0) {
            const [tareas] = await pool.promise().query(
                `SELECT t.*, 
                 IFNULL(tc.peso, 0) AS pesoCliente
                 FROM Tarea t
                 LEFT JOIN tareacliente tc ON t.idTarea = tc.Tarea_idTarea AND tc.Cliente_idCliente = ?
                 WHERE t.estaEliminado = 0`,
                [idCliente]
            );

            const proyectosConTareas = proyectos.map((proyecto) => ({
                ...proyecto,
                requirements: tareas.filter(
                    (tarea) => tarea.Proyecto_idProyecto === proyecto.idProyecto
                ),
            }));

       res.json({ success: true, proyectos: proyectosConTareas });
    } else {
       res.json({ success: false, message: 'No se encontraron proyectos activos para el cliente especificado' });
    }
    } catch (error) {
      console.error('Error al actualizar el peso de tarea:', error);
      res.status(500).json({ success: false, message: 'Error del servidor' });
    }
  });
  
  
  module.exports = router;
  