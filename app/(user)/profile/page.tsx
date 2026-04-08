'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/authStore';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import styles from './page.module.scss';

type Tab = 'profile' | 'security';

function ProfileContent() {
    const router = useRouter();
    const { user, logout } = useAuth();
    const { setUser } = useAuthStore();
    const [activeTab, setActiveTab] = useState<Tab>('profile');
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [saving, setSaving] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || '',
                email: user.email || '',
            });
        }
    }, [user]);

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const response = await fetch('/api/auth/me', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(profileData),
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
                alert('Profile updated successfully!');
            } else {
                const data = await response.json();
                alert(data.error || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Failed to update profile:', error);
            alert('An error occurred while updating profile');
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setErrors({ confirmPassword: 'Passwords do not match' });
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setErrors({ newPassword: 'Password must be at least 6 characters' });
            return;
        }

        setSaving(true);

        try {
            const response = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword,
                }),
            });

            if (response.ok) {
                alert('Password changed successfully!');
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                });
            } else {
                const data = await response.json();
                alert(data.error || 'Failed to change password');
            }
        } catch (error) {
            console.error('Failed to change password:', error);
            alert('An error occurred while changing password');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        setSaving(true);
        try {
            const response = await fetch('/api/auth/me', {
                method: 'DELETE',
            });

            if (response.ok) {
                logout();
                router.push('/');
            } else {
                const data = await response.json();
                alert(data.error || 'Failed to delete account');
            }
        } catch (error) {
            console.error('Failed to delete account:', error);
            alert('An error occurred while deleting account');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Profile & Settings</h1>
                <p className={styles.subtitle}>Manage your account settings and preferences</p>
            </div>

            <div className={styles.grid}>
                <div className={styles.sidebar}>
                    <button
                        className={`${styles.tabButton} ${activeTab === 'profile' ? styles.active : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        <span>👤</span>
                        Profile
                    </button>
                    <button
                        className={`${styles.tabButton} ${activeTab === 'security' ? styles.active : ''}`}
                        onClick={() => setActiveTab('security')}
                    >
                        <span>🔒</span>
                        Security
                    </button>
                    <button
                        className={styles.deleteTabButton}
                        onClick={() => setDeleteModalOpen(true)}
                    >
                        <span>🗑️</span>
                        Delete Account
                    </button>
                </div>

                <div className={styles.content}>
                    {activeTab === 'profile' && (
                        <Card>
                            <Card.Header title="Profile Information" />
                            <Card.Body>
                                <div className={styles.avatarSection}>
                                    <div className={styles.avatar}>{getInitials(user?.name || 'U')}</div>
                                    <div className={styles.avatarInfo}>
                                        <h3>{user?.name}</h3>
                                        <p>{user?.email}</p>
                                    </div>
                                </div>

                                <form onSubmit={handleProfileUpdate} className={styles.form}>
                                    <Input
                                        type="text"
                                        label="Full Name"
                                        value={profileData.name}
                                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                        required
                                    />
                                    <Input
                                        type="email"
                                        label="Email Address"
                                        value={profileData.email}
                                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                        required
                                    />

                                    <div className={styles.actions}>
                                        <Button type="submit" loading={saving}>
                                            Save Changes
                                        </Button>
                                    </div>
                                </form>
                            </Card.Body>
                        </Card>
                    )}

                    {activeTab === 'security' && (
                        <Card>
                            <Card.Header title="Security Settings" />
                            <Card.Body>
                                <form onSubmit={handlePasswordChange} className={styles.form}>
                                    <Input
                                        type="password"
                                        label="Current Password"
                                        value={passwordData.currentPassword}
                                        onChange={(e) =>
                                            setPasswordData({
                                                ...passwordData,
                                                currentPassword: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                    <Input
                                        type="password"
                                        label="New Password"
                                        value={passwordData.newPassword}
                                        onChange={(e) =>
                                            setPasswordData({
                                                ...passwordData,
                                                newPassword: e.target.value,
                                            })
                                        }
                                        error={errors.newPassword}
                                        required
                                    />
                                    <Input
                                        type="password"
                                        label="Confirm New Password"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) =>
                                            setPasswordData({
                                                ...passwordData,
                                                confirmPassword: e.target.value,
                                            })
                                        }
                                        error={errors.confirmPassword}
                                        required
                                    />

                                    <div className={styles.actions}>
                                        <Button type="submit" loading={saving}>
                                            Update Password
                                        </Button>
                                    </div>
                                </form>
                            </Card.Body>
                        </Card>
                    )}


                </div>
            </div>

            <Modal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                title="Delete Account"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setDeleteModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleDeleteAccount}>
                            Yes, Delete My Account
                        </Button>
                    </>
                }
            >
                <p>
                    Are you sure you want to delete your account? This action cannot be undone and all your
                    data will be permanently deleted.
                </p>
            </Modal>
        </div>
    );
}

export default function ProfilePage() {
    return (
        <ProtectedRoute>
            <ProfileContent />
        </ProtectedRoute>
    );
}
