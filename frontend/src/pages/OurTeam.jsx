import { motion } from 'framer-motion';
import { Linkedin, Twitter, Code, Rocket, Star } from 'lucide-react';
import { useState } from 'react';

const OurTeam = () => {
    const [selectedMember, setSelectedMember] = useState(null);

    const teamMembers = [
        {
            name: "Jane Doe",
            role: "Co-Founder & CEO",
            image: "/team/jane.jpg",
            bio: "Jane leads CareerCanvas with a passion for empowering students through AI-driven career tools.",
            icon: <Rocket size={20} className="text-accent" />,
            linkedin: "https://linkedin.com",
            twitter: "https://twitter.com",
        },
        {
            name: "John Smith",
            role: "CTO",
            image: "/team/john.jpg",
            bio: "John architects our AI-powered platform, specializing in full-stack and machine learning.",
            icon: <Code size={20} className="text-accent" />,
            linkedin: "https://linkedin.com",
            twitter: "https://twitter.com",
        },
        {
            name: "Emily Brown",
            role: "Head of Product",
            image: "/team/emily.jpg",
            bio: "Emily designs intuitive features to make career tools accessible for students.",
            icon: <Star size={20} className="text-accent" />,
            linkedin: "https://linkedin.com",
            twitter: "https://twitter.com",
        },
    ];

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
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
                    Our Team
                </h1>
                <p className="text-lg text-text-secondary max-w-3xl mx-auto">
                    Meet the innovators building CareerCanvas for students and professionals.
                </p>
            </motion.section>

            {/* Team Members */}
            <section className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {teamMembers.map((member, index) => (
                        <motion.div
                            key={member.name}
                            className="border border-muted/30 rounded-lg overflow-hidden bg-surface/50 backdrop-blur-md cursor-pointer"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            whileHover="hover"
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: {
                                    opacity: 1,
                                    y: 0,
                                    transition: { duration: 0.6, delay: index * 0.15 },
                                },
                                hover: {
                                    scale: 1.05,
                                    rotate: 1,
                                    transition: { duration: 0.3 },
                                },
                            }}
                            onClick={() => setSelectedMember(member)}
                        >
                            <img
                                src={member.image}
                                alt={member.name}
                                className="w-full h-64 object-cover"
                            />
                            <div className="p-6 text-center">
                                <div className="mb-2">{member.icon}</div>
                                <h3 className="text-xl font-medium text-text-primary">{member.name}</h3>
                                <p className="text-text-secondary text-sm mt-1">{member.role}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Modal for Team Member Details */}
            {selectedMember && (
                <motion.div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    initial="hidden"
                    animate="visible"
                    variants={modalVariants}
                    onClick={() => setSelectedMember(null)}
                >
                    <motion.div
                        className="bg-surface/50 backdrop-blur-md p-8 rounded-lg max-w-md mx-auto border border-muted/30"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={selectedMember.image}
                            alt={selectedMember.name}
                            className="w-32 h-32 rounded-full mx-auto mb-4"
                        />
                        <h3 className="text-2xl font-medium text-text-primary text-center">{selectedMember.name}</h3>
                        <p className="text-text-secondary text-center mb-4">{selectedMember.role}</p>
                        <p className="text-text-secondary text-sm text-center">{selectedMember.bio}</p>
                        <div className="flex justify-center gap-4 mt-4">
                            <a href={selectedMember.linkedin} className="text-accent hover:text-opacity-80">
                                <Linkedin size={24} />
                            </a>
                            <a href={selectedMember.twitter} className="text-accent hover:text-opacity-80">
                                <Twitter size={24} />
                            </a>
                        </div>
                        <motion.button
                            className="mt-6 px-4 py-2 bg-accent text-text-primary rounded-md"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedMember(null)}
                        >
                            Close
                        </motion.button>
                    </motion.div>
                </motion.div>
            )}

            {/* Culture Section */}
            <motion.section
                className="py-16 bg-surface/50 backdrop-blur-md"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-semibold text-text-primary mb-6">
                        Our Startup Culture
                    </h2>
                    <p className="text-text-secondary text-lg max-w-3xl mx-auto">
                        We’re a passionate team dedicated to making career development accessible, innovative, and empowering for students.
                    </p>
                </div>
            </motion.section>
        </div>
    );
};

export default OurTeam;
