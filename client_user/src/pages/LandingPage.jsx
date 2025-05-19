import { FaUserEdit } from "react-icons/fa";
import { ImProfile } from "react-icons/im";
import { BsMenuUp } from "react-icons/bs";
import Navbar from "../components/Navbar";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="bg-black px-6 py-8 md:py-10">
        <Navbar />

        <header className="max-w-4xl mx-auto text-center mt-10 mb-8 px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Register on RRA PMS
          </h1>
          <p className="text-gray-300 text-md md:text-xl mb-8">
            For free and get more revenue!
          </p>
        </header>
      </div>

      {/* How It Works Section */}
      <div className="bg-green-50 px-6 py-10 md:py-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-12">How it works</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <FaUserEdit className="text-2xl text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Step 1</h3>
              <p className="text-gray-600">Register your account</p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <ImProfile className="text-2xl text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Step 2</h3>
              <p className="text-gray-600">Build your profile</p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <BsMenuUp className="text-2xl text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Step 3</h3>
              <p className="text-gray-600">Start getting PMS'ed books</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}