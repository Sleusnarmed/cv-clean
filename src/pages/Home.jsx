import React from "react";
import { FiCheck, FiUser, FiFileText, FiLogIn, FiUserPlus } from "react-icons/fi";
import { Link } from "react-router";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header con logo y texto */}
      <header className="bg-[#1a2d6b] py-5 px-4 sm:px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between border-b border-blue-800 gap-4">
        <div className="flex items-center space-x-3">
          <img 
            src="https://i.postimg.cc/d3Z1C30p/loCVHOME.png" 
            alt="CVClean Logo" 
            className="h-10"
          />
          <span className="text-white font-bold text-2xl">CVClean</span>
        </div>
        <div className="flex items-center space-x-4 sm:space-x-6">
          <Link 
            to="/login" 
            className="text-white hover:text-blue-200 flex items-center space-x-1 transition-colors duration-200 text-sm sm:text-base"
          >
            <FiLogIn className="text-lg" />
            <span className="hidden sm:inline">Iniciar Sesión</span>
          </Link>
          <Link 
            to="/registro" 
            className="bg-white text-[#1a2d6b] px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md flex items-center space-x-1 text-sm sm:text-base"
          >
            <FiUserPlus className="text-lg" />
            <span className="hidden sm:inline">Registrarse</span>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Left Content */}
            <div className="lg:w-1/2 space-y-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
                Crea el <span className="text-blue-600">currículum</span>{" "}
                <span className="text-blue-600">perfecto</span> en minutos
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Diseña tu CV de forma fácil y profesional con nuestras herramientas avanzadas. ¡Prepárate para destacar entre la competencia!
              </p>
              
              <div className="pt-2 flex justify-start">
                <Link 
                  to="/login"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Comenzar Ahora
                </Link>
              </div>

              <div className="space-y-4 pt-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-2 rounded-full mt-0.5">
                    <FiCheck className="text-blue-600 text-lg" />
                  </div>
                  <span className="text-gray-700">Plantillas profesionales diseñadas por expertos en reclutamiento</span>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-2 rounded-full mt-0.5">
                    <FiFileText className="text-blue-600 text-lg" />
                  </div>
                  <span className="text-gray-700">Exportación en PDF</span>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-2 rounded-full mt-0.5">
                    <FiUser className="text-blue-600 text-lg" />
                  </div>
                  <span className="text-gray-700">Asesoramiento personalizado con IA</span>
                </div>
              </div>
            </div>

            {/* Right Image - Actualizada */}
            <div className="lg:w-1/2 flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl opacity-20 blur-lg"></div>
                <div className="relative bg-white p-1 rounded-xl shadow-2xl border border-gray-100 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                  <img
                    src="https://activacv.com/wp-content/uploads/2024/12/plantilla-curriculum-gratis-logrono.webp"
                    alt="Ejemplo de currículum profesional"
                    className="rounded-lg border border-gray-200 w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer con slogan */}
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

export default Home;