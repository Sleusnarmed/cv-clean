import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPhone, FaEnvelope, FaHome, FaBirthdayCake, FaGlobe, FaHeart, FaLink, FaUser, FaUpload, FaEdit, FaTrash, FaPlus, FaFilePdf } from 'react-icons/fa';

export default function CvCreado() {
  const { templateId } = useParams();
  const navigate = useNavigate();
  
  const [cvData, setCvData] = useState({
    nombre: '',
    apellidos: '',
    idioma: '',
    direccion: '',
    telefono: '',
    email: '',
    fechaNacimiento: '',
    nacionalidad: '',
    estadoCivil: '',
    enlaces: '',
    foto: null,
    sintesis: '',
    experiencia: [],
    estudios: []
  });

  // Estados para edición
  const [editingExp, setEditingExp] = useState(null);
  const [editingEst, setEditingEst] = useState(null);
  const [newDescripcion, setNewDescripcion] = useState('');

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCvData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCvData(prev => ({ ...prev, foto: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Funciones para experiencia
  const handleAddExperiencia = () => {
    const newExperiencia = {
      id: Date.now(),
      periodo: '',
      puesto: '',
      descripcion: []
    };
    setCvData(prev => ({
      ...prev,
      experiencia: [...prev.experiencia, newExperiencia]
    }));
    setEditingExp(newExperiencia.id);
  };

  const handleEditExperiencia = (id) => {
    setEditingExp(id);
  };

  const handleSaveExperiencia = (id) => {
    setEditingExp(null);
  };

  const handleDeleteExperiencia = (id) => {
    setCvData(prev => ({
      ...prev,
      experiencia: prev.experiencia.filter(exp => exp.id !== id)
    }));
  };

  const handleExperienciaChange = (id, field, value) => {
    setCvData(prev => ({
      ...prev,
      experiencia: prev.experiencia.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const handleAddDescripcion = (id) => {
    if (!newDescripcion.trim()) return;
    
    setCvData(prev => ({
      ...prev,
      experiencia: prev.experiencia.map(exp => 
        exp.id === id 
          ? { ...exp, descripcion: [...exp.descripcion, newDescripcion] } 
          : exp
      )
    }));
    setNewDescripcion('');
  };

  const handleDeleteDescripcion = (expId, descIndex) => {
    setCvData(prev => ({
      ...prev,
      experiencia: prev.experiencia.map(exp => 
        exp.id === expId 
          ? { 
              ...exp, 
              descripcion: exp.descripcion.filter((_, i) => i !== descIndex) 
            } 
          : exp
      )
    }));
  };

  // Funciones para estudios
  const handleAddEstudio = () => {
    const newEstudio = {
      id: Date.now(),
      periodo: '',
      institucion: '',
      titulo: ''
    };
    setCvData(prev => ({
      ...prev,
      estudios: [...prev.estudios, newEstudio]
    }));
    setEditingEst(newEstudio.id);
  };

  const handleEditEstudio = (id) => {
    setEditingEst(id);
  };

  const handleSaveEstudio = (id) => {
    setEditingEst(null);
  };

  const handleDeleteEstudio = (id) => {
    setCvData(prev => ({
      ...prev,
      estudios: prev.estudios.filter(est => est.id !== id)
    }));
  };

  const handleEstudioChange = (id, field, value) => {
    setCvData(prev => ({
      ...prev,
      estudios: prev.estudios.map(est => 
        est.id === id ? { ...est, [field]: value } : est
      )
    }));
  };

  // Función para convertir a PDF
  const handleConvertToPDF = () => {
    // Pasar los datos del CV como estado de navegación
    navigate('/pdf', { state: { cvData } });
  };

  // Opciones para selects
  const idiomas = ['Español', 'Inglés', 'Francés', 'Alemán', 'Portugués', 'Italiano', 'Otro'];
  const estadosCiviles = ['Soltero/a', 'Casado/a', 'Divorciado/a', 'Viudo/a', 'Unión libre', 'Otro'];

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Generador de CV - Plantilla {templateId}</h1>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Formulario */}
          <div className="w-full lg:w-1/2 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Información Personal</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    value={cvData.nombre}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Juan"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos</label>
                  <input
                    type="text"
                    name="apellidos"
                    value={cvData.apellidos}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Pérez García"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Idioma</label>
                <select
                  name="idioma"
                  value={cvData.idioma}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccione un idioma</option>
                  {idiomas.map((idioma, index) => (
                    <option key={index} value={idioma}>{idioma}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                <input
                  type="text"
                  name="direccion"
                  value={cvData.direccion}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Calle Principal #123"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input
                    type="text"
                    name="telefono"
                    value={cvData.telefono}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: +521234567890"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                  <input
                    type="email"
                    name="email"
                    value={cvData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: ejemplo@correo.com"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de nacimiento</label>
                  <input
                    type="date"
                    name="fechaNacimiento"
                    value={cvData.fechaNacimiento}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nacionalidad</label>
                  <input
                    type="text"
                    name="nacionalidad"
                    value={cvData.nacionalidad}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Mexicana"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado civil</label>
                  <select
                    name="estadoCivil"
                    value={cvData.estadoCivil}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccione...</option>
                    {estadosCiviles.map((estado, index) => (
                      <option key={index} value={estado}>{estado}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Enlaces</label>
                <input
                  type="text"
                  name="enlaces"
                  value={cvData.enlaces}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: LinkedIn, portafolio, etc."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Foto</label>
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition flex items-center gap-2">
                    <FaUpload />
                    Cargar foto
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  {cvData.foto && (
                    <span className="text-sm text-gray-500">Foto seleccionada</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Síntesis Profesional</h2>
              <textarea
                name="sintesis"
                value={cvData.sintesis}
                onChange={handleChange}
                rows="5"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Escribe una breve síntesis de tu perfil profesional..."
              />
            </div>

            {/* Experiencia Laboral */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Experiencia Laboral</h2>
                <button 
                  onClick={handleAddExperiencia}
                  className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition"
                >
                  <FaPlus size={14} /> Añadir
                </button>
              </div>
              
              {cvData.experiencia.length === 0 && (
                <p className="text-gray-500 text-sm italic">No hay experiencias agregadas</p>
              )}
              
              {cvData.experiencia.map((exp) => (
                <div key={exp.id} className="mb-4 p-3 border border-gray-200 rounded-md">
                  {editingExp === exp.id ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Periodo</label>
                        <input
                          type="text"
                          value={exp.periodo}
                          onChange={(e) => handleExperienciaChange(exp.id, 'periodo', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Ej: 2020 - 2023"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Puesto</label>
                        <input
                          type="text"
                          value={exp.puesto}
                          onChange={(e) => handleExperienciaChange(exp.id, 'puesto', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Ej: Desarrollador Frontend"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                        <ul className="space-y-2">
                          {exp.descripcion.map((desc, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={desc}
                                onChange={(e) => {
                                  const newDescripcion = [...exp.descripcion];
                                  newDescripcion[index] = e.target.value;
                                  handleExperienciaChange(exp.id, 'descripcion', newDescripcion);
                                }}
                                className="flex-1 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Descripción de la responsabilidad"
                              />
                              <button 
                                onClick={() => handleDeleteDescripcion(exp.id, index)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <FaTrash size={14} />
                              </button>
                            </li>
                          ))}
                        </ul>
                        <div className="flex gap-2 mt-2">
                          <input
                            type="text"
                            value={newDescripcion}
                            onChange={(e) => setNewDescripcion(e.target.value)}
                            placeholder="Nueva descripción"
                            className="flex-1 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            onClick={() => handleAddDescripcion(exp.id)}
                            className="bg-blue-600 text-white px-2 py-1 rounded-md hover:bg-blue-700 transition"
                          >
                            <FaPlus size={14} />
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleSaveExperiencia(exp.id)}
                          className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition"
                        >
                          Guardar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <h3 className="font-semibold">{exp.puesto || "(Sin título)"}</h3>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleEditExperiencia(exp.id)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <FaEdit size={14} />
                          </button>
                          <button 
                            onClick={() => handleDeleteExperiencia(exp.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </div>
                      {exp.periodo && <p className="text-sm text-gray-500">{exp.periodo}</p>}
                      <ul className="list-disc list-inside text-gray-700 pl-2 space-y-1">
                        {exp.descripcion.length === 0 && (
                          <li className="text-gray-400 italic">Sin descripciones agregadas</li>
                        )}
                        {exp.descripcion.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Estudios */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Estudios</h2>
                <button 
                  onClick={handleAddEstudio}
                  className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition"
                >
                  <FaPlus size={14} /> Añadir
                </button>
              </div>
              
              {cvData.estudios.length === 0 && (
                <p className="text-gray-500 text-sm italic">No hay estudios agregados</p>
              )}
              
              {cvData.estudios.map((est) => (
                <div key={est.id} className="mb-4 p-3 border border-gray-200 rounded-md">
                  {editingEst === est.id ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Periodo</label>
                        <input
                          type="text"
                          value={est.periodo}
                          onChange={(e) => handleEstudioChange(est.id, 'periodo', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Ej: 2015 - 2019"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Institución</label>
                        <input
                          type="text"
                          value={est.institucion}
                          onChange={(e) => handleEstudioChange(est.id, 'institucion', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Ej: Universidad Nacional"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                        <input
                          type="text"
                          value={est.titulo}
                          onChange={(e) => handleEstudioChange(est.id, 'titulo', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Ej: Licenciatura en Informática"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleSaveEstudio(est.id)}
                          className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition"
                        >
                          Guardar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <h3 className="font-semibold">{est.titulo || "(Sin título)"}</h3>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleEditEstudio(est.id)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <FaEdit size={14} />
                          </button>
                          <button 
                            onClick={() => handleDeleteEstudio(est.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </div>
                      {est.periodo && <p className="text-sm text-gray-500">{est.periodo}</p>}
                      {est.institucion && <p className="text-gray-700">{est.institucion}</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Vista previa del CV */}
          <div className="w-full lg:w-1/2 bg-white p-6 rounded-lg shadow-md">
            <div className="bg-gray-900 text-white p-6 rounded-t-lg">
              <div className="flex items-center gap-4">
                {cvData.foto && (
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white">
                    <img src={cvData.foto} alt="Foto" className="w-full h-full object-cover" />
                  </div>
                )}
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">
                    {cvData.nombre || "(Nombre)"} {cvData.apellidos || "(Apellidos)"}
                  </h1>
                  {cvData.idioma && <p className="text-blue-300">{cvData.idioma}</p>}
                </div>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Contacto */}
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-2">Contacto</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {cvData.telefono && (
                    <div className="flex items-center gap-2">
                      <FaPhone className="text-blue-600" />
                      <span>{cvData.telefono}</span>
                    </div>
                  )}
                  {cvData.email && (
                    <div className="flex items-center gap-2">
                      <FaEnvelope className="text-blue-600" />
                      <span>{cvData.email}</span>
                    </div>
                  )}
                  {cvData.direccion && (
                    <div className="flex items-center gap-2">
                      <FaHome className="text-blue-600" />
                      <span>{cvData.direccion}</span>
                    </div>
                  )}
                  {cvData.fechaNacimiento && (
                    <div className="flex items-center gap-2">
                      <FaBirthdayCake className="text-blue-600" />
                      <span>{cvData.fechaNacimiento}</span>
                    </div>
                  )}
                  {cvData.nacionalidad && (
                    <div className="flex items-center gap-2">
                      <FaGlobe className="text-blue-600" />
                      <span>{cvData.nacionalidad}</span>
                    </div>
                  )}
                  {cvData.estadoCivil && (
                    <div className="flex items-center gap-2">
                      <FaHeart className="text-blue-600" />
                      <span>{cvData.estadoCivil}</span>
                    </div>
                  )}
                  {cvData.enlaces && (
                    <div className="flex items-center gap-2">
                      <FaLink className="text-blue-600" />
                      <span>{cvData.enlaces}</span>
                    </div>
                  )}
                  {!cvData.telefono && !cvData.email && !cvData.direccion && 
                   !cvData.fechaNacimiento && !cvData.nacionalidad && 
                   !cvData.estadoCivil && !cvData.enlaces && (
                    <p className="text-gray-400 italic">No hay información de contacto</p>
                  )}
                </div>
              </div>
              
              {/* Síntesis */}
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-2">Síntesis Profesional</h2>
                {cvData.sintesis ? (
                  <p className="text-gray-700">{cvData.sintesis}</p>
                ) : (
                  <p className="text-gray-400 italic">No hay síntesis profesional</p>
                )}
              </div>
              
              {/* Experiencia */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-2">Experiencia</h2>
                {cvData.experiencia.length === 0 ? (
                  <p className="text-gray-400 italic">No hay experiencias laborales</p>
                ) : (
                  cvData.experiencia.map((exp, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between">
                        <h3 className="font-semibold text-gray-800">{exp.puesto || "(Puesto no especificado)"}</h3>
                        {exp.periodo && <span className="text-sm text-gray-500">{exp.periodo}</span>}
                      </div>
                      <ul className="list-disc list-inside text-gray-700 pl-2 space-y-1">
                        {exp.descripcion.length === 0 ? (
                          <li className="text-gray-400 italic">Sin descripciones</li>
                        ) : (
                          exp.descripcion.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))
                        )}
                      </ul>
                    </div>
                  ))
                )}
              </div>
              
              {/* Estudios */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-2">Estudios</h2>
                {cvData.estudios.length === 0 ? (
                  <p className="text-gray-400 italic">No hay estudios registrados</p>
                ) : (
                  cvData.estudios.map((est, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between">
                        <h3 className="font-semibold text-gray-800">{est.titulo || "(Título no especificado)"}</h3>
                        {est.periodo && <span className="text-sm text-gray-500">{est.periodo}</span>}
                      </div>
                      {est.institucion && <p className="text-gray-700">{est.institucion}</p>}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Botón para convertir a PDF */}
        <div className="mt-8 flex justify-center">
          <button 
            onClick={handleConvertToPDF}
            className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition"
          >
            <FaFilePdf /> Generar PDF
          </button>
        </div>
      </div>
 </div>
);
}