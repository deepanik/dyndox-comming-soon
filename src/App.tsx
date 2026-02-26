import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BoardSection from './components/BoardSection';

function App() {
    return (
        <div className="bg-white min-h-screen">
            <Navbar />
            <main>
                <Hero />
                <BoardSection />

                {/* Features grid */}
                <section id="features" className="section container">
                    <div className="text-center mb-16">
                        <span className="eyebrow">Platform</span>
                        <h2 className="text-5xl font-serif mb-4">Everything to scale.</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            From grant matching to compliance, your board handles the operational complexity.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard
                            title="The Vault"
                            desc="Matches your startup to 200+ Indian government grants. Drafts applications in minutes."
                        />
                        <FeatureCard
                            title="Morning Brief"
                            desc="A personalized strategic briefing delivered to your WhatsApp at 7:30 AM every morning."
                        />
                        <FeatureCard
                            title="Impact Dashboard"
                            desc="See the total rupee value created — time saved, grants won, and revenue influenced."
                        />
                    </div>
                </section>
            </main>

            <footer className="py-20 border-t border-gray-100">
                <div className="container text-center">
                    <div className="font-display font-bold tracking-widest text-sm mb-4">DYNDOX LAUNCHPAD</div>
                    <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Dyndox AI. Built for Indian Founders.</p>
                </div>
            </footer>
        </div>
    );
}

const FeatureCard = ({ title, desc }: { title: string, desc: string }) => (
    <div className="p-8 border border-gray-100 rounded-2xl hover:border-blue-500/20 hover:shadow-md transition-all">
        <h4 className="text-xl font-serif mb-3">{title}</h4>
        <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
    </div>
);

export default App;
