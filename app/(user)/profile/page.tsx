'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import styles from './page.module.scss';

type Tab = 'profile' | 'security';

function ProfileContent() {
    const router = useRouter();
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState<Tab>('profile');
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [saving, setSaving] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

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
            // TODO: Implement profile update API
            await new Promise((resolve) => setTimeout(resolve, 1000));
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Failed to update profile:', error);
            alert('Failed to update profile');
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
            // TODO: Implement password change API
            await new Promise((resolve) => setTimeout(resolve, 1000));
            alert('Password changed successfully!');
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        } catch (error) {
            console.error('Failed to change password:', error);
            alert('Failed to change password');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        try {
            // TODO: Implement account deletion API
            await new Promise((resolve) => setTimeout(resolve, 1000));
            logout();
            router.push('/');
        } catch (error) {
            console.error('Failed to delete account:', error);
            alert('Failed to delete account');
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
                                        <Button variant="outline" size="sm">
                                            Change Avatar
                                        </Button>
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
                            <Card.Header title="Change Password" />
                            <Card.Body>
                                <form onSubmit={handlePasswordChange} className={styles.form}>
                                    <Input
                                        type="password"
                                        label="Current Password"
                                        value={passwordData.currentPassword}
                                        onChange={(e) =>
                                            setPasswordData({ ...passwordData, currentPassword: e.target.value })
                                        }
                                        required
                                    />
                                    <Input
                                        type="password"
                                        label="New Password"
                                        value={passwordData.newPassword}
                                        onChange={(e) =>
                                            setPasswordData({ ...passwordData, newPassword: e.target.value })
                                        }
                                        error={errors.newPassword}
                                        helperText="Must be at least 6 characters"
                                        required
                                    />
                                    <Input
                                        type="password"
                                        label="Confirm New Password"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) =>
                                            setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                                        }
                                        error={errors.confirmPassword}
                                        required
                                    />

                                    <div className={styles.actions}>
                                        <Button type="submit" loading={saving}>
                                            Change Password
                                        </Button>
                                    </div>
                                </form>

                                <div className={styles.dangerZone}>
                                    <h3 className={styles.dangerTitle}>Danger Zone</h3>
                                    <p className={styles.dangerText}>
                                        Once you delete your account, there is no going back. Please be certain.
                                    </p>
                                    <Button variant="danger" onClick={() => setDeleteModalOpen(true)}>
                                        Delete Account
                                    </Button>
                                </div>
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
