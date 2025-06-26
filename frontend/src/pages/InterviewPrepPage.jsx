import { useState, useEffect, useRef, useReducer, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Mic, Send, RotateCcw, Sparkles, Lightbulb, SkipForward, Pause, Play, Download, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Player } from '@lottiefiles/react-lottie-player';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip as ChartTooltip, Legend } from 'chart.js';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';
import aiService from '../services/ai.service.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ChartTooltip, Legend);

// Animation variants
const pageVariants = { initial: { opacity: 0, y: 20 }, in: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } };
const buttonVariants = { hover: { scale: 1.05, boxShadow: '0 0 10px rgba(56,189,248,0.4)' }, tap: { scale: 0.95 } };
const sectionVariants = { collapsed: { height: 0, opacity: 0 }, expanded: { height: 'auto', opacity: 1 } };

// Reducer for state management
const initialState = {
  pageState: 'SETUP',
  isLoading: false,
  aiStatus: 'IDLE',
  jobTitle: 'Senior Machine Learning Engineer',
  jobDescription: '',
  sessionLog: [],
  questions: [],
  currentQuestionIndex: 0,
  sessionTime: 0,
  isPaused: false,
};

function interviewReducer(state, action) {
  switch (action.type) {
    case 'START_LOADING': return { ...state, isLoading: true };
    case 'FINISH_LOADING': return { ...state, isLoading: false };
    case 'SET_AI_STATUS': return { ...state, aiStatus: action.payload };
    case 'SET_JOB_TITLE': return { ...state, jobTitle: action.payload };
    case 'SET_JOB_DESCRIPTION': return { ...state, jobDescription: action.payload };
    case 'START_SESSION': return { ...state, pageState: 'SESSION', questions: action.payload, currentQuestionIndex: 0, sessionLog: [], sessionTime: 0 };
    case 'PROCESS_ANSWER': return { ...state, sessionLog: [...state.sessionLog, action.payload], currentQuestionIndex: state.currentQuestionIndex + 1 };
    case 'SKIP_QUESTION': return { ...state, sessionLog: [...state.sessionLog, action.payload], currentQuestionIndex: state.currentQuestionIndex + 1 };
    case 'FINISH_SESSION': return { ...state, pageState: 'REPORT', aiStatus: 'IDLE', isPaused: false };
    case 'RESET': return { ...initialState, jobTitle: state.jobTitle };
    case 'TOGGLE_PAUSE': return { ...state, isPaused: !state.isPaused };
    case 'UPDATE_TIME': return { ...state, sessionTime: state.isPaused ? state.sessionTime : state.sessionTime + 1 };
    default: return state;
  }
}

// Background Animation
const BackgroundAnimation = () => (
  <div className="absolute inset-0 z-[-1] opacity-10">
    <Player src="https://assets.lottiefiles.com/packages/lf20_rovfyyog.json" autoplay loop style={{ width: '100%', height: '100%' }} aria-hidden="true" />
  </div>
);

// AI Avatar
const AiAvatar = ({ status }) => {
  const lottieAnimations = {
    IDLE: 'https://assets.lottiefiles.com/packages/lf20_4b7l3rch.json',
    SPEAKING: 'https://assets.lottiefiles.com/packages/lf20_8q2r5kpa.json',
    LISTENING: 'https://assets.lottiefiles.com/packages/lf20_3z5a2f.json',
    ANALYZING: 'https://assets.lottiefiles.com/packages/lf20_kv4fhoop.json',
  };
  const statusConfig = {
    IDLE: { text: 'Ready to begin your session.' },
    SPEAKING: { text: 'Asking question...', color: 'border-accent animate-pulse' },
    LISTENING: { text: 'Listening...', color: 'border-green-500 animate-pulse' },
    ANALYZING: { text: 'Analyzing response...', color: 'border-yellow-500 animate-pulse' },
  };
  const current = statusConfig[status] || statusConfig.IDLE;
  return (
    <div className="flex flex-col items-center text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`w-48 h-48 rounded-full border-4 flex items-center justify-center bg-surface/60 backdrop-blur-lg transition-all duration-300 ${current.color || 'border-muted/20'}`}
      >
        <Player src={lottieAnimations[status] || lottieAnimations.IDLE} autoplay loop style={{ width: '150%', height: '150%' }} aria-hidden="true" />
      </motion.div>
      <p className="text-text-secondary mt-4 h-5 text-sm font-medium" aria-live="polite">{current.text}</p>
    </div>
  );
};

