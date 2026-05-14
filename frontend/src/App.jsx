import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import M1AuthUsers from './pages/M1AuthUsers';
import M2LeagueManagement from './pages/M2LeagueManagement';
import M3PredictionEngine from './pages/M3PredictionEngine';
import M4Scoreboard from './pages/M4Scoreboard';
import M5WorldCupAdmin from './pages/M5WorldCupAdmin';
import M6PrizeDistribution from './pages/M6PrizeDistribution';
import M7AdminPanel from './pages/M7AdminPanel';
import './App.css';

function Home() {
  return (
    <div className="home-container">
      <h1>Bienvenido a QuinielaMundial</h1>
      <p>Selecciona un módulo desde la navegación para comenzar.</p>
    </div>
  );
}

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
    <Router>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/m1-auth" element={<M1AuthUsers />} />
          <Route path="/m2-league" element={<M2LeagueManagement />} />
          <Route path="/m3-prediction" element={<M3PredictionEngine />} />
          <Route path="/m4-scoreboard" element={<M4Scoreboard />} />
          <Route path="/m5-worldcup" element={<M5WorldCupAdmin />} />
          <Route path="/m6-prize" element={<M6PrizeDistribution />} />
          <Route path="/m7-admin" element={<M7AdminPanel />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </Router>
  );
}
