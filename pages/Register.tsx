import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [nickname, setNickname] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            setLoading(false);
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Create user document with default structure
            const defaultUser = {
                id: user.uid,
                name: name,
                nickname: nickname,
                email: email,
                avatar: "https://i.pravatar.cc/150?u=" + user.uid,
                team: "Piloto Privado",
                country: "Global",
                class: "Rookie",
                rating: 1000,
                stats: {
                    totalRaces: 0,
                    wins: 0,
                    podiums: 0,
                    top5: 0,
                    poles: 0,
                    fastestLaps: 0,
                    avgPosition: 0,
                    winRate: "0%",
                    safetyRating: "B 2.50",
                    incidentsPerRace: 0
                },
                eloHistory: [
                    { date: "Ene", elo: 1000 }
                ],
                trophies: []
            };

            await setDoc(doc(db, 'users', user.uid), defaultUser);

            navigate('/dashboard');
        } catch (err: any) {
            setError('Error al registrarse. ' + err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-app-bg-secondary p-4">
            <div className="w-full max-w-md space-y-8 rounded-2xl bg-app-bg-surface p-8 shadow-xl border border-app-border">
                <div className="text-center flex flex-col items-center">
                    <img src="/LogoFPVO.png" alt="FPVO Logo" className="h-16 w-auto object-contain mb-4" />
                    <h2 className="text-3xl font-black italic tracking-tight text-app-text-title">Únete a los primados que valen de oro</h2>
                    <p className="mt-2 text-sm text-app-text-body">Crea tu cuenta de piloto</p>
                </div>

                {error && (
                    <div className="rounded-lg bg-app-status-error/10 p-4 text-sm text-app-status-error border border-app-status-error/20 text-center font-medium">
                        {error}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="sr-only">Nombre Completo</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                className="relative block w-full rounded-lg border border-app-border bg-app-bg-input px-4 py-3 text-app-text-title placeholder-app-text-muted focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand sm:text-sm transition-all"
                                placeholder="Nombre Completo"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="nickname" className="sr-only">Nickname (Piloto)</label>
                            <input
                                id="nickname"
                                name="nickname"
                                type="text"
                                required
                                className="relative block w-full rounded-lg border border-app-border bg-app-bg-input px-4 py-3 text-app-text-title placeholder-app-text-muted focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand sm:text-sm transition-all"
                                placeholder="Nickname"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="sr-only">Correo Electrónico</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="relative block w-full rounded-lg border border-app-border bg-app-bg-input px-4 py-3 text-app-text-title placeholder-app-text-muted focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand sm:text-sm transition-all"
                                placeholder="Correo Electrónico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <label htmlFor="password" className="sr-only">Contraseña</label>
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="new-password"
                                required
                                className="relative block w-full rounded-lg border border-app-border bg-app-bg-input px-4 py-3 text-app-text-title placeholder-app-text-muted focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand sm:text-sm transition-all pr-10"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-app-text-muted hover:text-app-text-title cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-sm">{showPassword ? 'visibility_off' : 'visibility'}</span>
                            </button>
                        </div>
                        <div className="relative">
                            <label htmlFor="confirmPassword" className="sr-only">Confirmar Contraseña</label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                autoComplete="new-password"
                                required
                                className="relative block w-full rounded-lg border border-app-border bg-app-bg-input px-4 py-3 text-app-text-title placeholder-app-text-muted focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand sm:text-sm transition-all pr-10"
                                placeholder="Confirmar Contraseña"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-app-text-muted hover:text-app-text-title cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-sm">{showConfirmPassword ? 'visibility_off' : 'visibility'}</span>
                            </button>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative flex w-full justify-center rounded-lg bg-brand px-4 py-3 text-sm font-bold text-app-text-title hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-app-bg-secondary disabled:opacity-50 transition-all shadow-lg shadow-brand/20"
                        >
                            {loading ? 'Creando cuenta...' : 'Registrarse'}
                        </button>
                    </div>
                </form>

                <div className="text-center text-sm">
                    <span className="text-app-text-body">¿Ya tienes cuenta? </span>
                    <Link to="/login" className="font-bold text-brand hover:text-brand-hover transition-colors">Inicia sesión</Link>
                </div>

                <div className="text-center mt-4">
                    <Link to="/" className="text-xs text-app-text-muted hover:text-white transition-colors flex items-center justify-center gap-1">
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                        Volver al inicio
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
