import { Routes, Route, Navigate } from 'react-router-dom';
import LeaguesLayout from '../pages/M2LeagueManagement/LeaguesLayout';
import LeagueList from '../pages/M2LeagueManagement/LeagueList';
import LeagueForm from '../pages/M2LeagueManagement/LeagueForm';
import LeagueDetails from '../pages/M2LeagueManagement/LeagueDetails';

export default function LeaguesRoutes() {
  return (
    <Routes>
      {/* Redirect to list by default */}
      <Route path="/" element={<Navigate to="list" replace />} />

      {/* Leagues Routes with Layout */}
      <Route element={<LeaguesLayout />}>
        <Route path="list" element={<LeagueList />} />
        <Route path="create" element={<LeagueForm />} />
        <Route path=":id" element={<LeagueDetails />} />
        <Route path=":id/edit" element={<LeagueForm />} />
      </Route>
    </Routes>
  );
}
