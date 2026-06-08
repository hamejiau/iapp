require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const toolRoutes = require('./src/routes/toolRoutes');

const app = express();

connectDB();

app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

app.use('/api/tools', toolRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`[EXITO] Servidor corriendo en puerto ${PORT}`));