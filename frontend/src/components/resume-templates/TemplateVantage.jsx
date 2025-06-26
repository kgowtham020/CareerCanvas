const TemplateVantage = ({ profile }) => {
    if (!profile) return <div className="p-8 bg-white rounded-md shadow-lg aspect-[8.5/11]">Loading profile data...</div>;

    const Section = ({ title, children, className }) => (
        <section className={`mb-5 ${className}`}>
            <h2 className="text-sm font-bold uppercase text-blue-800 tracking-wider border-b-2 border-gray-300 pb-1 mb-2">{title}</h2>
            <div className="space-y-3 text-sm">{children}</div>
        </section>
    );

    return (
        <div className="p-7 bg-white text-gray-800 rounded-md shadow-lg aspect-[8.5/11] font-serif">
            <header className="text-center mb-4">
                <h1 className="text-4xl font-semibold">{profile.name || 'Rishabh Mishra'}</h1>
                <p className="text-xs mt-1 px-4 text-gray-600">
                    {profile.phone} | {profile.email} | {profile.website} | {profile.github} | {profile.linkedin}
                </p>
            </header>
            <main>
                <Section title="Profile" className="text-center">
                    <p className="text-sm">{profile.summary || "Detail-oriented Data Analyst..." }</p>
                </Section>
                <div className="grid grid-cols-3 gap-x-6">
                    <div className="col-span-1 border-r pr-6 border-gray-200">
                        <Section title="Education">
                            {profile.education?.map((edu, index) => (
                                <div key={index}>
                                    <h3 className="font-bold">{edu.school}</h3>
                                    <p className="text-sm">{edu.degree}</p>
                                    <p className="text-xs text-gray-600">{edu.field}</p>
                                </div>
                            ))}
                        </Section>
                        <Section title="Skills">
                            <p><span className="font-bold">Technical:</span> {profile.skills?.join(', ')}</p>
                        </Section>
                    </div>

                    <div className="col-span-2">
                        <Section title="Experience">
                            {profile.experience?.map((exp, index) => (
                                <div key={index}>
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="font-bold">{exp.company}</h3>
                                        <p className="text-xs text-gray-600">{exp.start?.split('T')[0]} - {exp.end ? exp.end.split('T')[0] : 'Present'}</p>
                                    </div>
                                    <p className="italic">{exp.title}</p>
                                    <ul className="list-disc list-inside mt-1 text-gray-700 space-y-1 text-sm">
                                      {exp.description?.split('\n').map((item, i) => item && <li key={i}>{item.replace('•','').trim()}</li>)}
                                    </ul>
                                </div>
                            ))}
                        </Section>
                         <Section title="Projects">
                            {profile.projects?.map((proj, index) => (
                                <div key={index}>
                                    <h3 className="font-bold">{proj.name}</h3>
                                    <p className="text-gray-700">{proj.description} </p>
                                </div>
                            ))}
                        </Section>
                    </div>
                </div>
            </main>
        </div>
    );
};
export default TemplateVantage;