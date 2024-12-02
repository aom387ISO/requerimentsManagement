const express = require('express');
const pool = require('./db'); 
const router = express.Router();

router.post('/calculoCobertura', async (req, res) => {
    const pool = req.app.get('pool');
    const {idCliente, idProyecto} = req.params.id;

    const [tareas] = await pool.promise().query(
        `SELECT *
         FROM Tarea
         WHERE Proyecto_idProyecto = ? AND estaEliminado = 0`,
        [idProyecto]
      );

      const[tareasClientes] = await pool.promise.query(
        'SELECT * FROM Tareacliente WHERE Cliente_idCliente = ?'[idCliente]
      )


      pesoTareas = 0;

      pesoClientes = 0;
      
      for (const tarea of tareas) {

        const[pesoTareas] = await pool.promise.query(
            'SELECT * FROM Tareacliente WHERE Tarea_idTarea = ?'[tarea.idTarea]
          )

          for(const tareaPeso of pesoTareas){

            pesoTareas += tareaPeso.peso;

          }

      }


      for(const cliente of tareasClientes){

        pesoClientes += cliente.peso;
      }

      
      cobertura = pesoClientes/pesoTareas;

      res.json({success: true, cobertura});
});

module.exports = router;