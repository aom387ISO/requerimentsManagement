const express = require('express');
const router = express.Router();

router.put('/modificarTarea', async (req, res) => {
  const pool = req.app.get('pool');
  
  const {
    tareaId,
    nombreTarea,
    esfuerzo,
    tiempoMinutos,
    prioridad,
    proyectoId,
    dependeDe,
    precedeA,
    excluye,
    interdependeDe
  } = req.body;

  try {
    await pool.promise().query('START TRANSACTION');

    // Actualizar los datos de la tarea
    await pool.promise().query(
      'UPDATE Tarea SET nombreTarea = ?, esfuerzo = ?, tiempoMinutos = ?, prioridad = ?, Proyecto_idProyecto = ? WHERE idTarea = ? AND estaEliminado = 0',
      [nombreTarea, esfuerzo, tiempoMinutos, prioridad, proyectoId, tareaId]
    );

    // Actualizar dependencias
    if (dependeDe) {
      await pool.promise().query(
        'DELETE FROM Dependencia WHERE idTareaSucesiva = ?',
        [tareaId]
      );
      await pool.promise().query(
        'INSERT INTO Dependencia (idTareaPrecedente, idTareaSucesiva) VALUES (?, ?)',
        [dependeDe, tareaId]
      );
    }

    if (precedeA) {
      await pool.promise().query(
        'DELETE FROM Dependencia WHERE idTareaPrecedente = ?',
        [tareaId]
      );
      await pool.promise().query(
        'INSERT INTO Dependencia (idTareaPrecedente, idTareaSucesiva) VALUES (?, ?)',
        [tareaId, precedeA]
      );
    }

    // Actualizar exclusiones
    if (excluye) {
      await pool.promise().query(
        'DELETE FROM Exclusion WHERE idTareaExcluyeA = ? OR idTareaEsExcluidaPor = ?',
        [tareaId, tareaId]
      );
      await pool.promise().query(
        'INSERT INTO Exclusion (idTareaExcluyeA, idTareaEsExcluidaPor) VALUES (?, ?)',
        [tareaId, excluye]
      );
    }

    // Actualizar interdependencias
    if (interdependeDe) {
      await pool.promise().query(
        'DELETE FROM Interdependencia WHERE idTareaInterdependeA = ? OR idTareaEsInterdependidaPor = ?',
        [tareaId, tareaId]
      );
      await pool.promise().query(
        'INSERT INTO Interdependencia (idTareaInterdependeA, idTareaEsInterdependidaPor) VALUES (?, ?)',
        [tareaId, interdependeDe]
      );
    }

    await pool.promise().query('COMMIT');

    res.json({ success: true, message: 'Tarea modificada exitosamente' });

  } catch (error) {
    await pool.promise().query('ROLLBACK');
    console.error('Error al modificar la tarea:', error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});

module.exports = router;