const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./auth');

const app = express();

app.use(cors());


app.use(express.json());

app.use('/api', authRoutes);


app.listen(3000, () => {
  console.log('Servidor backend corriendo en el puerto 3000');
});
