const express = require('express');
const pool = require('./db');
const router = express.Router();

router.post('/calculoCobertura', async (req, res) => {
  const {
    clienteSeleccionado,
    tareas 
  } = req.body;


  pesoTarea = 0;
  pesoCliente = 1;
  cobertura = 0;

  if(tareas.lenght > 0 || Array.isArray(tareas)){

    try {

      const sumatoriaPesoTareas = tareas.map(async tarea => {
        const [rows] = await pool.promise().query(
          'SELECT * FROM Tareacliente WHERE Tarea_idTarea = ? AND Cliente_idCliente = ?',
          [tarea.idTarea, clienteSeleccionado]
        );

        if(rows.lenght>0){
          pesoTarea += rows[0].peso;
        }

      });
        
      await Promise.all(sumatoriaPesoTareas);

      cobertura = pesoTarea/pesoCliente;

      res.json({ success: true, data: cobertura });
      
    } catch (error) {
      res.json({ success: false, message: 'Error al recorrer las tareas' });
    }
    
  }else{
    res.json({ success: false, message: 'No hay una solución' });
  }
});

module.exports = router;