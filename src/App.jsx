import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import JobBoard from './pages/JobBoard';
import News from './pages/News';
import Messaging from './pages/Messaging';
import Chatbot from './pages/Chatbot';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <Header />
      <main style={{ paddingTop: '1rem' }}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />

          {/* Protected routes — require JWT token */}
          <Route path="/feed"     element={<PrivateRoute><Feed /></PrivateRoute>} />
          <Route path="/profile"  element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/jobs"     element={<PrivateRoute><JobBoard /></PrivateRoute>} />
          <Route path="/news"     element={<PrivateRoute><News /></PrivateRoute>} />
          <Route path="/messages" element={<PrivateRoute><Messaging /></PrivateRoute>} />
          <Route path="/chatbot"  element={<PrivateRoute><Chatbot /></PrivateRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;