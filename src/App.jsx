import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Home from './pages/home.jsx';
import Login from './pages/auth/Login.jsx';
import Registro from './pages/auth/RegisterForm.jsx';
import Chat from './pages/cv-creation/Chat.jsx';
import Plantillas from './pages/cv-creation/Plantilla.jsx';
import CvCreado from './pages/cv-creation/CvCreado.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} /> 
        <Route path="/chat" element={<Chat />} /> 
        <Route path="/plantillas" element={<Plantillas />} /> 
        <Route path="/cvcreado/:templateId" element={<CvCreado />} />
        {/* Puedes agregar más rutas aquí según sea necesario */}
        
      </Routes>
    </Router>
  );
}

export default App;