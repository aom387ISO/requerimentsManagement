const express = require('express');
const router = express.Router();

router.post('/agregarTarea', async (req, res) => {
  const pool = req.app.get('pool');
  
  const {
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

    const [tareaResult] = await pool.promise().query(
      'INSERT INTO Tarea (nombreTarea, esfuerzo, tiempoMinutos, prioridad, Proyecto_idProyecto, estaEliminado) VALUES (?, ?, ?, ?, ?, ?)',
      [nombreTarea, esfuerzo, tiempoMinutos, prioridad, proyectoId, 0]
    );

    const nuevaTareaId = tareaResult.insertId;

    if (dependeDe) {
      await pool.promise().query(
        'INSERT INTO Dependencia (idTareaPrecedente, idTareaSucesiva) VALUES (?, ?)',
        [dependeDe, nuevaTareaId]
      );
    }
    if (precedeA) {
      await pool.promise().query(
        'INSERT INTO Dependencia (idTareaPrecedente, idTareaSucesiva) VALUES (?, ?)',
        [nuevaTareaId, precedeA]
      );
    }

    if (excluye) {
      await pool.promise().query(
        'INSERT INTO Exclusion (idTareaExcluyeA, idTareaEsExcluidaPor) VALUES (?, ?)',
        [nuevaTareaId, excluye]
      );
    }

    if (interdependeDe) {
      await pool.promise().query(
        'INSERT INTO Interdependencia (idTareaInterdependeA, idTareaEsInterdependidaPor) VALUES (?, ?)',
        [nuevaTareaId, interdependeDe]
      );
    }

    await pool.promise().query('COMMIT');

    res.json({ success: true, message: 'Tarea agregada exitosamente', tareaId: nuevaTareaId });

  } catch (error) {
    await pool.promise().query('ROLLBACK');
    console.error('Error al agregar la tarea:', error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});

module.exports = router;
