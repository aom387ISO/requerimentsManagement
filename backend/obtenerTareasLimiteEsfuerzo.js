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
            const temp2 = [];

            for (const tarea of rows2) {

              const dependenciaEncontrada = dependencias.find(dep => dep.idTareaSecundaria === tarea.idTarea);
              console.log("Estoy en tarea");
              console.log("Dependencia encontrada para tarea", tarea.idTarea, ":", dependenciaEncontrada);

              if(dependenciaEncontrada){
                console.log("Dependencia encontrada:", dependenciaEncontrada);
                if (dependenciaEncontrada.dependencia === 1) {
                  console.log("---------------------------------------------------------------- Estoy en dependencia")

                  const tareaPrincipal = tareasFiltradas.find(dep => dep.idTarea === dependenciaEncontrada.idTareaPrimaria);
                  if(tareaPrincipal){
                    console.log("La tarea a la que dependo ya está en tareas filtradas y miro si me puedo unir");
                    esfuerzoAcumulado += tarea.esfuerzo;
                    if (esfuerzoAcumulado <= proyectos[0].esfuerzo) {
                      console.log("Me puedo unir")
                      tareasFiltradas.push(tarea);
                    }
                  }else{
                    tareasDependientes.push(dependenciaEncontrada);
                  }

                if (dependenciaEncontrada.exclusion === 1) {
                  console.log("---------------------------------------------------------------- Estoy en exclusion")
                  return;
                } 
                
                if (dependenciaEncontrada.interdependencia === 1) {
                  const tareaDependiente = rows2.find(t => t.idTarea === dependenciaEncontrada.idTareaPrincipal);
                  if (tareaDependiente) {
                    if (esfuerzoAcumulado + tarea.esfuerzo + tareaDependiente.esfuerzo <= proyectos[0].esfuerzo) {
                      tareasFiltradas.push(tarea);
                      tareasFiltradas.push(tareaDependiente);
                      esfuerzoAcumulado += tarea.esfuerzo + tareaDependiente.esfuerzo;
                    }
                  }
                }
              }
              
            }else{
              esfuerzoAcumulado += tarea.esfuerzo;
              if (esfuerzoAcumulado <= proyectos[0].esfuerzo) {
                tareasFiltradas.push(tarea);
              } else {
                return;
              }
            }

            if(tareasDependientes.length>0){
              console.log("**************************************************");

              if(tareasFiltradas.length>0){

                for (const dp of tareasDependientes) {

                  const tP = tareasFiltradas.find(tf => tf.idTarea === dp.idTareaPrimaria)

                  if(tP){
                    
                    const temp = await pool.promise().query(
                      'SELECT * FROM Tarea WHERE idTarea = ?',
                      [dp.idTareaSecundaria]
                    );

                    console.log("\n\n\n\n\n")
                    console.log(tP);
                    console.log(temp[0][0])
                    console.log("\n\n\n\n\n")

                    esfuerzoAcumulado += temp[0][0].esfuerzo;
                      if (esfuerzoAcumulado <= proyectos[0].esfuerzo) {
                        console.log("Me puedo unir")
                        tareasFiltradas.push(temp[0]);

                        if(temp2.length>0){
                          temp2 = temp2.filter(t2 => t2.idTareaPrimaria !== 2);
                        }else{
                          temp2 = tareasDependientes.filter(t2 => t2.idTareaPrimaria !== 2);
                        }

                      }
                    
                  }
  
                };

                if(temp2.length>0){
                  tareasDependientes = temp2;
                }
              }

            }
            };

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
