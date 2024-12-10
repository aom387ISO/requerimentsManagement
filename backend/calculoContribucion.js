const express = require('express');
const pool = require('./db');
const router = express.Router();


router.post('/calculoContribucion', async (req, res) => {
    const { tareas, clientes } = req.body;
    const pool = req.app.get('pool');

    if (!Array.isArray(tareas) || tareas.length === 0 || !Array.isArray(clientes) || clientes.length === 0) {
        return res.status(400).json({ success: false, message: 'Los campos tareas y clientes son obligatorios y deben ser arrays no vacíos.' });
    }
    console.log("Paso el if inicial en contribución");
    try {
        console.log("Estoy calculando contribuciones...");
        const contribucion = [];

        for (const cliente of clientes) {
            let contribucionTotal = 0;
            let satisfaccionTotal = 0;

            for (const tarea of tareas) {
                try {
                    const [rows] = await pool.promise().query(
                        `SELECT ProyectoCliente.peso AS wi, TareaCliente.peso AS vij 
                        FROM TareaCliente
                        JOIN Cliente ON TareaCliente.Cliente_idCliente = Cliente.idCliente
                        JOIN ProyectoCliente ON ProyectoCliente.Cliente_idCliente = Cliente.idCliente
                        WHERE TareaCliente.Tarea_idTarea = ? 
                        AND Cliente.idCliente = ?
                        AND ProyectoCliente.Proyecto_idProyecto = ?`,
                        [tarea.idTarea, cliente.idCliente, tarea.Proyecto_idProyecto]
                    );

                    if (rows.length > 0) {
                        const { wi, vij } = rows[0];
                        contribucionTotal += wi * vij;
                        satisfaccionTotal += wi * vij;
                    }
                } catch (error) {
                    console.error(`Error al procesar tarea ${tarea.idTarea} para cliente ${cliente.idCliente}:`, error);
                    return res.status(500).json({ success: false, message: 'Error al calcular contribuciones.' });
                }
            }

            contribucion.push(satisfaccionTotal === 0 ? 0 : contribucionTotal / satisfaccionTotal);
        }

        console.log("Contribuciones calculadas:", contribucion);
        res.status(200).json({ success: true, contribucion });
    } catch (error) {
        console.error('Error al calcular la contribución:', error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});


module.exports = router;
