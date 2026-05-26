import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import M1AuthUsers from './pages/M1AuthUsers';
import M3PredictionEngine from './pages/M3PredictionEngine';
import M4Scoreboard from './pages/M4Scoreboard';
import M5WorldCupAdmin from './pages/M5WorldCupAdmin';
import M6PrizeDistribution from './pages/M6PrizeDistribution';
import M7AdminPanel from './pages/M7AdminPanel';
import LeaguesRoutes from './routes/LeaguesRoutes';
import './App.css';


function NotFound() {
  return (
    <div className="not-found-container">
      <h1>404 - Página No Encontrada</h1>
      <p>La página que buscas no existe.</p>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/m1-auth" element={<M1AuthUsers />} />
            <Route path="/m2-league/*" element={<ProtectedRoute element={<LeaguesRoutes />} />} />
            <Route path="/m3-prediction" element={<ProtectedRoute element={<M3PredictionEngine />} />} />
            <Route path="/m4-scoreboard" element={<ProtectedRoute element={<M4Scoreboard />} />} />
            <Route path="/m5-worldcup/*" element={<ProtectedRoute element={<M5WorldCupAdmin />} />} />
            <Route path="/catalogo/*" element={<ProtectedRoute element={<M5WorldCupAdmin />} />} />
            <Route path="/prizes/*" element={<ProtectedRoute element={<M6PrizeDistribution />} />} />
            {/* <Route path="/m7-admin" element={<ProtectedRoute element={<M7AdminPanel />} />} /> */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}
