import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // Usamos variables de entorno para la API en producción, manteniendo el fallback local
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/tools';

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [formData, setFormData] = useState({ 
    role: '', 
    useCase: '', 
    pricing: 'Todos' 
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/recommend`, formData);
      
      setTimeout(() => {
        setResults(response.data.data);
        setLoading(false);
      }, 500); 
    } catch (error) {
      console.error('Error en la petición:', error);
      alert("Error al conectar con el servidor de IA");
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="glitch-title" data-text="IAPP">IAPP</h1>
        <p>RECOMENDADOR AVANZADO DE INTELIGENCIA ARTIFICIAL</p>
      </header>
      
      <main>
        <section className="search-card">
          <form className="search-form" onSubmit={handleSubmit}>
            
            <div className="form-group">
              <label>Perfil de Usuario</label>
              <select name="role" onChange={handleChange} required>
                <option value="">[ SELECCIONAR PERFIL ]</option>
                <option value="Estudiante">ESTUDIANTE UNIVERSITARIO</option>
                <option value="Docente">DOCENTE / INVESTIGADOR</option>
                <option value="Administrativo">GESTIÓN ADMINISTRATIVA</option>
                <option value="Desarrollador">INGENIERÍA / DESARROLLO</option>
              </select>
            </div>

            <div className="form-group">
              <label>Vector de Tarea</label>
              <select name="useCase" onChange={handleChange} required>
                <option value="">[ SELECCIONAR TAREA ]</option>
                <option value="Redacción">PROCESAMIENTO DE TEXTO (APA)</option>
                <option value="Análisis de Datos">ANÁLISIS DE DATOS / LÓGICA</option>
                <option value="Presentaciones">GENERACIÓN VISUAL</option>
                <option value="Código">SINTAXIS Y CÓDIGO</option>
              </select>
            </div>
            <div className="form-group">
              <label>Licencia</label>
              <select name="pricing" onChange={handleChange}>
                <option value="Todos">GLOBAL (CUALQUIERA)</option>
                <option value="Gratis">OPEN SOURCE / 100% GRATIS</option>
                <option value="Gratis con Límites">GRATIS CON LÍMITES (PRUEBA)</option>
                <option value="Pago">COMERCIAL (PAGO)</option>
              </select>
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'SINCRONIZANDO...' : 'INICIAR BÚSQUEDA'}
            </button>

          </form>
        </section>

        <section className="results-section">
          {searched && !loading && <h2 className="results-header">MATCHES ENCONTRADOS ({results.length})</h2>}
          
          {loading ? (
            <div className="loading-text">ACCEDIENDO A LA RED NEURAL...</div>
          ) : (
            <div className="tools-grid">
              {results.map(tool => (
                 <div key={tool._id} className="tool-card">
                   <h3>{tool.name}</h3>
                   <div className="badge-container">
                     <span className={`badge badge-${tool.pricingModel}`}>
                       {tool.pricingModel}
                     </span>
                     <span className="badge" style={{background: 'rgba(0, 229, 255, 0.1)', color: '#00e5ff', border: '2px solid #00e5ff'}}>
                       SEGURIDAD {tool.securityRating}
                     </span>
                   </div>
                   <p>{tool.description}</p>
                   <a 
                     href={tool.websiteUrl} 
                     target="_blank" 
                     rel="noopener noreferrer" 
                     className="btn-link-cyber"
                   >
                     CONECTAR A PLATAFORMA
                   </a>

                 </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;