import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PendingRetailers from './pages/PendingRetailers';
import AllRetailers from './pages/AllRetailers';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check auth status on initial load
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {isLoggedIn && <Header setIsLoggedIn={setIsLoggedIn} />}
        <div className="flex">
          {isLoggedIn && <Sidebar />}
          <div className="flex-1 p-4">
            <Routes>
              <Route path="/login" element={
                !isLoggedIn ? 
                  <Login setIsLoggedIn={setIsLoggedIn} /> : 
                  <Navigate to="/dashboard" replace />
              } />
              
              <Route path="/dashboard" element={
                isLoggedIn ? 
                  <Dashboard /> : 
                  <Navigate to="/login" replace />
              } />
              
              <Route path="/pending-retailers" element={
                isLoggedIn ? 
                  <PendingRetailers /> : 
                  <Navigate to="/login" replace />
              } />
              
              <Route path="/all-retailers" element={
                isLoggedIn ? 
                  <AllRetailers /> : 
                  <Navigate to="/login" replace />
              } />
              
              {/* Default redirect */}
              <Route path="/" element={
                <Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />
              } />
              
              {/* Fallback for unknown routes */}
              <Route path="*" element={
                <Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />
              } />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;