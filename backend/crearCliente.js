const express = require('express');
const pool = require('./db'); 
const router = express.Router();

router.post('/crearCliente', async (req, res) => {
    console.log('Ruta crear cliente alcanzada');
    const { nombre, apellido, correo, contrasena, contrasena2 } = req.body;
    const pool = req.app.get('pool');
    try {
      const [rows] = await pool.promise().query(
        'SELECT * FROM Cliente WHERE correo = ? ',[correo]
      );
      
      console.log('Valor de nombre recibido:', nombre);
      console.log('Valor del peso recibido', apellido);
      console.log('Valor del esfuerzo recibido', correo);
      console.log('Valor del peso recibido', contrasena);
      console.log('Valor del esfuerzo recibido', contrasena2);
      console.log('Resultado de la consulta:', rows);
  
      if (rows.length > 0) {

        const clienteExistente = rows[0];

        if(clienteExistente.estaEliminado){
            if(contrasena === contrasena2){
                await pool.promise().query(
                    'UPDATE Cliente SET nombre = ?, apellido = ?, correo =?, contrasena = ?, estaEliminado = ? WHERE idCliente = ?',
                    [nombre, apellido, correo, contrasena, false, clienteExistente.idCliente]
                );
                res.status(200).json({
                    success: true,
                    message: 'Cliente restaurado correctamente.'
                });
            }else{
                res.status(500).json({ success: false, message: 'La contraseña no coincide' });
            }
            
        }else{
            res.status(401).json({ success: false, message: 'Cliente existente' });
        }

      } else {

        if(contrasena === contrasena2){
            const [rows] = await pool.promise().query('SELECT MAX(idCliente) as maxId FROM Cliente');
            const maxId = rows[0].maxId || 0;
            const id = maxId + 1;
            
            await pool.promise().query(
                'INSERT INTO Cliente (idCliente, nombre, apellido, correo, contrasena, estaEliminado) VALUES (?, ?, ?, ?, ?, ?)',
                [id, nombre, apellido, correo, contrasena, false]
            )
    
            res.status(201).json({
                success: true,
                message: 'Cliente creado correctamente.'
            });
        }else{
            res.status(500).json({ success: false, message: 'La contraseña no coincide' });
        }
      }
    } catch (error) {
      console.error('Error al ejecutar la consulta:', error);
      res.status(500).json({ success: false, message: 'Error del servidor' });
    }
  });
  
  
  module.exports = router;
  