import { Mail, Phone, Linkedin, Github, Globe } from 'lucide-react';

// This is a new template component with a two-column layout.
const TemplateClassic = ({ profile, fontSize }) => {
  if (!profile) return null;

  const textSize = {
    sm: 'text-xs',
    base: 'text-sm',
    lg: 'text-base',
  }[fontSize];

  return (
    <div className={`p-8 bg-white text-gray-800 rounded-md shadow-lg aspect-[8.5/11] font-serif ${textSize}`}>
      {/* --- Header --- */}
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold tracking-wider">{profile.name || 'Your Name'}</h1>
        <div className="flex justify-center items-center gap-x-4 gap-y-1 text-xs mt-2 flex-wrap">
          {profile.phone && <span>{profile.phone}</span>}
          {profile.email && <span>&bull; {profile.email}</span>}
          {profile.linkedin && <span>&bull; {profile.linkedin}</span>}
        </div>
      </header>

      {/* Two-column layout */}
      <div className="grid grid-cols-3 gap-6">
        {/* --- Left Column --- */}
        <div className="col-span-1">
          <section className="mb-6">
            <h2 className="text-base font-bold uppercase border-b-2 border-gray-400 pb-1 mb-2">Contact</h2>
            <div className="space-y-1 text-xs">
              {profile.github && <div className="flex items-center gap-2"><Github size={12} /><span>{profile.github}</span></div>}
              {profile.website && <div className="flex items-center gap-2"><Globe size={12} /><span>{profile.website}</span></div>}
            </div>
          </section>
          <section className="mb-6">
            <h2 className="text-base font-bold uppercase border-b-2 border-gray-400 pb-1 mb-2">Skills</h2>
            <ul className="list-disc list-inside space-y-1">
                {profile.skills?.map(skill => <li key={skill}>{skill}</li>)}
            </ul>
          </section>
          <section>
            <h2 className="text-base font-bold uppercase border-b-2 border-gray-400 pb-1 mb-2">Education</h2>
            {profile.education?.map(edu => (
                <div key={edu._id} className="mb-3">
                    <h3 className="font-bold">{edu.school}</h3>
                    <p>{edu.degree}</p>
                    <p className="text-gray-600 text-xs">{edu.field}</p>
                </div>
            ))}
          </section>
        </div>

        {/* --- Right Column --- */}
        <div className="col-span-2">
           <section className="mb-6">
            <h2 className="text-base font-bold uppercase border-b-2 border-gray-400 pb-1 mb-2">Professional Summary</h2>
            <p className="text-gray-700">{profile.summary || 'Your professional summary...'}</p>
          </section>
          <section className="mb-6">
            <h2 className="text-base font-bold uppercase border-b-2 border-gray-400 pb-1 mb-2">Experience</h2>
            {profile.experience?.map(exp => (
              <div key={exp._id} className="mb-4">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold">{exp.title}</h3>
                  <p className="text-xs text-gray-600">{exp.start?.split('T')[0]} - {exp.end ? exp.end.split('T')[0] : 'Present'}</p>
                </div>
                <p className="italic">{exp.company}, {exp.location}</p>
                <ul className="list-disc list-inside mt-1 text-gray-700 space-y-1 text-sm">
                  {exp.description?.split('\n').map((item, index) => item && <li key={index}>{item.replace('•','').trim()}</li>)}
                </ul>
              </div>
            ))}
          </section>
           <section>
            <h2 className="text-base font-bold uppercase border-b-2 border-gray-400 pb-1 mb-2">Projects</h2>
            {profile.projects?.map(proj => (
                <div key={proj._id} className="mb-3">
                    <div className="flex justify-between items-baseline">
                        <h3 className="font-bold">{proj.name}</h3>
                        <p className="text-xs italic text-gray-600">{proj.technologies}</p>
                    </div>
                    <p className="text-gray-700">{proj.description}</p>
                </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
};

export default TemplateClassic;