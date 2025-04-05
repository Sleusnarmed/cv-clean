import { useState, useRef, useEffect } from "react";
import axios from "axios";

const Chat = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isDataComplete, setIsDataComplete] = useState(false);
  const [userId] = useState(
    () => `user_${Math.random().toString(36).substr(2, 9)}`
  );
  const messagesEndRef = useRef(null);

  // Initialize chat session and check data status periodically
  useEffect(() => {
    const initChat = async () => {
      setIsLoading(true);
      try {
        const response = await axios.post(
          "http://localhost:5000/api/chat/init",
          { userId }
        );
        setMessages([{ sender: "ai", text: response.data.message }]);
      } catch (error) {
        console.error("Error initializing chat:", error);
        setMessages([
          {
            sender: "ai",
            text: "¡Hola! Soy tu asistente para crear CV's. Vamos a comenzar.",
          },
        ]);
      }
      setIsLoading(false);
    };

    const checkDataStatus = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/chat/status/${userId}`
        );
        setIsDataComplete(response.data.hasCompleteData);
      } catch (error) {
        console.error("Error checking data status:", error);
        setIsDataComplete(false);
      }
    };

    initChat();
    
    // Check immediately and then every 5 seconds
    checkDataStatus();
    const interval = setInterval(checkDataStatus, 5000);
    return () => clearInterval(interval);
  }, [userId]);

  const handleSendMessage = async () => {
    if (inputMessage.trim() === "" || isLoading) return;

    setMessages((prev) => [...prev, { sender: "user", text: inputMessage }]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/chat/send", {
        userId,
        message: inputMessage,
      });

      const aiResponse = formatAIResponse(response.data.message);
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      let errorMessage =
        "Parece que hubo un problema. ¿Podrías reformular tu pregunta?";

      if (error.response?.data?.error?.includes("espera")) {
        errorMessage = error.response.data.error;
      } else if (error.message.includes("429")) {
        errorMessage =
          "Estoy recibiendo muchas solicitudes. Por favor espera un minuto.";
      }

      setMessages((prev) => [...prev, { sender: "ai", text: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to format AI responses
  const formatAIResponse = (text) => {
    const formattedText = text
      .replace(/^•\s+/gm, "• ")
      .replace(/\n\s*-/g, "\n•")
      .replace(/(Technical Checklist for Improvement:)/g, "\n\n$1\n");

    return {
      sender: "ai",
      text: formattedText,
      isChecklist:
        text.includes("Checklist") || text.includes("Recomendaciones:"),
    };
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isLoading) {
      handleSendMessage();
    }
  };

  // Improved PDF generation function
  const handleGeneratePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      // First check if the AI has confirmed completion
      const hasAIConfirmation = messages.some(
        m => m.sender === "ai" && 
        (m.text.includes("suficiente") || 
        m.text.includes("completa") || 
        m.text.includes("generar"))
      );

      if (!hasAIConfirmation) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: "Por favor completa toda la información solicitada antes de generar el PDF.",
          },
        ]);
        return;
      }

      // Then check backend status
      const statusResponse = await axios.get(
        `http://localhost:5000/api/chat/status/${userId}`
      );

      if (!statusResponse.data.hasCompleteData) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: "Aún faltan datos requeridos en el sistema. Por favor completa: " + 
                  (statusResponse.data.missingFields || "información personal, educación o experiencia"),
          },
        ]);
        return;
      }

      // If both checks pass, generate PDF
      const response = await axios.get(
        `http://localhost:5000/api/cv/${userId}/pdf`,
        { responseType: "blob" }
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `CV_${userId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Revoke the object URL to free up memory
      setTimeout(() => window.URL.revokeObjectURL(url), 100);
    } catch (error) {
      console.error("PDF Generation Error:", error);
      let errorMessage = "Error al generar el PDF. ";
      
      if (error.response?.status === 400) {
        errorMessage += error.response.data?.error || "Faltan datos requeridos.";
      } else if (error.response?.status === 500) {
        errorMessage += "Error en el servidor. Intenta nuevamente.";
      } else {
        errorMessage += "Por favor verifica tu conexión e intenta nuevamente.";
      }

      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: errorMessage }
      ]);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Side Panel */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static`}
      >
        <div className="flex flex-col h-full p-4 border-r border-gray-200">
          <div className="mb-6 p-2">
            <h2 className="text-lg font-semibold text-gray-800">
              Opciones del CV
            </h2>
            {!isDataComplete && (
              <p className="text-xs text-yellow-600 mt-1">
                Completa toda la información para generar el PDF
              </p>
            )}
          </div>
          <nav className="flex-1 space-y-1">
            <button
              onClick={handleGeneratePDF}
              disabled={isGeneratingPDF}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isGeneratingPDF
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
              }`}
              title={
                isDataComplete 
                  ? "Generar tu CV en PDF" 
                  : "Completa toda la información primero"
              }
            >
              {isGeneratingPDF ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Generando...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    ></path>
                  </svg>
                  {isDataComplete ? "Descargar PDF" : "Generar PDF"}
                </>
              )}
            </button>
            <a
              href="#"
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-indigo-600 transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                ></path>
              </svg>
              Trabajos Guardados
            </a>
            <a
              href="#"
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-indigo-600 transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              Ayuda CV
            </a>
          </nav>
          <div className="mt-auto p-2 border-t border-gray-200">
            <button className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
              <svg
                className="w-5 h-5 mr-2 inline"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                ></path>
              </svg>
              Guardar progreso
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
          sidebarOpen ? "ml-0 lg:ml-64" : ""
        }`}
      >
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="flex items-center px-4 py-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="mr-4 text-gray-500 hover:text-gray-600 lg:hidden"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
            <h1 className="text-lg font-medium text-gray-800">Háblame de ti</h1>
          </div>
        </header>

        {/* Conversation Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs md:max-w-md lg:max-w-lg rounded-xl px-4 py-3 transition-all ${
                    message.sender === "user"
                      ? "bg-indigo-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 shadow-xs rounded-bl-none border border-gray-200"
                  }`}
                >
                  {message.isChecklist ? (
                    <div className="text-sm space-y-2">
                      {message.text.split("\n").map((line, i) =>
                        line.startsWith("•") ? (
                          <div key={i} className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>{line.substring(1).trim()}</span>
                          </div>
                        ) : (
                          <p key={i} className={i > 0 ? "mt-3" : ""}>
                            {line}
                          </p>
                        )
                      )}
                    </div>
                  ) : (
                    <p className="text-sm">{message.text}</p>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 shadow-xs rounded-xl rounded-bl-none border border-gray-200 px-4 py-3 max-w-xs md:max-w-md lg:max-w-lg">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                    <div
                      className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
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
                className="flex-1 border border-gray-300 rounded-full pl-5 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm shadow-sm disabled:bg-gray-100 transition-colors"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className={`absolute right-2 rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors ${
                  inputMessage.trim() && !isLoading
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  ></path>
                </svg>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              La IA puede cometer errores. Verifica la información importante.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 lg:hidden bg-black bg-opacity-50 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Chat;