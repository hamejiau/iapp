const mongoose = require('mongoose');

const aiToolSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  websiteUrl: { type: String, required: true },
  pricingModel: { type: String, enum: ['Gratis', 'Gratis con Límites', 'Pago'], required: true },
  targetRoles: [{ type: String, required: true }],
  useCases: [{ type: String, required: true }],
  securityRating: { type: Number, min: 1, max: 5, default: 3 }
}, { timestamps: true });

module.exports = mongoose.model('AITool', aiToolSchema);