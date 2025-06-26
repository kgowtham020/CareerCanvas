import { Construction } from 'lucide-react';

const CoverLettersPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <Construction className="w-24 h-24 text-accent mb-4" />
      <h1 className="text-3xl font-bold text-text-primary">Coming Soon!</h1>
      <p className="text-text-secondary mt-2">
        The Cover Letter builder is currently under construction.
      </p>
    </div>
  );
};

export default CoverLettersPage;