const express = require('express');
const pool = require('./db'); 
const router = express.Router();

router.post('/listaClientesEnProyecto', async (req, res) => {
  const pool = req.app.get('pool');
});

module.exports = router;
