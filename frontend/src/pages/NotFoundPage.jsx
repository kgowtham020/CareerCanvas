import { Frown } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-primary text-center">
      <Frown className="w-24 h-24 text-accent mb-4" />
      <h1 className="text-4xl font-bold text-text-primary">404 - Not Found</h1>
      <p className="text-text-secondary mt-2 mb-6">
        The page you are looking for does not exist.
      </p>
      <Link 
        to="/"
        className="py-2 px-6 bg-accent hover:bg-accent-hover text-white font-bold rounded-lg transition-colors duration-300"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFoundPage;