import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const Chat = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userId] = useState(() => `user_${Math.random().toString(36).substr(2, 9)}`);
  const [cvProgress, setCvProgress] = useState({ 
    percentage: 0, 
    completedFields: 0, 
    totalFields: 4,
    hasCompleteData: false
  });
  const [cvData, setCvData] = useState({
    personal: {},
    education: [],
    experience: [],
    skills: { technical: [], soft: [] }
  });
  const messagesEndRef = useRef(null);

  // Initialize chat session
  useEffect(() => {
    const initChat = async () => {
      setIsLoading(true);
      try {
        const response = await axios.post('https://cv-generator-backend-w24b.onrender.com/api/chat/init', { userId });
        setMessages([{ sender: 'ai', text: response.data.message }]);
        if (response.data.cvProgress) {
          setCvProgress(response.data.cvProgress);
        }
      } catch (error) {
        console.error('Error initializing chat:', error);
        setMessages([{ 
          sender: 'ai', 
          text: "¡Hola! Soy tu asistente para crear CV's. Vamos a comenzar." 
        }]);
      }
      setIsLoading(false);
    };
    
    initChat();
  }, [userId]);

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '' || isLoading) return;

    // Add user message to UI immediately
    const userMessage = { sender: 'user', text: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Send message to backend
      const response = await axios.post('https://cv-generator-backend-w24b.onrender.com/api/chat/send', {
        userId,
        message: inputMessage
      });

      // Update CV data if available
      if (response.data.cvData) {
        setCvData(response.data.cvData);
      }

      // Update progress
      if (response.data.progress) {
        setCvProgress(response.data.progress);
      }

      // Add AI response to UI
      setMessages(prev => [...prev, { 
        sender: 'ai', 
        text: response.data.message,
        cvData: response.data.cvData
      }]);

      // Suggest download if CV is complete
      if (response.data.progress?.hasCompleteData) {
        setMessages(prev => [...prev, {
          sender: 'ai',
          text: "¡Tu CV está completo! ¿Quieres descargarlo ahora? Usa el botón en el panel lateral."
        }]);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { 
        sender: 'ai', 
        text: error.response?.data?.error || "Hubo un error. Por favor, inténtalo de nuevo."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSendMessage();
    }
  };

  // Check CV completion status periodically
  useEffect(() => {
    const checkCVStatus = async () => {
      try {
        const response = await axios.get(`https://cv-generator-backend-w24b.onrender.com/api/chat/status/${userId}`);
        if (response.data) {
          setCvProgress(prev => ({
            ...prev,
            hasCompleteData: response.data.hasCompleteData,
            percentage: response.data.cvProgress?.percentage || prev.percentage,
            completedFields: response.data.cvProgress?.completedFields || prev.completedFields
          }));
        }
      } catch (error) {
        console.error('Error checking CV status:', error);
      }
    };

    const interval = setInterval(checkCVStatus, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, [userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Function to generate PDF
  const handleGeneratePDF = async () => {
    if (!cvProgress.hasCompleteData) {
      setMessages(prev => [...prev, {
        sender: 'ai',
        text: "Por favor completa toda la información requerida antes de generar el PDF."
      }]);
      return;
    }
    try {
      setIsLoading(true);
      const response = await axios.get(`https://cv-generator-backend-w24b.onrender.com/api/cv/${userId}/pdf`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `CV_${cvData.personal.name || 'mi_cv'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error generating PDF:', error);
      let errorMessage = 'Error al generar el PDF';
      
      if (error.response?.data?.missingFields) {
        const missing = Object.entries(error.response.data.missingFields)
          .filter(([_, value]) => value)
          .map(([key]) => key);
        
        errorMessage = `Faltan campos obligatorios: ${missing.join(', ')}`;
      }
      
      setMessages(prev => [...prev, { 
        sender: 'ai', 
        text: errorMessage 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Progress bar component
  const ProgressBar = ({ percentage }) => (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div 
        className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" 
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Side Panel */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static`}>
        <div className="flex flex-col h-full p-4 border-r border-gray-200">
          <div className="mb-6 p-2">
            <h2 className="text-lg font-semibold text-gray-800">Progreso del CV</h2>
            <div className="mt-2 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {cvProgress.completedFields}/{cvProgress.totalFields} secciones
                </span>
                <span className="font-medium text-indigo-600">
                  {cvProgress.percentage}%
                </span>
              </div>
              <ProgressBar percentage={cvProgress.percentage} />
            </div>
          </div>

          <nav className="flex-1 space-y-1">
            <button 
              onClick={handleGeneratePDF}
              disabled={!cvProgress.hasCompleteData || isLoading}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                cvProgress.hasCompleteData && !isLoading 
                  ? 'text-indigo-700 bg-indigo-50 hover:bg-indigo-100' 
                  : 'text-gray-400 bg-gray-100 cursor-not-allowed'
              }`}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Descargar PDF
            </button>
            
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Secciones</h3>
              <div className="space-y-1">
                <div className={`px-3 py-2 text-sm rounded-lg flex items-center ${
                  cvData.personal?.name ? 'bg-green-50 text-green-800' : 'bg-gray-50 text-gray-500'
                }`}>
                  {cvData.personal?.name ? (
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  Información Personal
                </div>
                <div className={`px-3 py-2 text-sm rounded-lg flex items-center ${
                  cvData.education?.length > 0 ? 'bg-green-50 text-green-800' : 'bg-gray-50 text-gray-500'
                }`}>
                  {cvData.education?.length > 0 ? (
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  Educación
                </div>
                <div className={`px-3 py-2 text-sm rounded-lg flex items-center ${
                  cvData.experience?.length > 0 ? 'bg-green-50 text-green-800' : 'bg-gray-50 text-gray-500'
                }`}>
                  {cvData.experience?.length > 0 ? (
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  Experiencia
                </div>
                <div className={`px-3 py-2 text-sm rounded-lg flex items-center ${
                  (cvData.skills?.technical?.length > 0 || cvData.skills?.soft?.length > 0) 
                    ? 'bg-green-50 text-green-800' 
                    : 'bg-gray-50 text-gray-500'
                }`}>
                  {(cvData.skills?.technical?.length > 0 || cvData.skills?.soft?.length > 0) ? (
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  Habilidades
                </div>
              </div>
            </div>
          </nav>

          <div className="mt-auto p-2 border-t border-gray-200">
            <button 
              className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors"
              disabled={!cvProgress.hasCompleteData || isLoading}
            >
              {cvProgress.hasCompleteData ? 'Guardar CV' : 'Completa tu CV para guardar'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarOpen ? 'ml-0 lg:ml-64' : ''}`}>
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="mr-4 text-gray-500 hover:text-gray-600 lg:hidden"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-lg font-medium text-gray-800">Asistente de CV</h1>
            </div>
            <div className="lg:hidden">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                cvProgress.hasCompleteData ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {cvProgress.percentage}% completado
              </span>
            </div>
          </div>
        </header>

        {/* Conversation Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs md:max-w-md lg:max-w-lg rounded-xl px-4 py-3 ${
                  message.sender === 'user' 
                    ? 'bg-indigo-600 text-white rounded-br-none' 
                    : 'bg-white text-gray-800 shadow-xs rounded-bl-none border border-gray-200'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  {message.cvData && (
                    <div className="mt-2 pt-2 border-t border-gray-200 border-opacity-20 text-xs text-indigo-100">
                      Actualizado: {new Date().toLocaleTimeString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 shadow-xs rounded-xl rounded-bl-none border border-gray-200 px-4 py-3 max-w-xs md:max-w-md lg:max-w-lg">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="max-w-3xl mx-auto">
            <div className="relative flex items-center">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu mensaje..."
                disabled={isLoading}
                className="flex-1 border border-gray-300 rounded-full pl-5 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm shadow-sm disabled:bg-gray-100 transition-all"
              />
              <button 
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className={`absolute right-2 rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors ${
                  inputMessage.trim() && !isLoading 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              {cvProgress.hasCompleteData 
                ? '✅ Tu CV está completo. Puedes descargarlo ahora.' 
                : `ℹ️ Completa ${cvProgress.totalFields - cvProgress.completedFields} secciones más para terminar tu CV.`}
            </p>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 lg:hidden bg-black bg-opacity-50" 
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Chat;