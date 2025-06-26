import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Loader2, Plus, Trash2, User, Briefcase, GraduationCap, Code, Star } from 'lucide-react';
import profileService from '../services/profile.service.js';

// A new, styled wrapper for each major section on the page, using our "glassmorphism" style.
const SectionCard = ({ title, icon, onAddItem, children }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="bg-surface/50 backdrop-blur-lg border border-muted/30 rounded-2xl shadow-xl"
    >
        <div className="p-4 sm:p-6 border-b border-muted/30 flex justify-between items-center">
            <h2 className="text-xl font-bold text-text-primary flex items-center gap-3">
                {icon}
                <span>{title}</span>
            </h2>
            {onAddItem && (
                <button onClick={onAddItem} className="flex items-center gap-2 text-sm font-semibold bg-accent/10 text-accent px-3 py-1.5 rounded-lg hover:bg-accent/20 transition-colors">
                    <Plus size={16}/>Add New
                </button>
            )}
        </div>
        <div className="p-4 sm:p-6 space-y-6">
            {children}
        </div>
    </motion.div>
);

// A new, professionally styled input component for consistency.
const FormInput = ({ label, ...props }) => (
    <div>
        <label className="text-sm font-medium text-text-secondary">{label}</label>
        <input {...props} className="mt-1 w-full p-3 bg-background/70 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"/>
    </div>
);

// A new, professionally styled textarea component.
const FormTextarea = ({ label, ...props }) => (
    <div>
        <label className="text-sm font-medium text-text-secondary">{label}</label>
        <textarea {...props} className="mt-1 w-full p-3 bg-background/70 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all resize-none"></textarea>
    </div>
);


const SettingsPage = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    profileService.getProfile()
      .then(res => setProfile(res.data))
      .catch(() => toast.error("Could not load profile."))
      .finally(() => setIsLoading(false));
  }, []);
  
  const handleProfileChange = (e) => setProfile(p => ({ ...p, [e.target.name]: e.target.value }));
  const handleDynamicChange = (sec, idx, e) => setProfile(p => ({...p, [sec]: p[sec].map((item, i) => i === idx ? {...item, [e.target.name]: e.target.value} : item)}));
  const addItem = (sec, item) => setProfile(p => ({...p, [sec]: [...p[sec], { id: `new-${Date.now()}`, ...item}]}));
  const removeItem = (sec, idx) => {
      const newItems = profile[sec].filter((_, i) => i !== idx);
      setProfile(p => ({...p, [sec]: newItems}));
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
        const { user, ...profileData } = profile;
        await profileService.updateProfile(profileData);
        toast.success('Profile updated successfully!');
    } catch (error) {
        toast.error("Failed to save profile.");
    } finally {
        setIsSaving(false);
    }
  };

  if (isLoading || !profile) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="w-12 h-12 text-accent animate-spin" /></div>;
  }

  return (
    <div className="space-y-10">
      <header>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-4xl font-extrabold text-text-primary">Profile & Data Hub</h1>
              <p className="text-lg text-text-secondary mt-1">This is your central source of truth for building resumes.</p>
            </div>
            <button onClick={handleSaveChanges} disabled={isSaving} className="flex items-center justify-center bg-accent hover:bg-accent-hover text-white font-bold py-2.5 px-6 rounded-lg transition-transform hover:scale-105 disabled:bg-tertiary disabled:scale-100 shadow-lg shadow-accent/20">
                {isSaving ? <Loader2 className="animate-spin h-5 w-5" /> : 'Save All Changes'}
            </button>
          </div>
      </header>
      
      <SectionCard icon={<User size={22}/>} title="Personal Details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput label="Full Name" type="text" name="name" value={profile.user.name} disabled />
              <FormInput label="Email" type="email" name="email" value={profile.user.email} disabled />
              <FormInput label="Phone" type="tel" name="phone" value={profile.phone || ''} onChange={handleProfileChange} />
              <FormInput label="LinkedIn Profile URL" type="text" name="linkedin" value={profile.linkedin || ''} onChange={handleProfileChange} />
              <FormInput label="GitHub Profile URL" type="text" name="github" value={profile.github || ''} onChange={handleProfileChange} />
              <FormInput label="Personal Website URL" type="text" name="website" value={profile.website || ''} onChange={handleProfileChange} />
          </div>
          <FormTextarea label="Professional Summary" name="summary" value={profile.summary || ''} onChange={handleProfileChange} rows="5"/>
      </SectionCard>

      <SectionCard icon={<Briefcase size={22}/>} title="Work Experience" onAddItem={() => addItem('experience', {title:'', company:'', location:'', start:'', end:'', description:''})}>
        {profile.experience.map((exp, index) => (
            <div key={exp.id || exp._id} className="p-4 bg-background/50 rounded-lg border border-muted relative group">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput label="Job Title" name="title" value={exp.title} onChange={(e) => handleDynamicChange('experience', index, e)} />
                    <FormInput label="Company" name="company" value={exp.company} onChange={(e) => handleDynamicChange('experience', index, e)} />
                    <div className="col-span-2"><FormInput label="Location" name="location" value={exp.location} onChange={(e) => handleDynamicChange('experience', index, e)} /></div>
                    <FormInput label="Start Date" type="date" name="start" value={exp.start?.split('T')[0] || ''} onChange={(e) => handleDynamicChange('experience', index, e)} />
                    <FormInput label="End Date" type="date" name="end" value={exp.end?.split('T')[0] || ''} onChange={(e) => handleDynamicChange('experience', index, e)} />
                    <div className="col-span-2"><FormTextarea label="Description / Achievements" name="description" value={exp.description} onChange={(e) => handleDynamicChange('experience', index, e)} rows="5"/></div>
                </div>
                <button onClick={() => removeItem('experience', index)} className="absolute top-3 right-3 p-1.5 rounded-full bg-surface/50 text-subtle hover:text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
            </div>
        ))}
      </SectionCard>
      
      {/* Education, Projects, and Skills sections would follow the exact same updated pattern */}
      
    </div>
  );
};
export default SettingsPage;