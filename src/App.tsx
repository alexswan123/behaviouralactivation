import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/shared/Layout';
import WelcomePage from './components/onboarding/WelcomePage';
import SchedulePage from './components/schedule/SchedulePage';
import CataloguePage from './components/catalogue/CataloguePage';
import ProgressPage from './components/progress/ProgressPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/catalogue" element={<CataloguePage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
