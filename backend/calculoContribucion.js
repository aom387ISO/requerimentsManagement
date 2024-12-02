const express = require('express');
const pool = require('./db'); 
const router = express.Router();

router.post('/calculoContribucion', async (req, res) => {
    const { tareaId } = req.body;

    if (!tareaId) {
        return res.status(400).json({ success: false, message: 'El campo tareaId es obligatorio' });
    }

    try {
        const [pesos] = await pool.promise().query(
            `SELECT ProyectoCliente.peso AS wi, TareaCliente.peso AS vij 
            FROM TareaCliente
            JOIN Tarea ON TareaCliente.Tarea_idTarea = Tarea.idTarea
            JOIN Cliente ON TareaCliente.Cliente_idCliente = Cliente.idCliente
            JOIN ProyectoCliente ON ProyectoCliente.Cliente_idCliente = Cliente.idCliente
            WHERE TareaCliente.Tarea_idTarea = ? 
            AND ProyectoCliente.Proyecto_idProyecto = Tarea.Proyecto_idProyecto`,
            [tareaId]
        );

        if (pesos.length === 0) {
            return res.status(404).json({ success: false, message: 'No se encontraron datos para la tarea.' });
        }

        const satisfaccionTotal = pesos.reduce((total, { wi, vij }) => total + wi * vij, 0);

        const contribuciones = pesos.map(({ wi, vij }) => ({
            contribucion: (wi * vij) / satisfaccionTotal,
            wi,
            vij
        }));

        res.status(200).json({ success: true, contribuciones });
    } catch (error) {
        console.error('Error al calcular la contribución:', error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});