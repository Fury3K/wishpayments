'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, User, Mail, Lock, LogOut, Save, Camera, Shield, ChevronRight } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';
import { BottomNav } from '../components/BottomNav';
import { ConfirmationModal } from '../components/modals/ConfirmationModal';
import Link from 'next/link';

export default function ProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        oldPassword: '',
        password: '',
        confirmPassword: '',
        profilePicture: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/api/user/profile');
                setFormData(prev => ({
                    ...prev,
                    name: response.data.name,
                    email: response.data.email,
                    profilePicture: response.data.profilePicture || ''
                }));
            } catch (error: any) {
                toast.error('Failed to load profile');
                if (error.response?.status === 401) router.push('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [router]);

    const confirmLogout = () => {
        localStorage.removeItem('token');
        toast.success('Logged out successfully');
        router.push('/');
    };

    const handleLogout = () => {
        setShowLogoutModal(true);
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
             toast.error('Image size must be less than 5MB');
             return;
        }

        setIsUploading(true);
        // const uploadToast = toast.loading('Uploading and saving image...'); // Removed toast in favor of visual feedback and modal

        try {
            const formDataUpload = new FormData();
            formDataUpload.append('file', file);

            const response = await api.post('/api/upload', formDataUpload, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const newImageUrl = response.data.url;

            // Auto-save to profile
            await api.put('/api/user/profile', {
                name: formData.name,
                email: formData.email,
                profilePicture: newImageUrl
            });

            setFormData(prev => ({ ...prev, profilePicture: newImageUrl }));
            // toast.success('Profile picture updated!', { id: uploadToast });
            setShowSuccessModal(true);
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to upload image.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (formData.password && formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setSaving(true);
        try {
            await api.put('/api/user/profile', {
                name: formData.name,
                email: formData.email,
                oldPassword: formData.oldPassword || undefined,
                password: formData.password || undefined,
                profilePicture: formData.profilePicture
            });
            toast.success('Profile updated successfully');
            setFormData(prev => ({ ...prev, oldPassword: '', password: '', confirmPassword: '' }));
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen flex justify-center items-center bg-[#F3F4F6]"><span className="loading loading-spinner loading-lg text-blue-600"></span></div>;
    }

    return (
        <div className="bg-[#F3F4F6] font-sans text-[#1A1B2D] antialiased min-h-screen pb-[calc(6rem+env(safe-area-inset-bottom))] relative flex flex-col">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-6 sticky top-0 bg-[#F3F4F6] z-10">
                <Link href="/dashboard" className="p-2 -ml-2 text-gray-500 hover:text-gray-800 transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-xl font-bold text-[#1A1B2D]">Profile</h1>
                <div className="w-10"></div> {/* Spacer */}
            </header>

            <main className="px-6 flex-1">
                {/* Profile Avatar */}
                <div className="flex flex-col items-center mb-8">
                    <div className="relative group">
                        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/20 overflow-hidden relative">
                            {formData.profilePicture ? (
                                <img src={formData.profilePicture} alt="Profile" className={`w-full h-full object-cover transition-opacity duration-300 ${isUploading ? 'opacity-50' : 'opacity-100'}`} />
                            ) : (
                                <span className="text-4xl font-bold">{formData.name.charAt(0).toUpperCase()}</span>
                            )}
                            
                            {/* Loading Overlay */}
                            {isUploading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10">
                                    <span className="loading loading-spinner loading-md text-white"></span>
                                </div>
                            )}
                        </div>
                        <label className={`absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${isUploading ? 'pointer-events-none opacity-50' : ''}`}>
                            <Camera className="w-5 h-5 text-gray-600" />
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} disabled={isUploading} />
                        </label>
                    </div>
                    <h2 className="text-xl font-bold mt-4 text-[#1A1B2D]">{formData.name}</h2>
                    <p className="text-gray-500 text-sm">{formData.email}</p>
                </div>

                {/* Edit Form */}
                <div className="bg-white rounded-3xl p-6 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.03)] mb-6">
                    <h3 className="font-bold text-lg text-[#1A1B2D] mb-5">Personal Details</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 ml-1">Full Name</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <User className="w-5 h-5" />
                                </div>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-xl text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-0 transition-all placeholder:text-gray-400"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 ml-1">Email Address</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-xl text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-0 transition-all placeholder:text-gray-400"
                                    required
                                />
                            </div>
                        </div>

                        <div className="pt-4 space-y-4">
                            <h3 className="font-bold text-lg text-[#1A1B2D]">Security</h3>
                            
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 ml-1">Current Password</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.oldPassword}
                                        onChange={e => setFormData({ ...formData, oldPassword: e.target.value })}
                                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-xl text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-0 transition-all placeholder:text-gray-400"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 ml-1">New Password</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-xl text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-0 transition-all placeholder:text-gray-400"
                                    />
                                </div>
                            </div>

                            {formData.password && (
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700 ml-1">Confirm New Password</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                            <Lock className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            value={formData.confirmPassword}
                                            onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-xl text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-0 transition-all placeholder:text-gray-400"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-bold text-lg shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 mt-6"
                        >
                            {saving ? <span className="loading loading-spinner loading-sm"></span> : <>Save Changes <Save className="w-5 h-5" /></>}
                        </button>
                    </form>
                </div>

                <Link href="/profile/privacy" className="w-full py-4 rounded-xl bg-white text-[#1A1B2D] font-bold text-lg shadow-[0_10px_30px_-5px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all flex items-center justify-between px-6 mb-4">
                    <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-gray-500" />
                        <span>Privacy & Data</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                </Link>

                <button
                    onClick={handleLogout}
                    className="w-full py-4 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-lg transition-all flex items-center justify-center gap-2 mb-8"
                >
                    Log Out <LogOut className="w-5 h-5" />
                </button>
            </main>

            <BottomNav />

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="modal modal-open modal-bottom sm:modal-middle z-50">
                    <div className="modal-box text-center">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <Save className="w-8 h-8 text-green-600" />
                            </div>
                        </div>
                        <h3 className="font-bold text-lg text-[#1A1B2D]">Upload Complete!</h3>
                        <p className="py-2 text-gray-600">Your profile picture has been updated successfully.</p>
                        <div className="modal-action justify-center">
                            <button className="btn btn-primary w-full max-w-[120px]" onClick={() => setShowSuccessModal(false)}>Awesome</button>
                        </div>
                    </div>
                    <div className="modal-backdrop" onClick={() => setShowSuccessModal(false)}></div>
                </div>
            )}

            <ConfirmationModal
                isOpen={showLogoutModal}
                title="Log Out"
                message="Are you sure you want to log out of your account?"
                onConfirm={confirmLogout}
                onCancel={() => setShowLogoutModal(false)}
                confirmText="Log Out"
                cancelText="Cancel"
                variant="danger"
            />
        </div>
    );
}