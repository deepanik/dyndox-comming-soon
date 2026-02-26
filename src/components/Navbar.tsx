import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, ArrowRight, CheckCircle2, Shield, Zap, Globe, MessageSquare, BarChart3, FileText, Calendar, Users } from 'lucide-react';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass py-3 shadow-sm' : 'bg-transparent py-5'}`}
            style={{ borderBottom: isScrolled ? '1px solid var(--border)' : 'none' }}>
            <div className="container flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="font-display font-bold tracking-widest text-sm">DYNDOX</span>
                    <div className="h-4 w-[1px] bg-gray-300 mx-2" />
                    <span className="font-display text-xs text-gray-500 tracking-wider">LAUNCHPAD</span>
                </div>

                <div className="hidden md:flex items-center gap-8">
                    <a href="#features" className="text-sm font-medium hover:text-blue-600 transition-colors">Platform</a>
                    <a href="#board" className="text-sm font-medium hover:text-blue-600 transition-colors">The Board</a>
                    <a href="#grants" className="text-sm font-medium hover:text-blue-600 transition-colors">Vault</a>
                    <a href="#pricing" className="text-sm font-medium hover:text-blue-600 transition-colors">Pricing</a>
                    <button className="btn btn-primary text-xs px-5 py-2.5">Join Waitlist</button>
                </div>

                <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {isMobileMenuOpen && (
                <div className="md:hidden glass absolute top-full left-0 right-0 p-6 flex flex-col gap-4 border-b">
                    <a href="#features" onClick={() => setIsMobileMenuOpen(false)}>Platform</a>
                    <a href="#board" onClick={() => setIsMobileMenuOpen(false)}>The Board</a>
                    <a href="#grants" onClick={() => setIsMobileMenuOpen(false)}>Vault</a>
                    <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)}>Pricing</a>
                    <button className="btn btn-primary w-full">Join Waitlist</button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
