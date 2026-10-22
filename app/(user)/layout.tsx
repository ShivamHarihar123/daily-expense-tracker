import UserSidebar from '@/components/user/Sidebar/Sidebar';
import Footer from '@/components/layout/Footer';

export default function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 transition-colors">
            <UserSidebar />
            <main className="flex-1 flex flex-col min-w-0 min-h-screen overflow-y-auto">
                <div className="flex-1">
                    {children}
                </div>
                <Footer variant="compact" />
            </main>
        </div>
    );
}
