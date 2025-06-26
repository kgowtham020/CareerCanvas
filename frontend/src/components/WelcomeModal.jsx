import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const WelcomeModal = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-secondary rounded-lg shadow-xl w-full max-w-lg p-6 relative"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-text-secondary hover:text-text-primary">
              <X size={24} />
            </button>
            <div className="text-center">
              <img src="/logo.svg" alt="CareerCanvas Logo" className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-text-primary">Welcome to CareerCanvas!</h2>
              <p className="text-text-secondary mt-2">
                This is your all-in-one dashboard to build a great resume, find jobs, and land your dream career.
              </p>
              <p className="text-text-secondary mt-4">
                Start by creating a new resume or analyzing an existing one with our AI-powered ATS scanner.
              </p>
              <button
                onClick={onClose}
                className="mt-6 w-full bg-accent hover:bg-accent-hover text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
              >
                Let's Get Started
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeModal;