const express = require('express');
const pool = require('./db'); 
const router = express.Router();

router.post('/login', async (req, res) => {
  console.log('Ruta de login alcanzada');
  const { correo, contrasena } = req.body;
  const pool = req.app.get('pool');
  try {
    const [rows] = await pool.promise().query(
      'SELECT * FROM Cliente WHERE correo = ? AND contrasena = ? AND estaEliminado = ?',[correo, contrasena, false]
    );
    
    console.log('Valor de usuario recibido:', correo);
    console.log('Valor de la contrasena recibida', contrasena)
    console.log('Resultado de la consulta:', rows);

    if (rows.length > 0) {
      res.json({ success: true, user: rows[0] });
    } else {
      res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }
  } catch (error) {
    console.error('Error al ejecutar la consulta:', error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});


module.exports = router;
