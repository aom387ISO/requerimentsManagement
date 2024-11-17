const express = require('express');
const pool = require('./db');
const router = express.Router();

router.get('/verProyectosCliente/:id', async (req, res) => {
    const idCliente = req.params.id;
    console.log('idCliente backend es:', idCliente);
    const pool = req.app.get('pool');

    try {
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
        console.error('Error al ejecutar la consulta:', error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});

module.exports = router;
