import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AppLayout from './components/AppLayout';
import ConversationsPage from './pages/ConversationsPage';
import ConversationPage from './pages/ConversationPage';

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center healthcare-gradient">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-200 border-t-teal-600"></div>
          <p className="text-sm text-neutral-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={!isAuthenticated ? <LandingPage /> : <Navigate to="/app" />} />
      <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/app" />} />
      <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/app" />} />
      <Route
        path="/app"
        element={isAuthenticated ? <AppLayout /> : <Navigate to="/login" />}
      >
        <Route index element={<Navigate to="/app/conversations" />} />
        <Route path="conversations" element={<ConversationsPage />} />
        <Route path="conversations/:id" element={<ConversationPage />} />
      </Route>
      <Route path="*" element={<Navigate to={isAuthenticated ? "/app" : "/"} />} />
    </Routes>
  );
}

export default App;
