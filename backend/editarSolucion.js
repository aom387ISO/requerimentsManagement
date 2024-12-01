const express = require('express');
const pool = require('./db'); 
const router = express.Router();

router.put('/editarSolucion', async (req, res) => {
    const { tareasSeleccionadas } = req.body;
    console.log("Estoy en editar solución");
    console.log(tareasSeleccionadas);
    console.log(Array.isArray(tareasSeleccionadas));
    const pool = req.app.get('pool');
    try{
        if (!Array.isArray(tareasSeleccionadas) || tareasSeleccionadas.length === 0) {
            return res.status(400).json({ success: false, message: 'No se han seleccionado tareas' });
        }
        await pool.promise().query(
            `UPDATE tarea SET seleccionado = CASE
                WHEN seleccionado = true THEN false
                WHEN seleccionado = false OR seleccionado IS NULL THEN true
                ELSE seleccionado
                END
            WHERE idTarea IN (?);`,[tareasSeleccionadas]);

        res.status(200).json({ success: true, message: 'Solución editada correctamente' });
    } catch (error) {
    console.error('Error al ejecutar la consulta:', error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});

module.exports = router;