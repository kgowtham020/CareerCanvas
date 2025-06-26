import { useState, useEffect, useRef, useCallback } from 'react';
import { Loader2, CheckCircle, Lightbulb, GraduationCap, BarChart, UploadCloud, File, X, Info, Wand2, Sparkles, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Player } from '@lottiefiles/react-lottie-player';
import { Tooltip } from 'react-tooltip';
import { useDropzone } from 'react-dropzone';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const pageVariants = {
  initial: { opacity: 0, y: 50, scale: 0.9, filter: 'blur(10px)' },
  in: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
  out: { opacity: 0, y: -50, scale: 0.9, filter: 'blur(10px)' },
};

const tabVariants = {
  initial: { opacity: 0, x: -30, rotate: -10, scale: 0.9 },
  in: { opacity: 1, x: 0, rotate: 0, scale: 1 },
  out: { opacity: 0, x: 30, rotate: 10, scale: 0.9 },
};

const ScoreGauge = ({ score }) => {
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;
  let colorClass = 'text-error';
  if (score > 80) colorClass = 'text-success';
  else if (score > 60) colorClass = 'text-warning';

  return (
    <motion.div
      className="relative w-60 h-72 bg-surface/60 backdrop-blur-lg rounded-3xl p-6 shadow-2xl glass"
      initial={{ scale: 0, rotate: 180, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      transition={{ duration: 1.2, type: 'spring', stiffness: 80 }}
      whileHover={{ scale: 1.07, boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)' }}
    >
      <svg className="w-full h-full" viewBox="0 0 100 100" role="img" aria-label="Magical Match Score Gauge">
        <circle className="text-muted" strokeWidth="8" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
        <motion.circle
          className={colorClass}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
          initial={{ pathLength: 0, rotate: -90 }}
          animate={{ pathLength: 1, rotate: 0 }}
          transition={{ duration: 2, ease: 'circOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0, rotate: 360 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.5, duration: 1.2 }}
        >
          <Player
            autoplay
            loop
            src="https://assets.lottiefiles.com/packages/lf20_j3k3qw7n.json"
            style={{ height: '90px', width: '90px', filter: 'drop-shadow(0 0 10px #38bdf8)' }}
          />
        </motion.div>
        <motion.span
          className={`text-5xl font-bold ${colorClass} drop-shadow-md`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          {score}%
        </motion.span>
        <motion.span
          className="text-xl text-text-secondary uppercase tracking-widest"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          Magic Match Score
        </motion.span>
      </div>
      <Sparkles className="absolute top-2 right-2 w-6 h-6 text-accent animate-pulse" />
      <Info
        className="absolute bottom-2 right-2 w-6 h-6 text-subtle cursor-help"
        data-tooltip-id="score-tooltip"
        data-tooltip-content="Witness the magic! This score reveals how perfectly your resume aligns with the job. Aim for 80%+ to dazzle employers!"
        aria-label="Score Magic Tooltip"
      />
      <Tooltip id="score-tooltip" place="top" className="bg-surface text-text-secondary text-sm p-3 rounded-lg shadow-xl z-50" />
    </motion.div>
  );
};

const SkillsComparisonChart = ({ skillsData }) => (
  <motion.div
    className="bg-surface/60 backdrop-blur-lg rounded-3xl p-8 shadow-2xl glass"
    initial={{ opacity: 0, y: 50, rotate: 5 }}
    animate={{ opacity: 1, y: 0, rotate: 0 }}
    transition={{ duration: 0.8, ease: 'easeOut' }}
  >
    <ResponsiveContainer width="100%" height={400}>
      <RechartsBarChart data={skillsData} margin={{ top: 30, right: 40, left: 20, bottom: 10 }}>
        <CartesianGrid strokeDasharray="6 6" stroke="#334155" />
        <XAxis dataKey="skill" tick={{ fill: '#94a3b8', fontSize: 14 }} />
        <YAxis tick={{ fill: '#94a3b8', fontSize: 14 }} />
        <RechartsTooltip
          contentStyle={{ background: '#1e293b', border: '1px solid #334155', color: '#f8fafc', borderRadius: '10px', padding: '10px' }}
          itemStyle={{ color: '#f8fafc' }}
        />
        <Bar dataKey="required" fill="#38bdf8" name="Required" radius={[15, 15, 0, 0]} />
        <Bar dataKey="possessed" fill="#a78bfa" name="Possessed" radius={[15, 15, 0, 0]} />
      </RechartsBarChart>
    </ResponsiveContainer>
    <motion.p
      className="text-text-secondary text-center mt-6 italic text-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.8 }}
    >
      Behold the magic! Blue bars reveal required skills, purple shows yours. Let’s bridge the gap with enchantment!
    </motion.p>
    <Wand2 className="absolute top-4 right-4 w-8 h-8 text-accent animate-bounce" />
  </motion.div>
);

const ATSAnalyzerPage = () => {
  const [resumes, setResumes] = useState([]);
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [activeTab, setActiveTab] = useState('score');
  const [resumeSource, setResumeSource] = useState('select');
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // TODO: Fetch resumes from backend API (e.g., resumeService.getAllResumes())
    // Placeholder: Simulate fetching resumes with a magical delay
    setTimeout(() => {
      setResumes([{ _id: '1', title: 'Resume 1' }, { _id: '2', title: 'Resume 2' }]);
      if (resumes.length > 0) setSelectedResumeId(resumes[0]._id);
    }, 1200);
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && (file.type === 'application/pdf' || file.type.includes('word'))) {
      setUploadedFile(file);
      toast.success('Resume uploaded with a touch of magic!');
    } else {
      toast.error('Please upload a PDF or DOCX file.');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'application/msword': ['.doc', '.docx'] },
    maxFiles: 1,
  });

  const handleAnalyze = (e) => {
    e.preventDefault();
    if (!jobDescription) {
      toast.error('Please weave a job description into the magic!');
      return;
    }
    if (resumeSource === 'select' && !selectedResumeId) {
      toast.error('Please select a resume to enchant!');
      return;
    }
    if (resumeSource === 'upload' && !uploadedFile) {
      toast.error('Please upload a resume to cast the spell!');
      return;
    }

    setIsLoading(true);
    setAnalysisResult(null);

    // TODO: Call backend API to analyze ATS (e.g., axios.post('/api/ats/analyze', { jobDescription, resumeContent }))
    // Placeholder: Simulate magical analysis with a delay
    setTimeout(() => {
      setAnalysisResult({
        score: 75,
        eligibility: { degree: 'B.Tech', branch: 'CSE', passingYear: '2023', location: 'Remote' },
        skills: [{ name: 'JavaScript', required: true, possessed: true }, { name: 'Python', required: true, possessed: false }],
        role: { title: 'Developer', tasks: ['Code UI', 'Test Apps'], experience: '0-2 years' },
        suggestions: ['Add Python skills with a spell!', 'Highlight projects with magic!'],
      });
      setActiveTab('score');
      toast.success('The magic is complete! Analysis revealed!');
      setIsLoading(false);
    }, 2500);
  };

  const removeUploadedFile = () => {
    setUploadedFile(null);
    fileInputRef.current.value = '';
    toast.success('Resume removed with a wave of magic!');
  };

  const tabs = [
    { id: 'score', label: 'Match Score', icon: <BarChart size={20} /> },
    { id: 'eligibility', label: 'Eligibility', icon: <GraduationCap size={20} /> },
    { id: 'skills', label: 'Skills', icon: <Wand2 size={20} /> },
    { id: 'role', label: 'Job Role', icon: <Briefcase size={20} /> },
    { id: 'suggestions', label: 'Magic Tips', icon: <Lightbulb size={20} /> },
  ];

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-background via-surface/20 to-background py-20 px-4 sm:px-6 lg:px-12 overflow-hidden"
      variants={pageVariants}
      initial="initial"
      animate="in"
      exit="out"
      transition={{ duration: 1, ease: 'easeInOut' }}
    >
      <div className="max-w-7xl mx-auto relative">
        <motion.div
          className="absolute top-10 left-10 w-20 h-20 bg-accent/20 rounded-full blur-2xl animate-pulse"
          initial={{ scale: 0 }}
          animate={{ scale: 1.5 }}
          transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-24 h-24 bg-secondary/20 rounded-full blur-2xl animate-pulse"
          initial={{ scale: 0 }}
          animate={{ scale: 1.5 }}
          transition={{ duration: 5, repeat: Infinity, repeatType: 'reverse' }}
        />
        <motion.h1
          className="text-6xl font-heading text-text-primary text-center mb-12 tracking-wide drop-shadow-lg"
          initial={{ opacity: 0, y: -100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.3, duration: 1.2, type: 'spring' }}
        >
          ATS Magic Analyzer
        </motion.h1>
        <motion.p
          className="text-text-secondary text-center mb-16 max-w-4xl mx-auto text-xl leading-relaxed drop-shadow-md"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Step into a world of career enchantment! Our AI-powered ATS Magic Analyzer transforms your resume into a job-winning masterpiece. Paste a job description, upload your resume, and let the magic reveal your path to success—crafted for graduates and freshers!
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Input Section */}
          <motion.div
            className="glass rounded-3xl p-10 shadow-2xl relative overflow-hidden"
            initial={{ opacity: 0, x: -150, rotate: -5 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ delay: 0.7, duration: 1.2 }}
            whileHover={{ scale: 1.03, boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)' }}
          >
            <Wand2 className="absolute top-4 left-4 w-8 h-8 text-accent animate-spin-slow" />
            <h2 className="text-4xl font-heading text-text-primary mb-8 relative z-10">Cast Your Career Spell</h2>
            <form onSubmit={handleAnalyze} className="space-y-8 relative z-10">
              <div className="space-y-3">
                <label className="block text-text-primary text-2xl flex items-center">
                  Job Description
                  <Info
                    className="ml-2 w-6 h-6 text-subtle cursor-help"
                    data-tooltip-id="jd-tooltip"
                    data-tooltip-content="Unleash the magic by pasting the full job description—role, skills, location, and more!"
                    aria-label="Job Description Magic Info"
                  />
                </label>
                <Tooltip id="jd-tooltip" place="top" className="bg-surface text-text-secondary text-md p-4 rounded-xl shadow-2xl z-50" />
                <motion.textarea
                  className="w-full h-56 bg-surface text-text-primary rounded-2xl p-6 border border-muted focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the mystical job description here..."
                  initial={{ scale: 0.97 }}
                  animate={{ scale: 1 }}
                  whileFocus={{ scale: 1.02, boxShadow: '0 0 15px #38bdf8' }}
                />
                <motion.p
                  className="text-sm text-text-secondary text-right"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  {jobDescription.length}/2000 characters
                </motion.p>
              </div>

              <div className="space-y-3">
                <label className="block text-text-primary text-2xl">Choose Your Magic Source</label>
                <div className="flex space-x-8">
                  <motion.label
                    className="flex items-center text-text-secondary text-xl cursor-pointer"
                    whileHover={{ color: '#60a5fa', scale: 1.05 }}
                  >
                    <input
                      type="radio"
                      value="select"
                      checked={resumeSource === 'select'}
                      onChange={() => setResumeSource('select')}
                      className="mr-2 text-accent focus:ring-accent"
                      aria-checked={resumeSource === 'select'}
                    />
                    Select Saved Resume
                  </motion.label>
                  <motion.label
                    className="flex items-center text-text-secondary text-xl cursor-pointer"
                    whileHover={{ color: '#60a5fa', scale: 1.05 }}
                  >
                    <input
                      type="radio"
                      value="upload"
                      checked={resumeSource === 'upload'}
                      onChange={() => setResumeSource('upload')}
                      className="mr-2 text-accent focus:ring-accent"
                      aria-checked={resumeSource === 'upload'}
                    />
                    Upload New Resume
                  </motion.label>
                </div>
              </div>

              {resumeSource === 'select' ? (
                <div className="space-y-3">
                  <label className="block text-text-primary text-2xl" htmlFor="resumeSelect">
                    Select Your Scroll
                  </label>
                  <motion.select
                    id="resumeSelect"
                    className="w-full bg-surface text-text-primary rounded-2xl p-4 border border-muted focus:outline-none focus:ring-2 focus:ring-accent appearance-none"
                    value={selectedResumeId}
                    onChange={(e) => setSelectedResumeId(e.target.value)}
                    initial={{ scale: 0.97 }}
                    animate={{ scale: 1 }}
                    whileFocus={{ scale: 1.03, boxShadow: '0 0 15px #a78bfa' }}
                    aria-label="Select a magical resume"
                  >
                    {resumes.length > 0 ? (
                      resumes.map((resume) => (
                        <option key={resume._id} value={resume._id} className="py-3">
                          {resume.title || 'Mystical Resume'}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        No magical resumes yet
                      </option>
                    )}
                  </motion.select>
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="block text-text-primary text-2xl">Upload Your Spellbook</label>
                  <motion.div
                    {...getRootProps()}
                    className={`border-2 border-dashed border-muted rounded-2xl p-10 text-center ${
                      isDragActive ? 'bg-accent/30' : 'bg-surface'
                    } transition-all duration-500`}
                    initial={{ scale: 0.97 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.05, borderColor: '#60a5fa', boxShadow: '0 0 20px #38bdf8' }}
                    aria-label="Drag and drop your magical resume"
                  >
                    <input {...getInputProps()} ref={fileInputRef} />
                    {uploadedFile ? (
                      <motion.div
                        className="flex items-center justify-between bg-muted/50 rounded-xl p-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="flex items-center space-x-4">
                          <File className="w-7 h-7 text-accent animate-pulse" />
                          <span className="text-text-primary text-xl">{uploadedFile.name}</span>
                        </div>
                        <motion.button
                          type="button"
                          onClick={removeUploadedFile}
                          className="text-error hover:text-error/80"
                          whileHover={{ scale: 1.2, rotate: 360 }}
                          whileTap={{ scale: 0.9 }}
                          transition={{ duration: 0.5 }}
                          aria-label="Remove magical resume"
                        >
                          <X size={24} />
                        </motion.button>
                      </motion.div>
                    ) : (
                      <div className="space-y-4">
                        <UploadCloud className="mx-auto w-16 h-16 text-accent animate-bounce" />
                        <p className="text-text-secondary text-xl">
                          {isDragActive ? 'Drop your spellbook here...' : 'Drag & drop or click to upload (PDF/DOCX)'}
                        </p>
                      </div>
                    )}
                  </motion.div>
                </div>
              )}

              <motion.button
                type="submit"
                className="w-full bg-accent text-text-primary text-2xl py-4 rounded-2xl flex items-center justify-center space-x-3 shadow-lg"
                disabled={isLoading}
                initial={{ scale: 0.97 }}
                whileHover={{ scale: 1.08, backgroundColor: '#60a5fa', boxShadow: '0 10px 30px #38bdf8' }}
                whileTap={{ scale: 0.95 }}
                aria-label="Unleash the Magic"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={28} />
                    <span>Weaving Magic...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="animate-spin-slow" size={28} />
                    <span>Unleash the Magic!</span>
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Results Section */}
          <motion.div
            className="glass rounded-3xl p-10 shadow-2xl relative overflow-hidden"
            initial={{ opacity: 0, x: 150, rotate: 5 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ delay: 0.7, duration: 1.2 }}
            whileHover={{ scale: 1.03, boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)' }}
          >
            <Sparkles className="absolute top-4 left-4 w-8 h-8 text-secondary animate-twinkle" />
            <h2 className="text-4xl font-heading text-text-primary mb-8 relative z-10">Revealed Magic</h2>
            {isLoading ? (
              <motion.div
                className="flex flex-col items-center justify-center h-96"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7 }}
              >
                <Player
                  autoplay
                  loop
                  src="https://assets.lottiefiles.com/packages/lf20_kh2lfo.json"
                  style={{ height: '180px', width: '180px', filter: 'drop-shadow(0 0 15px #a78bfa)' }}
                />
                <motion.p
                  className="text-text-secondary text-2xl mt-6 text-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  Casting the ultimate career spell... Hold tight!
                </motion.p>
              </motion.div>
            ) : analysisResult ? (
              <>
                <div className="flex space-x-6 mb-8 overflow-x-auto pb-3">
                  {tabs.map((tab) => (
                    <motion.button
                      key={tab.id}
                      className={`flex items-center px-6 py-4 rounded-2xl ${
                        activeTab === tab.id ? 'bg-accent text-text-primary shadow-inner' : 'bg-surface text-text-secondary'
                      } transition-all duration-400`}
                      onClick={() => setActiveTab(tab.id)}
                      variants={tabVariants}
                      initial="initial"
                      animate="in"
                      exit="out"
                      whileHover={{ scale: 1.1, backgroundColor: activeTab === tab.id ? '#60a5fa' : '#475569' }}
                      aria-label={`Reveal ${tab.label} magic`}
                    >
                      {tab.icon}
                      <span className="ml-3 text-xl font-medium">{tab.label}</span>
                    </motion.button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {activeTab === 'score' && (
                    <motion.div
                      key="score"
                      variants={tabVariants}
                      initial="initial"
                      animate="in"
                      exit="out"
                      className="text-center"
                    >
                      <ScoreGauge score={analysisResult.score || 0} />
                      <motion.p
                        className="text-text-secondary text-xl mt-8 leading-relaxed"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                      >
                        {analysisResult.score > 80
                          ? 'A magical fit! Your resume dazzles for this role!'
                          : analysisResult.score > 60
                          ? 'Good magic! Add a sprinkle more to shine brighter.'
                          : 'Needs a magic boost! Tailor your resume to enchant employers.'}
                      </motion.p>
                    </motion.div>
                  )}
                  {activeTab === 'eligibility' && (
                    <motion.div
                      key="eligibility"
                      variants={tabVariants}
                      initial="initial"
                      animate="in"
                      exit="out"
                      className="space-y-6"
                    >
                      <h3 className="text-3xl font-heading text-text-primary mb-6">Eligibility Enchantment</h3>
                      <ul className="space-y-5 text-text-secondary text-xl">
                        <motion.li
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2, duration: 0.7 }}
                        >
                          <span className="font-bold">Degree:</span> {analysisResult.eligibility?.degree || 'Unrevealed'}
                        </motion.li>
                        <motion.li
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3, duration: 0.7 }}
                        >
                          <span className="font-bold">Branch:</span> {analysisResult.eligibility?.branch || 'Unrevealed'}
                        </motion.li>
                        <motion.li
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4, duration: 0.7 }}
                        >
                          <span className="font-bold">Passing Year:</span> {analysisResult.eligibility?.passingYear || 'Unrevealed'}
                        </motion.li>
                        <motion.li
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5, duration: 0.7 }}
                        >
                          <span className="font-bold">Location:</span> {analysisResult.eligibility?.location || 'Unrevealed'}
                        </motion.li>
                      </ul>
                    </motion.div>
                  )}
                  {activeTab === 'skills' && (
                    <motion.div
                      key="skills"
                      variants={tabVariants}
                      initial="initial"
                      animate="in"
                      exit="out"
                    >
                      <h3 className="text-3xl font-heading text-text-primary mb-6">Skills Sorcery</h3>
                      <SkillsComparisonChart
                        skillsData={analysisResult.skills?.map((skill) => ({
                          skill: skill.name,
                          required: skill.required ? 1 : 0,
                          possessed: skill.possessed ? 1 : 0,
                        }))}
                      />
                    </motion.div>
                  )}
                  {activeTab === 'role' && (
                    <motion.div
                      key="role"
                      variants={tabVariants}
                      initial="initial"
                      animate="in"
                      exit="out"
                      className="space-y-6"
                    >
                      <h3 className="text-3xl font-heading text-text-primary mb-6">Job Role Revelation</h3>
                      <motion.p
                        className="text-text-secondary text-xl"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.7 }}
                      >
                        <span className="font-bold">Role:</span> {analysisResult.role?.title || 'Unrevealed'}
                      </motion.p>
                      <motion.p
                        className="text-text-secondary text-xl"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.7 }}
                      >
                        <span className="font-bold">Tasks:</span>
                      </motion.p>
                      <ul className="list-disc list-inside text-text-secondary text-xl space-y-3">
                        {(analysisResult.role?.tasks || []).map((task, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + index * 0.1, duration: 0.7 }}
                          >
                            {task}
                          </motion.li>
                        ))}
                      </ul>
                      <motion.p
                        className="text-text-secondary text-xl"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.7 }}
                      >
                        <span className="font-bold">Experience Required:</span> {analysisResult.role?.experience || 'Unrevealed'}
                      </motion.p>
                    </motion.div>
                  )}
                  {activeTab === 'suggestions' && (
                    <motion.div
                      key="suggestions"
                      variants={tabVariants}
                      initial="initial"
                      animate="in"
                      exit="out"
                      className="space-y-6"
                    >
                      <h3 className="text-3xl font-heading text-text-primary mb-6">Magical Career Tips</h3>
                      <ul className="list-disc list-inside text-text-secondary text-xl space-y-4">
                        {(analysisResult.suggestions || []).map((suggestion, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + index * 0.1, duration: 0.7 }}
                          >
                            {suggestion}
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Persistent Suggestions Section */}
                <motion.div
                  className="mt-12 bg-surface/60 backdrop-blur-lg rounded-2xl p-6 shadow-xl glass"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                >
                  <h3 className="text-2xl font-heading text-text-primary mb-4 flex items-center">
                    <Lightbulb className="mr-2 w-6 h-6 text-accent animate-pulse" />
                    Final Magical Career Tips
                  </h3>
                  <ul className="list-disc list-inside text-text-secondary text-lg space-y-3">
                    {(analysisResult.suggestions || []).map((suggestion, index) => (
                      <motion.li
                        key={`final-${index}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9 + index * 0.1, duration: 0.7 }}
                      >
                        {suggestion}
                      </motion.li>
                    ))}
                  </ul>
                  <motion.p
                    className="text-text-secondary text-center mt-4 italic text-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1, duration: 0.7 }}
                  >
                    Take these tips and weave your career destiny!
                  </motion.p>
                  <Sparkles className="absolute top-2 right-2 w-6 h-6 text-secondary animate-twinkle" />
                </motion.div>
              </>
            ) : (
              <motion.div
                className="flex flex-col items-center justify-center h-96"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7 }}
              >
                <Player
                  autoplay
                  loop
                  src="https://assets.lottiefiles.com/packages/lf20_3rwasyjy.json"
                  style={{ height: '200px', width: '200px', filter: 'drop-shadow(0 0 20px #a78bfa)' }}
                />
                <motion.p
                  className="text-text-secondary text-2xl mt-8 text-center"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  Ready to unlock your career destiny? Add a job description and resume to begin the magic!
                </motion.p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ATSAnalyzerPage;