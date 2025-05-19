import { useState, useEffect } from 'react';
import Navbar from "../components/Navbar";
import { getParkingSlots, getVehicles, createSlotRequest } from '../services/api';
import ErrorMessage from '../utils/error-msg';

export default function ParkingSlots() {
  const [slots, setSlots] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({ vehicleId: '', slotId: '' });
  const [errors, setErrors] = useState({ vehicleId: '', slotId: '', api: '' });

  useEffect(() => {
    fetchSlots();
    fetchVehicles();
  }, []);

  const fetchSlots = async () => {
    try {
      const data = await getParkingSlots();
      setSlots(data.filter(slot => slot.status === 'available'));
    } catch (error) {
      setErrors({ ...errors, api: error.response?.data?.error || 'Failed to load parking slots' });
    }
  };

  const fetchVehicles = async () => {
    try {
      const data = await getVehicles();
      setVehicles(data);
    } catch (error) {
      setErrors({ ...errors, api: error.response?.data?.error || 'Failed to load vehicles' });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '', api: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.vehicleId || !formData.slotId) {
      setErrors({
        vehicleId: formData.vehicleId ? '' : 'Please select a vehicle',
        slotId: formData.slotId ? '' : 'Please select a slot',
        api: '',
      });
      return;
    }
    try {
      await createSlotRequest({
        vehicleId: parseInt(formData.vehicleId),
        slotId: parseInt(formData.slotId),
      });
      setFormData({ vehicleId: '', slotId: '' });
      fetchSlots();
      setErrors({ ...errors, api: 'Slot request created successfully' });
    } catch (error) {
      setErrors({ ...errors, api: error.response?.data?.error || 'Failed to create slot request' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Parking Slots</h1>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-8 space-y-4">
          <div>
            <label htmlFor="vehicleId" className="block text-sm font-medium text-gray-700">
              Select Vehicle
            </label>
            <select
              name="vehicleId"
              id="vehicleId"
              value={formData.vehicleId}
              onChange={handleChange}
              className={`mt-1 w-full px-3 py-2 border ${
                errors.vehicleId ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:ring-green-800 focus:border-green-800`}
            >
              <option value="">Select a vehicle</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.plateNumber} ({vehicle.vehicleType})
                </option>
              ))}
            </select>
            <ErrorMessage message={errors.vehicleId} />
          </div>
          <div>
            <label htmlFor="slotId" className="block text-sm font-medium text-gray-700">
              Select Parking Slot
            </label>
            <select
              name="slotId"
              id="slotId"
              value={formData.slotId}
              onChange={handleChange}
              className={`mt-1 w-full px-3 py-2 border ${
                errors.slotId ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:ring-green-800 focus:border-green-800`}
            >
              <option value="">Select a slot</option>
              {slots.map((slot) => (
                <option key={slot.id} value={slot.id}>
                  {slot.slotNumber} ({slot.size}, {slot.location})
                </option>
              ))}
            </select>
            <ErrorMessage message={errors.slotId} />
          </div>
          <button
            type="submit"
            className="w-full bg-green-800 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
          >
            Request Slot
          </button>
          <ErrorMessage message={errors.api} />
        </form>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Available Parking Slots</h2>
        {slots.length === 0 ? (
          <p className="text-gray-500">No available parking slots.</p>
        ) : (
          <ul className="space-y-4">
            {slots.map((slot) => (
              <li key={slot.id} className="bg-white p-4 rounded-lg shadow">
                <p><strong>Slot:</strong> {slot.slotNumber}</p>
                <p><strong>Size:</strong> {slot.size}</p>
                <p><strong>Vehicle Type:</strong> {slot.vehicleType}</p>
                <p><strong>Location:</strong> {slot.location}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}