import api from './api';

// CORRECTED: The URL is now just '/resumes'
const API_URL = '/resumes';

const getAllResumes = () => api.get(API_URL);
const getResumeById = (id) => api.get(`${API_URL}/${id}`);
const createResume = (resumeData) => api.post(API_URL, resumeData);
const updateResume = (id, resumeData) => api.put(`${API_URL}/${id}`, resumeData);
const deleteResume = (id) => api.delete(`${API_URL}/${id}`);

const resumeService = { getAllResumes, getResumeById, createResume, updateResume, deleteResume };
export default resumeService;