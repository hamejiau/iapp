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
    console.log("[INFO] Intentando conectar a la base de datos...");
    await connectDB();
    await seedDatabase();
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`[EXITO] Servidor corriendo en puerto ${PORT}`));
  } catch (error) {
    console.error("[ERROR] No se pudo iniciar el servidor:", error.message);
    process.exit(1); // Detener el proceso si la DB falla
  }
};

app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // Permite fallback si la variable no está configurada
  methods: ['GET', 'POST']
}));

app.use(express.json());

// Log de peticiones para depuración en Render
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

app.use('/api/tools', toolRoutes);

startServer();