'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, Command, Github } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import axios from 'axios';
import { toast } from 'react-hot-toast'; // Assuming react-hot-toast is installed or will be.

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError('');

      try {
          const response = await axios.post('/api/auth/register', { name, email, password });
          if (response.status === 201) {
              toast.success('Registration successful! Please log in.');
              router.push('/login');
          }
      } catch (err: any) {
          setError(err.response?.data?.message || 'Registration failed');
          toast.error(err.response?.data?.message || 'Registration failed');
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      <Navbar showProfile={false} />

      <div className="flex-1 flex flex-col justify-center items-center p-4">
        <div className="card w-full max-w-sm bg-base-100 shadow-xl">
            <div className="card-body">
                <h2 className="card-title text-2xl font-bold text-center justify-center mb-2">Create Account</h2>
                <p className="text-center text-base-content/70 mb-6">Start tracking your financial goals today.</p>

                <form className="space-y-4" onSubmit={handleRegister}>
                    {error && <div className="alert alert-error">{error}</div>}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Full Name</span>
                        </label>
                        <label className="input-group">
                            <div className="relative w-full">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-base-content/50" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    className="input input-bordered w-full pl-10"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </label>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Email</span>
                        </label>
                        <label className="input-group">
                            <div className="relative w-full">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-base-content/50" />
                                </div>
                                <input
                                    type="email"
                                    placeholder="hello@example.com"
                                    className="input input-bordered w-full pl-10"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </label>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Password</span>
                        </label>
                        <label className="input-group">
                            <div className="relative w-full">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-base-content/50" />
                                </div>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="input input-bordered w-full pl-10"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </label>
                    </div>

                    <button className="btn btn-primary w-full mt-4" type="submit" disabled={loading}>
                        {loading ? <span className="loading loading-spinner"></span> : 'Sign Up'}
                    </button>
                </form>

                <div className="divider">OR</div>

                <div className="space-y-3">
                    <button className="btn btn-outline w-full gap-2">
                        <Command className="w-5 h-5" />
                        Continue with Google
                    </button>
                    <button className="btn btn-outline w-full gap-2">
                        <Github className="w-5 h-5" />
                        Continue with GitHub
                    </button>
                </div>

                <div className="text-center mt-6 text-sm">
                    Already have an account?{' '}
                    <Link href="/login" className="link link-primary font-semibold">
                        Log in
                    </Link>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}