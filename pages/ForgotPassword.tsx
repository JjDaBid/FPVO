import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import { Link } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);

        try {
            await sendPasswordResetEmail(auth, email);
            setMessage('Se ha enviado un correo de recuperación. Revisa tu bandeja de entrada.');
        } catch (err: any) {
            console.error(err);
            if (err.code === 'auth/user-not-found') {
                setError('No existe una cuenta asociada a este correo.');
            } else {
                setError('Error al enviar el correo. Intenta nuevamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-app-bg-secondary p-4">
            <div className="w-full max-w-md space-y-8 rounded-2xl bg-app-bg-surface p-8 shadow-xl border border-app-border">
                <div className="text-center flex flex-col items-center">
                    <img src="/LogoFPVO.png" alt="FPVO Logo" className="h-24 w-auto object-contain mb-4" />
                    <h2 className="text-3xl font-black italic tracking-tight text-app-text-title">Recuperar Contraseña</h2>
                    <p className="mt-2 text-sm text-app-text-body">Ingresa tu correo para recibir las instrucciones</p>
                </div>

                {message && (
                    <div className="rounded-lg bg-app-status-success/10 p-4 text-sm text-app-status-success border border-app-status-success/20 text-center font-medium">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="rounded-lg bg-app-status-error/10 p-4 text-sm text-app-status-error border border-app-status-error/20 text-center font-medium">
                        {error}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative flex w-full justify-center rounded-lg bg-brand px-4 py-3 text-sm font-bold text-app-text-title hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-app-bg-secondary disabled:opacity-50 transition-all shadow-lg shadow-brand/20"
                        >
                            {loading ? 'Enviando...' : 'Enviar Correo de Recuperación'}
                        </button>
                    </div>
                </form>

                <div className="text-center text-sm space-y-2">
                    <div>
                        <Link to="/login" className="font-bold text-brand hover:text-brand-hover transition-colors">Volver al inicio de sesión</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
