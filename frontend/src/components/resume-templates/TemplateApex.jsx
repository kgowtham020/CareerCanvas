const TemplateApex = ({ profile }) => {
    if (!profile) return <div className="p-8 bg-white rounded-md shadow-lg aspect-[8.5/11]">Loading profile data...</div>;

    const Section = ({ title, children, className }) => (
        <section className={`mb-4 ${className}`}>
            <h2 className="text-center font-bold text-sm uppercase tracking-widest border-y-2 border-black py-1 mb-2">{title}</h2>
            {children}
        </section>
    );

    return (
        <div className="p-8 bg-white text-gray-900 rounded-md shadow-lg aspect-[8.5/11] font-serif text-sm">
            <header className="text-center mb-4">
                <h1 className="text-3xl font-bold">{profile.name || "Kaditham Gowtham" }</h1>
                <p className="text-xs">
                    Email: {profile.email} | Mobile: {profile.phone} | Portfolio: {profile.website} | Github: {profile.github}
                </p>
            </header>
            <main>
                <Section title="Skills Summary">
                    <div className="text-xs columns-3 gap-4">
                        {profile.skills?.map(skill => <p key={skill}>{skill}</p>)}
                    </div>
                </Section>
                <Section title="Experience">
                    {profile.experience?.map((exp, index) => (
                        <div key={index} className="mb-3">
                            <h3 className="font-bold text-base">{exp.company} — <span className="font-normal italic">{exp.title}</span></h3>
                            <ul className="list-disc list-inside space-y-px text-sm">
                                {exp.description?.split('\n').map((item, i) => item && <li key={i}>{item.replace('•','').trim()}</li>)}
                            </ul>
                        </div>
                    ))}
                </Section>
                <Section title="Projects">
                    {profile.projects?.map((proj, index) => (
                        <div key={index} className="mb-2">
                            <p><span className="font-bold">{proj.name}:</span> {proj.description}</p>
                            <p className="text-xs italic">Tech: {proj.technologies}</p>
                        </div>
                    ))}
                </Section>
                <Section title="Education">
                    {profile.education?.map((edu, index) => (
                        <div key={index} className="text-center">
                            <p><span className="font-bold">{edu.school}</span> — {edu.degree} in {edu.field} (GPA: {edu.gpa || 'N/A'})</p>
                        </div>
                    ))}
                </Section>
            </main>
        </div>
    );
};
export default TemplateApex;