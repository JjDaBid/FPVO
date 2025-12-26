import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-app-bg-main text-white font-sans selection:bg-brand selection:text-white">
            {/* NAVBAR */}
            <nav className="absolute top-0 w-full z-50 px-6 py-2">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center justify-start py-2">
                            <img src="/LogoFPVO.png" alt="FPVO Logo" className="h-12 w-auto object-contain" />
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link to="/login" className="text-sm font-bold text-gray-300 hover:text-white transition-colors uppercase tracking-wider hidden md:block">
                            Iniciar Sesión
                        </Link>
                        <Link to="/register" className="px-6 py-2 rounded-lg bg-brand hover:bg-brand-hover text-white text-sm font-bold transition-all shadow-lg shadow-brand/20 uppercase tracking-wide">
                            Unirse
                        </Link>
                    </div>
                </div>
            </nav>

            {/* HERO SECTION */}
            <section className="relative min-h-screen flex items-center overflow-hidden mt-10">
                {/* Background Image & Overlays */}
                <div className="absolute inset-0 top-10 z-0">
                    {/* <div className="absolute inset-0 bg-[url('/HeroFPVO.jpg')] bg-[length:95%_auto] bg-right lg:bg-center bg-no-repeat"></div> */}
                    <div className="absolute inset-0 bg-[url('/HeroFPVO.jpg')] bg-cover bg-top bg-no-repeat"></div>

                    {/* Gradient from left (dark) to right (transparent) to show image on the side */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#101622] via-[#101622]/50 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#101622] via-transparent to-transparent"></div>

                    {/* Accent Glows */}
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-brand/30 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-cyan-600/20 rounded-full blur-[100px] mix-blend-screen"></div>
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-glow"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_0_20px_rgba(19,91,236,0.3)] animate-fade-in-up">
                            <span className="w-2 h-2 rounded-full bg-brand animate-pulse"></span>
                            <span className="text-xs font-bold text-brand tracking-wider uppercase drop-shadow-lg">SimRacing Profesional</span>
                        </div>

                        <h1 className="text-6xl md:text-7xl font-black italic leading-[0.85] tracking-tighter text-white animate-fade-in-up delay-100">
                            PRIMADOS QUE <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-cyan-400 drop-shadow-[0_0_30px_rgba(19,91,236,0.6)]">VALEN DE</span> <br />
                            ORO
                        </h1>

                        <p className="text-lg text-gray-300 font-medium max-w-lg leading-relaxed animate-fade-in-up delay-200 border-l-4 border-brand pl-6">
                            Compite en el campeonato de autos más prestigioso del Mundo. Física realista, tiempos cronometrados y recompensas exclusivas por tu desempeño.
                        </p>

                        <div className="flex flex-wrap items-center gap-4 animate-fade-in-up delay-300 pt-4">
                            <Link to="/register" className="group relative flex items-center justify-center gap-3 bg-brand text-white px-8 py-4 rounded-none skew-x-[-10deg] hover:bg-brand-hover transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(19,91,236,0.4)]">
                                <span className="skew-x-[10deg] font-black italic text-lg tracking-wider">EMPIEZA AHORA</span>
                                <span className="material-symbols-outlined filled skew-x-[10deg] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </Link>

                            <a href="#features" className="group relative flex items-center justify-center gap-3 px-8 py-4 rounded-none skew-x-[-10deg] border border-white/20 hover:bg-white/10 transition-all">
                                <span className="skew-x-[10deg] font-bold text-sm tracking-wide">CONOCER MÁS</span>
                            </a>
                        </div>
                    </div>

                    {/* Floating Info Cards (Decorative) */}
                    <div className="hidden lg:block relative h-[600px] perspective-1000">
                        <div className="absolute top-1/4 right-10 w-64 bg-app-bg-surface/80 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-2xl transform rotate-y-[-10deg] hover:rotate-y-0 transition-transform duration-500 float-animation">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center">
                                    <span className="material-symbols-outlined text-white">trophy</span>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold">Próximo Evento</p>
                                    <p className="text-white font-bold italic">GP de Mónaco</p>
                                </div>
                            </div>
                            <div className="w-full bg-gray-700 h-1.5 rounded-full mt-2 overflow-hidden">
                                <div className="bg-brand w-3/4 h-full"></div>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-1 text-right">Inscripciones al 75%</p>
                        </div>

                        <div className="absolute bottom-12 right-12 w-72 bg-app-bg-surface/90 backdrop-blur-md border border-white/10 p-5 rounded-xl shadow-2xl transform rotate-y-[-5deg] hover:rotate-y-0 transition-transform duration-500 float-animation delay-500">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold">Vuelta Rápida</p>
                                    <h4 className="text-2xl font-black italic text-white">1:18.452</h4>
                                </div>
                                <span className="px-2 py-1 rounded bg-green-500/20 text-green-400 text-xs font-bold">+1.2s</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <img src="https://i.pravatar.cc/150?img=12" alt="User" className="w-8 h-8 rounded-full border-2 border-brand" />
                                <p className="text-sm font-bold text-gray-300">Carlos Sainz Jr.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURES GRID */}
            <section id="features" className="py-20 bg-app-bg-secondary relative">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="p-8 rounded-2xl bg-app-bg-surface border border-white/5 hover:border-brand/50 transition-colors group">
                            <span className="material-symbols-outlined text-5xl text-brand mb-6 group-hover:scale-110 transition-transform">speed</span>
                            <h3 className="text-2xl font-black italic text-white mb-3">Servidores 120Hz</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Compite sin lag. Nuestros servidores dedicados de alta frecuencia garantizan la experiencia más fluida y justa.
                            </p>
                        </div>
                        {/* Feature 2 */}
                        <div className="p-8 rounded-2xl bg-app-bg-surface border border-white/5 hover:border-brand/50 transition-colors group">
                            <span className="material-symbols-outlined text-5xl text-brand mb-6 group-hover:scale-110 transition-transform">gavel</span>
                            <h3 className="text-2xl font-black italic text-white mb-3">Control total en pista</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Nada se escapa: cada maniobra registrada y evaluada para mantener la competición justa.
                            </p>
                        </div>
                        {/* Feature 3 */}
                        <div className="p-8 rounded-2xl bg-app-bg-surface border border-white/5 hover:border-brand/50 transition-colors group">
                            <span className="material-symbols-outlined text-5xl text-brand mb-6 group-hover:scale-110 transition-transform">payments</span>
                            <h3 className="text-2xl font-black italic text-white mb-3">Premios Reales</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Tu habilidad vale oro. Repartimos más de $5,000 USD en premios cada temporada a los mejores pilotos y equipos.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="py-20 bg-brand text-white">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl md:text-6xl font-black italic mb-8">¿LISTO PARA CORRER?</h2>
                    <Link to="/register" className="inline-block bg-cyan-500 text-brand px-10 py-5 rounded-full font-black text-xl hover:bg-black hover:text-white transition-all shadow-2xl transform hover:scale-105">
                        UNIRSE AHORA
                    </Link>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="py-10 bg-app-bg-input text-center text-gray-500 text-sm">
                <p>&copy; {new Date().getFullYear()} FPVO League. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
