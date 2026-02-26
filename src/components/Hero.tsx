import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const Hero = () => {
    return (
        <section className="section bg-white pt-32 overflow-hidden">
            <div className="container">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="eyebrow">Coming Soon — Q2 2026</span>
                        <h1 className="text-6xl md:text-7xl font-serif leading-[1.1] mb-6 text-near-black">
                            Your AI Executive <br />
                            <span className="italic text-blue-600">Board</span> is Ready.
                        </h1>
                        <p className="text-lg text-text-secondary mb-8 max-w-lg">
                            Launch Pad gives every Indian startup founder a complete AI executive board —
                            five specialized advisors who advise, execute tasks, find grants, and deliver
                            daily briefings to your WhatsApp.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <div className="relative flex-1 max-w-sm">
                                <input
                                    type="email"
                                    placeholder="Enter your work email"
                                    className="w-full h-12 px-4 rounded-lg border border-gray-200 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                            <button className="btn btn-primary h-12 px-8 flex gap-2">
                                Join the Waitlist <ArrowRight size={18} />
                            </button>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-text-muted">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-200" />
                                ))}
                            </div>
                            <span>Join 847+ founders already on the waitlist</span>
                        </div>
                    </motion.div>

                    <motion.div
                        className="relative"
                        initial={{ opacity: 0, scale: 0.95, rotate: -2 }}
                        animate={{ opacity: 1, scale: 1, rotate: -2 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <div className="bg-[#0D1B3E] rounded-2xl p-6 shadow-2xl border border-white/10 relative overflow-hidden">
                            <div className="flex gap-1.5 mb-6">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                    <span className="text-[10px] font-display font-bold text-blue-400 tracking-wider">MARCUS • CEO ADVISOR</span>
                                    <p className="text-sm text-white/90 mt-1 leading-relaxed">
                                        Growth is up 12% this week. Let's focus our Grant Strategy on the SISFS scheme before the Q2 deadline.
                                    </p>
                                </div>

                                <div className="p-4 bg-blue-600/10 rounded-xl border border-blue-500/20">
                                    <span className="text-[10px] font-display font-bold text-blue-300 tracking-wider">ARIA • LEGAL ADVISOR</span>
                                    <p className="text-sm text-white/90 mt-1 italic">
                                        I've pre-drafted your DPIIT renewal. Review it in the Vault whenever you're ready.
                                    </p>
                                </div>

                                <div className="h-10 bg-white/5 rounded-lg border border-white/5 flex items-center px-4 text-xs text-white/30 italic">
                                    Brief your board...
                                </div>
                            </div>
                        </div>

                        {/* Decorative blobs */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/20 blur-[80px] -z-10 rounded-full" />
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-600/10 blur-[80px] -z-10 rounded-full" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
