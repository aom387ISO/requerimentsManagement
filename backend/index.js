// index.js
console.log('Hola, Node.js!');

const mysql = require('mysql2');

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