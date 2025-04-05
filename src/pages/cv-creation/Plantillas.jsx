import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Rutas centralizadas para consistencia
const APP_ROUTES = {
  CV_CREADO: '/CvCreado',
  REGISTRO: '/Registro'
};

const Plantillas = () => {
  const [experience, setExperience] = useState('Todas las plantillas');
  const [photoFilter, setPhotoFilter] = useState('con');
  const navigate = useNavigate();
  
  const templates = [
    { 
      id: 1, 
      title: 'Innovador', 
      color: 'bg-blue-600', 
      hasPhoto: true,
      imageUrl: 'https://i.postimg.cc/HnS55MrJ/Screenshot-2025-04-04-212046.png',
      experienceLevel: ['todas', 'ninguna', '0-3']
    },
    { 
      id: 2, 
      title: 'Ejecutivo', 
      color: 'bg-indigo-700', 
      hasPhoto: true,
      imageUrl: 'https://i.postimg.cc/QVGDf49v/Screenshot-2025-04-04-215103.png',
      experienceLevel: ['todas', '3-5', '10+']
    },
    { 
      id: 3, 
      title: 'Creativo', 
      color: 'bg-purple-700', 
      hasPhoto: false,
      imageUrl: 'https://i.postimg.cc/gcBnVmM6/Sin-foto.jpg',
      experienceLevel: ['todas', '0-3', '5-10']
    },
    { 
      id: 4, 
      title: 'Minimalista', 
      color: 'bg-gray-800', 
      hasPhoto: false,
      imageUrl: 'https://i.postimg.cc/GpsZ5JrC/Screenshot-2025-04-04-224750.png',
      experienceLevel: ['todas', 'ninguna', '10+']
    },
    { 
      id: 5, 
      title: 'Técnico', 
      color: 'bg-green-700', 
      hasPhoto: true,
      imageUrl: 'https://i.postimg.cc/HnS55MrJ/Screenshot-2025-04-04-212046.png',
      experienceLevel: ['todas', '0-3', '3-5']
    },
    { 
      id: 6, 
      title: 'Clásico', 
      color: 'bg-blue-900', 
      hasPhoto: true,
      imageUrl: 'https://i.postimg.cc/QVGDf49v/Screenshot-2025-04-04-215103.png',
      experienceLevel: ['todas', '5-10', '10+']
    }
  ];

  const experiences = [
    'Todas las plantillas',
    'Ninguna experiencia',
    '0-3 años',
    '3-5 años',
    '5-10 años',
    '10+ años'
  ];

  const filteredTemplates = templates.filter(template => {
    const experienceMatch = 
      experience === 'Todas las plantillas' ||
      (experience === 'Ninguna experiencia' && template.experienceLevel.includes('ninguna')) ||
      (experience === '0-3 años' && template.experienceLevel.includes('0-3')) ||
      (experience === '3-5 años' && template.experienceLevel.includes('3-5')) ||
      (experience === '5-10 años' && template.experienceLevel.includes('5-10')) ||
      (experience === '10+ años' && template.experienceLevel.includes('10+'));
    
    const photoMatch = 
      (photoFilter === 'con' && template.hasPhoto) ||
      (photoFilter === 'sin' && !template.hasPhoto);
    
    return experienceMatch && photoMatch;
  });

  const handleSelectTemplate = (templateId) => {
    // Redirección consistente con validación
    if (templateId) {
      navigate(`${APP_ROUTES.CV_CREADO}/${templateId}`, {
        replace: true,
        state: { 
          templateData: templates.find(t => t.id === templateId),
          origin: 'plantillas'
        }
      });
    } else {
      console.error('ID de plantilla no válido');
      navigate(APP_ROUTES.REGISTRO); // Fallback seguro
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-5 flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="https://i.postimg.cc/QdmXH1bV/logoCV.png" 
              alt="Logo CVClean" 
              className="h-16 w-auto"
            />
          </div>
        </div>
        <div className="container mx-auto px-4 pb-8">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            <span className="text-blue-800">Selecciona</span>
            <span className="text-gray-900"> el CV perfecto para tu perfil</span>
          </h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row">
        <aside className="w-full md:w-72 bg-white p-6 rounded-lg shadow-md mb-6 md:mb-0 md:mr-8 border border-gray-200">
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 text-lg">Años de experiencia</h3>
            <select 
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-800 focus:border-blue-800 transition-all text-gray-700"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            >
              {experiences.map((exp, index) => (
                <option key={index} value={exp}>{exp}</option>
              ))}
            </select>
          </div>
          <div className="pt-4 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3 text-lg">Foto</h3>
            <select 
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-800 focus:border-blue-800 transition-all text-gray-700"
              value={photoFilter}
              onChange={(e) => setPhotoFilter(e.target.value)}
            >
              <option value="con">Con foto</option>
              <option value="sin">Sin foto</option>
            </select>
          </div>
          <div className="pt-4 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3 text-lg">Más filtros</h3>
            <p className="text-gray-500 text-sm">Próximamente más opciones de filtrado</p>
          </div>
        </aside>

        <main className="flex-1">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md border border-gray-200">
              <p className="text-gray-600 text-lg">No se encontraron plantillas con los filtros seleccionados</p>
              <button 
                onClick={() => {
                  setExperience('Todas las plantillas');
                  setPhotoFilter('con');
                }}
                className="mt-4 px-6 py-2 bg-blue-800 hover:bg-blue-900 text-white font-medium rounded-md transition-colors duration-300"
              >
                Mostrar todas
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTemplates.map((template) => (
                <div 
                  key={template.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-200 hover:border-blue-500"
                >
                  <div className="h-96 bg-gray-100 overflow-hidden relative flex items-center justify-center">
                    <img 
                      src={template.imageUrl} 
                      alt={`Plantilla ${template.title}`}
                      className="object-contain w-full h-full"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/500x300?text=Plantilla+no+disponible';
                      }}
                    />
                    {template.hasPhoto && (
                      <div className="absolute top-2 left-2 w-12 h-12 rounded-full bg-white border-2 border-white shadow-md overflow-hidden">
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className={`h-1 ${template.color}`}></div>
                  <div className="p-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{template.title}</h3>
                        <p className="text-gray-600 text-sm">Diseño profesional</p>
                      </div>
                    </div>
                    <div className="mt-6">
                      <button 
                        onClick={() => handleSelectTemplate(template.id)}
                        className="w-full py-3 px-4 bg-blue-800 hover:bg-blue-900 text-white font-medium rounded-md transition-colors duration-300 shadow-sm transform hover:-translate-y-0.5"
                      >
                        Seleccionar plantilla
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="text-2xl font-bold">
                <span className="text-blue-400">CV</span>
                <span className="text-gray-300">Clean</span>
              </div>
              <p className="text-gray-400 text-sm mt-1">Crea tu currículum profesional en minutos</p>
            </div>
            <div className="flex space-x-6">
              <a className="text-gray-400 hover:text-blue-400 transition-colors">"Diseños simples, oportunidades claras"</a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-6 pt-6 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} CvClean. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Plantillas;