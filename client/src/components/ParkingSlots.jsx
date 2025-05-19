import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import Navbar from './Navbar';
import { getParkingSlots, createBulkParkingSlots, updateParkingSlot, deleteParkingSlot } from '../services/api';
import ErrorMessage from '../utils/error-msg';
import { FaParking, FaPlus, FaSearch, FaEdit, FaTrash, FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';
import { sanitizeSearchInput, sanitizeSearchQuery } from '../utils/sanitization';

export default function ParkingSlots() {
  const [slots, setSlots] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  const [search, setSearch] = useState('');
  const [slotForm, setSlotForm] = useState([]);
  const [editSlot, setEditSlot] = useState(null);
  const [errors, setErrors] = useState({ api: '' });

  const fetchSlots = useCallback(async (query = '') => {
    try {
      const { sanitized, isValid } = sanitizeSearchQuery(query);
      if (!isValid && query) {
        toast.error('Invalid search query');
        return;
      }
      const response = await getParkingSlots({
        page: pagination.page,
        limit: pagination.limit,
        search: sanitized,
      });
      const { data, pagination: pag } = response;
      setSlots(data || []);
      setPagination(pag || { page: 1, limit: 10, total: 0, pages: 1 });
      setErrors({ api: '' });
      if (!data?.length && sanitized) {
        toast.info('No parking slots found for your search');
      }
    } catch (error) {
      console.error('API Error:', error);
      setErrors({ api: error.response?.data?.error || 'Failed to load slots' });
      setPagination({ page: 1, limit: 10, total: 0, pages: 1 });
      setSlots([]);
    }
  }, [pagination.page, pagination.limit]);

  useEffect(() => {
    let isMounted = true;
    const timeout = setTimeout(() => {
      if (isMounted) fetchSlots(search);
    }, 300);
    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, [fetchSlots, search]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const clearSearch = () => {
    setSearch('');
    fetchSlots('');
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    try {
      const sanitizedForm = slotForm.map(slot => ({
        ...slot,
        slotNumber: sanitizeSearchInput(slot.slotNumber),
        location: sanitizeSearchInput(slot.location),
      }));
      await createBulkParkingSlots(sanitizedForm);
      setSlotForm([]);
      setErrors({ api: '' });
      fetchSlots(search);
      toast.success('Slots created successfully');
    } catch (error) {
      setErrors({ api: error.response?.data?.error || 'Failed to create slots' });
      toast.error(error.response?.data?.error || 'Failed to create slots');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateParkingSlot(editSlot.id, {
        slotNumber: sanitizeSearchInput(editSlot.slotNumber),
        size: editSlot.size,
        vehicleType: editSlot.vehicleType,
        location: sanitizeSearchInput(editSlot.location),
        status: editSlot.status,
      });
      setEditSlot(null);
      setErrors({ api: '' });
      fetchSlots(search);
      toast.success('Slot updated successfully');
    } catch (error) {
      setErrors({ api: error.response?.data?.error || 'Failed to update slot' });
      toast.error(error.response?.data?.error || 'Failed to update slot');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete slot?')) {
      try {
        await deleteParkingSlot(id);
        setErrors({ api: '' });
        fetchSlots(search);
        toast.success('Slot deleted successfully');
      } catch (error) {
        setErrors({ api: error.response?.data?.error || 'Failed to delete slot' });
        toast.error(error.response?.data?.error || 'Failed to delete slot');
      }
    }
  };

  const addSlotForm = () => {
    setSlotForm([...slotForm, { slotNumber: '', size: 'small', vehicleType: 'car', location: '' }]);
  };

  const StatusBadge = ({ status }) => {
    switch(status) {
      case 'available':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Available
          </span>
        );
      case 'occupied':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Occupied
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            Pending
          </span>
        );
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
                Parking Slot Management
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                View and manage all parking slots
              </p>
            </div>
            <div className="relative w-full sm:w-64 flex items-center">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search slots..."
                value={search}
                onChange={handleSearch}
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
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

        <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200 mb-8">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Create Multiple Slots</h3>
          </div>
          <form onSubmit={handleBulkSubmit} className="px-4 py-5 sm:p-6 space-y-4">
            {slotForm.map((slot, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slot Number</label>
                  <input
                    type="text"
                    placeholder="A-101"
                    value={slot.slotNumber}
                    onChange={(e) => {
                      const newForm = [...slotForm];
                      newForm[index].slotNumber = e.target.value;
                      setSlotForm(newForm);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                  <select
                    value={slot.size}
                    onChange={(e) => {
                      const newForm = [...slotForm];
                      newForm[index].size = e.target.value;
                      setSlotForm(newForm);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                  <select
                    value={slot.vehicleType}
                    onChange={(e) => {
                      const newForm = [...slotForm];
                      newForm[index].vehicleType = e.target.value;
                      setSlotForm(newForm);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="car">Car</option>
                    <option value="truck">Truck</option>
                    <option value="motorcycle">Motorcycle</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="Floor 1"
                    value={slot.location}
                    onChange={(e) => {
                      const newForm = [...slotForm];
                      newForm[index].location = e.target.value;
                      setSlotForm(newForm);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => {
                      const newForm = [...slotForm];
                      newForm.splice(index, 1);
                      setSlotForm(newForm);
                    }}
                    className="px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={addSlotForm}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <FaPlus className="mr-2" />
                Add Slot
              </button>
              {slotForm.length > 0 && (
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-500 hover:bg-amber-600"
                >
                  Create Slots
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Existing Parking Slots</h3>
          </div>
          {slots.length === 0 ? (
            <div className="px-4 py-12 text-center">
              <p className="text-gray-500">No parking slots found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Slot Number
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Size
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vehicle Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {slots.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {s.slotNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                        {s.size}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                        {s.vehicleType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {s.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <StatusBadge status={s.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setEditSlot(s)}
                          className="text-green-600 hover:text-green-900 mr-4 inline-flex items-center"
                        >
                          <FaEdit className="mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(s.id)}
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

        {editSlot && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-md mx-4">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <FaEdit className="text-green-600 mr-2" />
                  Edit Parking Slot
                </h2>
              </div>
              <form onSubmit={handleUpdate} className="px-6 py-4 space-y-4">
                <div>
                  <label htmlFor="slotNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Slot Number
                  </label>
                  <input
                    type="text"
                    id="slotNumber"
                    value={editSlot.slotNumber}
                    onChange={(e) => setEditSlot({ ...editSlot, slotNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">
                    Size
                  </label>
                  <select
                    id="size"
                    value={editSlot.size}
                    onChange={(e) => setEditSlot({ ...editSlot, size: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700 mb-1">
                    Vehicle Type
                  </label>
                  <select
                    id="vehicleType"
                    value={editSlot.vehicleType}
                    onChange={(e) => setEditSlot({ ...editSlot, vehicleType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="car">Car</option>
                    <option value="truck">Truck</option>
                    <option value="motorcycle">Motorcycle</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    value={editSlot.location}
                    onChange={(e) => setEditSlot({ ...editSlot, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    value={editSlot.status}
                    onChange={(e) => setEditSlot({ ...editSlot, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditSlot(null)}
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