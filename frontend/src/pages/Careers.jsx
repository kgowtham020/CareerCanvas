import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Briefcase, DollarSign, Clock, Rocket } from 'lucide-react';
import { useState } from 'react';

const Careers = () => {
    const [selectedJob, setSelectedJob] = useState(null);

    const jobs = [
        {
            title: "Frontend Developer",
            location: "Remote",
            type: "Full-time",
            description: "Build intuitive interfaces for our AI-powered career platform.",
            requirements: ["2+ years React experience", "Tailwind CSS proficiency", "Passion for student empowerment"],
        },
        {
            title: "AI Engineer",
            location: "Remote",
            type: "Full-time",
            description: "Develop AI models for our ATS analyzer and interview coach.",
            requirements: ["Python and ML frameworks", "Experience with NLP", "Interest in career tech"],
        },
        {
            title: "Product Designer",
            location: "Remote",
            type: "Part-time",
            description: "Design user-centric features for student career tools.",
            requirements: ["Figma expertise", "UI/UX portfolio", "Startup enthusiasm"],
        },
    ];

    const benefits = [
        { title: "Equity Options", description: "Share in our startup’s success.", icon: <DollarSign size={20} className="text-accent" /> },
        { title: "Flexible Hours", description: "Work when you’re most productive.", icon: <Clock size={20} className="text-accent" /> },
        { title: "Impactful Work", description: "Empower students with free tools.", icon: <Rocket size={20} className="text-accent" /> },
        { title: "Growth Path", description: "Grow with a mission-driven startup.", icon: <Briefcase size={20} className="text-accent" /> },
    ];

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    };

    const buttonHover = {
        hover: { scale: 1.1, transition: { duration: 0.3 } },
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    };

    return (
        <div className="min-h-screen bg-background">
            <style jsx>{`
                .gradient-bg {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, #0f172a, #1e293b);
                    opacity: 0.8;
                    z-index: -1;
                    animation: gradientShift 15s ease infinite;
                }
                @keyframes gradientShift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `}</style>
            <div className="gradient-bg"></div>

            {/* Hero Section */}
            <motion.section
                className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8 text-center"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
            >
                <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
                    Join CareerCanvas
                </h1>
                <p className="text-lg text-text-secondary max-w-3xl mx-auto">
                    Help us empower students with free, AI-powered career tools.
                </p>
            </motion.section>

            {/* Job Listings */}
            <section className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-semibold text-text-primary mb-8 text-center">
                    Open Positions
                </h2>
                <div className="space-y-6">
                    {jobs.map((job, index) => (
                        <motion.div
                            key={job.title}
                            className="p-6 border border-muted/30 rounded-lg bg-surface/50 backdrop-blur-md hover:shadow-xl transition-shadow"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={{ ...fadeIn, transition: { delay: index * 0.15 } }}
                        >
                            <div className="flex flex-col sm:flex-row justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-medium text-text-primary">{job.title}</h3>
                                    <p className="text-text-secondary text-sm">{job.location} • {job.type}</p>
                                    <p className="text-text-secondary text-sm mt-2">{job.description}</p>
                                </div>
                                <motion.div whileHover="hover" variants={buttonHover}>
                                    <button
                                        onClick={() => setSelectedJob(job)}
                                        className="mt-4 sm:mt-0 px-4 py-2 bg-accent text-text-primary rounded-md hover:bg-opacity-90"
                                    >
                                        Learn More
                                    </button>
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Job Details Modal */}
            {selectedJob && (
                <motion.div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    initial="hidden"
                    animate="visible"
                    variants={modalVariants}
                    onClick={() => setSelectedJob(null)}
                >
                    <motion.div
                        className="bg-surface/50 backdrop-blur-md p-8 rounded-lg max-w-md mx-auto border border-muted/30"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-2xl font-medium text-text-primary mb-4">{selectedJob.title}</h3>
                        <p className="text-text-secondary text-sm mb-2">{selectedJob.location} • {selectedJob.type}</p>
                        <p className="text-text-secondary text-sm mb-4">{selectedJob.description}</p>
                        <h4 className="text-lg font-medium text-text-primary mb-2">Requirements</h4>
                        <ul className="list-disc list-inside text-text-secondary text-sm mb-4">
                            {selectedJob.requirements.map((req, index) => (
                                <li key={index}>{req}</li>
                            ))}
                        </ul>
                        <Link
                            to={`/apply/${selectedJob.title.toLowerCase().replace(/\s/g, '-')}`}
                            className="inline-block px-4 py-2 bg-accent text-text-primary rounded-md hover:bg-opacity-90"
                        >
                            Apply Now
                        </Link>
                        <motion.button
                            className="mt-4 ml-4 px-4 py-2 bg-muted text-text-primary rounded-md"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedJob(null)}
                        >
                            Close
                        </motion.button>
                    </motion.div>
                </motion.div>
            )}

            {/* Benefits Section */}
            <motion.section
                className="py-16 bg-surface/50 backdrop-blur-md"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-semibold text-text-primary mb-8 text-center">
                        Why Join Us?
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={benefit.title}
                                className="p-6 border border-muted/30 rounded-md text-center bg-surface/50 backdrop-blur-md"
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={{ ...fadeIn, transition: { delay: index * 0.1 } }}
                                whileHover={{ scale: 1.05 }}
                            >
                                <div className="mb-4">{benefit.icon}</div>
                                <h3 className="text-lg font-medium text-text-primary">{benefit.title}</h3>
                                <p className="text-text-secondary text-sm">{benefit.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>
        </div>
    );
};

export default Careers;