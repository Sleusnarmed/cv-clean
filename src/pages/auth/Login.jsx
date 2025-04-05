export default function Login() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-1000 to-indigo-800 flex items-center justify-center py-12 px-6 sm:px-8">
      <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-lg text-center">
        {/* 1. Logo */}
        <div className="flex justify-center mb-6">
          <img
            className="h-16 w-auto"
            src="https://i.postimg.cc/QdmXH1bV/logoCV.png"
            alt="Logo CVClean"
          />
        </div>

        {/* 2. Título */}
        <h2 className="text-2xl font-extrabold text-gray-900 mb-6">
          Inicia sesión en tu cuenta
        </h2>

        {/* 3. Formulario */}
        <form className="space-y-4 text-left">
          {/* 3.1 Correo electrónico */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              className="block w-full px-4 py-2 text-gray-900 rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none sm:text-sm"
              required
            />
          </div>

          {/* 3.2 Contraseña */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              className="block w-full px-4 py-2 text-gray-900 rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none sm:text-sm"
              required
            />
          </div>

          {/* 3.3 ¿Olvidaste tu contraseña? */}
          <div className="text-right">
            <a href="#" className="text-xs text-indigo-600 hover:text-indigo-500">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          {/* 3.4 Botón Iniciar sesión */}
          <button
            type="submit"
            className="w-full py-2 px-4 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Iniciar sesión
          </button>
        </form>

        {/* 4. Separador "O" */}
        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-3 text-sm text-gray-500">O</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* 5. Continuar con Google */}
        <button
          className="w-full max-w-xs mx-auto mb-6 flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <img
            src="https://th.bing.com/th/id/OIP.CKotJtDeqttVnWArF1l3QQHaHl?rs=1&pid=ImgDetMain"
            alt="Google Logo"
            className="h-5 w-5 mr-2"
          />
          Continuar con Google
        </button>

        {/* 6. Línea separación */}
        <div className="border-t border-gray-200 my-4"></div>

        {/* 7. Registro */}
        <div className="mt-4">
          <p className="text-sm text-gray-500">
            ¿No tienes una cuenta?
          </p>
          <button
            className="mt-2 text-sm font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Regístrate gratis
          </button>
        </div>
      </div>
    </div>
  );
}