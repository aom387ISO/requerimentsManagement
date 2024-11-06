// index.js
console.log('Hola, Node.js!');

const mysql = require('mysql2');
const express = require('express');
const app = express();

app.use(express.json());
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'pris1'
});

async function getClientes() {
    try {
      const [rows] = await pool.promise().query('SELECT * FROM Cliente');
      console.log('Resultados de la consulta:');
      console.log(rows);
    } catch (error) {
      console.error('Error al ejecutar la consulta:', error);
    }
  }
  
  getClientes();

  app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const [rows] = await pool.promise().query(
        'SELECT * FROM Cliente WHERE nombre = ?',
        [username, password]
      );
  
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
  
  app.listen(3001, () => {
    console.log('Servidor iniciado en el puerto 3001');
  });