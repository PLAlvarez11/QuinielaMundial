import { Routes, Route, Navigate } from 'react-router-dom';

// Venues
import VenueList from '../pages/catalogo/VenueList';
import VenueCreate from '../pages/catalogo/VenueCreate';
import VenueEdit from '../pages/catalogo/VenueEdit';

// Stadiums
import StadiumList from '../pages/catalogo/StadiumList';
import StadiumCreate from '../pages/catalogo/StadiumCreate';
import StadiumEdit from '../pages/catalogo/StadiumEdit';

// Countries
import CountryList from '../pages/catalogo/CountryList';
import CountryCreate from '../pages/catalogo/CountryCreate';
import CountryEdit from '../pages/catalogo/CountryEdit';

// Tournament Stages
import TournamentStageList from '../pages/catalogo/TournamentStageList';
import TournamentStageCreate from '../pages/catalogo/TournamentStageCreate';
import TournamentStageEdit from '../pages/catalogo/TournamentStageEdit';

// Groups
import GroupList from '../pages/catalogo/GroupList';
import GroupCreate from '../pages/catalogo/GroupCreate';
import GroupEdit from '../pages/catalogo/GroupEdit';

// Group Countries
import GroupCountryList from '../pages/catalogo/GroupCountryList';
import GroupCountryCreate from '../pages/catalogo/GroupCountryCreate';
import GroupCountryEdit from '../pages/catalogo/GroupCountryEdit';

// Matches
import MatchList from '../pages/catalogo/MatchList';
import MatchCreate from '../pages/catalogo/MatchCreate';
import MatchEdit from '../pages/catalogo/MatchEdit';

export default function CatalogoRoutes() {
  return (
    <Routes>
      {/* Redirect to venues by default */}
      <Route path="/" element={<Navigate to="venues" replace />} />

      {/* Venues Routes */}
      <Route path="venues" element={<VenueList />} />
      <Route path="venues/create" element={<VenueCreate />} />
      <Route path="venues/edit/:id" element={<VenueEdit />} />

      {/* Stadiums Routes */}
      <Route path="stadiums" element={<StadiumList />} />
      <Route path="stadiums/create" element={<StadiumCreate />} />
      <Route path="stadiums/edit/:id" element={<StadiumEdit />} />

      {/* Countries Routes */}
      <Route path="countries" element={<CountryList />} />
      <Route path="countries/create" element={<CountryCreate />} />
      <Route path="countries/edit/:id" element={<CountryEdit />} />

      {/* Tournament Stages Routes */}
      <Route path="tournament-stages" element={<TournamentStageList />} />
      <Route path="tournament-stages/create" element={<TournamentStageCreate />} />
      <Route path="tournament-stages/edit/:id" element={<TournamentStageEdit />} />

      {/* Groups Routes */}
      <Route path="groups" element={<GroupList />} />
      <Route path="groups/create" element={<GroupCreate />} />
      <Route path="groups/edit/:id" element={<GroupEdit />} />

      {/* Group Countries Routes */}
      <Route path="group-countries" element={<GroupCountryList />} />
      <Route path="group-countries/create" element={<GroupCountryCreate />} />
      <Route path="group-countries/edit/:id" element={<GroupCountryEdit />} />

      {/* Matches Routes */}
      <Route path="matches" element={<MatchList />} />
      <Route path="matches/create" element={<MatchCreate />} />
      <Route path="matches/edit/:id" element={<MatchEdit />} />
    </Routes>
  );
}
