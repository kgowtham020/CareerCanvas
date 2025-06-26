import { motion } from 'framer-motion';
import { Users, MessageSquare, Briefcase } from 'lucide-react';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const CommunityHubPage = () => {
  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.5 }} className="text-center">
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-text-primary">Community Hub</h1>
        <p className="text-text-secondary mt-2 text-lg">Connect, learn, and grow with your peers. <span className="text-yellow-400 font-semibold">(Coming Soon)</span></p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div className="p-6 bg-secondary rounded-lg">
          <MessageSquare className="w-12 h-12 text-accent mx-auto mb-4"/>
          <h2 className="text-xl font-semibold text-text-primary">Feedback Forums</h2>
          <p className="text-text-secondary mt-2">Get anonymous, constructive feedback on your resume drafts from fellow job-seekers.</p>
        </div>
        <div className="p-6 bg-secondary rounded-lg">
          <Users className="w-12 h-12 text-accent mx-auto mb-4"/>
          <h2 className="text-xl font-semibold text-text-primary">Peer Mock Interviews</h2>
          <p className="text-text-secondary mt-2">Practice interviewing with other members in a low-stakes, supportive environment.</p>
        </div>
        <div className="p-6 bg-secondary rounded-lg">
          <Briefcase className="w-12 h-12 text-accent mx-auto mb-4"/>
          <h2 className="text-xl font-semibold text-text-primary">Industry Q&A</h2>
          <p className="text-text-secondary mt-2">Join live Q&A sessions with industry professionals and recruiters.</p>
        </div>
      </div>
    </motion.div>
  );
};

export default CommunityHubPage;