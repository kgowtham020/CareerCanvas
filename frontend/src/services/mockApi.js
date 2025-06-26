// This file simulates a more dynamic API for our new features.

const generateFeedback = (score) => {
  if (score < 65) return ["Your resume is missing several key skills. Tailor it more closely.", "Action verbs are lacking. Use words like 'Led', 'Developed', 'Managed'."];
  if (score < 85) return ["Good alignment, but some keywords could be better integrated.", "Try to quantify your achievements, e.g., 'Improved performance by 15%'."];
  return ["Excellent keyword and skills match! Your resume is well-aligned.", "Proofread carefully for any typos. A second pair of eyes always helps."];
};

const allLearningResources = [
    { skill: "Docker", description: "Learn containerization from the ground up with this freeCodeCamp course.", url: "https://www.youtube.com/watch?v=pg19Z8QxakY" },
    { skill: "Kubernetes", description: "Understand orchestration and how to manage containerized applications at scale.", url: "https://www.youtube.com/watch?v=X48VuDVv0do" },
    { skill: "Agile Methodologies", description: "A primer on Scrum, Kanban, and the Agile mindset in software development.", url: "https://www.youtube.com/watch?v=Z9QbYZh1YXY" },
    { skill: "Python", description: "The official Python tutorial for beginners is a great place to start.", url: "https://docs.python.org/3/tutorial/" },
    { skill: "SQL", description: "Practice your SQL skills with interactive exercises on SQLBolt.", url: "https://sqlbolt.com/" },
];

export const mockApi = {
  analyzeResumeWithGaps: (jobDescription, resumeIdentifier) => {
    console.log(`Analyzing: ${resumeIdentifier} against a job of length ${jobDescription.length}`);
    return new Promise(resolve => {
      setTimeout(() => {
        let score = Math.floor(60 + Math.random() * 40); // Random score 60-99
        let gaps = ["Docker", "Agile Methodologies", "Python"]; // Hardcoded gaps
        let learningPlan = allLearningResources.filter(res => gaps.includes(res.skill));
        
        const result = {
          score,
          feedback: generateFeedback(score),
          gaps,
          learning: learningPlan,
        };
        resolve(result);
      }, 2000);
    });
  },

  getInterviewQuestions: (jobTitle) => {
    console.log(`Fetching interview questions for: ${jobTitle}`);
    return new Promise(resolve => {
      setTimeout(() => {
        const questions = [
            `Tell me about a time you had to learn a new technology quickly for a project.`,
            `Describe a challenging project you worked on. What was your role?`,
            `How do you handle disagreements with team members?`,
            `Where do you see yourself in five years?`,
            `What do you know about our company and this role (${jobTitle})?`
        ];
        resolve(questions);
      }, 1500);
    });
  },

  getAnswerFeedback: (answer) => {
    console.log(`Getting feedback for answer of length: ${answer.length}`);
    return new Promise(resolve => {
        setTimeout(() => {
            if (answer.length < 50) {
                resolve("This answer seems a bit short. Try to elaborate more by using the STAR method (Situation, Task, Action, Result) to structure your response and provide more detail.");
            } else {
                resolve("Good, detailed answer. You've provided a solid overview. To make it even stronger, try to link your experience back to a specific requirement in the job description.");
            }
        }, 1800);
    });
  },
};