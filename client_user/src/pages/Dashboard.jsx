import Navbar from '../components/Navbar';

export default function Dashboard() {
  let user = {};

  try {
    const storedUser = localStorage.getItem('user');
    user = storedUser ? JSON.parse(storedUser) : {};
  } catch (error) {
    console.error("Error parsing user data from localStorage:", error);
    user = {};
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome, {user.name}!</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Manage Vehicles</h2>
            <p className="text-gray-600 mb-4">View, add, or edit your vehicles.</p>
            <a
              href="/vehicles"
              className="text-green-800 hover:text-green-700 font-medium"
            >
              Go to Vehicles
            </a>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Parking Slots</h2>
            <p className="text-gray-600 mb-4">Find and request available parking slots.</p>
            <a
              href="/parking-slots"
              className="text-green-800 hover:text-green-700 font-medium"
            >
              Go to Parking Slots
            </a>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Slot Requests</h2>
            <p className="text-gray-600 mb-4">Track your parking slot requests.</p>
            <a
              href="/slot-requests"
              className="text-green-800 hover:text-green-700 font-medium"
            >
              Go to Slot Requests
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}