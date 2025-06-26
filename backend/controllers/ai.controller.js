// --- AI-Powered ATS Analysis Logic ---
const analyzeAts = async (req, res) => {
    try {
        const { resumeContent, jobDescription } = req.body;
        if (!jobDescription) {
            return res.status(400).json({ message: "Job description is required for analysis." });
        }
        console.log("Simulating AI ATS analysis...");
        // Simulating a real AI call delay
        setTimeout(() => {
            const simulatedResponse = {
                matchScore: Math.floor(70 + Math.random() * 25), // e.g., 87
                keywords: [
                    { term: "React", present: true, mentioned: 5 },
                    { term: "Node.js", present: true, mentioned: 3 },
                    { term: "SQL", present: true, mentioned: 2 },
                    { term: "Agile", present: false, mentioned: 0 },
                    { term: "CI/CD", present: false, mentioned: 0 },
                ],
                suggestions: [
                    "Excellent use of keywords related to core web technologies.",
                    "Consider adding specific achievements with quantifiable results, e.g., 'Increased performance by 15%'.",
                    "The job description mentions 'Agile' and 'CI/CD'. Try to incorporate these skills into your experience descriptions if applicable."
                ]
            };
            res.json(simulatedResponse);
        }, 2500);
    } catch (error) {
        console.error("Error in AI ATS analysis:", error);
        res.status(500).send('Server Error');
    }
};

// --- AI-Powered Interview Question Generation ---
const getInterviewQuestions = async (req, res) => {
    try {
        const { jobTitle } = req.body;
        if (!jobTitle) {
            return res.status(400).json({ message: "Job title is required." });
        }
        console.log(`Simulating AI interview question generation for: ${jobTitle}`);
        // Simulating a real AI call delay
        setTimeout(() => {
            const simulatedQuestions = {
                behavioral: [
                    `Tell me about a challenging project you worked on as a ${jobTitle}.`,
                    "How do you handle tight deadlines and pressure?",
                    "Describe a time you had a disagreement with a team member and how you resolved it."
                ],
                technical: [
                    `What is the difference between SQL and NoSQL databases?`,
                    `Explain the concept of RESTful APIs.`,
                    `How would you optimize a slow-loading web page?`
                ]
            };
            res.json(simulatedQuestions);
        }, 2000);
    } catch (error) {
        console.error("Error in AI interview prep:", error);
        res.status(500).send('Server Error');
    }
};

// --- AI-Powered Answer Feedback Generation ---
const getAnswerFeedback = async (req, res) => {
    try {
        const { userAnswer, jobTitle } = req.body;
        if (!userAnswer) {
            return res.status(400).json({ message: "User answer is required." });
        }
        console.log(`Simulating AI feedback for answer about ${jobTitle}`);
        // Simulating a real AI call delay
        setTimeout(() => {
            const feedback = {
                clarityScore: Math.floor(70 + Math.random() * 25),
                relevanceScore: Math.floor(60 + Math.random() * 35),
                impactScore: Math.floor(65 + Math.random() * 30),
                constructiveFeedback: "This is a solid foundation. To enhance your impact, focus on explicitly stating the positive business outcome of your actions. For example, instead of 'I fixed the bug,' try 'I fixed the bug, which reduced customer support tickets by 15%.'",
                followUpQuestion: "That's very insightful. Based on that, what was the biggest technical trade-off you had to make?"
            };
            res.json(feedback);
        }, 2500);
    } catch (error) {
        console.error("Error in AI answer feedback:", error);
        res.status(500).send('Server Error');
    }
};

// This line now correctly exports all three functions defined above.
module.exports = { analyzeAts, getInterviewQuestions, getAnswerFeedback };