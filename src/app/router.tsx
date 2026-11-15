import React from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { WorkoutPlayerPage } from '../features/timer/WorkoutPlayerPage';
import { ExercisesPage } from '../features/exercises/ExercisesPage';
import { WorkoutsPage } from '../features/workouts/WorkoutsPage';
import { WeeklyProgramPage } from '../features/weekly/WeeklyProgramPage';
import { WorkoutBuilderPage } from '../features/builder/WorkoutBuilderPage';
import { SettingsPage } from '../features/settings/SettingsPage';

export const AppRouter: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="weekly" element={<WeeklyProgramPage />} />
          <Route path="player" element={<WorkoutPlayerPage />} />
          <Route path="workouts" element={<WorkoutsPage />} />
          <Route path="exercises" element={<ExercisesPage />} />
          <Route path="builder" element={<WorkoutBuilderPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};
