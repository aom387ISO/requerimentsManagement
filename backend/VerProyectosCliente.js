const express = require('express');
const pool = require('./db');
const router = express.Router();

// Ruta para obtener proyectos y tareas de un cliente específico usando parámetro de ruta
router.get('/verProyectosCliente/:id', async (req, res) => {
    const idCliente = req.params.id; // Obtener el idCliente desde el parámetro de ruta
    console.log('idCliente backend es:', idCliente);
    const pool = req.app.get('pool');

    try {
        // Consulta para obtener los proyectos del cliente específico
        const [proyectos] = await pool.promise().query(
            `SELECT *
                FROM proyecto p
                JOIN proyectoCliente pc ON p.idProyecto = pc.Proyecto_idProyecto
                JOIN cliente c ON pc.Cliente_idCliente = c.idCliente
                WHERE p.estaEliminado = 0
                AND c.idCliente = ?`, // Filtramos por el idCliente
            [idCliente] // Pasamos el idCliente como parámetro
        );

        if (proyectos.length > 0) {
            // Consulta para obtener las tareas asociadas a los proyectos de este cliente
            const [tareas] = await pool.promise().query(
                `SELECT *
                FROM Tarea t
                JOIN tareacliente tc ON t.idTarea = tc.Tarea_idTarea
                JOIN cliente c ON tc.Cliente_idCliente = c.idCliente
                WHERE t.estaEliminado = 0`
            );

            // Asocia cada tarea al proyecto correspondiente
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
