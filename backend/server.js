const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser'); // Si usas bodyParser
const authRoutes = require('./auth'); // Ruta de autenticación

const app = express();

// Middleware para manejar CORS
app.use(cors());

// Middleware para parsear JSON en el cuerpo de la solicitud
app.use(express.json());  // Esto es crucial para poder leer req.body

// Usar las rutas de autenticación
app.use('/api', authRoutes);

// Iniciar el servidor
app.listen(3000, () => {
  console.log('Servidor backend corriendo en el puerto 3000');
});
