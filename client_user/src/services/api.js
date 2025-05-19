import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const login = async ({ email, password }) => {
    const response = await api.post('/auth/login', { email, password });
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return response.data;
};

export const register = async ({ name, email, password }) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
};

export const verifyOtp = async ({ userId, otpCode }) => {
    const response = await api.post('/auth/verify-otp', { userId, otpCode });
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return response.data;
};

export const resendOtp = async ({ userId }) => {
    const response = await api.post('/auth/resend-otp', { userId });
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

// Vehicle Routes
export const getVehicles = async () => {
    const response = await api.get('/vehicles');
    return response.data.data; // Assumes { data: [...] }
};

export const getVehicle = async (id) => {
    const response = await api.get(`/vehicles/${id}`);
    return response.data.data;
};

export const createVehicle = async ({ plateNumber, vehicleType, size, otherAttributes }) => {
    const response = await api.post('/vehicles', {
        plateNumber,
        vehicleType,
        size,
        otherAttributes: otherAttributes || {},
    });
    return response.data.data;
};

export const updateVehicle = async (id, { plateNumber, vehicleType, size, otherAttributes }) => {
    const response = await api.put(`/vehicles/${id}`, {
        plateNumber,
        vehicleType,
        size,
        otherAttributes: otherAttributes || {},
    });
    return response.data.data;
};

export const deleteVehicle = async (id) => {
    await api.delete(`/vehicles/${id}`);
};

// Parking Slot Routes
export const getParkingSlots = async () => {
    const response = await api.get('/parking-slots');
    return response.data.data;
};

export const createParkingSlot = async ({ slotNumber, size, vehicleType, location }) => {
    const response = await api.post('/parking-slots', {
        slotNumber,
        size,
        vehicleType,
        location,
    });
    return response.data.data;
};

// Slot Request Routes
export const getSlotRequests = async () => {
    const response = await api.get('/slot-requests');
    return response.data.data;
};

export const createSlotRequest = async ({ vehicleId, slotId }) => {
    const response = await api.post('/slot-requests', { vehicleId, slotId });
    return response.data.data;
};

export const updateSlotRequest = async (id, { requestStatus }) => {
    const response = await api.put(`/slot-requests/${id}`, { requestStatus });
    return response.data.data;
  };