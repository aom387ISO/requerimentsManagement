const express = require('express');
const pool = require('./db'); 
const router = express.Router();

router.post('/calculoContribucion', async (req, res) => {
    const pool = req.app.get('pool');


    try{

    } catch (error) {
    console.error('Error al ejecutar la consulta:', error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});

module.exports = router;