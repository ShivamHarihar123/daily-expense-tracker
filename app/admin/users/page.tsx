'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Card from '@/components/ui/Card/Card';
import Input from '@/components/ui/Input/Input';
import Button from '@/components/ui/Button/Button';
import styles from './page.module.scss';

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    verified: boolean;
    createdAt: string;
}

export default function AdminUsers() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuthStore();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        if (user?.role !== 'admin') {
            router.push('/dashboard');
            return;
        }

        fetchUsers();
    }, [isAuthenticated, user, router, page, search]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '20',
                ...(search && { search }),
            });

            const response = await fetch(`/api/admin/users?${params}`);
            const data = await response.json();

            if (data.success) {
                setUsers(data.users);
                setTotalPages(data.pagination.totalPages);
                setTotalItems(data.pagination.totalItems);
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId: string) => {
        if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/users/${userId}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (data.success) {
                alert('User deleted successfully');
                fetchUsers();
            } else {
                alert(data.error || 'Failed to delete user');
            }
        } catch (error) {
            console.error('Failed to delete user:', error);
            alert('Failed to delete user');
        }
    };

    const handleRoleToggle = async (userId: string, currentRole: string) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';

        try {
            const response = await fetch(`/api/admin/users/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: newRole }),
            });

            const data = await response.json();

            if (data.success) {
                alert(`User role updated to ${newRole}`);
                fetchUsers();
            } else {
                alert(data.error || 'Failed to update user role');
            }
        } catch (error) {
            console.error('Failed to update user:', error);
            alert('Failed to update user');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1>User Management</h1>
                    <p>Manage all users in the system</p>
                </div>
                <Button onClick={() => router.push('/admin')}>← Back to Dashboard</Button>
            </div>

            <Card className={styles.filterCard}>
                <div className={styles.filters}>
                    <Input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        className={styles.searchInput}
                    />
                    <div className={styles.stats}>
                        <span>Total Users: {totalItems}</span>
                    </div>
                </div>
            </Card>

            <Card>
                {loading ? (
                    <div className={styles.loading}>Loading users...</div>
                ) : (
                    <>
                        <div className={styles.userTable}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th>Joined</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((u) => (
                                        <tr key={u._id}>
                                            <td>{u.name}</td>
                                            <td>{u.email}</td>
                                            <td>
                                                <span
                                                    className={`${styles.badge} ${u.role === 'admin'
                                                            ? styles.badgeAdmin
                                                            : styles.badgeUser
                                                        }`}
                                                >
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td>
                                                <span
                                                    className={`${styles.badge} ${u.verified
                                                            ? styles.badgeVerified
                                                            : styles.badgeUnverified
                                                        }`}
                                                >
                                                    {u.verified ? 'Verified' : 'Unverified'}
                                                </span>
                                            </td>
                                            <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <div className={styles.actions}>
                                                    <button
                                                        className={styles.btnRole}
                                                        onClick={() => handleRoleToggle(u._id, u.role)}
                                                        disabled={u._id === user?._id}
                                                    >
                                                        {u.role === 'admin' ? '👤 Make User' : '👑 Make Admin'}
                                                    </button>
                                                    <button
                                                        className={styles.btnDelete}
                                                        onClick={() => handleDelete(u._id)}
                                                        disabled={u._id === user?._id}
                                                    >
                                                        🗑️ Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {totalPages > 1 && (
                            <div className={styles.pagination}>
                                <Button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                >
                                    Previous
                                </Button>
                                <span>
                                    Page {page} of {totalPages}
                                </span>
                                <Button
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </Card>
        </div>
    );
}
