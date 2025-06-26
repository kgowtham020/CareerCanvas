import api from './api';

const API_URL = '/api/ats';
const ATS_API_KEY = import.meta.env.VITE_ATS_API_KEY || 'your_jobscan_api_key';

const analyzeAts = async ({ jobDescription, resumeContent }) => {
  try {
    const response = await api.post(
      `${API_URL}/analyze`,
      { jobDescription, resumeContent },
      {
        headers: {
          'Authorization': `Bearer ${ATS_API_KEY}`,
        },
      }
    );
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'ATS analysis failed');
  }
};

export default { analyzeAts };