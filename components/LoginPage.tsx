
import React, { useState } from 'react';
import { authService } from '../services/authService.ts';
import SpinnerIcon from './icons/SpinnerIcon.tsx';

// Replaced UserIcon with EnvelopeIcon to better represent an email/username field.
const EnvelopeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25-2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>
);


const LockClosedIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 0 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
    </svg>
);

interface LoginPageProps {
    onLoginSuccess: (username: string) => void;
    authScriptUrl?: string;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, authScriptUrl }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            const loggedInUsername = await authService.login(username, password, authScriptUrl);
            onLoginSuccess(loggedInUsername);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col justify-start bg-slate-800 px-8 pt-20 sm:pt-28 font-sans">
            <div className="w-full max-w-sm mx-auto">
                <div className="mb-12">
                    {/* A back arrow is shown in the image, but omitted here as it serves no function on the initial login screen. */}
                    <h1 className="text-5xl font-bold text-white">Log In</h1>
                </div>

                <form className="space-y-8" onSubmit={handleSubmit}>
                    {/* Username Input - Changed to Email */}
                    <div className="relative border-b border-slate-600 focus-within:border-amber-400 transition-colors duration-300">
                        <EnvelopeIcon className="absolute left-1 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                            id="username"
                            name="username"
                            type="email"
                            autoComplete="email"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="block w-full bg-transparent py-3 pl-10 text-white placeholder:text-slate-400 focus:outline-none sm:text-sm sm:leading-6"
                            placeholder="Email Address"
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <div className="relative border-b border-slate-600 focus-within:border-amber-400 transition-colors duration-300">
                            <LockClosedIcon className="absolute left-1 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full bg-transparent py-3 pl-10 text-white placeholder:text-slate-400 focus:outline-none sm:text-sm sm:leading-6"
                                placeholder="Password"
                            />
                        </div>
                        {error && (
                            <p className="mt-2 text-sm text-red-500">{error}</p>
                        )}
                    </div>
                    
                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex w-full justify-center items-center rounded-full bg-slate-900 px-3 py-4 text-md font-semibold leading-6 text-white shadow-lg hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600 disabled:opacity-70 disabled:cursor-wait transition-colors"
                        >
                            {isLoading ? (
                                <SpinnerIcon className="animate-spin h-5 w-5 text-white" />
                            ) : (
                                'Log in'
                            )}
                        </button>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm text-slate-400">
                    First time here?{' '}
                    <a href="#" onClick={(e) => e.preventDefault()} className="font-semibold leading-6 text-cyan-400 hover:text-cyan-300">
                        Sign up.
                    </a>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;