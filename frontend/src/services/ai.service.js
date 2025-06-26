import api from './api';

// CORRECTED: The URL is now just '/ai'
const API_URL = '/ai';

const analyzeAts = (data) => api.post(`${API_URL}/analyze-ats`, data);
const getInterviewQuestions = (data) => api.post(`${API_URL}/interview-prep`, data);
const getAnswerFeedback = (data) => api.post(`${API_URL}/feedback`, data);

const aiService = { analyzeAts, getInterviewQuestions, getAnswerFeedback };
export default aiService;