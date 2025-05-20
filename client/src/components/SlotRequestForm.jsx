import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './Navbar';
import { getVehicles, createSlotRequest } from '../services/api';
import ErrorMessage from '../utils/error-msg';
import { FaCar, FaCalendarAlt, FaPlus } from 'react-icons/fa';

export default function SlotRequestForm() {
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState({
    vehicleId: '',
    startTime: '',
    endTime: '',
  });
  const [errors, setErrors] = useState({ api: '' });

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const { data } = await getVehicles();
        setVehicles(data || []);
        setErrors({ api: '' });
      } catch (error) {
        setErrors({ api: error.response?.data?.error || 'Failed to load vehicles' });
        toast.error(error.response?.data?.error || 'Failed to load vehicles');
      }
    };
    fetchVehicles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createSlotRequest({
        vehicleId: parseInt(form.vehicleId),
        startTime: new Date(form.startTime).toISOString(),
        endTime: new Date(form.endTime).toISOString(),
      });
      setForm({ vehicleId: '', startTime: '', endTime: '' });
      setErrors({ api: '' });
      toast.success('Slot request created successfully');
    } catch (error) {
      setErrors({ api: error.response?.data?.error || 'Failed to create slot request' });
      toast.error(error.response?.data?.error || 'Failed to create slot request');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <FaCar className="text-green-600 mr-3" />
            Create Slot Request
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Request a parking slot for your vehicle
          </p>
        </div>

        <ErrorMessage message={errors.api} />

        <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">New Slot Request</h3>
          </div>
          <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle</label>
                <select
                  value={form.vehicleId}
                  onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  required
                >
                  <option value="">Select a vehicle</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.plateNumber} ({vehicle.vehicleType})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <input
                  type="datetime-local"
                  value={form.startTime}
                  onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                <input
                  type="datetime-local"
                  value={form.endTime}
                  onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-500 hover:bg-amber-600"
              >
                <FaPlus className="mr-2" />
                Create Slot Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}