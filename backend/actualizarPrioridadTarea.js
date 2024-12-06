const express = require('express');
const pool = require('./db'); 
const router = express.Router();

router.put('/actualizarPrioridadTarea', async (req, res) => {
    const { tareaId } = req.body;

    const pool = req.app.get('pool');
    console.log("hola, mi tarea id es:", tareaId)
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
        console.log(pesos);

        if (pesos.length === 0) {
            return res.status(404).json({ success: false, message: 'No se han encontrado pesos de la tarea .' });
        }

        const prioridad = pesos.reduce((total, { wi, vij }) => total + wi * vij, 0);

        console.log("Satisfacción calculada:", prioridad); 
        await pool.promise().query(
            `UPDATE tarea SET prioridad = ? WHERE idTarea = ?`, 
            [prioridad, tareaId]
        );

        
        res.status(200).json({success: true,message: 'Tarea modificada correctamente.'});
    } catch (error) {
        console.error('Error al actualizar la prioridad de la tarea:', error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});

module.exports = router;
