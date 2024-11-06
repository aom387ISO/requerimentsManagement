const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('./db'); // Importar el pool de conexiones
const router = express.Router();

router.post('/login', async (req, res) => {
    console.log('Ruta de login alcanzada')
  const { usuario, contrasena } = req.body;

  try {
    
    const [results] = await pool.promise().query('SELECT * FROM cliente WHERE nombre = ?', [usuario]);

    if (results.length > 0) {
      const usuarioDb = results[0];

      const isMatch = await bcrypt.compare(contrasena, usuarioDb.password);

      if (isMatch) {
        res.status(200).json({ mensaje: 'Autenticación exitosa' });
      } else {
        res.status(400).json({ error: 'Contraseña incorrecta' });
      }
    } else {
      res.status(400).json({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('Error al realizar la consulta de login:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

module.exports = router;
