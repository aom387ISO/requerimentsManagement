const express = require('express');
const pool = require('./db'); 
const router = express.Router();

router.put('/cortarPorEsfuerzo', async (req, res) => {
  console.log('Ruta de esfuerzo alcanzada');
  const { idProyecto, limite } = req.body;

  const pool = req.app.get('pool');

  try{
    await pool.promise().query(
        'UPDATE proyecto SET limite = ? WHERE idProyecto = ?',
        [limite, idProyecto]
    );

    res.json({ success: true, message: 'Límite de esfuerzo actualizado correctamente' }); 
} catch (error) {
    console.error('Error al ejecutar la consulta:', error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
}
});


module.exports = router;