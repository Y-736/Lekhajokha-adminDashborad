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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsLoggedIn(true);
      setSidebarOpen(window.innerWidth >= 1024);
    }

    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        {isLoggedIn && (
          <div className="fixed top-0 left-0 right-0 z-20">
            <Header 
              setIsLoggedIn={setIsLoggedIn} 
              setSidebarOpen={setSidebarOpen} 
              sidebarOpen={sidebarOpen}
            />
          </div>
        )}
        <div className="flex flex-1 pt-16"> {/* pt-16 accounts for fixed header height */}
          {isLoggedIn && (
            <div className={`fixed top-16 bottom-0 z-10 ${sidebarOpen ? 'lg:w-64' : 'lg:w-0'}`}>
              <Sidebar 
                sidebarOpen={sidebarOpen} 
                setSidebarOpen={setSidebarOpen}
              />
            </div>
          )}
          <main className={`flex-1 overflow-y-auto transition-all duration-300 ${
            sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'
          }`}>
            <div className="p-4 md:p-6 mx-auto w-full max-w-[1800px]">
              <Routes>
                <Route path="/login" element={!isLoggedIn ? <Login setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" replace />} />
                <Route path="/pending-retailers" element={isLoggedIn ? <PendingRetailers /> : <Navigate to="/login" replace />} />
                <Route path="/all-retailers" element={isLoggedIn ? <AllRetailers /> : <Navigate to="/login" replace />} />
                <Route path="/" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />} />
                <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;