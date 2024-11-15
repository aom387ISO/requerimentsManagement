const express = require('express');
const pool = require('./db');
const router = express.Router();

router.post('/editarProyecto', async (req, res) => {
    console.log('Ruta editar proyecto alcanzada');
    const { nombreProyecto, peso, esfuerzo, idProyecto} = req.body;
    const pool = req.app.get('pool');
    try {
        const [rows] = await pool.promise().query(
            'SELECT * FROM Proyecto WHERE  idProyecto = ? AND nombreProyecto = ? AND estaEliminado = ?',[idProyecto, nombreProyecto, false]
          );
     
      console.log('Valor de nombre recibido:', nombreProyecto);
      console.log('Valor del peso recibido', peso);
      console.log('Valor del esfuerzo recibido', esfuerzo);
      console.log('Valor del id del proyecto recibido', idProyecto);
      console.log('Resultado de la consulta:', rows);

      if (rows.length > 0) {
        
        res.status(500).json({
            success: false,
            message: 'Hay un proyecto con el mismo nombre.'
        });
       
      } else {

        await pool.promise().query(
          'UPDATE Proyecto SET nombreProyecto = ?, peso = ?, prioridad = ?, esfuerzo = ?, estaEliminado = ? WHERE idProyecto = ?',
          [nombreProyecto, peso, -1, esfuerzo, false, idProyecto]
        );
        res.status(200).json({
          success: true,
          message: 'Proyecto modificado correctamente.'
        });

      }
    } catch (error) {
      console.error('Error al ejecutar la consulta:', error);
      res.status(500).json({ success: false, message: 'Error del servidor' });
    }
  });
 
 
  module.exports = router;
 