import { useState } from 'react';

const initialResumes = [
  {
    id: 'resume-1',
    title: 'Software Engineer Resume',
    lastUpdated: '2 days ago',
  },
  {
    id: 'resume-2',
    title: 'Product Manager Application',
    lastUpdated: '1 week ago',
  },
  {
    id: 'resume-3',
    title: 'Data Analyst CV (Final)',
    lastUpdated: '3 hours ago',
  }
];

// This hook provides the initial mock data.
// In a real app, this would fetch data from an API.
const useMockResumes = () => {
  // We use useState here so that if we wanted to add simulated fetching logic,
  // we could easily add loading/error states. For now, it just returns the data.
  const [resumes] = useState(initialResumes);
  
  return { resumes };
};

export default useMockResumes;