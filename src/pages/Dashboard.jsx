import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const { data } = await axios.get('http://localhost:5000/api/admin/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStats(data.data);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('adminToken');
          navigate('/login');
        } else {
          setError(err.response?.data?.message || 'Failed to fetch dashboard data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [navigate]);

  if (loading) return (
    <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 flex justify-center items-center h-64 ">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  if (error) return (
    <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
        <p className="font-bold">Error</p>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Reload Page
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 md:p-6  ">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 md:mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 md:p-6 rounded-xl shadow-lg text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm opacity-80">Total Retailers</p>
              <p className="text-2xl md:text-3xl font-bold mt-2">{stats?.totalRetailers || 0}</p>
            </div>
            <div className="bg-white/20 p-2 md:p-3 rounded-full">
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <p className="text-xs mt-3 md:mt-4 opacity-80">All registered retailers</p>
        </div>
        
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-4 md:p-6 rounded-xl shadow-lg text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm opacity-80">Pending Retailers</p>
              <p className="text-2xl md:text-3xl font-bold mt-2">{stats?.pendingRetailers || 0}</p>
            </div>
            <div className="bg-white/20 p-2 md:p-3 rounded-full">
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-xs mt-3 md:mt-4 opacity-80">Awaiting approval</p>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 md:p-6 rounded-xl shadow-lg text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm opacity-80">Approved Retailers</p>
              <p className="text-2xl md:text-3xl font-bold mt-2">{stats?.approvedRetailers || 0}</p>
            </div>
            <div className="bg-white/20 p-2 md:p-3 rounded-full">
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-xs mt-3 md:mt-4 opacity-80">Active retailers</p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="bg-indigo-100 p-2 rounded-full mr-3 md:mr-4">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm md:text-base font-medium text-gray-800">System updated to v2.1</p>
              <p className="text-xs md:text-sm text-gray-500">New features added</p>
              <p className="text-xs text-gray-400 mt-1">Today, 10:42 AM</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-indigo-100 p-2 rounded-full mr-3 md:mr-4">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm md:text-base font-medium text-gray-800">New retailer registration</p>
              <p className="text-xs md:text-sm text-gray-500">John Doe submitted application</p>
              <p className="text-xs text-gray-400 mt-1">Yesterday, 2:30 PM</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-indigo-100 p-2 rounded-full mr-3 md:mr-4">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm md:text-base font-medium text-gray-800">System maintenance</p>
              <p className="text-xs md:text-sm text-gray-500">Scheduled database backup</p>
              <p className="text-xs text-gray-400 mt-1">2 days ago, 11:00 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}