import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Tag, Calendar, Mail } from 'lucide-react';

const Blog = () => {
    const [category, setCategory] = useState('All');
    const [email, setEmail] = useState('');

    const posts = [
        {
            title: "Crafting an ATS-Friendly Resume",
            category: "Resume Tips",
            date: "2025-06-15",
            excerpt: "Learn how to optimize your resume for ATS with our AI tools.",
            featured: true,
        },
        {
            title: "Acing Your First Tech Interview",
            category: "Interview Prep",
            date: "2025-06-01",
            excerpt: "Tips to build confidence with our AI interview coach.",
        },
        {
            title: "Why AI is Transforming Career Prep",
            category: "Tech Insights",
            date: "2025-05-20",
            excerpt: "Explore how AI tools like ours empower students.",
        },
        {
            title: "Building Your Professional Profile",
            category: "Career Tips",
            date: "2025-05-10",
            excerpt: "Use our profile hub to showcase your skills.",
        },
    ];

    const categories = ['All', 'Resume Tips', 'Interview Prep', 'Tech Insights', 'Career Tips'];

    const filteredPosts = category === 'All' ? posts : posts.filter(post => post.category === category);

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        setEmail('');
    };

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: (i = 1) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                delay: i * 0.15,
            },
        }),
        hover: {
            scale: 1.03,
            transition: { duration: 0.3 },
        },
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
                    CareerCanvas Blog
                </h1>
                <p className="text-lg text-text-secondary max-w-3xl mx-auto">
                    Free insights to help students excel in their career journey.
                </p>
            </motion.section>

            {/* Featured Post */}
            {posts.find(post => post.featured) && (
                <motion.section
                    className="py-16 bg-surface/50 backdrop-blur-md"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-semibold text-text-primary mb-6 text-center">
                            Featured Post
                        </h2>
                        <motion.div
                            className="p-8 border border-muted/30 rounded-lg bg-surface/50 backdrop-blur-md"
                            whileHover="hover"
                            variants={fadeIn}
                        >
                            <p className="text-sm text-text-secondary mb-2 flex items-center gap-2">
                                <Tag className="text-accent" /> {posts[0].category} • <Calendar className="text-accent" /> {posts[0].date}
                            </p>
                            <h3 className="text-2xl font-medium text-text-primary mb-2">{posts[0].title}</h3>
                            <p className="text-text-secondary text-base mb-4">{posts[0].excerpt}</p>
                            <Link
                                to={`/blog/${posts[0].title.toLowerCase().replace(/\s/g, '-')}`}
                                className="text-accent hover:underline"
                            >
                                Read More
                            </Link>
                        </motion.div>
                    </div>
                </motion.section>
            )}

            {/* Category Filter */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-center gap-4 flex-wrap">
                    {categories.map((cat) => (
                        <motion.button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`px-4 py-2 rounded-md text-sm font-medium ${
                                category === cat
                                    ? 'bg-accent text-text-primary'
                                    : 'text-text-secondary hover:text-accent border border-muted/30'
                            } transition-colors`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {cat}
                        </motion.button>
                    ))}
                </div>
            </section>

            {/* Blog Posts */}
            <section className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-semibold text-text-primary mb-8 text-center">
                    Latest Posts
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {filteredPosts.map((post, index) => (
                        <motion.div
                            key={post.title}
                            className="border border-muted/30 rounded-lg overflow-hidden bg-surface/50 backdrop-blur-md"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            custom={index}
                            variants={fadeIn}
                            whileHover="hover"
                        >
                            <div className="p-6">
                                <p className="text-sm text-text-secondary mb-2 flex items-center gap-2">
                                    <Tag className="text-accent" /> {post.category} • <Calendar className="text-accent" /> {post.date}
                                </p>
                                <h3 className="text-xl font-medium text-text-primary mb-2">{post.title}</h3>
                                <p className="text-text-secondary text-sm mb-4">{post.excerpt}</p>
                                <Link
                                    to={`/blog/${post.title.toLowerCase().replace(/\s/g, '-')}`}
                                    className="text-accent hover:underline"
                                >
                                    Read More
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Newsletter Signup */}
            <motion.section
                className="py-16 bg-surface/50 backdrop-blur-md text-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-semibold text-text-primary mb-4">
                        Stay Updated
                    </h2>
                    <p className="text-text-secondary text-lg max-w-2xl mx-auto mb-6">
                        Get the latest career tips and updates from CareerCanvas.
                    </p>
                    <div className="flex justify-center gap-2 max-w-md mx-auto">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="flex-1 px-3 py-2 text-sm border border-muted/30 rounded-md bg-surface/50 backdrop-blur-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                            required
                        />
                        <motion.button
                            onClick={handleNewsletterSubmit}
                            className="px-4 py-2 bg-accent text-text-primary rounded-md hover:bg-opacity-90"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Mail className="inline mr-2" /> Subscribe
                        </motion.button>
                    </div>
                </div>
            </motion.section>
        </div>
    );
};

export default Blog;
