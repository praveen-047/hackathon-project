import {Routes,Route} from "react-router-dom"
import ParticlesBackground from "./components/ParticlesBackground";
import Login from './pages/Login/index.js'
import Register from './pages/Register/index.js'
import Home from './pages/Home/index.js'
import Admin  from "./pages/Admin/index.js";
import Candidate  from "./pages/Candidate/index.js";
import ProtectedRoute from "./pages/ProtectedRoute/index.js"
import TemplatesChoose from "./pages/TemplatesChoose";
import AtsCheck from "./pages/AtsCheck";
import FormPage from "./pages/FormPage";
import NotFound from "./pages/NotFound/index.js";

import './App.css';

function App() {
  return (
    <>
      <ParticlesBackground />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
          <Route path="/candidate" element={<ProtectedRoute><Candidate /></ProtectedRoute>} />
          <Route path="/build-resume" element={<TemplatesChoose />} />
         <Route path="/FormPage" element={<FormPage />} />
         <Route path="/check-ats" element={<AtsCheck />} />
        <Route path="*" element={<NotFound />} />
        </Routes>
    </>
  );
}

export default App;
