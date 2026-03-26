import UserSidebar from '@/components/user/Sidebar/Sidebar';
import styles from './layout.module.scss';

export default function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={styles.layout}>
            <UserSidebar />
            <main className={styles.main}>
                {children}
            </main>
        </div>
    );
}
