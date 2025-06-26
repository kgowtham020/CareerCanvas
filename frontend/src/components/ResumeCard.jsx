import { FileText, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ResumeCard = ({ resume, onDelete }) => {
  const navigate = useNavigate();

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/editor/${resume.id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(resume.id, resume.title); // Pass title for the toast message
  };

  return (
    <div
      className="bg-secondary p-5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col justify-between h-48 hover:border-accent border border-transparent"
      onClick={() => navigate(`/editor/${resume.id}`)}
    >
      <div>
        <div className="flex justify-between items-start">
          <FileText className="w-8 h-8 text-accent" />
          {/* Buttons now appear on group hover for a cleaner UI */}
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button onClick={handleEdit} className="p-2 rounded-full hover:bg-tertiary text-text-secondary hover:text-accent transition-colors duration-200" title="Edit">
              <Edit size={18} />
            </button>
            <button onClick={handleDelete} className="p-2 rounded-full hover:bg-tertiary text-text-secondary hover:text-red-500 transition-colors duration-200" title="Delete">
              <Trash2 size={18} />
            </button>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-text-primary mt-4 truncate">{resume.title}</h3>
      </div>
      <p className="text-sm text-text-secondary mt-2">Last updated: {resume.lastUpdated}</p>
    </div>
  );
};

export default ResumeCard;