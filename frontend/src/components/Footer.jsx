import { FaLinkedin, FaGithub, FaTwitter, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import logo from '../assets/logo.svg'; // adjust the path if Footer is in a different folder


const Footer = () => {
    const [email, setEmail] = useState('');
    
    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        // Add newsletter subscription logic here
        setEmail('');
    };

    const socialLinks = [
        { href: "https://linkedin.com", icon: <FaLinkedin size={20}/>, name: "LinkedIn" },
        { href: "https://github.com", icon: <FaGithub size={20}/>, name: "GitHub" },
        { href: "https://twitter.com", icon: <FaTwitter size={20}/>, name: "Twitter" },
    ];

    const companyLinks = [
        { href: "/about", name: "About Us" },
        { href: "/team", name: "Our Team" },
        { href: "/careers", name: "Careers" },
        { href: "/blog", name: "Blog" },
    ];

    const supportLinks = [
        { href: "/contact", name: "Contact" },
        { href: "/faq", name: "FAQ" },
        { href: "/support", name: "Support Center" },
        { href: "/privacy", name: "Privacy Policy" },
        { href: "/terms", name: "Terms of Service" },
    ];

    return (
        <footer className="w-full mt-24 border-t border-muted/30 text-text-secondary">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
  <img
    src={logo}
    alt="CareerCanvas Logo"
    className="h-10 w-10 transition-transform hover:scale-105"
  />
  <span className="font-bold text-xl text-text-primary">CareerCanvas</span>
</div>

                        <p className="text-sm leading-relaxed">
                            Empowering your career journey with innovative solutions and personalized guidance.
                        </p>
                        <p className="text-sm">
                            © {new Date().getFullYear()} CareerCanvas. All rights reserved.
                        </p>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="text-text-primary font-semibold mb-4">Company</h3>
                        <nav className="flex flex-col gap-2">
                            {companyLinks.map(link => (
                                <Link 
                                    key={link.name} 
                                    to={link.href} 
                                    className="text-sm hover:text-accent transition-colors duration-200 hover:translate-x-1"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h3 className="text-text-primary font-semibold mb-4">Support</h3>
                        <nav className="flex flex-col gap-2">
                            {supportLinks.map(link => (
                                <Link 
                                    key={link.name} 
                                    to={link.href} 
                                    className="text-sm hover:text-accent transition-colors duration-200 hover:translate-x-1"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Contact & Newsletter */}
                    <div className="space-y-4">
                        <h3 className="text-text-primary font-semibold mb-4">Stay Connected</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                                <FaEnvelope className="text-accent" />
                                <span>support@careercanvas.com</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaPhone className="text-accent" />
                                <span>+1 (555) 123-4567</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaMapMarkerAlt className="text-accent" />
                                <span>123 Career St, Tech City, TC 12345</span>
                            </div>
                        </div>
                        <div className="mt-4">
                            <h4 className="text-sm font-medium text-text-primary">Newsletter</h4>
                            <div className="mt-2 flex gap-2">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="flex-1 px-3 py-2 text-sm border border-muted/30 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={handleNewsletterSubmit}
                                    className="px-4 py-2 bg-accent text-text-primary rounded-md hover:bg-opacity-90 transition-colors"
                                >
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 pt-8 border-t border-muted/30 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex justify-center gap-6">
                        {socialLinks.map(link => (
                            <a 
                                key={link.name} 
                                href={link.href} 
                                className="hover:text-accent transition-colors duration-200 transform hover:scale-110" 
                                title={link.name}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {link.icon}
                            </a>
                        ))}
                    </div>
                    <p className="text-xs text-center">
                        Built with <span className="text-accent">♥</span> by the CareerCanvas Team
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;