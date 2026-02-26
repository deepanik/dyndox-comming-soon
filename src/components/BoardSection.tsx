import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, Globe, MessageSquare, BarChart3, Users } from 'lucide-react';

const advisors = [
    {
        id: 'marcus',
        name: 'Marcus Sterling',
        role: 'CEO Advisor • Strategy',
        icon: <Zap className="text-blue-500" size={20} />,
        color: 'bg-blue-500',
        brief: 'Strategic pivot recommended. SISFS grant application is now 80% drafted. Review the market analysis for the Bangalore sector.'
    },
    {
        id: 'aria',
        name: 'Aria Thorne',
        role: 'Legal Advisor • Compliance',
        icon: <Shield className="text-purple-500" size={20} />,
        color: 'bg-purple-500',
        brief: 'DPIIT renewal is pending in 14 days. I have matched 3 new state-level incentives for your current burn profile.'
    },
    {
        id: 'sarah',
        name: 'Sarah Chen',
        role: 'CTO Advisor • Technology',
        icon: <Globe className="text-green-500" size={20} />,
        color: 'bg-green-500',
        brief: 'Infrastructure audit complete. Recommended cost optimization on AWS instances will save ₹12,000 monthly.'
    },
    {
        id: 'david',
        name: 'David Okonkwo',
        role: 'CFO Advisor • Finance',
        icon: <BarChart3 className="text-amber-500" size={20} />,
        color: 'bg-amber-500',
        brief: 'Runway analysis: 18 months at current burn. Recommended bridge round planning should start in Q3.'
    },
    {
        id: 'elena',
        name: 'Elena Vasquez',
        role: 'CMO Advisor • Marketing',
        icon: <MessageSquare className="text-pink-500" size={20} />,
        color: 'bg-pink-500',
        brief: 'LinkedIn outreach automation is generating 15% higher engagement. Review the new content cluster for Q2.'
    }
];

const BoardSection = () => {
    const [activeAdvisor, setActiveAdvisor] = useState(advisors[0]);

    return (
        <section id="board" className="section bg-gray-50">
            <div className="container">
                <div className="text-center mb-16">
                    <span className="eyebrow">The Board</span>
                    <h2 className="text-5xl font-serif mb-4">Five Experts. One Platform.</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Your AI Executive Board works 24/7. Meet the advisors who handle the heavy lifting while you focus on building.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    <div className="lg:col-span-4 space-y-4">
                        {advisors.map((advisor) => (
                            <button
                                key={advisor.id}
                                onClick={() => setActiveAdvisor(advisor)}
                                className={`w-full p-4 rounded-xl border transition-all text-left flex items-center gap-4 ${activeAdvisor.id === advisor.id
                                        ? 'bg-white shadow-md border-blue-500/30'
                                        : 'bg-transparent border-transparent hover:bg-gray-100'
                                    }`}
                            >
                                <div className={`w-10 h-10 rounded-lg ${advisor.color} bg-opacity-10 flex items-center justify-center`}>
                                    {advisor.icon}
                                </div>
                                <div>
                                    <h4 className="font-display font-semibold text-sm">{advisor.name}</h4>
                                    <p className="text-xs text-gray-500">{advisor.role}</p>
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="lg:col-span-8 bg-white rounded-2xl p-8 border border-gray-100 shadow-sm min-h-[400px] flex flex-col justify-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeAdvisor.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-full ${activeAdvisor.color} bg-opacity-20 flex items-center justify-center`}>
                                        {activeAdvisor.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-serif">{activeAdvisor.name}</h3>
                                        <p className="text-sm text-blue-600 font-medium">{activeAdvisor.role}</p>
                                    </div>
                                </div>

                                <div className="p-6 bg-blue-50 rounded-xl border border-blue-100">
                                    <span className="text-[10px] font-bold text-blue-500 tracking-widest uppercase mb-2 block">Morning Brief • 07:30 AM</span>
                                    <p className="text-lg text-gray-800 leading-relaxed font-serif italic">
                                        "{activeAdvisor.brief}"
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 border border-gray-100 rounded-lg">
                                        <h5 className="text-xs font-bold text-gray-400 uppercase mb-2">Capabilities</h5>
                                        <ul className="text-sm space-y-2 text-gray-600">
                                            <li>• Strategic Market Analysis</li>
                                            <li>• Competitive Intelligence</li>
                                            <li>• Growth Modeling</li>
                                        </ul>
                                    </div>
                                    <div className="p-4 border border-gray-100 rounded-lg">
                                        <h5 className="text-xs font-bold text-gray-400 uppercase mb-2">Recent Execution</h5>
                                        <ul className="text-sm space-y-2 text-gray-600">
                                            <li>• Drafted Grant Proposal</li>
                                            <li>• Optimized Burn Rate</li>
                                            <li>• Scheduled Outreach</li>
                                        </ul>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BoardSection;
