require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const toolRoutes = require('./src/routes/toolRoutes');
const { seedDatabase } = require('./src/controllers/toolController');

const app = express();

// Función para inicializar la aplicación de forma segura
const startServer = async () => {
  try {
    await connectDB();
    await seedDatabase();
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`[EXITO] Servidor corriendo en puerto ${PORT}`));
  } catch (error) {
    console.error("[ERROR] No se pudo iniciar el servidor:", error.message);
    process.exit(1); // Detener el proceso si la DB falla
  }
};

app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

app.use('/api/tools', toolRoutes);

startServer();