// Loading Spinner
const LoadingSpinner = () => (
  <div className="flex items-center justify-center">
    <Player src="https://assets.lottiefiles.com/packages/lf20_44nd0ogf.json" autoplay loop style={{ width: '60px', height: '60px' }} aria-hidden="true" />
  </div>
);

// Score Chart
const ScoreChart = ({ label, score }) => {
  const color = score > 85 ? '#22c55e' : score > 65 ? '#f59e0b' : '#ef4444';
  return (
    <div className="w-full">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-text-primary">{label}</span>
        <span className="text-sm font-medium text-text-primary">{score}/100</span>
      </div>
      <div className="w-full bg-muted/20 rounded-full h-2.5">
        <div style={{ width: `${score}%`, backgroundColor: color }} className="h-full rounded-full transition-all duration-500 ease-out" />
      </div>
    </div>
  );
};

// Main Component
const InterviewPrepPage = () => {
  const [state, dispatch] = useReducer(interviewReducer, initialState);
  const { pageState, isLoading, aiStatus, jobTitle, jobDescription, sessionLog, questions, currentQuestionIndex, sessionTime, isPaused } = state;
  const [transcript, setTranscript] = useState('');
  const [useTextInput, setUseTextInput] = useState(false);
  const [subtitles, setSubtitles] = useState('');
  const [showTips, setShowTips] = useState(false);
  const [sampleAnswer, setSampleAnswer] = useState('');
  const [showSample, setShowSample] = useState(false);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);

  // Timer for session duration
  useEffect(() => {
    if (pageState === 'SESSION' && !isPaused) {
      timerRef.current = setInterval(() => dispatch({ type: 'UPDATE_TIME' }), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [pageState, isPaused]);

  // Speech Recognition Setup
  useEffect(() => {
    if (useTextInput || !('webkitSpeechRecognition' in window)) {
      if (!useTextInput && pageState === 'SESSION') {
        toast.error('Voice recognition not supported. Using text input.', { id: 'mic-support' });
        setUseTextInput(true);
      }
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript;
      }
      if (finalTranscript) setTranscript((prev) => (prev + ' ' + finalTranscript).trim());
    };
    recognition.onerror = (event) => {
      toast.error(event.error === 'not-allowed' ? 'Microphone permission denied.' : 'Speech recognition error.', { id: 'mic-error' });
      dispatch({ type: 'SET_AI_STATUS', payload: 'IDLE' });
      setUseTextInput(true);
    };
    recognition.onend = () => {
      if (aiStatus === 'LISTENING') dispatch({ type: 'SET_AI_STATUS', payload: 'ANALYZING' });
    };
    recognitionRef.current = recognition;
    return () => recognitionRef.current?.stop();
  }, [useTextInput, pageState, aiStatus]);

  const speak = useCallback(
    (text, onEndCallback) => {
      if (isPaused) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onstart = () => setSubtitles(text);
      utterance.onend = () => {
        setSubtitles('');
        onEndCallback();
      };
      window.speechSynthesis.speak(utterance);
    },
    [isPaused]
  );

  const startListening = useCallback(() => {
    if (isPaused || useTextInput || !recognitionRef.current) return;
    setTranscript('');
    try {
      recognitionRef.current.start();
      dispatch({ type: 'SET_AI_STATUS', payload: 'LISTENING' });
    } catch (error) {
      toast.error('Failed to start listening.');
      setUseTextInput(true);
    }
  }, [useTextInput, isPaused]);

  const stopListening = useCallback(() => {
    if (useTextInput || !recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch (error) {
      console.warn('Stop listening error:', error);
    }
  }, [useTextInput]);

  const startInterview = useCallback(async () => {
    if (!jobTitle) {
      toast.error('Please enter a job title.');
      return;
    }
    dispatch({ type: 'START_LOADING' });
    try {
      const response = await aiService.getInterviewQuestions({ jobTitle, jobDescription });
      const allQuestions = [...response.data.behavioral, ...response.data.technical, "That concludes our session. I'm now compiling your final report."];
      if (allQuestions.length < 2) throw new Error('No questions generated.');
      dispatch({ type: 'START_SESSION', payload: allQuestions });
      dispatch({ type: 'SET_AI_STATUS', payload: 'SPEAKING' });
      speak(`Let's begin your practice for a ${jobTitle} role. First question: ${allQuestions[0]}`, startListening);
    } catch (error) {
      toast.error('Failed to start interview.');
    } finally {
      dispatch({ type: 'FINISH_LOADING' });
    }
  }, [jobTitle, jobDescription, speak, startListening]);

  const submitAnswer = useCallback(
    async () => {
      if (isPaused) return;
      stopListening();
      const currentAnswer = transcript.trim();
      if (!currentAnswer) {
        toast.error('Please provide an answer.');
        if (!useTextInput) startListening();
        return;
      }
      dispatch({ type: 'SET_AI_STATUS', payload: 'ANALYZING' });
      try {
        const [feedbackResponse, sampleResponse] = await Promise.all([
          aiService.getAnswerFeedback({ userAnswer: currentAnswer, jobTitle }),
          aiService.getSampleAnswer({ question: questions[currentQuestionIndex], jobTitle }),
        ]);
        const feedbackData = feedbackResponse.data;
        const sampleData = sampleResponse.data.sampleAnswer || 'No sample answer available.';
        setSampleAnswer(sampleData);
        const logEntry = { question: questions[currentQuestionIndex], answer: currentAnswer, feedback: feedbackData, sampleAnswer: sampleData };
        dispatch({ type: 'PROCESS_ANSWER', payload: logEntry });
        const nextQuestion = questions[currentQuestionIndex + 1];
        dispatch({ type: 'SET_AI_STATUS', payload: 'SPEAKING' });
        if (currentQuestionIndex >= questions.length - 2) {
          speak(`Thank you. Here is my feedback: ${feedbackData.constructiveFeedback}. ${nextQuestion}`, () => dispatch({ type: 'FINISH_SESSION' }));
        } else {
          speak(`Thank you. Here is my feedback: ${feedbackData.constructiveFeedback}. Now for your next question: ${nextQuestion}`, startListening);
        }
      } catch (error) {
        toast.error("Couldn't get feedback or sample answer.");
        dispatch({ type: 'SET_AI_STATUS', payload: 'IDLE' });
      }
    },
    [transcript, state, stopListening, speak, startListening]
  );

  const skipQuestion = useCallback(async () => {
    if (isPaused) return;
    stopListening();
    try {
      const sampleResponse = await aiService.getSampleAnswer({ question: questions[currentQuestionIndex], jobTitle });
      const sampleData = sampleResponse.data.sampleAnswer || 'No sample answer available.';
      const logEntry = { question: questions[currentQuestionIndex], answer: '(Skipped)', feedback: null, sampleAnswer: sampleData };
      dispatch({ type: 'SKIP_QUESTION', payload: logEntry });
      if (currentQuestionIndex >= questions.length - 2) {
        endInterview();
        return;
      }
      const nextQuestion = questions[currentQuestionIndex + 1];
      dispatch({ type: 'SET_AI_STATUS', payload: 'SPEAKING' });
      speak(`Okay, let's skip that one. Next question: ${nextQuestion}`, startListening);
    } catch (error) {
      toast.error('Failed to fetch sample answer.');
      dispatch({ type: 'SKIP_QUESTION', payload: { question: questions[currentQuestionIndex], answer: '(Skipped)', feedback: null } });
    }
  }, [state, stopListening, speak, startListening]);

  const endInterview = useCallback(() => {
    stopListening();
    window.speechSynthesis.cancel();
    setSubtitles('');
    clearInterval(timerRef.current);
    dispatch({ type: 'FINISH_SESSION' });
  }, [stopListening]);

  const togglePause = useCallback(() => {
    if (aiStatus === 'LISTENING') stopListening();
    if (!isPaused) window.speechSynthesis.pause();
    dispatch({ type: 'TOGGLE_PAUSE' });
  }, [aiStatus, isPaused, stopListening]);

  const resumeInterview = useCallback(() => {
    window.speechSynthesis.resume();
    if (aiStatus === 'LISTENING') startListening();
    dispatch({ type: 'TOGGLE_PAUSE' });
  }, [aiStatus, startListening]);

  const showHint = useCallback(() => {
    const hints = {
      'Senior Machine Learning Engineer': 'Use STAR method; mention metrics like F1 score, AUC, or model accuracy.',
      'Software Engineer': 'Detail technical solutions with tools like React, Docker, or Kubernetes.',
      default: 'Use STAR method: Situation, Task, Action, Result.',
    };
    toast.custom(
      (t) => (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-surface/70 backdrop-blur-lg border border-muted/20 rounded-lg p-4 flex items-center gap-3"
        >
          <Lightbulb className="text-yellow-400" size={24} />
          <p className="text-sm text-text-primary">{hints[jobTitle] || hints.default}</p>
        </motion.div>
      ),
      { duration: 5000 }
    );
  }, [jobTitle]);

  const downloadPDF = useCallback(() => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(18);
    doc.text('CareerCanvas Interview Report', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Role: ${jobTitle}`, 20, 35);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 42);
    const tableData = sessionLog.map((log, i) => [
      `Q${i + 1}: ${log.question}`,
      log.answer,
      log.feedback
        ? `Clarity: ${log.feedback.clarityScore}, Relevance: ${log.feedback.relevanceScore}, Impact: ${log.feedback.impactScore}\n\n${log.feedback.constructiveFeedback}`
        : 'N/A',
      log.sampleAnswer || 'N/A',
    ]);
    doc.autoTable({
      startY: 50,
      head: [['Question', 'Your Answer', 'AI Feedback', 'Sample Answer']],
      body: tableData,
      theme: 'grid',
    });
    doc.save('CareerCanvas_Interview_Report.pdf');
  }, [jobTitle, sessionLog]);

  // Calculate overall score
  const calculateOverallScore = () => {
    if (!sessionLog.length) return 0;
    const answered = sessionLog.filter((log) => log.feedback);
    if (!answered.length) return 0;
    const total = answered.reduce(
      (sum, log) => sum + log.feedback.clarityScore + log.feedback.relevanceScore + log.feedback.impactScore,
      0
    );
    return Math.round(total / (answered.length * 3));
  };

  // Setup Page
  if (pageState === 'SETUP') {
    const trendingSkills = {
      'Senior Machine Learning Engineer': ['TensorFlow', 'PyTorch', 'Cloud ML', 'System Design'],
      'Software Engineer': ['React', 'Node.js', 'Docker', 'AWS'],
      default: ['Problem Solving', 'Communication', 'Teamwork'],
    };
    return (
      <motion.div initial="initial" animate="in" variants={pageVariants} className="max-w-2xl mx-auto text-center relative">
        <BackgroundAnimation />
        <h1 className="text-4xl font-bold text-text-primary">AI Interview Coach</h1>
        <p className="text-text-secondary text-lg mt-2">Practice real interviews with our AI to ace your dream job.</p>
        <div className="p-8 mt-8 bg-surface/60 backdrop-blur-lg border border-muted/20 rounded-lg space-y-6 text-left">
          <div>
            <label className="text-sm font-medium text-text-primary" htmlFor="job-title">
              Job Title
            </label>
            <motion.input
              id="job-title"
              type="text"
              value={jobTitle}
              onChange={(e) => dispatch({ type: 'SET_JOB_TITLE', payload: e.target.value })}
              placeholder="e.g., Software Engineer"
              className="w-full mt-1 p-3 bg-background/70 border border-muted rounded-md text-text-primary focus:ring-2 ring-accent outline-none"
              whileHover={{ scale: 1.02 }}
              aria-label="Job title"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-text-primary" htmlFor="job-description">
              Job Description (Optional)
            </label>
            <ReactQuill
              value={jobDescription}
              onChange={(value) => dispatch({ type: 'SET_JOB_DESCRIPTION', payload: value })}
              theme="bubble"
              className="mt-1 bg-background/70 border border-muted rounded-md text-text-primary"
              placeholder="Paste the job description here..."
              id="job-description"
            />
          </div>
          <div className="p-4 bg-surface/70 backdrop-blur-lg border border-muted/20 rounded-md">
            <h4 className="font-semibold text-text-primary mb-2">Trending Skills for {jobTitle}</h4>
            <div className="flex flex-wrap gap-2">
              {(trendingSkills[jobTitle] || trendingSkills.default).map((skill) => (
                <motion.span
                  key={skill}
                  className="text-xs bg-muted/20 px-2 py-1 rounded-full text-text-secondary"
                  whileHover={{ scale: 1.1, backgroundColor: '#38bdf8', color: '#fff' }}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>
          <div>
            <motion.button
              onClick={() => setShowTips(!showTips)}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="w-full flex justify-between items-center py-3 px-4 bg-surface/70 text-text-primary rounded-lg"
              aria-expanded={showTips}
              aria-controls="interview-tips"
            >
              <span className="flex items-center gap-2">
                <BookOpen size={18} /> Interview Preparation Tips
              </span>
              {showTips ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </motion.button>
            <motion.div
              variants={sectionVariants}
              initial="collapsed"
              animate={showTips ? 'expanded' : 'collapsed'}
              className="overflow-hidden mt-2"
              id="interview-tips"
            >
              <div className="p-4 bg-background/70 rounded-md text-text-secondary text-sm">
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>STAR Method:</strong> Structure answers with Situation, Task, Action, Result to showcase your skills.
                  </li>
                  <li>
                    <strong>Be Concise:</strong> Keep answers under 2 minutes, focusing on key achievements.
                  </li>
                  <li>
                    <strong>Body Language:</strong> Sit up straight and maintain eye contact (even with the camera).
                  </li>
                  <li>
                    <strong>Research the Role:</strong> Tailor answers to the job description and company values.
                  </li>
                  <li>
                    <strong>Practice Common Questions:</strong> Prepare for questions like "Tell me about yourself" or "Why this role?".
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
          <motion.button
            onClick={startInterview}
            disabled={isLoading}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className="w-full flex justify-center py-3 px-4 bg-gradient-to-r from-accent to-jobPortal text-white font-bold rounded-lg disabled:bg-muted/20"
            aria-label="Start mock interview"
          >
            {isLoading ? <LoadingSpinner /> : 'Start Mock Interview'}
          </motion.button>
        </div>
      </motion.div>
    );
  }

  // Session Page
  if (pageState === 'SESSION') {
    const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto flex flex-col items-center space-y-6 relative">
        <BackgroundAnimation />
        <div className="flex items-center justify-between w-full text-sm text-text-secondary">
          <p>
            Question {currentQuestionIndex + 1}/{questions.length - 1}
          </p>
          <p>Time: {formatTime(sessionTime)}</p>
        </div>
        <AiAvatar status={aiStatus} />
        {subtitles && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-text-secondary max-w-md text-center bg-surface/70 backdrop-blur-lg border border-muted/20 rounded-md px-4 py-2"
            aria-live="polite"
          >
            {subtitles}
          </motion.p>
        )}
        <div className="w-full text-center p-6 bg-surface/60 backdrop-blur-lg border border-muted/20 rounded-lg min-h-[8rem] flex items-center justify-center">
          <p className="text-2xl font-semibold text-text-primary">{questions[currentQuestionIndex]}</p>
        </div>
        <div className="w-full min-h-[150px] bg-surface/60 backdrop-blur-lg border border-muted/20 rounded-lg p-4 relative">
          {useTextInput ? (
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full h-32 bg-transparent text-text-primary resize-none focus:outline-none"
              aria-label="Answer input"
            />
          ) : (
            <p className="text-text-primary">{transcript || 'Speak your answer...'}</p>
          )}
          {aiStatus === 'LISTENING' && !useTextInput && (
            <span className="absolute bottom-4 left-4 inline-block w-3 h-3 bg-red-500 rounded-full animate-pulse" aria-hidden="true" />
          )}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <motion.button
            onClick={submitAnswer}
            disabled={(aiStatus !== 'LISTENING' && !useTextInput) || !transcript.trim()}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className="flex items-center gap-2 px-6 py-3 text-base font-semibold rounded-lg bg-gradient-to-r from-accent to-jobPortal text-white disabled:bg-muted/20"
            aria-label="Submit answer"
          >
            <Send size={18} /> Submit Answer
          </motion.button>
          <motion.button
            onClick={showHint}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className="flex items-center gap-2 px-4 py-2 text-sm text-yellow-300 bg-yellow-500/10 hover:bg-yellow-500/20 rounded-lg"
            aria-label="Show hint"
          >
            <Lightbulb size={16} /> Hint
          </motion.button>
          <motion.button
            onClick={skipQuestion}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary bg-surface/70 hover:bg-surface/90 rounded-lg"
            aria-label="Skip question"
          >
            <SkipForward size={16} /> Skip
          </motion.button>
          <motion.button
            onClick={isPaused ? resumeInterview : togglePause}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary bg-surface/70 hover:bg-surface/90 rounded-lg"
            aria-label={isPaused ? 'Resume interview' : 'Pause interview'}
          >
            {isPaused ? <Play size={16} /> : <Pause size={16} />}
            {isPaused ? 'Resume' : 'Pause'}
          </motion.button>
          <motion.button
            onClick={() => setUseTextInput(!useTextInput)}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary bg-surface/70 hover:bg-surface/90 rounded-lg"
            aria-label={useTextInput ? 'Switch to voice input' : 'Switch to text input'}
          >
            <Mic size={16} /> {useTextInput ? 'Use Voice' : 'Use Text'}
          </motion.button>
          <motion.button
            onClick={endInterview}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg"
            aria-label="End interview"
          >
            <RotateCcw size={16} /> End Session
          </motion.button>
        </div>
        {sampleAnswer && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full mt-4"
          >
            <motion.button
              onClick={() => setShowSample(!showSample)}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="w-full flex justify-between items-center py-3 px-4 bg-surface/70 text-text-primary rounded-lg"
              aria-expanded={showSample}
              aria-controls="sample-answer"
            >
              <span className="flex items-center gap-2">
                <BookOpen size={18} /> View Sample Answer
              </span>
              {showSample ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </motion.button>
            <motion.div
              variants={sectionVariants}
              initial="collapsed"
              animate={showSample ? 'expanded' : 'collapsed'}
              className="overflow-hidden mt-2"
              id="sample-answer"
            >
              <div className="p-4 bg-background/70 rounded-md text-text-secondary text-sm">
                <ReactQuill value={sampleAnswer} readOnly={true} theme="bubble" className="text-text-secondary" />
              </div>
            </motion.div>
          </motion.div>
        )}
        <div className="w-full bg-surface/60 backdrop-blur-lg border border-muted/20 rounded-full h-2.5">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: `${((currentQuestionIndex + 1) / (questions.length - 1)) * 100}%` }}
            className="bg-gradient-to-r from-accent to-jobPortal h-full rounded-full transition-all duration-500"
            aria-label={`Progress: ${currentQuestionIndex + 1} of ${questions.length - 1}`}
          />
        </div>
      </motion.div>
    );
  }

  // Report Page
  if (pageState === 'REPORT') {
    const overallScore = calculateOverallScore();
    return (
      <motion.div initial="initial" animate="in" variants={pageVariants} className="max-w-4xl mx-auto relative">
        <BackgroundAnimation />
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-text-primary">Interview Report</h1>
          <motion.button
            onClick={downloadPDF}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className="flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-gradient-to-r from-accent to-jobPortal text-white"
            aria-label="Download report"
          >
            <Download size={16} /> Download Report
          </motion.button>
        </div>
        <div className="p-6 bg-surface/60 backdrop-blur-lg border border-muted/20 rounded-lg mb-8">
          <h2 className="text-2xl font-semibold text-text-primary mb-4">Overall Performance</h2>
          <p className="text-text-secondary">
            Your overall score: <span className="font-bold text-accent">{overallScore}/100</span>
          </p>
          <p className="text-sm text-text-secondary mt-2">
            {overallScore > 85
              ? 'Excellent performance! You’re ready to shine in real interviews.'
              : overallScore > 65
              ? 'Good effort! Focus on the feedback below to improve.'
              : 'Keep practicing! Use the sample answers and resources to boost your skills.'}
          </p>
          <ScoreChart label="Overall Score" score={overallScore} />
        </div>
        <div className="space-y-8">
          {sessionLog.map((log, index) => (
            <motion.div
              key={index}
              className="p-6 bg-surface/60 backdrop-blur-lg border border-muted/20 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <p className="font-semibold text-text-primary text-lg">
                Question {index + 1}: {log.question}
              </p>
              <p className="mt-3 p-4 bg-background/70 rounded-md italic text-text-secondary">
                Your Answer: "{log.answer}"
              </p>
              {log.feedback && (
                <div className="mt-4 p-4 bg-background/70 border border-muted/20 rounded-lg">
                  <p className="font-semibold text-accent flex items-center gap-2 mb-4">
                    <Sparkles size={18} /> Performance Analysis
                  </p>
                  <div className="space-y-4">
                    <ScoreChart label="Clarity" score={log.feedback.clarityScore} />
                    <ScoreChart label="Relevance" score={log.feedback.relevanceScore} />
                    <ScoreChart label="Impact" score={log.feedback.impactScore} />
                  </div>
                  <div className="mt-6 p-3 bg-blue-900/20 border-l-4 border-blue-400 rounded-r-md">
                    <p className="font-semibold text-blue-300 flex items-center gap-2">
                      <Lightbulb size={16} /> Constructive Feedback
                    </p>
                    <ReactQuill value={log.feedback.constructiveFeedback} readOnly={true} theme="bubble" className="text-blue-200 -mt-2 -ml-3" />
                  </div>
                </div>
              )}
              {log.sampleAnswer && (
                <div className="mt-4 p-4 bg-background/70 border border-muted/20 rounded-lg">
                  <p className="font-semibold text-text-primary flex items-center gap-2 mb-2">
                    <BookOpen size={16} /> Sample Answer
                  </p>
                  <ReactQuill value={log.sampleAnswer} readOnly={true} theme="bubble" className="text-text-secondary" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
        <div className="mt-8 p-6 bg-surface/60 backdrop-blur-lg border border-muted/20 rounded-lg">
          <h2 className="text-2xl font-semibold text-text-primary mb-4">Next Steps & Resources</h2>
          <p className="text-text-secondary mb-4">Continue improving with these free resources:</p>
          <ul className="list-disc pl-5 text-sm text-text-secondary space-y-2">
            <li>
              <a
                href="https://leetcode.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                LeetCode
              </a>
              : Practice technical interview questions.
            </li>
            <li>
              <a
                href="https://www.themuse.com/advice/star-interview-method"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                STAR Method Guide
              </a>
              : Learn how to structure your answers.
            </li>
            <li>
              <a
                href="https://www.coursera.org/learn/interview-preparation"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                Coursera Interview Prep
              </a>
              : Free courses to boost your skills.
            </li>
          </ul>
        </div>
        <motion.button
          onClick={() => dispatch({ type: 'RESET' })}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          className="mt-8 w-full flex justify-center items-center gap-2 py-3 px-4 bg-gradient-to-r from-accent to-jobPortal text-white font-bold rounded-lg"
          aria-label="Start new interview"
        >
          <RotateCcw size={16} /> Start New Interview
        </motion.button>
      </motion.div>
    );
  }
};

export default InterviewPrepPage;