// index.js
console.log('Hola, Node.js!');

const mysql = require('mysql2');
const express = require('express');
const loginRouter = require('./login');
const eliminarClienteRouter = require('./eliminarCliente');
const eliminarProyectoRouter = require('./eliminarProyecto');
const eliminarTareaRouter = require('./eliminarTarea');
const crearProyectoRouter = require('./crearProyecto');
const crearClienteRouter = require('./crearCliente');
const obtenerClientesRouter = require('./obtenerClientes');
const obtenerProyectosRouter = require('./obtenerProyectos');
const modificarPesoTareaRouter = require('./modificarPesoTarea');
const modificarPesoClienteRouter = require('./modificarPesoCliente');
const anadirClienteProyecto = require('./anadirClienteProyecto');
const verProyectosRouter = require('./verProyectos');
const verProyectosClienteRouter = require('./verProyectosCliente');
const verProyectosSinClienteRouter = require('./verProyectosSinCliente');
const verProyectosConClienteRouter = require('./verProyectosConCliente');
const anadirTareaRouter = require('./anadirTarea');
const editarTareaRouter = require('./editarTarea');
const editarProyectoRouter = require('./editarProyecto');
const editarSolucionRouter = require('./editarSolucion');
const actualizarPrioridadTareaRouter = require('./actualizarPrioridadTarea');
const eliminarClienteProyectoRouter = require('./eliminarClienteProyecto');
const cortarPorEsfuerzoRouter = require('./cortarPorEsfuerzo');
const calculoProductividadRouter = require('./calculoProductividad');
const obtenerTareasLimiteEsfuerzo = require('./obtenerTareasLimiteEsfuerzo');
const obtenerTareasManual = require('./obtenerTareasManual')
const obtenerTareas = require('./obtenerTareas')
const calculoContribucionRouter = require('./calculoContribucion');
const calculoCoberturaRouter = require('./calculoCobertura');
const obtenerClientesCobertura = require('./obtenerClientesCobertura');
const insertarDependenciaRouter = require('./insertarDependencia');
const insertarExclusionaRouter = require('./insertarExclusion');
const insertarInterdependenciaRouter = require('./insertarInterdependencia');

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

  app.set('pool', pool);

  app.use('/api', loginRouter);

  app.use('/api', eliminarClienteRouter);

  app.use('/api', eliminarProyectoRouter);

  app.use('/api', eliminarTareaRouter);

  app.use('/api', crearProyectoRouter);

  app.use('/api', crearClienteRouter);

  app.use('/api', obtenerClientesRouter);

  app.use('/api', obtenerProyectosRouter);

  app.use('/api', modificarPesoTareaRouter);

  app.use('/api', modificarPesoClienteRouter);

  app.use('/api', anadirClienteProyecto);

  app.use('/api', anadirTareaRouter);

  app.use('/api', verProyectosRouter); 
  
  app.use('/api', verProyectosClienteRouter); 

  app.use('/api', verProyectosSinClienteRouter); 

  app.use('/api', verProyectosConClienteRouter); 

  app.use('/api', editarTareaRouter);

  app.use('/api', editarProyectoRouter);

  app.use('/api', editarSolucionRouter);

  app.use('/api', actualizarPrioridadTareaRouter);

  app.use('/api', eliminarClienteProyectoRouter);

  app.use('/api', cortarPorEsfuerzoRouter);

  app.use('/api', obtenerTareasLimiteEsfuerzo);

  app.use('/api', obtenerTareasManual);

  app.use('/api', obtenerTareas);

  app.use('/api', calculoCoberturaRouter);

  app.use('/api', calculoContribucionRouter);

  app.use('/api', obtenerClientesCobertura);

  app.use('/api', insertarDependenciaRouter);

  app.use('/api', insertarExclusionaRouter);

  app.use('/api', insertarInterdependenciaRouter);
  
  app.listen(3001, () => {
    console.log('Servidor iniciado en el puerto 3001');
  });