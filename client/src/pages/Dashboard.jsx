import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getUsers, getVehicles, getParkingSlots, getSlotRequests } from '../services/api';
import ErrorMessage from '../utils/error-msg';
import { FaUsers, FaCar, FaParking, FaListAlt, FaCalendarAlt } from 'react-icons/fa';
import { IoMdCheckmarkCircle, IoMdCloseCircle, IoMdTime } from 'react-icons/io';

export default function Dashboard() {
  const [stats, setStats] = useState({ users: 0, vehicles: 0, slots: 0, requests: 0 });
  const [recentRequests, setRecentRequests] = useState([]);
  const [errors, setErrors] = useState({ api: '' });
  // eslint-disable-next-line no-unused-vars
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        // console.log('Fetching data with token:', localStorage.getItem('token')); //debugging
        const [users, vehicles, slots, requests] = await Promise.all([
          getUsers({ page: 1, limit: 1 }).catch(err => {
            console.log('getUsers failed:', err.response?.data || err.message);
            throw err;
          }),
          getVehicles({ page: 1, limit: 1 }).catch(err => {
            console.log('getVehicles failed:', err.response?.data || err.message);
            throw err;
          }),
          getParkingSlots({ page: 1, limit: 1 }).catch(err => {
            console.log('getParkingSlots failed:', err.response?.data || err.message);
            throw err;
          }),
          getSlotRequests({ page: 1, limit: 1 }).catch(err => {
            console.log('getSlotRequests failed:', err.response?.data || err.message);
            throw err;
          }),
        ]);
        if (isMounted) {
          setStats({
            users: users.meta?.totalItems || 0,
            vehicles: vehicles.meta?.totalItems || 0,
            slots: slots.meta?.totalItems || 0,
            requests: requests.meta?.totalItems || 0,
          });
          const { data } = await getSlotRequests({ page: 1, limit: 5 }).catch(err => {
            console.log('getSlotRequests (recent) failed:', err.response?.data || err.message);
            throw err;
          });
          setRecentRequests(data || []);
          setErrors({ api: '' });
        }
      } catch (error) {
        if (isMounted) {
          console.log('Fetch data error:', error.response?.data || error.message);
          setErrors({ api: error.response?.data?.error || 'Failed to load data' });
        }
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

    // styling requests' status
  const StatusBadge = ({ status }) => {
    switch(status) {
      case 'approved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <IoMdCheckmarkCircle className="mr-1" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <IoMdCloseCircle className="mr-1" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            <IoMdTime className="mr-1" />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 border-b border-gray-200 pb-4">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <ErrorMessage message={errors.api} />      
          <p className="mt-1 text-sm text-gray-500">Overview of your parking management system</p>
        </div>

        <ErrorMessage message={errors.api} />

        {/* Status cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {[
            { label: 'Total Users', value: stats.users, icon: <FaUsers className="text-green-600" />, bg: 'bg-white' },
            { label: 'Registered Vehicles', value: stats.vehicles, icon: <FaCar className="text-blue-600" />, bg: 'bg-white' },
            { label: 'Parking Slots', value: stats.slots, icon: <FaParking className="text-amber-600" />, bg: 'bg-white' },
            { label: 'Slot Requests', value: stats.requests, icon: <FaListAlt className="text-purple-600" />, bg: 'bg-white' },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`${stat.bg} overflow-hidden shadow rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-300`}
            >
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-3 rounded-md bg-opacity-10 bg-green-500">
                    {stat.icon}
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.label}</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                    </dd>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Requests */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <FaListAlt className="mr-2 text-green-600" />
              Recent Slot Requests
            </h2>
          </div>
          {recentRequests.length === 0 ? (
            <div className="px-4 py-12 text-center">
              <p className="text-gray-500">No recent requests found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
  <tr>
    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      User Email
    </th>
    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      Vehicle
    </th>
    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      Slot
    </th>
    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      Status
    </th>
    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      <div className="flex items-center">
        <FaCalendarAlt className="mr-1" />
        Date
      </div>
    </th>
  </tr>
</thead>
<tbody className="bg-white divide-y divide-gray-200">
  {recentRequests.map((req) => (
    <tr key={req.id} className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {req.user?.email || 'N/A'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {req.vehicle?.plateNumber || 'N/A'} ({req.vehicle?.vehicleType || 'N/A'})
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {req.slotNumber || 'Not Assigned'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <StatusBadge status={req.requestStatus} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : 'N/A'}
      </td>
    </tr>
  ))}
</tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}