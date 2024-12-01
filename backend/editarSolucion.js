const express = require('express');
const pool = require('./db'); 
const router = express.Router();

router.put('/editarSolucion', async (req, res) => {
    const { tareasSeleccionadas, proyectoId } = req.body;
    console.log("Estoy en editar solución");
    console.log(tareasSeleccionadas);
    console.log(Array.isArray(tareasSeleccionadas));
    const pool = req.app.get('pool');
    try{
        if (!Array.isArray(tareasSeleccionadas) || tareasSeleccionadas.length === 0) {
            return res.status(400).json({ success: false, message: 'No se han seleccionado tareas' });
        }

        const [proyectos] = await pool.promise().query(
            'SELECT esfuerzo FROM Proyecto WHERE idProyecto = ? AND estaEliminado = ?', [proyectoId, false]
        );

        const [tareas] = await pool.promise().query(
            'SELECT idTarea, esfuerzo, seleccionado FROM Tarea WHERE Proyecto_idProyecto = ? AND estaEliminado = false', [proyectoId]
        );

        //Ya en la bd
        const esfuerzoSeleccionado = tareas.reduce((acc, tarea) => {
            console.log(tarea)
            if (tarea.seleccionado === 1) {
                return acc + tarea.esfuerzo;  
            }
            return acc;
        }, 0);
        
        //Las que acabo de seleccionar.
        const esfuerzoNuevo = tareas.reduce((acc, tareaId) => {
            const tarea = tareas.find(t => t.idTarea === tareaId);
            if (!tarea) return acc;

            if (tarea.seleccionado === 0) {
                return acc + tarea.esfuerzo;
            }
        
            if (tarea.seleccionado === 1) {
                return acc - tarea.esfuerzo;
            }
        
            return acc;
        }, 0);


        const esfuerzoTotal = esfuerzoSeleccionado + esfuerzoNuevo;
        
        console.log("Esfuerzo guardado:"+ esfuerzoSeleccionado);
        console.log("Esfuerzo de las tareas que he seleccionado a añadir:"+ esfuerzoNuevo);
        console.log("Esfuerzo proyecto:"+ proyectos[0].esfuerzo);
        console.log("Esfuerzo total:"+ esfuerzoTotal);

        if (esfuerzoTotal > proyectos[0].esfuerzo) {
            return res.status(400).json({ success: false, message: 'El esfuerzo de las tareas supera al del proyecto' });
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