import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CVGenerator = () => {
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('active');
  
  const startNewSession = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/cv/start/');
      setSessionId(response.data.session_id);
      setMessages([{ role: 'assistant', content: response.data.message }]);
      setStatus('active');
    } catch (error) {
      console.error('Error starting session:', error);
    }
  };
  
  const sendMessage = async () => {
    if (!input.trim() || !sessionId) return;
    
    try {
      const userMessage = { role: 'user', content: input };
      setMessages(prev => [...prev, userMessage]);
      setInput('');
      
      const response = await axios.post(
        `http://localhost:8000/api/cv/chat/${sessionId}/`,
        { message: input }
      );
      
      setMessages(prev => [...prev, { role: 'assistant', content: response.data.message }]);
      setStatus(response.data.status);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">CV Generator</h1>
      
      <div className="mb-4">
        <button 
          onClick={startNewSession}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Start New CV
        </button>
      </div>
      
      <div className="border rounded-lg p-4 mb-4 h-96 overflow-y-auto">
        {messages.map((msg, i) => (
          <div key={i} className={`mb-3 ${msg.role === 'assistant' ? 'text-blue-600' : 'text-green-600'}`}>
            <strong>{msg.role === 'assistant' ? 'Assistant' : 'You'}:</strong>
            <p className="whitespace-pre-wrap">{msg.content}</p>
          </div>
        ))}
      </div>
      
      {status === 'active' && (
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1 border rounded-l px-3 py-2"
            placeholder="Type your response..."
          />
          <button
            onClick={sendMessage}
            className="bg-green-500 text-white px-4 py-2 rounded-r"
          >
            Send
          </button>
        </div>
      )}
      
      {status === 'completed' && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h2 className="text-xl font-semibold mb-2">CV Complete!</h2>
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Download PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default CVGenerator;