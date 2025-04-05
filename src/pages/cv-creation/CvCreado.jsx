import React, { useState } from 'react';
import { FiUser, FiMail, FiLock, FiCheck, FiUserPlus, FiAlertCircle, FiArrowRight } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router';

export default function CvCreado() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      setLoading(true);
      // Simulación de registro (reemplazar con tu API real)
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Registro exitoso:', formData);
      navigate('/login'); // Redirige al login después del registro
    } catch (err) {
      setError('Error al registrar. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header consistente con Login */}
      <header className="bg-[#1a2d6b] py-5 px-6 md:px-12 flex items-center justify-between border-b border-blue-800">
        <Link to="/" className="flex items-center space-x-3">
          <img 
            src="https://i.postimg.cc/d3Z1C30p/loCVHOME.png" 
            alt="CVClean Logo" 
            className="h-10"
          />
          <span className="text-white font-bold text-2xl">CVClean</span>
        </Link>
        <div className="flex items-center space-x-6">
          <Link to="/login" className="text-white hover:text-blue-200 flex items-center space-x-1 transition-colors duration-200">
            <FiCheck className="text-lg" />
            <span>Iniciar Sesión</span>
          </Link>
          <Link to="/registro" className="bg-white text-[#1a2d6b] px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md flex items-center space-x-1">
            <FiUser className="text-lg" />
            <span>Registrarse</span>
          </Link>
        </div>
      </header>

      {/* Formulario de Registro */}
      <main className="flex-grow flex items-center justify-center py-12 px-6">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Regístrate</h1>
          <p className="text-gray-600 mb-8">Crea tu cuenta para comenzar</p>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 flex items-center">
              <FiAlertCircle className="mr-2" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1">Nombre completo</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tu nombre"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Correo electrónico</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="tu@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Contraseña</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                  minLength="6"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Confirmar contraseña</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400" />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                  minLength="6"
                  required
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                required
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
                Acepto los términos y condiciones
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center gap-2 ${
                loading ? "opacity-75 cursor-not-allowed" : "hover:bg-blue-700"
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creando cuenta...
                </>
              ) : (
                <>
                  <FiUserPlus />
                  Registrarse
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center">
                Inicia sesión <FiArrowRight className="ml-1" />
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer consistente */}
      <footer className="bg-white py-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <p className="text-2xl font-light text-gray-700 italic">
            "Diseños limpios, oportunidades claras, CvClean"
          </p>
        </div>
      </footer>
    </div>
  );
}