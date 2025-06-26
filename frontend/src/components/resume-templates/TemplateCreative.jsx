import { Mail, Phone, Linkedin, Github, Globe } from 'lucide-react';

const TemplateCreative = ({ profile, fontSize, accentColor }) => {
    if (!profile) return null;
    const textSize = { sm: 'text-xs', base: 'text-sm', lg: 'text-base' }[fontSize];

    return (
        <div className={`p-8 bg-white text-gray-800 rounded-md shadow-lg aspect-[8.5/11] font-sans ${textSize}`}>
            <div className="grid grid-cols-12 gap-8 h-full">
                {/* --- Left Column (Sidebar) --- */}
                <div className="col-span-4" style={{ backgroundColor: accentColor || '#2d3748' }}>
                    <div className="p-6 text-white h-full flex flex-col">
                        <h1 className="text-3xl font-bold leading-tight">{profile.name || 'Your Name'}</h1>
                        <p className="text-lg mt-1 opacity-90">{profile.experience?.[0]?.title || 'Aspiring Professional'}</p>
                        <div className="mt-8 space-y-3 text-xs opacity-80">
                            {profile.phone && <div className="flex items-center gap-2"><Phone size={14} /> {profile.phone}</div>}
                            {profile.email && <div className="flex items-center gap-2"><Mail size={14} /> {profile.email}</div>}
                            {profile.website && <div className="flex items-center gap-2"><Globe size={14} /> {profile.website}</div>}
                            {profile.linkedin && <div className="flex items-center gap-2"><Linkedin size={14} /> {profile.linkedin}</div>}
                            {profile.github && <div className="flex items-center gap-2"><Github size={14} /> {profile.github}</div>}
                        </div>
                        <div className="mt-auto">
                            <h2 className="font-bold uppercase tracking-wider mb-2">Skills</h2>
                            <div className="flex flex-wrap gap-1.5 text-xs">
                                {profile.skills?.map(skill => <span key={skill} className="bg-white/20 px-2 py-1 rounded">{skill}</span>)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Right Column (Main Content) --- */}
                <div className="col-span-8 py-6">
                    <section className="mb-6"><h2 className="text-xl font-bold uppercase tracking-wider text-gray-700">Summary</h2><div className="w-16 h-1 rounded-full my-2" style={{ backgroundColor: accentColor || '#2d3748' }}></div><p>{profile.summary}</p></section>
                    <section className="mb-6"><h2 className="text-xl font-bold uppercase tracking-wider text-gray-700">Experience</h2><div className="w-16 h-1 rounded-full my-2" style={{ backgroundColor: accentColor || '#2d3748' }}></div>{profile.experience?.map(exp => (<div key={exp._id} className="mb-3"><h3 className="font-bold text-base">{exp.title} at {exp.company}</h3><ul className="list-disc list-inside mt-1 space-y-1">{exp.description?.split('\n').map((item, index) => item && <li key={index}>{item.replace('•','').trim()}</li>)}</ul></div>))}</section>
                    <section><h2 className="text-xl font-bold uppercase tracking-wider text-gray-700">Education</h2><div className="w-16 h-1 rounded-full my-2" style={{ backgroundColor: accentColor || '#2d3748' }}></div>{profile.education?.map(edu => (<div key={edu._id}><h3 className="font-bold">{edu.school}</h3><p>{edu.degree} in {edu.field}</p></div>))}</section>
                </div>
            </div>
        </div>
    );
};
export default TemplateCreative;