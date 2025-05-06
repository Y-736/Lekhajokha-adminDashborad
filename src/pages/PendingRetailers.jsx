import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function PendingRetailers() {
  const [retailers, setRetailers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedRetailer, setSelectedRetailer] = useState(null);
  const [status, setStatus] = useState('Approved');
  const [notes, setNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [modalError, setModalError] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });
  const navigate = useNavigate();

  const fetchPendingRetailers = async () => {
    const token = localStorage.getItem('adminToken');
    
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get(
        'http://localhost:5000/api/admin/retailers/pending', 
        {
          params: {
            page: pagination.page,
            limit: pagination.limit
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.success) {
        setRetailers(response.data.data || []);
        setPagination(prev => ({
          ...prev,
          total: response.data.total || 0
        }));
      } else {
        setError(response.data?.message || 'No data received');
      }
    } catch (err) {
      let errorMessage = 'Failed to fetch pending retailers';
      if (err.response) {
        errorMessage = err.response.data?.message || 
                      `Server error: ${err.response.status}`;
      } else if (err.request) {
        errorMessage = 'No response from server - check your connection';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingRetailers();
  }, [navigate, pagination.page]);

  const handleStatusUpdate = async () => {
    if (!['Approved', 'Rejected'].includes(status)) {
      setModalError('Invalid status selected');
      return;
    }
    
    setUpdating(true);
    setModalError('');
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.put(
        `http://localhost:5000/api/admin/retailers/${selectedRetailer.id}/status`,
        { status, adminNotes: notes },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setShowModal(false);
        setNotes('');
        setStatus('Approved');
        await fetchPendingRetailers();
      } else {
        setModalError(response.data.message || 'Update failed');
      }
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalError('');
    setNotes('');
    setStatus('Approved');
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= Math.ceil(pagination.total / pagination.limit)) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 p-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-gray-200 h-16 rounded animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
          <div className="mt-2 space-x-2">
            <button 
              onClick={fetchPendingRetailers}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Login Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Pending Retailers</h1>
        <div className="flex items-center space-x-4">
          <span className="px-3 py-1 text-sm bg-indigo-100 text-indigo-800 rounded-full">
            {pagination.total} pending
          </span>
          <button
            onClick={fetchPendingRetailers}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {retailers.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="mt-2 text-gray-600">No pending retailers found</p>
          <button 
            onClick={fetchPendingRetailers}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Check Again
          </button>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {retailers.map((retailer) => (
                  <tr key={retailer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <span className="text-indigo-600 font-medium">
                            {retailer.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{retailer.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{retailer.business_name}</div>
                      <div className="text-sm text-gray-500">{retailer.business_type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <a href={`mailto:${retailer.email}`} className="text-indigo-600 hover:underline">
                          {retailer.email}
                        </a>
                      </div>
                      <div className="text-sm text-gray-500">{retailer.mobile}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedRetailer(retailer);
                          setShowModal(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Update Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination.total > pagination.limit && (
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-50"
              >
                Previous
              </button>
              <div className="text-sm text-gray-700">
                Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
              </div>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
                className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium mb-4">Update Status for {selectedRetailer?.name}</h3>
            {modalError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
                {modalError}
              </div>
            )}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                rows="3"
                placeholder="Optional notes about this decision..."
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCloseModal}
                disabled={updating}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                disabled={updating}
                className={`px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {updating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}