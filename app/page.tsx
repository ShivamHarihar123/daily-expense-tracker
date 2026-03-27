import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar/Navbar';
import Button from '@/components/ui/Button';
import styles from './page.module.scss';

export default function HomePage() {
    return (
        <div className={styles.container}>
            <Navbar />
            {/* Background Blobs */}
            <div className={`${styles.blob} ${styles.blob1}`} />
            <div className={`${styles.blob} ${styles.blob2}`} />

            {/* Hero Section */}
            <header className={styles.hero}>
                <div className={styles.heroContent}>
                    <div className={styles.badge}>
                        <span>✨</span>
                        AI-Powered Financial Freedom
                    </div>
                    <h1 className={styles.title}>
                        Master Your Money <br />
                        <span>with </span>
                        <span className={styles.highlight}>Precision.</span>
                    </h1>
                    <p className={styles.subtitle}>
                        The most elegant way to track expenses, manage budgets, and visualize your financial health in real-time. Built for those who value clarity.
                    </p>
                    <div className={styles.actions}>
                        <Link href="/signup">
                            <Button size="lg" className={styles.cta}>
                                Get Started Free
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button variant="outline" size="lg">
                                Sign In
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className={styles.heroImage}>
                    <div className={styles.preview}>
                        <Image 
                            src="/app_mockup_dashboard_high_quality_premium_glassmorphism_ui_design_4k_dark_theme_fintech_dashboard_interface_elegant_minimalist_png_1774516223999.png"
                            alt="ExpenseTracker Dashboard Preview"
                            width={1000}
                            height={600}
                            priority
                        />
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section className={styles.features}>
                <div className={styles.featureGrid}>
                    <div className={styles.featureCard}>
                        <div className={styles.icon}>📱</div>
                        <h3>Instant Tracking</h3>
                        <p>Log your daily expenditures in seconds with a mobile-optimized interface designed for speed.</p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.icon}>🎯</div>
                        <h3>Smart Budgets</h3>
                        <p>Set monthly targets and let our AI calculate exactly how much you have left to spend safely.</p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.icon}>📊</div>
                        <h3>Deep Analytics</h3>
                        <p>Visualize your spending habits with beautiful, interactive charts that reveal and hidden patterns.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
