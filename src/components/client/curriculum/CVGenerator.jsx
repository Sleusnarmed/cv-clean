import { useState, useEffect, useRef } from 'react';
import { startCVSession, sendCVMessage, generatePDF } from '../../../services/api/api.jsx';
import PDFPreview from '../../server/pdfGenerator/pdfPreview.jsx';

const CVGenerator = () => {
  const [sessionId, setSessionId] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('active'); // Start as active by default
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize the CV session automatically
  useEffect(() => {
    const initializeSession = async () => {
      try {
        setIsLoading(true);
        const response = await startCVSession();
        console.log('API Response:', response);
        
        const session_id = response.session_id || response.sessionId;
        const message = response.message || response.initial_message;
        
        if (!session_id || !message) {
          throw new Error('Invalid response format');
        }
        
        setSessionId(session_id);
        setConversation([{ role: 'assistant', content: message }]);
      } catch (error) {
        console.error('Error starting session:', error);
        setConversation([{
          role: 'assistant',
          content: 'Failed to initialize CV session. Please refresh the page.'
        }]);
      } finally {
        setIsLoading(false);
      }
    };

    initializeSession();
  }, []); // Empty dependency array means this runs once on mount

  // Send message to backend
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    try {
      setIsLoading(true);
      // Add user message
      const userMessage = { role: 'user', content: input };
      setConversation(prev => [...prev, userMessage]);
      setInput('');
      
      // Get AI response
      const { message, status: newStatus } = await sendCVMessage(sessionId, input);
      setConversation(prev => [...prev, { role: 'assistant', content: message }]);
      setStatus(newStatus);
    } catch (error) {
      console.error('Error sending message:', error);
      setConversation(prev => [...prev, { 
        role: 'assistant', 
        content: 'Error processing your message. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate PDF when CV is complete
  const handleGeneratePDF = async () => {
    try {
      setIsLoading(true);
      const pdfBlob = await generatePDF(sessionId);
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setConversation(prev => [...prev, { 
        role: 'assistant', 
        content: 'Failed to generate PDF. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-blue-600">AI CV Generator</h1>
          <p className="text-gray-600 mt-2">
            The assistant will guide you through creating your CV
          </p>
        </header>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Conversation Panel */}
          <div className="p-6 border-b">
            <div className="h-96 overflow-y-auto mb-4 space-y-4">
              {conversation.length === 0 && isLoading ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Initializing CV assistant...</p>
                </div>
              ) : (
                conversation.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-3/4 rounded-lg px-4 py-2 ${
                        msg.role === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area - Always visible except when generating PDF */}
            {status !== 'completed' && (
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-1 border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type your response..."
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send'}
                </button>
              </div>
            )}

            {/* Completion Actions */}
            {status === 'completed' && (
              <div className="flex justify-center">
                <button
                  onClick={handleGeneratePDF}
                  className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
                  disabled={isLoading}
                >
                  {isLoading ? 'Generating...' : 'Download PDF'}
                </button>
              </div>
            )}
          </div>

          {/* PDF Preview */}
          {pdfUrl && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Your CV Preview</h2>
              <PDFPreview pdfUrl={pdfUrl} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CVGenerator;