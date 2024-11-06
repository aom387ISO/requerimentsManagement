// index.js
console.log('Hola, Node.js!');

const mysql = require('mysql2');
const express = require('express');
const loginRouter = require('./login');
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

  // Añadir el pool al objeto `app` para que esté disponible en otras partes de la aplicación
  app.set('pool', pool);

  // Ruta principal para la lógica de login
  app.use('/api', loginRouter);
  
  app.listen(3001, () => {
    console.log('Servidor iniciado en el puerto 3001');
  });