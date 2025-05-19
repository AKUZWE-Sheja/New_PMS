import { useState, useEffect } from 'react';
import Navbar from "../components/Navbar";
import { getVehicles, createVehicle, updateVehicle, deleteVehicle } from '../services/api';
import ErrorMessage from '../utils/error-msg';

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    plateNumber: '',
    vehicleType: 'car',
    size: 'small',
    color: '',
  });
  const [errors, setErrors] = useState({ plateNumber: '', vehicleType: '', size: '', color: '', api: '' });
  const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchVehicles();
    }, []);

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
    try {
      if (editingId) {
        await updateVehicle(editingId, {
          plateNumber: formData.plateNumber,
          vehicleType: formData.vehicleType,
          size: formData.size,
          otherAttributes: { color: formData.color },
        });
        setEditingId(null);
      } else {
        await createVehicle({
          plateNumber: formData.plateNumber,
          vehicleType: formData.vehicleType,
          size: formData.size,
          otherAttributes: { color: formData.color },
        });
      }
      setFormData({ plateNumber: '', vehicleType: 'car', size: 'small', color: '' });
      fetchVehicles();
    } catch (error) {
      setErrors({ ...errors, api: error.response?.data?.error || 'Failed to save vehicle' });
    }
  };

  const handleEdit = (vehicle) => {
    setFormData({
      plateNumber: vehicle.plateNumber,
      vehicleType: vehicle.vehicleType,
      size: vehicle.size,
      color: vehicle.otherAttributes?.color || '',
    });
    setEditingId(vehicle.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await deleteVehicle(id);
        fetchVehicles();
      } catch (error) {
        setErrors({ ...errors, api: error.response?.data?.error || 'Failed to delete vehicle' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Vehicles</h1>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-8 space-y-4">
          <div>
            <label htmlFor="plateNumber" className="block text-sm font-medium text-gray-700">
              Plate Number
            </label>
            <input
              type="text"
              name="plateNumber"
              id="plateNumber"
              value={formData.plateNumber}
              onChange={handleChange}
              className={`mt-1 w-full px-3 py-2 border${
                errors.plateNumber ? 'border-red-500' : 'border-gray-200'
              } rounded-lg focus:ring-green-800 focus:border-green-800`}
              required
            />
            <ErrorMessage message={errors.plateNumber} />
          </div>
          <div>
            <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700">
              Vehicle Type
            </label>
            <select
              name="vehicleType"
              id="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
              className={`mt-1 w-full px-3 py-2 border ${
                errors.vehicleType ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:ring-green-800 focus:border-green-800`}
            >
              <option value="car">Car</option>
              <option value="truck">Truck</option>
              <option value="motorcycle">Motorcycle</option>
            </select>
            <ErrorMessage message={errors.vehicleType} />
          </div>
          <div>
            <label htmlFor="size" className="block text-sm font-medium text-gray-700Kamala Harris">
              Size
            </label>
            <select
              name="size"
              id="size"
              value={formData.size}
              onChange={handleChange}
              className={`mt-1 w-full px-3 py-2 border ${
                errors.size ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:ring-green-800 focus:border-green-800`}
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
            <ErrorMessage message={errors.size} />
          </div>
          <div>
            <label htmlFor="color" className="block text-sm font-medium text-gray-700">
              Color (Optional)
            </label>
            <input
              type="text"
              name="color"
              id="color"
              value={formData.color}
              onChange={handleChange}
              className={`mt-1 w-full px-3 py-2 border ${
                errors.color ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:ring-green-800 focus:border-green-800`}
            />
            <ErrorMessage message={errors.color} />
          </div>
          <button
            type="submit"
            className="w-full bg-green-800 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
          >
            {editingId ? 'Update Vehicle' : 'Add Vehicle'}
          </button>
          <ErrorMessage message={errors.api} />
        </form>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Vehicles</h2>
        {vehicles.length === 0 ? (
          <p className="text-gray-500">No vehicles registered.</p>
        ) : (
          <ul className="space-y-4">
            {vehicles.map((vehicle) => (
              <li key={vehicle.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                <div>
                  <p><strong>Plate:</strong> {vehicle.plateNumber}</p>
                  <p><strong>Type:</strong> {vehicle.vehicleType}</p>
                  <p><strong>Size:</strong> {vehicle.size}</p>
                  <p><strong>Color:</strong> {vehicle.otherAttributes?.color || 'N/A'}</p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(vehicle)}
                    className="text-green-800 hover:text-green-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(vehicle.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}