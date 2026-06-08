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
    console.log("[SISTEMA] Base de datos actualizada con los nuevos modelos de licenciamiento.");
  }
};

exports.recommendTools = async (req, res) => {
  try {
    await seedDatabase();

    const { role, useCase, pricing } = req.body;
    let conditions = [];
    
    if (role) conditions.push({ targetRoles: { $in: [role] } });
    if (useCase) conditions.push({ useCases: { $in: [useCase] } });
    if (pricing && pricing !== 'Todos') conditions.push({ pricingModel: pricing });

    let tools = [];
    
    if (conditions.length > 0) {
      tools = await AITool.find({ $and: conditions });
      if(tools.length === 0) {
          tools = await AITool.find({ $or: conditions }).sort({securityRating: -1});
      }
    } else {
      tools = await AITool.find({});
    }

    res.status(200).json({ success: true, count: tools.length, data: tools });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error en el servidor', error: error.message });
  }
};