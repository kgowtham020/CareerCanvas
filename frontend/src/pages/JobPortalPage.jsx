import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Search, Briefcase, MapPin, Clock } from 'lucide-react';
import { Player } from '@lottiefiles/react-lottie-player';
import aiService from '../services/ai.service.js';

// Hardcoded Company Data (What We Offer)
const offerings = [
  { title: "Top Companies", description: "Access exclusive job listings from Google, Microsoft, Amazon, and more.", icon: Briefcase },
  { title: "Student-Focused", description: "Internships, entry-level roles, and career resources tailored for graduates.", icon: MapPin },
  { title: "Easy Navigation", description: "Search, filter, and explore opportunities with a clean, intuitive design.", icon: Clock },
];

// Sample Job Listings (What They Get)
const jobListings = [
  { id: '1', title: 'Software Engineer Intern', company: 'Google', logoUrl: 'https://svgl.app/library/google.svg', location: 'Remote', type: 'Internship', description: 'Kickstart your career with real-world projects at a tech giant.' },
  { id: '2', title: 'Junior Developer', company: 'Microsoft', logoUrl: 'https://svgl.app/library/microsoft.svg', location: 'Redmond, WA', type: 'Full-Time', description: 'Build cutting-edge software with a supportive team.' },
  { id: '3', title: 'Frontend Engineer', company: 'Amazon', logoUrl: 'https://svgl.app/library/amazon-icon.svg', location: 'Seattle, WA', type: 'Full-Time', description: 'Create user-friendly interfaces for millions.' },
];

// Animation Variants
const pageVariants = { initial: { opacity: 0, y: 20 }, in: { opacity: 1, y: 0 }, out: { opacity: 0, y: -20 } };
const cardVariants = { hover: { scale: 1.05, boxShadow: '0 0 15px rgba(56,189,248,0.5)' }, tap: { scale: 0.95 } };

// Background Animation
const BackgroundAnimation = () => (
  <div className="absolute inset-0 z-[-1] opacity-10">
    <Player src="https://assets.lottiefiles.com/packages/lf20_rovfyyog.json" autoplay loop style={{ width: '100%', height: '100%' }} aria-hidden="true" />
  </div>
);

const JobPortalPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter jobs based on search term
  const filteredJobs = jobListings.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background text-text-primary font-inter relative overflow-hidden p-6"
    >
      <BackgroundAnimation />

      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-accent to-jobPortal bg-clip-text text-transparent">
          Your Job Portal
        </h1>
        <p className="text-text-secondary text-lg mt-2">Launch your career with opportunities built for graduates.</p>
      </header>

      {/* What We Offer Section */}
      <section className="max-w-6xl mx-auto mb-12">
        <h2 className="text-3xl font-semibold text-accent mb-6 text-center">What We Offer</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offerings.map((offer, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover="hover"
              whileTap="tap"
              className="p-6 bg-surface/60 backdrop-blur-lg border border-muted rounded-xl shadow-lg"
            >
              <offer.icon className="text-accent mb-4" size={32} />
              <h3 className="text-xl font-semibold text-text-primary mb-2">{offer.title}</h3>
              <p className="text-text-secondary">{offer.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Search Bar */}
      <section className="max-w-3xl mx-auto mb-12">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" size={24} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search jobs or companies..."
            className="w-full pl-12 pr-4 py-4 bg-surface/60 backdrop-blur-lg border border-muted rounded-lg text-text-primary focus:ring-2 ring-accent outline-none placeholder-text-secondary"
            aria-label="Search jobs"
          />
        </div>
      </section>

      {/* What They Get - Job Listings */}
      <section className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-accent mb-6 text-center">What You Get</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <motion.div
                key={job.id}
                variants={cardVariants}
                whileHover="hover"
                whileTap="tap"
                className="p-6 bg-surface/60 backdrop-blur-lg border border-muted rounded-xl shadow-lg cursor-pointer"
                aria-label={`Explore ${job.title} at ${job.company}`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <img src={job.logoUrl} alt={`${job.company} logo`} className="w-12 h-12 rounded-md bg-white p-1 object-contain" />
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary">{job.title}</h3>
                    <p className="text-sm text-text-secondary">{job.company}</p>
                  </div>
                </div>
                <p className="text-sm text-text-secondary flex items-center gap-2 mb-2">
                  <MapPin size={16} /> {job.location}
                </p>
                <p className="text-sm text-text-secondary flex items-center gap-2 mb-4">
                  <Clock size={16} /> {job.type}
                </p>
                <p className="text-sm text-text-secondary line-clamp-2">{job.description}</p>
                <motion.a
                  href="#"
                  variants={cardVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="mt-4 flex items-center gap-2 justify-center py-2 bg-gradient-to-r from-accent to-jobPortal text-white rounded-lg"
                  aria-label={`Learn more about ${job.title}`}
                >
                  Learn More <ExternalLink size={16} />
                </motion.a>
              </motion.div>
            ))
          ) : (
            <p className="text-center text-text-secondary col-span-full">No jobs match your search. Try something else!</p>
          )}
        </div>
      </section>
    </motion.div>
  );
};

export default JobPortalPage;