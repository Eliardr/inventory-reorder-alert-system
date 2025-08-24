import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Tasks from './pages/Tasks';
import InventoryDashboard from './pages/inventory/InventoryDashboard';
import RequireAuth from './RequireAuth';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    // keep it simple; you can style this later
    return <div className="p-8 text-center">Loading…</div>;
  }

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* root: go to inventory if logged in, else login */}
        <Route path="/" element={<Navigate to={user ? '/inventory' : '/login'} replace />} />

        {/* public */}
        <Route path="/login" element={user ? <Navigate to="/inventory" replace /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/inventory" replace /> : <Register />} />

        {/* protected */}
        <Route element={<RequireAuth />}>
          <Route path="/inventory" element={<InventoryDashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/tasks" element={<Tasks />} />
        </Route>

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
