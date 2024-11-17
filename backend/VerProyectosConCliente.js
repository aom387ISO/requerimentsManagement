const express = require('express');
const pool = require('./db');
const router = express.Router();

// Ruta para obtener proyectos y tareas de un cliente específico usando parámetro de ruta
router.get('/verProyectosConCliente/:id', async (req, res) => {
    const idProyecto = req.params.id; // Obtener el idCliente desde el parámetro de ruta
    console.log('idProyecto backend es:', idProyecto);
    const pool = req.app.get('pool');

    try {
        const [clientes] = await pool.promise().query(
            `SELECT * FROM cliente c
             WHERE c.idCliente IN (
               SELECT Cliente_idCliente FROM proyectoCliente WHERE Proyecto_idProyecto = ?
             ) AND c.idCliente != 0 AND c.estaEliminado != true`,
            [idProyecto]
          );

        if (clientes.length > 0) {
            res.json({ success: true, clientes });

        } else {
            res.json({ success: false, message: 'No se encontraron proyectos activos para el cliente especificado' });
        }
    } catch (error) {
        console.error('Error al ejecutar la consulta:', error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});

module.exports = router;
