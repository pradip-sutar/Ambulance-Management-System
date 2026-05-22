import { BrowserRouter, Routes, Route } from "react-router-dom";

import AboutPage from "./pages/about.jsx";
import LoginPage from "./pages/login.jsx";
import RegisterPage from "./pages/register.jsx";
import  PrivacyPolicyPage from "./pages/privacy-policy.jsx";
import AdminPage from "./pages/adminlayout.jsx";  
import ReportPage from "./pages/admin-report.jsx";
import DriverPage from "./pages/driverlayout.jsx";
import Home from "./pages/homepage.jsx";
import ServicesPage from "./pages/service.jsx";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin-report" element={<ReportPage />} />
        <Route path="/driver" element={<DriverPage/>} />
        <Route path="/services" element={<ServicesPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;