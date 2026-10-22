import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-[#0f172a] text-white relative overflow-x-hidden selection:bg-indigo-500 selection:text-white">
            <Navbar />

            {/* Background Ambient Glows */}
            <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] bg-gradient-to-br from-indigo-600/25 to-teal-500/15 rounded-full blur-[100px] pointer-events-none -z-0" />
            <div className="absolute top-[35%] left-[-150px] w-[550px] h-[550px] bg-gradient-to-br from-blue-500/15 to-indigo-500/10 rounded-full blur-[100px] pointer-events-none -z-0" />
            <div className="absolute bottom-[10%] right-[-120px] w-[500px] h-[500px] bg-gradient-to-br from-indigo-500/15 to-teal-400/10 rounded-full blur-[100px] pointer-events-none -z-0" />

            {/* 1. HERO SECTION */}
            <header className="relative z-10 max-w-[1400px] mx-auto px-6 pt-12 md:pt-20 pb-16 flex flex-col md:flex-row items-center justify-between gap-12 min-h-[calc(100vh-80px)]">
                <div className="flex-1 max-w-2xl text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-600/15 border border-indigo-400/30 text-indigo-300 text-xs sm:text-sm font-medium backdrop-blur-md mb-6">
                        <span>✨</span>
                        <span>AI-Powered Financial Intelligence</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 text-white">
                        Master Your Money <br />
                        <span>with </span>
                        <span className="bg-gradient-to-r from-indigo-400 to-teal-300 bg-clip-text text-transparent">
                            Total Precision.
                        </span>
                    </h1>

                    <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto md:mx-0 mb-8 leading-relaxed">
                        The modern, intuitive expense tracker that automatically categorizes transactions, sets smart budget limits, and reveals savings opportunities with AI insights in real-time.
                    </p>

                    <div className="flex items-center justify-center md:justify-start gap-4 flex-wrap mb-8">
                        <Link href="/signup">
                            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/40 inline-flex items-center gap-2">
                                Get Started Free
                                <span>→</span>
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
                                Sign In
                            </Button>
                        </Link>
                        <a href="#features" className="text-slate-400 hover:text-indigo-400 text-sm font-medium px-2 py-1 transition">
                            Explore Features ↓
                        </a>
                    </div>

                    <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap text-xs sm:text-sm text-slate-400">
                        <span className="text-amber-400 tracking-wider">★★★★★</span>
                        <span>
                            Rated <strong className="text-slate-200">4.9/5</strong> by 10,000+ smart budgeters • 100% Free to start • No credit card required
                        </span>
                    </div>
                </div>

                <div className="flex-1 relative flex items-center justify-center w-full max-w-[620px]">
                    <div className="relative rounded-2xl md:rounded-3xl p-3 bg-white/[0.04] backdrop-blur-xl border border-white/15 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] transition duration-500 hover:scale-[1.01]">
                        <Image 
                            src="/app_mockup_dashboard_high_quality_premium_glassmorphism_ui_design_4k_dark_theme_fintech_dashboard_interface_elegant_minimalist_png_1774516223999.png"
                            alt="ExpenseTracker Dashboard Preview"
                            width={1000}
                            height={600}
                            priority
                            className="rounded-xl block w-full h-auto"
                        />

                        {/* Floating Metric Pill Top */}
                        <div className="hidden sm:flex absolute -top-4 -right-4 items-center gap-3 px-4 py-2.5 bg-slate-900/90 backdrop-blur-md border border-white/15 rounded-full shadow-xl">
                            <span className="text-xl">📈</span>
                            <div>
                                <span className="block text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Monthly Savings</span>
                                <strong className="block text-xs font-bold text-emerald-400">+34% ($520 saved)</strong>
                            </div>
                        </div>

                        {/* Floating Metric Pill Bottom */}
                        <div className="hidden sm:flex absolute -bottom-4 -left-4 items-center gap-3 px-4 py-2.5 bg-slate-900/90 backdrop-blur-md border border-white/15 rounded-full shadow-xl">
                            <span className="text-xl">🤖</span>
                            <div>
                                <span className="block text-[10px] uppercase font-semibold text-slate-400 tracking-wider">AI Forecast</span>
                                <strong className="block text-xs font-bold text-teal-300">Safe to spend $45/day</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* 2. STATS & IMPACT BAR */}
            <section className="relative z-10 max-w-[1300px] mx-auto px-6 mb-20">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 sm:p-8 bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl sm:rounded-3xl shadow-xl">
                    <div className="text-center">
                        <span className="block text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
                            $15M+
                        </span>
                        <span className="text-xs sm:text-sm text-slate-400 mt-1 block">Expenses Tracked</span>
                    </div>
                    <div className="text-center">
                        <span className="block text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-white via-slate-100 to-teal-300 bg-clip-text text-transparent">
                            98.4%
                        </span>
                        <span className="text-xs sm:text-sm text-slate-400 mt-1 block">AI Categorization Accuracy</span>
                    </div>
                    <div className="text-center">
                        <span className="block text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
                            32%
                        </span>
                        <span className="text-xs sm:text-sm text-slate-400 mt-1 block">Avg. Monthly Savings</span>
                    </div>
                    <div className="text-center">
                        <span className="block text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-white via-slate-100 to-teal-300 bg-clip-text text-transparent">
                            10,000+
                        </span>
                        <span className="text-xs sm:text-sm text-slate-400 mt-1 block">Active Users & Teams</span>
                    </div>
                </div>
            </section>

            {/* 3. CORE FEATURES SECTION */}
            <section id="features" className="relative z-10 py-20 border-t border-white/5">
                <div className="text-center max-w-2xl mx-auto px-6 mb-14">
                    <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-2 block">
                        Intelligent Features
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
                        Everything You Need to Take Financial Control
                    </h2>
                    <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                        Engineered for speed, clarity, and peace of mind. Say goodbye to messy spreadsheets and surprise end-of-month bank statements.
                    </p>
                </div>

                <div className="max-w-[1300px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Feature 1 */}
                    <div className="p-7 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-indigo-400/40 transition duration-200 flex flex-col group">
                        <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-400/30 flex items-center justify-center text-2xl mb-5 group-hover:scale-105 transition">
                            🤖
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Smart AI Categorization</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1">
                            Our intelligent algorithm automatically sorts your spending into groceries, utilities, dining, entertainment, and custom categories without manual guesswork.
                        </p>
                        <span className="self-start text-[11px] font-semibold text-teal-400 bg-teal-400/10 border border-teal-400/20 px-2.5 py-1 rounded-md">
                            Machine Learning
                        </span>
                    </div>

                    {/* Feature 2 */}
                    <div className="p-7 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-indigo-400/40 transition duration-200 flex flex-col group">
                        <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-400/30 flex items-center justify-center text-2xl mb-5 group-hover:scale-105 transition">
                            🎯
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Predictive Budget Limits</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1">
                            Establish monthly spending limits per category and receive proactive warnings before you cross your threshold, keeping you accountable effortlessly.
                        </p>
                        <span className="self-start text-[11px] font-semibold text-teal-400 bg-teal-400/10 border border-teal-400/20 px-2.5 py-1 rounded-md">
                            Proactive Alerts
                        </span>
                    </div>

                    {/* Feature 3 */}
                    <div className="p-7 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-indigo-400/40 transition duration-200 flex flex-col group">
                        <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-400/30 flex items-center justify-center text-2xl mb-5 group-hover:scale-105 transition">
                            📊
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Deep Visual Analytics</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1">
                            Interactive monthly breakdowns, trend lines, and velocity charts reveal hidden spending patterns and help you identify immediate opportunities to save.
                        </p>
                        <span className="self-start text-[11px] font-semibold text-teal-400 bg-teal-400/10 border border-teal-400/20 px-2.5 py-1 rounded-md">
                            Interactive Charts
                        </span>
                    </div>

                    {/* Feature 4 */}
                    <div className="p-7 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-indigo-400/40 transition duration-200 flex flex-col group">
                        <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-400/30 flex items-center justify-center text-2xl mb-5 group-hover:scale-105 transition">
                            ⚡
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Lightning-Fast Entry</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1">
                            Log expenses in under five seconds on mobile or desktop with quick-select payment methods, receipt attachments, and searchable tags.
                        </p>
                        <span className="self-start text-[11px] font-semibold text-teal-400 bg-teal-400/10 border border-teal-400/20 px-2.5 py-1 rounded-md">
                            Mobile Optimized
                        </span>
                    </div>

                    {/* Feature 5 */}
                    <div className="p-7 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-indigo-400/40 transition duration-200 flex flex-col group">
                        <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-400/30 flex items-center justify-center text-2xl mb-5 group-hover:scale-105 transition">
                            📑
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Instant CSV & PDF Export</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1">
                            Generate audit-ready spreadsheets and PDF reports for tax preparation, business reimbursements, or personal wealth tracking with one click.
                        </p>
                        <span className="self-start text-[11px] font-semibold text-teal-400 bg-teal-400/10 border border-teal-400/20 px-2.5 py-1 rounded-md">
                            Tax Ready
                        </span>
                    </div>

                    {/* Feature 6 */}
                    <div className="p-7 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-indigo-400/40 transition duration-200 flex flex-col group">
                        <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-400/30 flex items-center justify-center text-2xl mb-5 group-hover:scale-105 transition">
                            🔒
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Bank-Grade Security</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1">
                            Your financial records are encrypted with 256-bit AES standards. We never sell your data, and session security is fortified with JWT and bcrypt hashing.
                        </p>
                        <span className="self-start text-[11px] font-semibold text-teal-400 bg-teal-400/10 border border-teal-400/20 px-2.5 py-1 rounded-md">
                            Privacy First
                        </span>
                    </div>
                </div>
            </section>

            {/* 4. WORKFLOW SECTION */}
            <section id="how-it-works" className="relative z-10 py-20 bg-white/[0.015]">
                <div className="text-center max-w-2xl mx-auto px-6 mb-14">
                    <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-2 block">
                        Simple Workflow
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
                        Get Started in 3 Easy Steps
                    </h2>
                    <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                        From sign-up to complete financial clarity in less than three minutes.
                    </p>
                </div>

                <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10">
                        <div className="text-4xl font-extrabold text-indigo-400/35 mb-4">01</div>
                        <h3 className="text-lg font-bold text-white mb-2">Create Account & Set Goals</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Sign up in seconds and define your monthly spending targets for categories like food, rent, entertainment, and transit.
                        </p>
                    </div>

                    <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10">
                        <div className="text-4xl font-extrabold text-indigo-400/35 mb-4">02</div>
                        <h3 className="text-lg font-bold text-white mb-2">Log Expenses Effortlessly</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Record transactions as they happen with automated category suggestions and instant balance calculations on any device.
                        </p>
                    </div>

                    <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10">
                        <div className="text-4xl font-extrabold text-indigo-400/35 mb-4">03</div>
                        <h3 className="text-lg font-bold text-white mb-2">Gain Insights & Save More</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Let our AI analyze spending velocity, eliminate recurring leaks, and guide you towards consistent long-term wealth building.
                        </p>
                    </div>
                </div>
            </section>

            {/* 5. COMPARISON SECTION */}
            <section className="relative z-10 py-20">
                <div className="text-center max-w-2xl mx-auto px-6 mb-14">
                    <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-2 block">
                        Why Upgrade
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
                        Traditional Spreadsheets vs. ExpenseTracker AI
                    </h2>
                    <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                        See why thousands of users abandoned spreadsheets in favor of our intelligent tracking platform.
                    </p>
                </div>

                <div className="max-w-[1100px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-2xl bg-red-500/[0.04] border border-red-500/20">
                        <div className="text-lg font-bold text-red-400 mb-5">Traditional Spreadsheets ❌</div>
                        <ul className="flex flex-col gap-3.5 text-sm text-slate-300">
                            <li>❌ Manual data entry takes 20+ minutes every week</li>
                            <li>❌ Easy to introduce formula errors and broken sums</li>
                            <li>❌ Zero alerts when you are about to overspend</li>
                            <li>❌ Clunky and frustrating to open or edit on smartphones</li>
                            <li>❌ No predictive AI recommendations or cash-flow forecasts</li>
                        </ul>
                    </div>

                    <div className="p-8 rounded-2xl bg-indigo-600/[0.08] border-2 border-indigo-500/40 shadow-xl shadow-indigo-600/15">
                        <div className="text-lg font-bold text-indigo-300 mb-5">Daily Expense Tracker AI ✨</div>
                        <ul className="flex flex-col gap-3.5 text-sm text-slate-200">
                            <li>✅ Log transactions in 5 seconds with automatic categorization</li>
                            <li>✅ Instant accurate calculations with zero formula maintenance</li>
                            <li>✅ Real-time notifications before you exceed monthly budget limits</li>
                            <li>✅ Sleek, lightning-fast responsive interface on phone and desktop</li>
                            <li>✅ Actionable AI tips that help the average user save $300+/month</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* 6. TESTIMONIALS */}
            <section className="relative z-10 py-20 bg-white/[0.015]">
                <div className="text-center max-w-2xl mx-auto px-6 mb-14">
                    <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-2 block">
                        User Stories
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
                        Loved by People Who Value Clarity
                    </h2>
                    <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                        Join thousands who have taken complete command of their personal and business finances.
                    </p>
                </div>

                <div className="max-w-[1300px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
                        <div>
                            <div className="text-amber-400 text-sm mb-4">★★★★★</div>
                            <p className="text-slate-300 text-sm leading-relaxed mb-6 italic">
                                &ldquo;I used to lose track of SaaS subscriptions and dining out. The AI categorization alone spotted $180 in recurring fees I forgot about. Saved me more than $400 in my first month.&rdquo;
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg">👨‍💻</div>
                            <div>
                                <strong className="block text-sm text-white">Alex Rivera</strong>
                                <span className="block text-xs text-slate-400">Freelance Software Engineer</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
                        <div>
                            <div className="text-amber-400 text-sm mb-4">★★★★★</div>
                            <p className="text-slate-300 text-sm leading-relaxed mb-6 italic">
                                &ldquo;The visual analytics are absolutely gorgeous. Seeing exactly how much safe spending money I have remaining each day has transformed my relationship with personal budgeting.&rdquo;
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg">👩‍💼</div>
                            <div>
                                <strong className="block text-sm text-white">Sarah Jenkins</strong>
                                <span className="block text-xs text-slate-400">Product Marketing Lead</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
                        <div>
                            <div className="text-amber-400 text-sm mb-4">★★★★★</div>
                            <p className="text-slate-300 text-sm leading-relaxed mb-6 italic">
                                &ldquo;Exporting audit-ready CSVs for tax season took literally two clicks. My accountant was thrilled with how clean the category breakdowns were formatted. Highly recommended!&rdquo;
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg">👨‍🎨</div>
                            <div>
                                <strong className="block text-sm text-white">David Chen</strong>
                                <span className="block text-xs text-slate-400">Agency Founder</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. FAQ */}
            <section id="faq" className="relative z-10 py-20">
                <div className="text-center max-w-2xl mx-auto px-6 mb-14">
                    <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-2 block">
                        Got Questions?
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
                        Frequently Asked Questions
                    </h2>
                </div>

                <div className="max-w-[1000px] mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
                        <h4 className="font-semibold text-white mb-2 text-base">Is ExpenseTracker completely free to use?</h4>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Yes! You can get started completely free without entering credit card information. Our core expense tracking, category budgets, and analytics features are accessible right away.
                        </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
                        <h4 className="font-semibold text-white mb-2 text-base">How does the AI smart categorization work?</h4>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Our intelligent natural language processing model evaluates transaction titles, merchants, and amounts to recommend the most accurate category, saving you manual sorting time.
                        </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
                        <h4 className="font-semibold text-white mb-2 text-base">Can I export my data at any time?</h4>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Absolutely. You retain 100% ownership of your data. You can export complete CSV records filtered by date range or category whenever you need them.
                        </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
                        <h4 className="font-semibold text-white mb-2 text-base">How is my personal financial data protected?</h4>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            We employ strict security practices including salted password hashing (bcrypt), encrypted database connections, and session-based authentication to keep your records private and secure.
                        </p>
                    </div>
                </div>
            </section>

            {/* 8. CTA BANNER */}
            <section className="relative z-10 px-6 py-12 mb-16">
                <div className="max-w-[1100px] mx-auto p-8 sm:p-14 bg-gradient-to-br from-indigo-700 via-indigo-800 to-indigo-950 rounded-3xl text-center border border-indigo-400/20 shadow-2xl shadow-indigo-600/30">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
                        Ready to Take Total Control of Your Finances?
                    </h2>
                    <p className="text-indigo-100/90 text-base sm:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
                        Join thousands who are eliminating overspending and building wealth with confidence. Setup takes less than 60 seconds.
                    </p>
                    <div className="flex items-center justify-center gap-4 flex-wrap mb-6">
                        <Link href="/signup">
                            <Button size="lg" className="bg-white hover:bg-slate-100 text-indigo-950 font-bold px-8 shadow-lg inline-flex items-center gap-2">
                                Create Free Account
                                <span>→</span>
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 px-8">
                                Sign In to Dashboard
                            </Button>
                        </Link>
                    </div>
                    <div className="flex items-center justify-center gap-6 text-xs text-indigo-200/80 flex-wrap">
                        <span>✓ No credit card required</span>
                        <span>✓ Instant access</span>
                        <span>✓ Secure & private</span>
                    </div>
                </div>
            </section>

            {/* 9. REUSABLE DYNAMIC FOOTER */}
            <Footer />
        </div>
    );
}

