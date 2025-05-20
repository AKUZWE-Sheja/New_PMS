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

export const register = async ({ fname, lname, email, password }) => {
    const response = await api.post('/auth/register', { fname, lname, email, password });
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


export const createVehicle = async ({ plateNumber, vehicleType, size }) => {
  const response = await api.post('/vehicles', { plateNumber, vehicleType, size });
  return response.data.data;
};

export const getVehicles = async ({ page = 1, limit = 10, search = '' } = {}) => {
  const response = await api.get('/vehicles', { params: { page, limit, search } });
  return { data: response.data.data, meta: response.data.meta };
};

export const updateVehicle = async (id, { plateNumber, vehicleType, size }) => {
  const response = await api.put(`/vehicles/${id}`, { plateNumber, vehicleType, size });
  return response.data.data;
};

export const deleteVehicle = async (id) => {
  await api.delete(`/vehicles/${id}`);
};


export const getParkingSlots = async ({ page = 1, limit = 10, search = '' } = {}) => {
  const response = await api.get('/parking-slots', { params: { page, limit, search } });
  return { data: response.data.data, meta: response.data.meta };
};

export const createSlotRequest = async ({ vehicleId, startTime, endTime }) => {
  const response = await api.post('/slot-requests', { vehicleId, startTime, endTime });
  return response.data.data;
};

export const updateSlotRequest = async (id, { vehicleId, startTime, endTime }) => {
  const response = await api.put(`/slot-requests/${id}`, { vehicleId, startTime, endTime });
  return response.data.data;
};
export const deleteSlotRequest = async (id) => {
  await api.delete(`/slot-requests/${id}`);
};

export const getSlotRequests = async ({ page = 1, limit = 10, search = '' } = {}) => {
  const response = await api.get('/slot-requests', { params: { page, limit, search } });
  return { data: response.data.data, meta: response.data.meta };
};