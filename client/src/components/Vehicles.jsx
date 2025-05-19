import { FaCar, FaEdit, FaTrash, FaSearch, FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import Navbar from './Navbar';
import { getVehicles, updateVehicle, deleteVehicle } from '../services/api';
import ErrorMessage from '../utils/error-msg';
import { sanitizeSearchInput, sanitizeSearchQuery } from '../utils/sanitization';

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  const [search, setSearch] = useState('');
  const [editVehicle, setEditVehicle] = useState(null);
  const [errors, setErrors] = useState({ api: '' });

  const fetchVehicles = useCallback(async (query = '') => {
    try {
      const { sanitized, isValid } = sanitizeSearchQuery(query);
      if (!isValid && query) {
        toast.error('Invalid search query');
        return;
      }
      const { data, pagination: pag } = await getVehicles({
        page: pagination.page,
        limit: pagination.limit,
        search: sanitized,
      });
      setVehicles(data || []);
      setPagination(pag || { page: 1, limit: 10, total: 0, pages: 1 });
      setErrors({ api: '' });
      if (!data?.length && sanitized) {
        toast.info('No vehicles found for your search');
      }
    } catch (error) {
      setErrors({ api: error.response?.data?.error || 'Failed to load vehicles' });
      setPagination({ page: 1, limit: 10, total: 0, pages: 1 });
      setVehicles([]);
    }
  }, [pagination.page, pagination.limit]);

  useEffect(() => {
    let isMounted = true;
    const timeout = setTimeout(() => {
      if (isMounted) fetchVehicles(search);
    }, 300);
    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, [fetchVehicles, search]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const clearSearch = () => {
    setSearch('');
    fetchVehicles('');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateVehicle(editVehicle.id, {
        plateNumber: sanitizeSearchInput(editVehicle.plateNumber),
        vehicleType: editVehicle.vehicleType,
        size: editVehicle.size,
        otherAttributes: editVehicle.otherAttributes,
      });
      setEditVehicle(null);
      setErrors({ api: '' });
      fetchVehicles(search);
      toast.success('Vehicle updated successfully');
    } catch (error) {
      setErrors({ api: error.response?.data?.error || 'Failed to update vehicle' });
      toast.error(error.response?.data?.error || 'Failed to update vehicle');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete vehicle?')) {
      try {
        await deleteVehicle(id);
        setErrors({ api: '' });
        fetchVehicles(search);
        toast.success('Vehicle deleted successfully');
      } catch (error) {
        setErrors({ api: error.response?.data?.error || 'Failed to delete vehicle' });
        toast.error(error.response?.data?.error || 'Failed to delete vehicle');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 border-b border-gray-200 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <FaCar className="text-green-600 mr-3" />
                Vehicle Management
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                View and manage all registered vehicles
              </p>
            </div>
            <div className="relative w-full sm:w-64 flex items-center">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search vehicles..."
                value={search}
                onChange={handleSearch}
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
              {search && (
                <button
                  onClick={clearSearch}
                  className="absolute right-0 inset-y-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </div>
        </div>

        <ErrorMessage message={errors.api} />

        <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
          {vehicles.length === 0 ? (
            <div className="px-4 py-12 text-center">
              <p className="text-gray-500">No vehicles found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plate Number
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Size
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {vehicles.map((v) => (
                    <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {v.plateNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                        {v.vehicleType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                        {v.size}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setEditVehicle(v)}
                          className="text-green-600 hover:text-green-900 mr-4 inline-flex items-center"
                        >
                          <FaEdit className="mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(v.id)}
                          className="text-red-600 hover:text-red-900 inline-flex items-center"
                        >
                          <FaTrash className="mr-1" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-6 px-4">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setPagination({ ...pagination, page: Math.max(1, pagination.page - 1) })}
              disabled={pagination.page === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPagination({ ...pagination, page: Math.min(pagination.pages, pagination.page + 1) })}
              disabled={pagination.page === pagination.pages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span>{' '}
                of <span className="font-medium">{pagination.total}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setPagination({ ...pagination, page: Math.max(1, pagination.page - 1) })}
                  disabled={pagination.page === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Previous</span>
                  <FaChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setPagination({ ...pagination, page: Math.min(pagination.pages, pagination.page + 1) })}
                  disabled={pagination.page === pagination.pages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Next</span>
                  <FaChevronRight className="h-4 w-4" />
                </button>
              </nav>
            </div>
          </div>
        </div>

        {editVehicle && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-md mx-4">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <FaEdit className="text-green-600 mr-2" />
                  Edit Vehicle
                </h2>
              </div>
              <form onSubmit={handleUpdate} className="px-6 py-4 space-y-4">
                <div>
                  <label htmlFor="plateNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Plate Number
                  </label>
                  <input
                    type="text"
                    id="plateNumber"
                    value={editVehicle.plateNumber}
                    onChange={(e) => setEditVehicle({ ...editVehicle, plateNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700 mb-1">
                    Vehicle Type
                  </label>
                  <select
                    id="vehicleType"
                    value={editVehicle.vehicleType}
                    onChange={(e) => setEditVehicle({ ...editVehicle, vehicleType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="car">Car</option>
                    <option value="truck">Truck</option>
                    <option value="motorcycle">Motorcycle</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">
                    Size
                  </label>
                  <select
                    id="size"
                    value={editVehicle.size}
                    onChange={(e) => setEditVehicle({ ...editVehicle, size: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditVehicle(null)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}