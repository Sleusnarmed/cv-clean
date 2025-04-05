import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Home from './pages/Home.jsx';
import Login from './pages/auth/Login.jsx';
import Registro from './pages/auth/RegisterForm.jsx';
import Chat from './pages/cv-creation/Chat.jsx';
import Plantillas from './pages/cv-creation/Plantillas.jsx';
import Pdf from './pages/cv-creation/PDF.jsx'; // Asegúrate de que este componente exista
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
        <Route path="/pdf" element={<Pdf />} />

        {/* Puedes agregar más rutas aquí según sea necesario */}
        
      </Routes>
    </Router>
  );
}

export default App;