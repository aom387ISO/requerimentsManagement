const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('./db'); // Importar el pool de conexiones
const jwt = require('jsonwebtoken');
const router = express.Router();

// Ruta para el login
router.post('/login', async (req, res) => {
  const { usuario, contrasena } = req.body;
  console.log('Datos recibidos:', { usuario, contrasena });  // Verificar si los datos están llegando

  try {
    // Buscar usuario en la base de datos
    const [results] = await pool.promise().query('SELECT * FROM usuarios WHERE username = ?', [usuario]);

    if (results.length > 0) {
      const usuarioDb = results[0];

      // Comparar la contraseña
      const isMatch = await bcrypt.compare(contrasena, usuarioDb.password);
      if (isMatch) {
        // Generar un token JWT
        const token = jwt.sign({ userId: usuarioDb.id }, 'tu_clave_secreta', { expiresIn: '1h' });

        // Enviar respuesta con el token
        res.status(200).json({ mensaje: 'Autenticación exitosa', token });
      } else {
        res.status(400).json({ error: 'Contraseña incorrecta' });
      }
    } else {
      res.status(400).json({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

module.exports = router;
