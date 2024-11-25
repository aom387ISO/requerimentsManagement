const express = require('express');
const pool = require('./db'); 
const router = express.Router();

router.delete('/eliminarClienteProyecto', async (req, res) => {
    console.log('Ruta de borrado alcanzada');
    const {idProyecto, idCliente} = req.body;

    const pool = req.app.get('pool');
    try {

    console.log(idProyecto);
    console.log(idCliente);

    await pool.promise().query(
        'DELETE FROM Proyectocliente WHERE Proyecto_idProyecto = ? AND Cliente_idCliente = ?',[idProyecto, idCliente]
      );
  
      const [rows2] = await pool.promise().query(
        'SELECT * FROM Tarea WHERE Proyecto_idProyecto = ? AND estaEliminado = ?',[idProyecto, false]
      );

      if(rows2.length > 0){

        for(const tarea of rows2){
            await pool.promise().query(
                'DELETE FROM Tareacliente WHERE Tarea_idTarea = ? AND Cliente_idCliente = ?',[tarea.idTarea, idCliente]
            );
        }
        res.json({ success: true, message: 'Cliente eliminado un proyecto exitosamente' });
      }else{
        res.status(401).json({ success: false, message: 'Error al cargar las tareas' });
      }

    } catch (error) {
      console.error('Error al ejecutar la consulta:', error);
      res.status(500).json({ success: false, message: 'Error del servidor' });
    }
  });
  
  
  module.exports = router;
  