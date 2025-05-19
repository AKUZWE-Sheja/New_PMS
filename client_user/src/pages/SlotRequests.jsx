import { useState, useEffect } from 'react';
import Navbar from "../components/Navbar";
import { getSlotRequests, updateSlotRequest } from '../services/api';
import ErrorMessage from '../utils/error-msg';

export default function SlotRequests() {
  const [requests, setRequests] = useState([]);
  const [errors, setErrors] = useState({ api: '' });
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const data = await getSlotRequests();
      setRequests(data);
    } catch (error) {
      setErrors({ api: error.response?.data?.error || 'Failed to load slot requests' });
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateSlotRequest(id, { requestStatus: status });
      fetchRequests();
    } catch (error) {
      setErrors({ api: error.response?.data?.error || `Failed to ${status} request` });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Slot Requests</h1>

        <ErrorMessage message={errors.api} />

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          {user.role === 'admin' ? 'All Slot Requests' : 'Your Slot Requests'}
        </h2>
        {requests.length === 0 ? (
          <p className="text-gray-500">No slot requests.</p>
        ) : (
          <ul className="space-y-4">
            {requests.map((request) => (
              <li key={request.id} className="bg-white p-4 rounded-lg shadow">
                <p><strong>Vehicle:</strong> {request.vehicle.plateNumber}</p>
                <p><strong>Slot:</strong> {request.slotNumber || 'N/A'}</p>
                <p><strong>Status:</strong> {request.requestStatus}</p>
                {user.role === 'admin' && request.requestStatus === 'pending' && (
                  <div className="mt-2 space-x-2">
                    <button
                      onClick={() => handleUpdateStatus(request.id, 'approved')}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(request.id, 'rejected')}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}