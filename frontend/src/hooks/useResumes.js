// import { useState, useEffect } from 'react';
// import { db } from '../services/firebase';
// import { useAuth } from '../context/AuthContext';
// import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';

// const useResumes = () => {
//   const [resumes, setResumes] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const { currentUser } = useAuth(); 

//   useEffect(() => {
//     let unsubscribe = () => {};

//     if (currentUser) {
//       setIsLoading(true);
      
//       // THIS IS THE FINAL, CORRECTED LINE OF CODE.
//       // It uses `${...}` to properly insert your variables into the database path.
//       const resumesPath = `artifacts/${import.meta.env.VITE_APP_ID}/users/${currentUser.uid}/resumes`;
      
//       const resumesCollectionRef = collection(db, resumesPath);
//       const q = query(resumesCollectionRef, orderBy('lastUpdated', 'desc'));

//       unsubscribe = onSnapshot(q, (snapshot) => {
//         const fetchedResumes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//         setResumes(fetchedResumes);
//         setIsLoading(false);
//       }, (err) => {
//         console.error("Error fetching resumes:", err);
//         setIsLoading(false);
//       });
//     } else {
//       setResumes([]);
//       setIsLoading(false);
//     }
    
//     return () => unsubscribe();
    
//   }, [currentUser]);

//   return { resumes, isLoading };
// };

// export default useResumes;
