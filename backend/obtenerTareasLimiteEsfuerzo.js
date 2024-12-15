const express = require('express');
const pool = require('./db'); 
const router = express.Router();

router.get('/obtenerTareasLimiteEsfuerzo/:proyectoId', async (req, res) => {
  const { proyectoId } = req.params;
  const pool = req.app.get('pool');
  console.log("Estoy en obtenerTareasLimiteEsfuerzo------------------------------------");
  
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
        const productividad = tarea.prioridad / tarea.esfuerzo;
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

        let tareasFiltradas = [];
        let esfuerzoAcumulado = 0;
        let tareasPendientes = []; 
        let temp2 = [];

        for (const tarea of rows2) {
          const dependenciaEncontrada = dependencias.find(dep => dep.idTareaSecundaria === tarea.idTarea);
          console.log("Estoy en tarea", tarea.idTarea);

          if (dependenciaEncontrada) {
            console.log("Dependencia encontrada:", dependenciaEncontrada);
            if (dependenciaEncontrada.dependencia === 1) {
              console.log("---------------------------------------------------------------- Estoy en dependencia");

              const tareaPrincipal = tareasFiltradas.find(dep => dep.idTarea === dependenciaEncontrada.idTareaPrimaria);
              if (tareaPrincipal) {
                console.log("La tarea a la que dependo ya está en tareas filtradas y miro si me puedo unir");
                esfuerzoAcumulado += tarea.esfuerzo;
                if (esfuerzoAcumulado <= proyectos[0].esfuerzo) {
                  console.log("Me puedo unir");
                  if (!tareasFiltradas.some(t => t.idTarea === tarea.idTarea)) {
                    tareasFiltradas.push(tarea);
                  }
                }
              } else {
                tareasPendientes.push(tarea);
              }
            }

            if (dependenciaEncontrada.exclusion === 1) {
              console.log("---------------------------------------------------------------- Estoy en exclusion");
              const tareaPrincipal = tareasFiltradas.find(dep => dep.idTarea === dependenciaEncontrada.idTareaPrimaria);
              const tareaSecundaria = tareasFiltradas.find(dep => dep.idTarea === dependenciaEncontrada.idTareaSecundaria);
              console.log("tprincipal:", tareaPrincipal);
              if (tareaPrincipal && tareaSecundaria) {
                console.log("holaaaaaaaaaaaaaaaaaaaaaaaa",tareaPrincipal);
                console.log(tareaSecundaria);

                if (!tareasFiltradas.some(t => t.idTarea === tareaPrincipal.idTarea)) {
                  tareasFiltradas.push(tareaPrincipal);
                }

            }
              continue;
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
          } else {
            console.log("Sin dependencias");
            esfuerzoAcumulado += tarea.esfuerzo;
            if (esfuerzoAcumulado <= proyectos[0].esfuerzo) {
              if (!tareasFiltradas.some(t => t.idTarea === tarea.idTarea)) {
                tareasFiltradas.push(tarea);
              }
            } else {
              continue;
            }
          }
        }

        console.log("Esfuerzo acumulado:", esfuerzoAcumulado);
        console.log("Tareas filtradas:", tareasFiltradas);

        if (tareasPendientes.length > 0) {
          for (const tarea of tareasPendientes) {
            const dependencia = dependencias.find(dep => dep.idTareaSecundaria === tarea.idTarea);
            const tareaPrincipal = tareasFiltradas.find(t => t.idTarea === dependencia.idTareaPrimaria);
            
            if (tareaPrincipal) {
              if (esfuerzoAcumulado + tarea.esfuerzo <= proyectos[0].esfuerzo) {
                tareasFiltradas.push(tarea);
                esfuerzoAcumulado += tarea.esfuerzo;
              }
            }
          }
        }

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
