const express = require('express');
const pool = require('./db');
const router = express.Router();

router.post('/calculoCobertura', async (req, res) => {
  const {
    tareas, clientes 
  } = req.body;


  pesoTarea = 0;
  pesoCliente = 1;
  coberturas = [];

  if((tareas.lenght > 0 || Array.isArray(tareas))&&(clientes.lenght > 0 || Array.isArray(clientes))){

    try {

      for (const cliente of clientes) {
        pesoTarea = 0;
        pesoCliente = 1;
        coberturaTemp = 0;
        idProyecto = 0;
            
        for (const tarea of tareas) {
          console.log(tarea.idTarea);

          const [rows] = await pool.promise().query(
            'SELECT peso FROM Tareacliente WHERE Tarea_idTarea = ? AND Cliente_idCliente = ?',
            [tarea.idTarea, cliente.idCliente]
          );

          console.log("se detiene la ejecucion aqui, no avanza")
    
          if (rows.length > 0) {
            console.log("prueba");
            pesoTarea += rows[0];
            idProyecto = tarea.Proyecto_idProyecto;
          } 
        }

        const[rows2] = await pool.promise().query(
          'SELECT tc.peso AS peso FROM Tareacliente tc JOIN Tarea t ON tc.Tarea_idTarea = t.idTarea  WHERE tc.Cliente_idCliente = ? AND t.Proyecto_idProyecto = ?',
          [cliente.id, idProyecto]
        );

        if(rows2.lenght>0){
          pesoCliente = 0;
          for (const peso of rows2) {

            pesoCliente += peso;

          }
        }
        
        if(pesoCliente === 0){
          pesoCliente = 1;
        }

        coberturaTemp = pesoTarea/pesoCliente;
        
        coberturas.push(coberturaTemp);
    }
      console.log(coberturas);
      res.json({ success: true, coberturas: coberturas });
      
    } catch (error) {
      res.json({ success: false, message: 'Error al recorrer las tareas' });
    }
    
  }else{
    res.json({ success: false, message: 'No hay una solución' });
  }
});

module.exports = router;