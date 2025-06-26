import { Mail, Phone, Linkedin, Github, Globe } from 'lucide-react';
import { useRef } from 'react';

// This is a helper component to make any text field directly editable.
const EditableField = ({ value, onSave, placeholder, className, as: Component = 'p' }) => {
    const handleBlur = (e) => {
        onSave(e.currentTarget.innerText);
    };

    return (
        <Component
            contentEditable={true}
            suppressContentEditableWarning={true} // Suppresses a common React warning for contentEditable
            onBlur={handleBlur}
            className={`outline-none focus:bg-blue-100 focus:shadow-inner rounded-sm px-1 transition-all ${className}`}
            placeholder={placeholder}
        >
            {value}
        </Component>
    );
};

// The main template is now interactive.
const TemplateOdyssey = ({ resumeData, setResumeData }) => {
  if (!resumeData) return null;

  // Generic handler to update any field in our state
  const handleUpdate = (path, value) => {
    setResumeData(prev => {
        const newResumeData = JSON.parse(JSON.stringify(prev)); // Deep copy
        let current = newResumeData;
        path.forEach((key, index) => {
            if (index === path.length - 1) {
                current[key] = value;
            } else {
                current = current[key];
            }
        });
        return newResumeData;
    });
  };

  return (
    <div className="p-8 bg-white text-gray-800 rounded-md shadow-lg aspect-[8.5/11] font-sans text-sm">
      <header className="text-center border-b-2 border-gray-300 pb-4 mb-6">
        <EditableField as="h1" value={resumeData.name} onSave={(v) => handleUpdate(['name'], v)} className="text-4xl font-bold tracking-wider uppercase"/>
        <div className="flex justify-center items-center gap-x-4 gap-y-1 text-xs mt-3 flex-wrap">
          <div className="flex items-center gap-1.5"><Phone size={12} /> <EditableField value={resumeData.phone} onSave={(v) => handleUpdate(['phone'], v)} /></div>
          <div className="flex items-center gap-1.5"><Mail size={12} /> <EditableField value={resumeData.email} onSave={(v) => handleUpdate(['email'], v)} /></div>
          <div className="flex items-center gap-1.5"><Linkedin size={12} /> <EditableField value={resumeData.linkedin} onSave={(v) => handleUpdate(['linkedin'], v)} /></div>
          <div className="flex items-center gap-1.5"><Github size={12} /> <EditableField value={resumeData.github} onSave={(v) => handleUpdate(['github'], v)} /></div>
        </div>
      </header>
      <main>
        <section className="mb-5"><h2 className="text-lg font-bold uppercase tracking-wider text-gray-800 border-b-2 border-gray-300 pb-1 mb-3">Summary</h2><EditableField as="div" value={resumeData.summary} onSave={(v) => handleUpdate(['summary'], v)} className="text-gray-700"/></section>
        <section className="mb-5"><h2 className="text-lg font-bold uppercase tracking-wider text-gray-800 border-b-2 border-gray-300 pb-1 mb-3">Skills</h2><EditableField value={resumeData.skills.join(', ')} onSave={(v) => handleUpdate(['skills'], v.split(',').map(s=>s.trim()))} /></section>
        <section className="mb-5"><h2 className="text-lg font-bold uppercase tracking-wider text-gray-800 border-b-2 border-gray-300 pb-1 mb-3">Experience</h2>
          {resumeData.experience?.map((exp, index) => (
            <div key={exp.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <EditableField as="h3" value={exp.title} onSave={(v) => handleUpdate(['experience', index, 'title'], v)} className="font-bold text-base"/>
                <div className="text-xs font-medium text-gray-600">
                  <EditableField value={exp.start} onSave={(v) => handleUpdate(['experience', index, 'start'], v)} /> - <EditableField value={exp.end || 'Present'} onSave={(v) => handleUpdate(['experience', index, 'end'], v)} />
                </div>
              </div>
              <EditableField as="p" value={exp.company} onSave={(v) => handleUpdate(['experience', index, 'company'], v)} className="italic text-gray-700"/>
              <EditableField as="div" value={exp.description} onSave={(v) => handleUpdate(['experience', index, 'description'], v)} className="list-disc list-inside mt-1 text-gray-700 space-y-1"/>
            </div>
          ))}
        </section>
        {/* Other sections like Projects and Education would follow the same pattern */}
      </main>
    </div>
  );
};
export default TemplateOdyssey;