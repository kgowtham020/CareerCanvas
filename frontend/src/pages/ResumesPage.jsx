import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowRight, LayoutTemplate, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import resumeService from '../services/resume.service';

const resumeTemplates = [
  { id: 'odyssey', name: 'Odyssey', description: 'A modern, single-column template for tech roles.', imageUrl: 'https://i.imgur.com/3ZQI2H8.png' },
  { id: 'apex', name: 'Apex', description: 'A comprehensive layout for experienced professionals.', imageUrl: 'https://i.imgur.com/s6z6sD2.png' },
  { id: 'vantage', name: 'Vantage', description: 'A classic two-column design for clarity.', imageUrl: 'https://i.imgur.com/xT5pG3s.png' },
  { id: 'creative', name: 'Creative', description: 'A stylish resume with a sidebar for creative roles.', imageUrl: 'https://i.imgur.com/L1Z0oJ7.png' },
];

const pageVariants = { initial: { opacity: 0, y: 20 }, in: { opacity: 1, y: 0 } };

const ResumesPage = () => {
  const [userResumes, setUserResumes] = useState([]);
  const navigate = useNavigate();

  // Fetch the user's saved resumes when the page loads
  useEffect(() => {
    resumeService.getAllResumes()
      .then(response => {
        setUserResumes(response.data);
      })
      .catch(error => {
        console.error("Error fetching resumes:", error);
        toast.error("Could not load your saved resumes.");
      });
  }, []);

  const handleCreateNewFromTemplate = (template) => {
    const newId = 'new'; // Use a special keyword for new resumes
    toast.success(`Starting new resume with "${template.name}" template!`);
    navigate(`/editor/${newId}?template=${template.id}`);
  };

  const handleDeleteResume = async (e, resumeId, resumeTitle) => {
    e.stopPropagation(); // Prevent navigation when clicking the delete button
    if (window.confirm(`Are you sure you want to delete "${resumeTitle}"?`)) {
      try {
        await resumeService.deleteResume(resumeId);
        toast.success(`"${resumeTitle}" has been deleted.`);
        // Refresh the list by filtering out the deleted resume
        setUserResumes(prevResumes => prevResumes.filter(r => r._id !== resumeId));
      } catch (error) {
        console.error("Error deleting resume:", error);
        toast.error("Failed to delete resume.");
      }
    }
  };

  return (
    <motion.div initial="initial" animate="in" variants={pageVariants} transition={{ duration: 0.5 }} className="space-y-12">
      <section>
        <header><h1 className="text-3xl font-bold text-text-primary">Start with a Professional Template</h1><p className="text-text-secondary mt-1">Choose a free, ATS-friendly template to begin.</p></header>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10 mt-6">
          {resumeTemplates.map(template => (
            <div key={template.id} className="group cursor-pointer" onClick={() => handleCreateNewFromTemplate(template)}>
              <div className="aspect-[8.5/11] bg-secondary rounded-lg overflow-hidden border-2 border-tertiary group-hover:border-accent group-hover:scale-[1.02] transition-all duration-300 shadow-lg"><img src={template.imageUrl} alt={template.name} className="w-full h-full object-cover object-top"/></div>
              <div className="flex justify-between items-center mt-3"><h3 className="font-semibold text-text-primary">{template.name}</h3><div className="flex items-center gap-2 px-3 py-1 text-xs rounded-full bg-accent text-white opacity-0 group-hover:opacity-100 transition-opacity">Use Template <ArrowRight size={14}/></div></div>
              <p className="text-sm text-text-secondary">{template.description}</p>
            </div>
          ))}
        </div>
      </section>
      <section>
        <header><h2 className="text-2xl font-bold text-text-primary">My Documents</h2><p className="text-text-secondary mt-1">Manage your saved resumes.</p></header>
        <div className="space-y-3 mt-6">
          {userResumes.length > 0 ? userResumes.map(resume => (
            <motion.div key={resume._id} onClick={() => navigate(`/editor/${resume._id}`)} className="group flex items-center justify-between p-4 bg-secondary rounded-lg cursor-pointer hover:bg-tertiary transition-colors">
              <div className="flex items-center"><FileText className="w-6 h-6 text-accent mr-4"/><div><h3 className="font-semibold text-text-primary">{resume.title}</h3><p className="text-sm text-text-secondary">Last updated: {new Date(resume.updatedAt).toLocaleDateString()}</p></div></div>
              <div className="flex items-center gap-4">
                <button onClick={(e) => handleDeleteResume(e, resume._id, resume.title)} className="p-2 rounded-full text-text-secondary opacity-0 group-hover:opacity-100 hover:bg-primary hover:text-red-500 transition-all"><Trash2 size={16}/></button>
                <ArrowRight className="text-text-secondary group-hover:text-accent transition-transform group-hover:translate-x-1"/>
              </div>
            </motion.div>
          )) : (
            <div className="text-center py-12 bg-secondary rounded-lg border-2 border-dashed border-tertiary">
                <LayoutTemplate className="mx-auto h-12 w-12 text-text-secondary" /><h3 className="mt-2 text-sm font-semibold text-text-primary">No Saved Documents Yet</h3><p className="mt-1 text-sm text-text-secondary">Select a template above to get started.</p>
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
};
export default ResumesPage;