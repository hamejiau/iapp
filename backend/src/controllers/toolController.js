const AITool = require('../models/AITool');

const seedDatabase = async () => {
  const count = await AITool.countDocuments();
  if (count === 0) {
    await AITool.insertMany([
      { name: 'ChatGPT Plus', description: 'Asistente avanzado. Excelente para código y redacción compleja.', websiteUrl: 'https://chat.openai.com', pricingModel: 'Pago', targetRoles: ['Estudiante', 'Docente', 'Desarrollador'], useCases: ['Redacción', 'Código', 'Análisis de Datos'], securityRating: 4 },
      { name: 'Claude 3', description: 'Analiza documentos largos (PDFs) con un tono muy natural y preciso.', websiteUrl: 'https://claude.ai', pricingModel: 'Gratis con Límites', targetRoles: ['Docente', 'Administrativo', 'Estudiante'], useCases: ['Redacción', 'Análisis de Datos'], securityRating: 4 },
      { name: 'Gamma App', description: 'Genera presentaciones, páginas web y documentos visuales en segundos solo con un prompt.', websiteUrl: 'https://gamma.app', pricingModel: 'Gratis', targetRoles: ['Estudiante', 'Administrativo'], useCases: ['Presentaciones'], securityRating: 3 },
      { name: 'GitHub Copilot', description: 'El compañero de IA definitivo para programadores. Autocompleta código en tiempo real.', websiteUrl: 'https://github.com/features/copilot', pricingModel: 'Pago', targetRoles: ['Desarrollador'], useCases: ['Código'], securityRating: 5 },
      { name: 'Perplexity AI', description: 'Motor de búsqueda que cita las fuentes académicas de sus respuestas en tiempo real.', websiteUrl: 'https://www.perplexity.ai', pricingModel: 'Gratis', targetRoles: ['Estudiante', 'Docente'], useCases: ['Redacción'], securityRating: 4 },
      { name: 'Notion AI', description: 'Organiza notas, resume reuniones y redacta informes en un solo lugar.', websiteUrl: 'https://www.notion.so', pricingModel: 'Gratis con Límites', targetRoles: ['Administrativo', 'Estudiante', 'Docente'], useCases: ['Redacción', 'Análisis de Datos'], securityRating: 4 },
      { name: 'Tabnine', description: 'Asistente de código con IA que aprende de tu propio entorno local.', websiteUrl: 'https://www.tabnine.com', pricingModel: 'Gratis con Límites', targetRoles: ['Desarrollador'], useCases: ['Código'], securityRating: 5 },
      { name: 'Tome', description: 'Crea narrativas visuales y presentaciones ejecutivas a partir de texto.', websiteUrl: 'https://tome.app', pricingModel: 'Gratis con Límites', targetRoles: ['Docente', 'Administrativo'], useCases: ['Presentaciones'], securityRating: 4 }
    ]);
    console.info("[SISTEMA] Base de datos inicializada con herramientas de IA.");
  }
};

// Es recomendable llamar a seedDatabase() desde el archivo principal de la app (ej. server.js)
// y no dentro de un controlador que se ejecuta en cada request.

exports.recommendTools = async (req, res) => {
  try {
    const { role, useCase, pricing } = req.body;
    console.log("[DEBUG] Filtros recibidos:", { role, useCase, pricing });

    const query = {};
    
    // Construcción dinámica de filtros (Búsqueda exacta)
    if (role && role !== "") query.targetRoles = role;
    if (useCase && useCase !== "") query.useCases = useCase;
    if (pricing && pricing !== 'Todos') query.pricingModel = pricing;

    console.log("[DEBUG] Query Mongoose:", JSON.stringify(query));

    let tools = [];
    
    if (Object.keys(query).length > 0) {
      // Búsqueda estricta: debe cumplir todos los filtros seleccionados
      tools = await AITool.find(query).sort({ securityRating: -1 });
      console.log(`[DEBUG] Resultados exactos encontrados: ${tools.length}`);
      
      // Si no hay resultados exactos, fallback a búsqueda flexible ($or)
      if(tools.length === 0) {
          console.log("[DEBUG] No hay matches exactos, intentando búsqueda flexible...");
          const fallbackConditions = Object.entries(query).map(([key, value]) => ({ [key]: value }));
          tools = await AITool.find({ $or: fallbackConditions }).sort({ securityRating: -1 });
      }
    } else {
      tools = await AITool.find({}).limit(10);
    }

    res.status(200).json({ success: true, count: tools.length, data: tools });
  } catch (error) {
    console.error("Error en recommendTools:", error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

exports.seedDatabase = seedDatabase; // Exportar para uso en el arranque del servidor