import api from './api';

// CORRECTED: The URL is now just '/profile'
const API_URL = '/profile';

const getProfile = () => api.get(API_URL);
const updateProfile = (profileData) => api.post(API_URL, profileData);

const profileService = { getProfile, updateProfile };
export default profileService;