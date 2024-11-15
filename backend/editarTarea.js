const express = require('express');
const pool = require('./db');
const router = express.Router();

router.put('/editarTarea', async (req, res) => {
    console.log('Ruta crear proyecto alcanzada');
    let { nombreTarea, esfuerzo, tiempoHoras, tiempoMinutos, tareaId} = req.body.almacenVariables;
    const pool = req.app.get('pool');
    console.log('ID:', tareaId);
    try {
      const [rows] = await pool.promise().query(
        'SELECT * FROM Tarea WHERE  idTarea = ?',[tareaId]
      );
     
      console.log('Valor de nombre recibido:', nombreTarea);
      console.log('Valor del esfuerzo recibido', esfuerzo);
      console.log('Valor del tiempo en horas recibido', tiempoHoras);
      console.log('Valor del tiempo en minutos recibido', tiempoMinutos);
      console.log('Valor del esfuerzo recibido', tareaId);
      console.log('Resultado de la consulta:', rows);


      if (rows.length > 0) {
        const tareaExistente = rows[0];
        nombreTarea = nombreTarea !== undefined ? nombreTarea : tareaExistente.nombreTarea;
        esfuerzo = esfuerzo !== undefined ? esfuerzo : tareaExistente.esfuerzo;
        let horas = tiempoHoras !== undefined ? tiempoHoras : Math.floor(tareaExistente.tiempoMinutos / 60);
        let minutos = tiempoMinutos !== undefined ? tiempoMinutos : tareaExistente.tiempoMinutos % 60;
        
        const tiempoTotal = horas * 60 + minutos;
        

        await pool.promise().query(
          'UPDATE Tarea SET nombreTarea = ?, esfuerzo = ?, tiempoMinutos = ?, prioridad = ?, Proyecto_idProyecto = ?, estaEliminado = ? WHERE idTarea = ?',
          [nombreTarea, esfuerzo, tiempoTotal, -1, tareaExistente.Proyecto_idProyecto, false, tareaId]
        );
        res.status(200).json({
          success: true,
          message: 'Proyecto modificado correctamente.'
        });
       
      } else {

        res.status(500).json({
            success: false,
            message: 'El proyecto no existe.'
        });

      }
    } catch (error) {
      console.error('Error al ejecutar la consulta:', error);
      res.status(500).json({ success: false, message: 'Error del servidor' });
    }
  });
 
 
  module.exports = router;
 