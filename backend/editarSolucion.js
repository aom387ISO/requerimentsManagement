const express = require('express');
const pool = require('./db'); 
const router = express.Router();

router.put('/editarSolucion', async (req, res) => {
    const { tareasSeleccionadas, proyectoId } = req.body;
    console.log("Estoy en editar solución");
    console.log(tareasSeleccionadas);
    console.log(Array.isArray(tareasSeleccionadas));
    const pool = req.app.get('pool');

    try {
        
        if (!Array.isArray(tareasSeleccionadas) || tareasSeleccionadas.length === 0) {
            return res.status(400).json({ success: false, message: 'No se han seleccionado tareas' });
        }

        let errorDependencia = false;
        let errorInterdependencia = false;
        let errorExclusion = false;

        const [proyectos] = await pool.promise().query(
            'SELECT esfuerzo FROM Proyecto WHERE idProyecto = ? AND estaEliminado = ?', [proyectoId, false]
        );

        const [tareas] = await pool.promise().query(
            'SELECT idTarea, esfuerzo, seleccionado FROM Tarea WHERE Proyecto_idProyecto = ? AND estaEliminado = false', [proyectoId]
        );

        const [dependencias] = await pool.promise().query(
            'SELECT * FROM Dependencias'
        );

        let cambioEsfuerzo = 0;


        tareasSeleccionadas.forEach((tareaId) => {
            const tarea = tareas.find(t => t.idTarea === tareaId);
            if (!tarea) return;
        
            const depend = dependencias.find(t => t.idTareaSecundaria === tareaId);

            if (depend) {
                const idTareaSecundaria = depend.idTareaSecundaria;
                const idTareaPrimaria = depend.idTareaPrimaria;
                
                if(depend.dependencia === 1){
                    const tareaPrimaria = tareas.find(t => t.idTarea === idTareaPrimaria);
                    const tareaSecundaria = tareas.find(t => t.idTarea === idTareaSecundaria);
                    const estaTareaSecundaria = tareasSeleccionadas.find(id => id === idTareaSecundaria);
                    const estaTareaPrimaria = tareasSeleccionadas.find(id => id === idTareaPrimaria);

                    console.log("\n\n\n\n\n");
                    console.log(tareaPrimaria);
                    console.log(tareaSecundaria);
                    console.log(estaTareaSecundaria);
                    console.log(estaTareaPrimaria);
                    console.log("\n\n\n\n\n");

                    if(estaTareaSecundaria){
                        if(!estaTareaPrimaria){
                            errorDependencia = true;
                        }

                    }
                    
                }

                if(depend.interdependencia === 1){
                    const tareaPrimaria = tareas.find(t => t.idTarea === idTareaPrimaria);
                    const tareaSecundaria = tareas.find(t => t.idTarea === idTareaSecundaria);
                    const estaTareaSecundaria = tareasSeleccionadas.find(id => id === idTareaSecundaria);
                    const estaTareaPrimaria = tareasSeleccionadas.find(id => id === idTareaPrimaria);

                    if(estaTareaSecundaria){
                        if(!estaTareaPrimaria){
                            errorInterdependencia = true;
                        }

                    }

                    if(!estaTareaSecundaria){
                        if(estaTareaPrimaria){
                            errorInterdependencia = true;
                        }

                    }
                }

                if(depend.exclusion === 1){
                    const tareaPrimaria = tareas.find(t => t.idTarea === idTareaPrimaria);
                    const tareaSecundaria = tareas.find(t => t.idTarea === idTareaSecundaria);
                    const estaTareaSecundaria = tareasSeleccionadas.find(id => id === idTareaSecundaria);
                    const estaTareaPrimaria = tareasSeleccionadas.find(id => id === idTareaPrimaria);

                    console.log("\n\n\n\n\n");
                    console.log(tareaPrimaria);
                    console.log(tareaSecundaria);
                    console.log(estaTareaSecundaria);
                    console.log(estaTareaPrimaria);
                    console.log("\n\n\n\n\n");

                    if(estaTareaSecundaria){
                        if(estaTareaPrimaria){
                            errorExclusion = true;
                        }

                    }

                }
            }
        });

        console.log(errorExclusion);

        if(errorDependencia){
            return res.status(400).json({ success: false, message: 'Falta por añadir las dependencias.' });
        }else if (errorExclusion) {
            return res.status(400).json({ success: false, message: 'Has añadido tareas que se excluyen.' });
        }else if(errorInterdependencia) {
            return res.status(400).json({ success: false, message: 'Falta por añadir las tareas para respetar la interdependencia' });
        }else {

            tareasSeleccionadas.forEach((tareaId) => {
                const tarea = tareas.find(t => t.idTarea === tareaId);
                if (!tarea) return;
    
                if (tarea.seleccionado === 0) {
                    cambioEsfuerzo += tarea.esfuerzo;
                } 
                else if (tarea.seleccionado === 1) {
                    cambioEsfuerzo -= tarea.esfuerzo;
                }
            });
    
            const esfuerzoTotal = tareas.reduce((acc, tarea) => {
                return tarea.seleccionado === 1 ? acc + tarea.esfuerzo : acc;
            }, 0) + cambioEsfuerzo;
    
            console.log("Cambio de esfuerzo calculado:", cambioEsfuerzo);
            console.log("Esfuerzo total después del cambio:", esfuerzoTotal);
            console.log("Esfuerzo permitido del proyecto:", proyectos[0].esfuerzo);
    
            if (esfuerzoTotal > proyectos[0].esfuerzo) {
                return res.status(400).json({ success: false, message: 'El esfuerzo de las tareas supera al del proyecto' });
            }
    
            await pool.promise().query(
                `UPDATE Tarea SET seleccionado = CASE
                    WHEN idTarea IN (?) THEN NOT seleccionado
                    ELSE seleccionado
                    END
                WHERE Proyecto_idProyecto = ?;`,
                [tareasSeleccionadas, proyectoId]
            );
    
            res.status(200).json({ success: true, message: 'Solución editada correctamente' });

        }

    } catch (error) {
        console.error('Error al ejecutar la consulta:', error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});


module.exports = router;