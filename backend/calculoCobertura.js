const express = require('express');
const pool = require('./db');
const router = express.Router();

router.post('/calculoCobertura', async (req, res) => {
  const {tareas, clientes} = req.body;
  pesoTarea = 0;
  pesoCliente = 1;
  coberturas = [];
  const pool = req.app.get('pool');

  try {
  if((tareas.length > 0 || Array.isArray(tareas))&&(clientes.length > 0 || Array.isArray(clientes))){
      
      for (const cliente of clientes) {
        pesoTarea = 0;
        pesoCliente = 1;
        coberturaTemp = 0;
        idProyecto = 0;
       //     console.log("Sale tareas: ", tareas);
        for (const tarea of tareas) {
          console.log(tarea.idTarea);
          console.log("Cliente id: ", cliente.idCliente);
          
          try{
            console.log("Estoy dentro de tareas try")
            const [rows] = await pool.promise().query(
              'SELECT peso FROM Tareacliente WHERE Tarea_idTarea = ? AND Cliente_idCliente = ?',
              [tarea.idTarea, cliente.idCliente]
            );
            
            console.log("Rows en cero 1 ", rows[0].peso)
            console.log("Rows en cero",rows[0])
            console.log("se detiene la ejecucion aqui, no avanza")
      
            if (rows.length > 0 && !isNaN(rows[0].peso)) {
              console.log("prueba");
              pesoTarea += rows[0].peso;
              idProyecto = tarea.Proyecto_idProyecto;
            }
          }catch (error) {
            return res.json({ success: false, message: 'Error al recorrer las tareas 1' });
          }  
        }
        console.log("He salido del for de tareas");

        try{
        const[rows2] = await pool.promise().query(
          'SELECT tc.peso AS peso FROM Tareacliente tc JOIN Tarea t ON tc.Tarea_idTarea = t.idTarea  WHERE tc.Cliente_idCliente = ? AND t.Proyecto_idProyecto = ?',
          [cliente.idCliente, idProyecto]
        );
        console.log("He pasado la consulta");
        if(rows2.length>0){
          pesoCliente = 0;
          for (const peso of rows2) {

            pesoCliente += peso.peso;

          }
        }
        console.log("He pasado la condición 1");

        if(pesoCliente === 0 || isNaN(pesoCliente) ){
          pesoCliente = 1;
        }
        console.log("He pasado la condición 2");

        coberturaTemp = pesoTarea/pesoCliente;
        
        coberturas.push(coberturaTemp);
        console.log("Acabó");

      }catch (error) {
          res.json({ success: false, message: 'Error al recorrer las tareas rows2' });
        } 
    }
      console.log(coberturas);
      res.json({ success: true, coberturas: coberturas });

      }else{
        res.json({ success: false, message: 'No hay una solución' });
      }
    } catch (error) {
      res.json({ success: false, message: 'Error al recorrer las tareas' });
    }  
});

module.exports = router;