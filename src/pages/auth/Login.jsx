import React, { useState, useEffect } from "react";
import { FiLogIn, FiUserPlus, FiArrowRight, FiMail, FiLock, FiAlertCircle } from "react-icons/fi";
import { Link, useNavigate } from "react-router";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!email || !password) {
      setError("Por favor completa todos los campos");
      return;
    }

    // Simulación de login exitoso
    console.log("Iniciando sesión con:", { email, password });
    setIsLoggedIn(true);
  };

  // Efecto para redirigir después del login
  useEffect(() => {
    if (isLoggedIn) {
      const timer = setTimeout(() => {
        navigate("/chat");
      }, 1500); // Pequeño retraso para simular procesamiento

      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header (igual que en Home.jsx) */}
      <header className="bg-[#1a2d6b] py-5 px-6 md:px-12 flex items-center justify-between border-b border-blue-800">
        <div className="flex items-center space-x-3">
            <Link to="/" className="text-white hover:text-blue-200 flex items-center space-x-1 transition-colors duration-200">

                <img 
                    src="https://i.postimg.cc/d3Z1C30p/loCVHOME.png" 
                    alt="CVClean Logo" 
                    className="h-10"
                />
                <span className="text-white font-bold text-2xl">CVClean</span>
            </Link>
        </div>
        <div className="flex items-center space-x-6">
          <Link to="/login" className="text-white hover:text-blue-200 flex items-center space-x-1 transition-colors duration-200">
            <FiLogIn className="text-lg" />
            <span>Iniciar Sesión</span>
          </Link>
          
          <Link to="/registro" className="bg-white text-[#1a2d6b] px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md flex items-center space-x-1">
            <FiUserPlus className="text-lg" />
            <span>Registrarse</span>
          </Link>
        </div>
      </header>

      {/* Contenido principal del Login */}
      <main className="flex-grow flex items-center justify-center py-12 px-6">
        {isLoggedIn ? (
          <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center">
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <FiLogIn className="text-blue-600 text-2xl" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Inicio de sesión exitoso</h2>
              <p className="text-gray-600">Redirigiendo al chat...</p>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Inicia Sesión</h1>
            <p className="text-gray-600 mb-8">Ingresa para crear tu CV profesional</p>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 flex items-center">
                <FiAlertCircle className="mr-2" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 mb-2">Correo Electrónico</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Contraseña</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Recordarme
                  </label>
                </div>
                <Link to="/olvide-contrasena" className="text-sm text-blue-600 hover:text-blue-800">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center gap-2"
              >
                <FiLogIn />
                Ingresar
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link 
                to="/registro" 
                className="text-blue-600 hover:text-blue-800 inline-flex items-center"
              >
                ¿No tienes cuenta? Regístrate <FiArrowRight className="ml-1" />
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Footer (igual que en Home.jsx) */}
      <footer className="bg-white py-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <p className="text-2xl font-light text-gray-700 italic">
            "Diseños limpios, oportunidades claras, CvClean"
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Login;