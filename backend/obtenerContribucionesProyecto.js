const express = require('express');
const db = require('./db');  // Asegúrate de tener tu archivo db.js configurado correctamente
const router = express.Router();

// Endpoint para obtener contribuciones de clientes para un proyecto
router.get('/obtenerContribucionesProyecto/:proyectoId', (req, res) => {
  const proyectoId = req.params.proyectoId;

  // Consulta SQL para obtener las tareas asociadas a un proyecto y calcular la contribución de cada cliente
  const query = `
    SELECT c.nombreCliente, SUM(t.productividad * t.esfuerzo) AS contribucionTotal
    FROM tareas t
    JOIN proyectos p ON t.idProyecto = p.idProyecto
    JOIN clientes c ON t.idCliente = c.idCliente
    WHERE t.idProyecto = ?
    GROUP BY c.idCliente
  `;

  // Ejecutamos la consulta
  db.query(query, [proyectoId], (error, results) => {
    if (error) {
      console.error('Error al obtener las contribuciones:', error);
      return res.status(500).json({ success: false, message: 'Error al obtener las contribuciones' });
    }

    // Si no se encontraron resultados
    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'No se encontraron contribuciones para este proyecto' });
    }

    // Respuesta exitosa con los datos
    res.json({ success: true, contribuciones: results });
  });
});

module.exports = router;
