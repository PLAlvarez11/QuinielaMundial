import { useState } from 'react';
import LeagueList from './LeagueList';
import LeagueForm from './LeagueForm';
import LeagueDetails from './LeagueDetails';
import './main.css';

export default function M2LeagueManagementMain() {
  const [currentView, setCurrentView] = useState('list'); // 'list', 'create', 'details'
  const [selectedLeague, setSelectedLeague] = useState(null);

  const handleSelectLeague = (league) => {
    setSelectedLeague(league);
    setCurrentView('details');
  };

  const handleCreateNew = () => {
    setSelectedLeague(null);
    setCurrentView('create');
  };

  const handleFormSuccess = (league) => {
    setSelectedLeague(league);
    setCurrentView('details');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedLeague(null);
  };

  const handleEditLeague = () => {
    setCurrentView('create');
  };

  return (
    <div className="m2-league-management">
      <div className="m2-header">
        <h1>Gestión de Ligas</h1>
        <p className="m2-subtitle">
          Crea, administra y participa en ligas de predicciones
        </p>
      </div>

      <div className="m2-content">
        {currentView === 'list' && (
          <LeagueList
            onSelectLeague={handleSelectLeague}
            onCreateNew={handleCreateNew}
          />
        )}

        {currentView === 'create' && (
          <LeagueForm
            league={selectedLeague}
            onSuccess={handleFormSuccess}
            onCancel={handleBackToList}
          />
        )}

        {currentView === 'details' && selectedLeague && (
          <LeagueDetails
            league={selectedLeague}
            onEdit={handleEditLeague}
            onBack={handleBackToList}
          />
        )}
      </div>
    </div>
  );
}
