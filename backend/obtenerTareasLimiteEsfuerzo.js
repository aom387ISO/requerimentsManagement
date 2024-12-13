const express = require('express');
const pool = require('./db'); 
const router = express.Router();

router.get('/obtenerTareasLimiteEsfuerzo/:proyectoId', async (req, res) => {
  const { proyectoId } = req.params;
  const pool = req.app.get('pool');
  console.log("Estoy en obtenerTareasLimiteEsfuerzo------------------------------------")
  try {
    const [rows] = await pool.promise().query(
      'SELECT * FROM Tarea WHERE Proyecto_idProyecto = ? AND estaEliminado = ?', [proyectoId, false]
    );

    const [proyectos] = await pool.promise().query(
        'SELECT * FROM Proyecto WHERE idProyecto = ? AND estaEliminado = ?', [proyectoId, false]
      );

    /*const [dependencias] = await pool.promise().query(
      'SELECT * FROM Dependencias WHERE dependencia = ?', [true]
    );*/
    const [dependencias] = await pool.promise().query(
      'SELECT * FROM Dependencias'
    );


    if (rows.length > 0) {

        const updatePromises = rows.map(tarea => {
            productividad = tarea.prioridad / tarea.esfuerzo;
            return pool.promise().query(
              'UPDATE Tarea SET productividad = ? WHERE idTarea = ?',
              [productividad, tarea.idTarea]
            );
          });
      
          try {
            await Promise.all(updatePromises);

            const [rows2] = await pool.promise().query(
                'SELECT * FROM Tarea WHERE Proyecto_idProyecto = ? AND estaEliminado = ? ORDER BY productividad DESC', [proyectoId, false]
            );

            const tareasFiltradas = [];
            let esfuerzoAcumulado = 0;
            const tareasDependientes = [];

            rows2.forEach(tarea => {

              const dependenciaEncontrada = dependencias.find(dep => dep.idTareaSecundaria === tarea.idTarea);
              console.log("Estoy en tarea");
              console.log("Dependencia encontrada para tarea", tarea.idTarea, ":", dependenciaEncontrada);

              if(dependenciaEncontrada){
                console.log("Dependencia encontrada:", dependenciaEncontrada);
                if (dependenciaEncontrada.dependencia === 1) {
                  /** Falta meter lógica dependencia
                  esfuerzoAcumulado += tarea.esfuerzo;
                  if (esfuerzoAcumulado <= proyectos[0].esfuerzo) {
                    tareasFiltradas.push(tarea);
                  }*/

                } else if (dependenciaEncontrada.exclusion === 1) {
                  console.log("---------------------------------------------------------------- Estoy en exclusion")
                  return;
                } else if (dependenciaEncontrada.interdependencia === 1) {
                  const tareaDependiente = rows2.find(t => t.idTarea === dependenciaEncontrada.idTareaPrincipal);
                  if (tareaDependiente) {
                    if (esfuerzoAcumulado + tarea.esfuerzo + tareaDependiente.esfuerzo <= proyectos[0].esfuerzo) {
                      tareasFiltradas.push(tarea);
                      tareasFiltradas.push(tareaDependiente);
                      esfuerzoAcumulado += tarea.esfuerzo + tareaDependiente.esfuerzo;
                    }
                  }
                }
              }else{ //Si no hay dependencia.
                esfuerzoAcumulado += tarea.esfuerzo;
                if (esfuerzoAcumulado <= proyectos[0].esfuerzo) {
                  tareasFiltradas.push(tarea);
                } else {
                  return;
                }
              }

/*
              if(dependenciaEncontrada){
                tareasDependientes.push(tarea);
              }else{
                esfuerzoAcumulado += tarea.esfuerzo;
                if (esfuerzoAcumulado <= proyectos[0].esfuerzo) {
                    tareasFiltradas.push(tarea);
                } else {
 
                    return;
                }
              }
*/
            });

            res.json({ success: true, tareas: tareasFiltradas });
          } catch (error) {
            console.error('Error al actualizar las tareas:', error);
            res.status(500).json({ success: false, message: 'Error del servidor' });
          }
    } else {
      res.json({ success: false, message: 'No se encontraron tareas activos' });
    }
  } catch (error) {
    console.error('Error al ejecutar la consulta:', error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});


module.exports = router;
