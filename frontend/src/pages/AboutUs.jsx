import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, FileText, Bot, Briefcase } from 'lucide-react';
import { useState } from 'react';

const AboutUs = () => {
    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    };

    const stagger = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
    };

    const features = [
        { title: "Resume Editor", description: "Craft ATS-friendly resumes with our Overleaf-inspired editor.", icon: <FileText size={24} className="text-accent" /> },
        { title: "ATS Analyzer", description: "Optimize your resume with AI-driven job match insights.", icon: <Bot size={24} className="text-accent" /> },
        { title: "Interview Coach", description: "Master interviews with our voice-to-voice AI simulator.", icon: <Users size={24} className="text-accent" /> },
        { title: "Profile Hub", description: "Manage your professional journey in one place.", icon: <Briefcase size={24} className="text-accent" /> },
    ];

    const roadmap = [
        { year: "2024", milestone: "Launched beta with resume editor and ATS analyzer." },
        { year: "2025", milestone: "Added interview coach and community hub." },
        { year: "2026", milestone: "Global expansion with multilingual support." },
    ];

    const testimonials = [
        { quote: "CareerCanvas’s resume editor helped me land my first internship!", author: "Sarah, CS Student" },
        { quote: "The AI interview coach is a game-changer for confidence-building.", author: "Rahul, MBA Candidate" },
        { quote: "Free tools that rival paid platforms—amazing for students!", author: "Emma, Recent Graduate" },
    ];

    const handleNextTestimonial = () => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    };

    const handlePrevTestimonial = () => {
        setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
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
                    About CareerCanvas
                </h1>
                <p className="text-lg text-text-secondary max-w-3xl mx-auto">
                    Empowering students with free, AI-powered tools to navigate from classroom to career.
                </p>
                <motion.div
                    className="mt-8"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Link
                        to="/contact"
                        className="inline-block px-6 py-3 bg-accent text-text-primary rounded-md hover:bg-opacity-90 transition-colors"
                    >
                        Join Our Beta
                    </Link>
                </motion.div>
            </motion.section>

            {/* Mission & Vision */}
            <motion.section
                className="py-16 bg-surface/50 backdrop-blur-md"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div>
                            <h2 className="text-3xl font-semibold text-text-primary mb-4">Our Vision</h2>
                            <p className="text-text-secondary text-lg">
                                To be the indispensable AI-powered co-pilot for every student’s career journey.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-3xl font-semibold text-text-primary mb-4">Our Mission</h2>
                            <p className="text-text-secondary text-lg">
                                To democratize professional development with a free, all-in-one career platform.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* Features Section */}
            <section className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-semibold text-text-primary mb-8 text-center">
                    Our Tools
                </h2>
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8"
                    variants={stagger}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {features.map((feature) => (
                        <motion.div
                            key={feature.title}
                            className="p-6 border border-muted/30 rounded-lg text-center hover:shadow-xl transition-shadow duration-300 bg-surface/50 backdrop-blur-md"
                            variants={fadeIn}
                            whileHover={{ scale: 1.05 }}
                        >
                            <div className="mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-medium text-text-primary mb-2">{feature.title}</h3>
                            <p className="text-text-secondary text-sm">{feature.description}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* Roadmap Timeline */}
            <motion.section
                className="py-16 bg-surface/50 backdrop-blur-md"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-semibold text-text-primary mb-8 text-center">
                        Our Roadmap
                    </h2>
                    <div className="relative">
                        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-muted h-full"></div>
                        {roadmap.map((item, index) => (
                            <motion.div
                                key={item.year}
                                className={`flex items-center mb-8 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                                variants={fadeIn}
                            >
                                <div className="w-1/2 px-4">
                                    <div className="p-6 bg-surface/50 backdrop-blur-md rounded-lg border border-muted/30">
                                        <h3 className="text-xl font-medium text-text-primary">{item.year}</h3>
                                        <p className="text-text-secondary text-sm">{item.milestone}</p>
                                    </div>
                                </div>
                                <div className="w-1/2"></div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Testimonials Carousel */}
            <motion.section
                className="py-16 bg-surface/50 backdrop-blur-md"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-semibold text-text-primary mb-8">
                        What Our Beta Users Say
                    </h2>
                    <motion.div
                        className="p-6 border border-muted/30 rounded-lg bg-surface/50 backdrop-blur-md"
                        key={currentTestimonial}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <p className="text-text-secondary text-lg italic">"{testimonials[currentTestimonial].quote}"</p>
                        <p className="text-text-primary font-medium mt-4">{testimonials[currentTestimonial].author}</p>
                    </motion.div>
                    <div className="flex justify-center gap-4 mt-6">
                        <motion.button
                            onClick={handlePrevTestimonial}
                            className="px-4 py-2 bg-accent text-text-primary rounded-md hover:bg-opacity-90"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Prev
                        </motion.button>
                        <motion.button
                            onClick={handleNextTestimonial}
                            className="px-4 py-2 bg-accent text-text-primary rounded-md hover:bg-opacity-90"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Next
                        </motion.button>
                    </div>
                </div>
            </motion.section>
        </div>
    );
};

export default AboutUs;