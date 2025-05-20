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
    // console.log(`Request to ${config.url}:`, { token, headers: config.headers }); //debugging
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log(`Response error from ${error.config.url}:`, {
            status: error.response?.status,
            data: error.response?.data,
        });
        if (error.response?.status === 401) {
            console.log('401 detected, clearing localStorage and redirecting to /login');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const login = async ({ email, password }) => {
    const response = await api.post('/auth/login', { email, password });
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    console.log('Login success:', { token, user });
    return response.data;
};

export const register = async ({ name, email, password }) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

export const getUsers = async ({ page = 1, limit = 10, search = '' } = {}) => {
    const response = await api.get('/users', { params: { page, limit, search } });
    return { data: response.data.data, meta: response.data.meta };
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

export const createBulkParkingSlots = async (slots) => {
  const response = await api.post('/parking-slots/bulk', { slots }); // Updated to /parking-slots
  return response.data;
};

export const getParkingSlots = async ({ page = 1, limit = 10, search = '' } = {}) => {
  const response = await api.get('/parking-slots', { params: { page, limit, search } });
  return { data: response.data.data, meta: response.data.meta };
};

export const updateParkingSlot = async (id, { slotNumber, size, vehicleType, location, status }) => {
  const response = await api.put(`/parking-slots/${id}`, { slotNumber, size, vehicleType, location, status }); // Updated to /parking-slots
  return response.data.data;
};

export const deleteParkingSlot = async (id) => {
  await api.delete(`/parking-slots/${id}`); // Updated to /parking-slots
};

export const getSlotRequests = async ({ page = 1, limit = 10, search = '' } = {}) => {
  const response = await api.get('/slot-requests', { params: { page, limit, search } });
  return { data: response.data.data, meta: response.data.meta };
};

export const createSlotRequest = async ({ vehicleId, startTime, endTime }) => {
  const response = await api.post('/slot-requests', { vehicleId, startTime, endTime });
  return response.data.data;
};

export const approveSlotRequest = async (id) => {
  const response = await api.post(`/slot-requests/${id}/approve`); // Changed to POST
  return response.data.data;
};

export const rejectSlotRequest = async (id, reason) => {
  const response = await api.post(`/slot-requests/${id}/reject`, { reason }); // Changed to POST
  return response.data.data;
};

// eslint-disable-next-line no-unused-vars
const fetchOutgoingCars = async (from, to) => {
  const res = await fetch(`/api/requests/outgoing?from=${from}&to=${to}`);
  const { data } = await res.json();
  return data;
};