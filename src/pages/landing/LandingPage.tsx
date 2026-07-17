import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Check, Star, ArrowRight, Play, ChevronDown, ShieldCheck, Cpu, Clock, Layers, Award } from "lucide-react";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import "../../styles/landing.css";

// Assets imports
import heroMockupImg from "../../assets/landing/hero_dashboard_mockup.png";
import instructorDashboardImg from "../../assets/landing/feature_instructor_dashboard.png";
import autoGradingImg from "../../assets/landing/feature_auto_grading.png";
import examInterfaceImg from "../../assets/landing/feature_exam_interface.png";
import analyticsImg from "../../assets/landing/feature_analytics.png";
import securityImg from "../../assets/landing/feature_security.png";
import multilangImg from "../../assets/landing/feature_multilang.png";
import howItWorksBgImg from "../../assets/landing/how_it_works_bg.png";
import ctaBannerBgImg from "../../assets/landing/cta_banner_bg.png";
import avatarSarahImg from "../../assets/landing/avatar_sarah.png";
import avatarJamesImg from "../../assets/landing/avatar_james.png";
import avatarFatimaImg from "../../assets/landing/avatar_fatima.png";

const LandingPage: React.FC = () => {
    const { t } = useTranslation();
    const [faqOpen, setFaqOpen] = useState<{ [key: number]: boolean }>({});

    const toggleFaq = (index: number) => {
        setFaqOpen(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const tickerChips = [
        t("landing.features_ticker.auto_grading", "⚡ Auto-Grading"),
        t("landing.features_ticker.analytics", "📊 Real-time Analytics"),
        t("landing.features_ticker.tamper_resistant", "🔒 Tamper-Resistant"),
        t("landing.features_ticker.multilang", "🌍 Multi-Language"),
        t("landing.features_ticker.mobile_ready", "📱 Mobile-Ready"),
        t("landing.features_ticker.timed_exams", "⏱ Timed Exams"),
        t("landing.features_ticker.question_banks", "📂 Question Banks"),
        t("landing.features_ticker.course_mgmt", "🎓 Course Management"),
        t("landing.features_ticker.jwt_auth", "🔐 JWT Auth")
    ];

    const faqQuestions = [
        {
            q: t("landing.faq.q_1", "Is ExamSys free to use?"),
            a: t("landing.faq.a_1", "Yes! Our Free plan includes everything you need to get started — 3 courses, 50 students, and basic analytics at no cost.")
        },
        {
            q: t("landing.faq.q_2", "How does auto-grading work?"),
            a: t("landing.faq.a_2", "When a student submits their exam (or time runs out), the platform instantly compares each selected answer to the correct choice and calculates the final score automatically.")
        },
        {
            q: t("landing.faq.q_3", "Can I customize passing score thresholds?"),
            a: t("landing.faq.a_3", "Absolutely. When creating or editing an exam, you can set the exact passing score percentage for each exam individually.")
        },
        {
            q: t("landing.faq.q_4", "Does ExamSys support Arabic and RTL languages?"),
            a: t("landing.faq.a_4", "Yes. The platform fully supports Arabic with automatic RTL layout switching. Spanish and French are also supported.")
        },
        {
            q: t("landing.faq.q_5", "How is exam integrity maintained?"),
            a: t("landing.faq.a_5", "Once an exam is published and has submissions, questions are automatically locked — preventing edits that could compromise grading fairness.")
        },
        {
            q: t("landing.faq.q_6", "Can students see their results immediately?"),
            a: t("landing.faq.a_6", "Yes. For auto-graded exams, results are available the moment the submission is processed — typically within seconds.")
        },
        {
            q: t("landing.faq.q_7", "Is there a mobile-friendly version?"),
            a: t("landing.faq.a_7", "Yes. The entire platform is responsive and tested on mobile. Students can take exams from any device.")
        },
        {
            q: t("landing.faq.q_8", "How many students can enroll in one course?"),
            a: t("landing.faq.a_8", "On the Free plan, up to 50 per course. Pro plan supports 500, and Enterprise is unlimited.")
        },
        {
            q: t("landing.faq.q_9", "Can I set a time limit on exams?"),
            a: t("landing.faq.a_9", "Yes. You can configure time limits per exam. The student sees a live countdown, and the exam auto-submits when time expires.")
        },
        {
            q: t("landing.faq.q_10", "How do I get started?"),
            a: t("landing.faq.a_10", "Click 'Get Started Free' at the top of this page, register an account, and you can create your first course in under 5 minutes.")
        }
    ];

    return (
        <div className="landing-body min-vh-100 d-flex flex-column">
            <Navbar />

            {/* HERO SECTION */}
            <header className="landing-hero-bg pt-5 mt-5">
                <div className="container px-3 px-md-4 px-lg-5 pt-4 pb-5">
                    <div className="row align-items-center gy-5">
                        <div className="col-lg-6 animate-fade-in-up">
                            <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill mb-3 fw-semibold">
                                {t("landing.hero.badge", "✦ Built for Modern Education")}
                            </span>
                            <h1 className="display-4 fw-extrabold text-dark mb-3 lh-sm">
                                {t("landing.hero.headline", "The Examination Platform Built for Academic Rigor")}
                            </h1>
                            <p className="lead text-secondary mb-4 fs-5">
                                {t("landing.hero.subheadline", "From question banks to instant results — ExamSys gives instructors complete control and students a calm, focused testing experience.")}
                            </p>
                            <div className="d-flex flex-wrap gap-3 mb-5">
                                <Link to="/register" className="btn btn-primary btn-lg px-4 py-2.5 shadow-sm d-flex align-items-center gap-2">
                                    {t("landing.hero.cta_primary", "Get Started Free")} <ArrowRight size={18} />
                                </Link>
                                <a href="#features" className="btn btn-outline-secondary btn-lg px-4 py-2.5 d-flex align-items-center gap-2">
                                    <Play size={16} fill="currentColor" /> {t("landing.hero.cta_secondary", "Watch Demo")}
                                </a>
                            </div>
                            <div className="d-flex align-items-center gap-4 flex-wrap border-top pt-4">
                                <div className="d-flex align-items-center gap-1.5 text-secondary fs-6">
                                    <Check size={16} className="text-success" />
                                    <span>{t("landing.hero.trust_institutions", "500+ Institutions")}</span>
                                </div>
                                <div className="d-flex align-items-center gap-1.5 text-secondary fs-6">
                                    <Check size={16} className="text-success" />
                                    <span>{t("landing.hero.trust_exams", "50,000+ Exams Created")}</span>
                                </div>
                                <div className="d-flex align-items-center gap-1.5 text-secondary fs-6">
                                    <Check size={16} className="text-success" />
                                    <span>{t("landing.hero.trust_rating", "4.9★ Rated")}</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 text-center">
                            <div className="landing-floating-visual position-relative mx-auto" style={{ maxWidth: "550px" }}>
                                <img
                                    src={heroMockupImg}
                                    alt="ExamSys Dashboard Mockup"
                                    className="img-fluid rounded-3 shadow-lg border"
                                    style={{ background: "var(--surface-card)" }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* MARQUEE TICKER */}
            <section className="landing-ticker-container">
                <div className="landing-ticker-strip">
                    {[...tickerChips, ...tickerChips].map((chip, idx) => (
                        <div key={idx} className="landing-ticker-chip">
                            {chip}
                        </div>
                    ))}
                </div>
            </section>

            {/* SERVICES / FEATURES SECTION */}
            <section id="features" className="landing-section-py">
                <div className="container px-3 px-md-4 px-lg-5">
                    <div className="text-center mb-5 max-w-2xl mx-auto">
                        <h2 className="display-5 fw-bold text-dark mb-3">
                            {t("landing.services.section_title", "Features Built for Academic Rigor")}
                        </h2>
                        <p className="lead text-secondary fs-5">
                            {t("landing.services.section_subtitle", "Everything you need to deliver fair, high-stakes assessments or simple classroom quizzes.")}
                        </p>
                    </div>

                    <div className="row g-4">
                        {/* Card 1 */}
                        <div className="col-md-6 col-lg-4">
                            <div className="landing-service-card">
                                <img src={instructorDashboardImg} alt="Instructor Command Center" className="img-fluid rounded mb-4 border" />
                                <div className="landing-icon-badge">
                                    <Cpu size={24} />
                                </div>
                                <h3 className="h4 text-dark mb-2">{t("landing.services.card_1.title", "Instructor Command Center")}</h3>
                                <p className="text-secondary fs-6 mb-0">
                                    {t("landing.services.card_1.desc", "Build and manage courses, exams, and question banks — all from one clean dashboard. Set passing scores, time limits, and publish with one click.")}
                                </p>
                            </div>
                        </div>
                        {/* Card 2 */}
                        <div className="col-md-6 col-lg-4">
                            <div className="landing-service-card">
                                <img src={autoGradingImg} alt="Intelligent Auto-Grading" className="img-fluid rounded mb-4 border" />
                                <div className="landing-icon-badge">
                                    <ShieldCheck size={24} />
                                </div>
                                <h3 className="h4 text-dark mb-2">{t("landing.services.card_2.title", "Intelligent Auto-Grading")}</h3>
                                <p className="text-secondary fs-6 mb-0">
                                    {t("landing.services.card_2.desc", "MCQ submissions graded instantly. Results available the moment time runs out — no waiting, no manual review.")}
                                </p>
                            </div>
                        </div>
                        {/* Card 3 */}
                        <div className="col-md-6 col-lg-4">
                            <div className="landing-service-card">
                                <img src={examInterfaceImg} alt="Student-First Exam Experience" className="img-fluid rounded mb-4 border" />
                                <div className="landing-icon-badge">
                                    <Clock size={24} />
                                </div>
                                <h3 className="h4 text-dark mb-2">{t("landing.services.card_3.title", "Student-First Exam Experience")}</h3>
                                <p className="text-secondary fs-6 mb-0">
                                    {t("landing.services.card_3.desc", "Clean, distraction-free exam interface with question navigator, auto-save, and live countdown. Students stay focused — not frustrated.")}
                                </p>
                            </div>
                        </div>
                        {/* Card 4 */}
                        <div className="col-md-6 col-lg-4">
                            <div className="landing-service-card">
                                <img src={analyticsImg} alt="Deep Analytics & Reports" className="img-fluid rounded mb-4 border" />
                                <div className="landing-icon-badge">
                                    <Layers size={24} />
                                </div>
                                <h3 className="h4 text-dark mb-2">{t("landing.services.card_4.title", "Deep Analytics & Reports")}</h3>
                                <p className="text-secondary fs-6 mb-0">
                                    {t("landing.services.card_4.desc", "Per-exam performance breakdowns, pass/fail distribution, average score trends, and student progress over time.")}
                                </p>
                            </div>
                        </div>
                        {/* Card 5 */}
                        <div className="col-md-6 col-lg-4">
                            <div className="landing-service-card">
                                <img src={securityImg} alt="Secure & Tamper-Resistant" className="img-fluid rounded mb-4 border" />
                                <div className="landing-icon-badge">
                                    <Award size={24} />
                                </div>
                                <h3 className="h4 text-dark mb-2">{t("landing.services.card_5.title", "Secure & Tamper-Resistant")}</h3>
                                <p className="text-secondary fs-6 mb-0">
                                    {t("landing.services.card_5.desc", "JWT-based auth, role-separated access, and question locking on published exams — academic integrity is always enforced.")}
                                </p>
                            </div>
                        </div>
                        {/* Card 6 */}
                        <div className="col-md-6 col-lg-4">
                            <div className="landing-service-card">
                                <img src={multilangImg} alt="Multi-Language & RTL Ready" className="img-fluid rounded mb-4 border" />
                                <div className="landing-icon-badge">
                                    <Award size={24} />
                                </div>
                                <h3 className="h4 text-dark mb-2">{t("landing.services.card_6.title", "Multi-Language & RTL Ready")}</h3>
                                <p className="text-secondary fs-6 mb-0">
                                    {t("landing.services.card_6.desc", "Runs in English, Arabic, Spanish, and French with automatic RTL layout switching — built to serve global campuses.")}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS SECTION */}
            <section id="how-it-works" className="landing-section-py landing-section-alt position-relative" style={{ overflow: "hidden" }}>
                <div className="position-absolute top-0 start-0 w-100 h-100 opacity-10" style={{ backgroundImage: `url(${howItWorksBgImg})`, backgroundSize: "cover" }} />
                <div className="container px-3 px-md-4 px-lg-5 position-relative">
                    <div className="text-center mb-5 max-w-2xl mx-auto">
                        <h2 className="display-5 fw-bold text-dark mb-3">
                            {t("landing.how_it_works.section_title", "Simple, Rigorous Workflow")}
                        </h2>
                        <p className="lead text-secondary fs-5">
                            {t("landing.how_it_works.section_subtitle", "Setting up exams takes minutes. Managing them takes seconds.")}
                        </p>
                    </div>

                    <div className="row gy-5 gx-4 text-center">
                        <div className="col-md-4">
                            <div className="px-3">
                                <div className="display-1 fw-extrabold text-success mb-3 opacity-25">01</div>
                                <h3 className="h4 text-dark mb-2">{t("landing.how_it_works.step_1.title", "Create Your Course")}</h3>
                                <p className="text-secondary fs-6">
                                    {t("landing.how_it_works.step_1.desc", "Instructors sign up, create a course, set enrollment limits, and invite students — or let them enroll freely.")}
                                </p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="px-3">
                                <div className="display-1 fw-extrabold text-success mb-3 opacity-25">02</div>
                                <h3 className="h4 text-dark mb-2">{t("landing.how_it_works.step_2.title", "Build & Publish Exams")}</h3>
                                <p className="text-secondary fs-6">
                                    {t("landing.how_it_works.step_2.desc", "Add questions, set time limits and passing scores, then publish when ready. The platform handles everything else.")}
                                </p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="px-3">
                                <div className="display-1 fw-extrabold text-success mb-3 opacity-25">03</div>
                                <h3 className="h4 text-dark mb-2">{t("landing.how_it_works.step_3.title", "Review Results Instantly")}</h3>
                                <p className="text-secondary fs-6">
                                    {t("landing.how_it_works.step_3.desc", "The moment an exam is submitted, scores are calculated. Students see their results. Instructors see the full picture.")}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* STATS SECTION */}
            <section className="landing-stats-bg py-5">
                <div className="container px-3 px-md-4 px-lg-5 text-center">
                    <div className="row gy-4">
                        <div className="col-6 col-md-3">
                            <div className="display-5 fw-extrabold text-success mb-1">500+</div>
                            <div className="text-secondary fw-semibold fs-6">{t("landing.stats.institutions", "Educational Institutions")}</div>
                        </div>
                        <div className="col-6 col-md-3">
                            <div className="display-5 fw-extrabold text-success mb-1">50,000+</div>
                            <div className="text-secondary fw-semibold fs-6">{t("landing.stats.exams", "Exams Created")}</div>
                        </div>
                        <div className="col-6 col-md-3">
                            <div className="display-5 fw-extrabold text-success mb-1">1.2M+</div>
                            <div className="text-secondary fw-semibold fs-6">{t("landing.stats.questions", "Questions Answered")}</div>
                        </div>
                        <div className="col-6 col-md-3">
                            <div className="display-5 fw-extrabold text-success mb-1">4.9 / 5</div>
                            <div className="text-secondary fw-semibold fs-6">{t("landing.stats.rating", "Average Platform Rating")}</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* PRICING SECTION */}
            <section id="pricing" className="landing-section-py">
                <div className="container px-3 px-md-4 px-lg-5">
                    <div className="text-center mb-5 max-w-2xl mx-auto">
                        <h2 className="display-5 fw-bold text-dark mb-3">
                            {t("landing.pricing.section_title", "Simple, Transparent Pricing")}
                        </h2>
                        <p className="lead text-secondary fs-5">
                            {t("landing.pricing.section_subtitle", "Start free, upgrade as you grow. No hidden fees.")}
                        </p>
                    </div>

                    <div className="row g-4 align-items-stretch justify-content-center">
                        <div className="col-md-6 col-lg-4">
                            <div className="landing-price-card">
                                <h3 className="h5 text-secondary mb-1">{t("landing.pricing.tier_free.name", "Free")}</h3>
                                <div className="d-flex align-items-baseline mb-4">
                                    <span className="display-4 fw-extrabold text-dark">$0</span>
                                    <span className="text-secondary ms-1">/mo</span>
                                </div>
                                <ul className="list-unstyled mb-5 d-flex flex-column gap-3 flex-grow-1">
                                    <li className="d-flex align-items-center gap-2">
                                        <Check size={18} className="text-success flex-shrink-0" />
                                        <span className="text-secondary fs-6">{t("landing.pricing.tier_free.f1", "Up to 3 courses")}</span>
                                    </li>
                                    <li className="d-flex align-items-center gap-2">
                                        <Check size={18} className="text-success flex-shrink-0" />
                                        <span className="text-secondary fs-6">{t("landing.pricing.tier_free.f2", "50 students per course")}</span>
                                    </li>
                                    <li className="d-flex align-items-center gap-2">
                                        <Check size={18} className="text-success flex-shrink-0" />
                                        <span className="text-secondary fs-6">{t("landing.pricing.tier_free.f3", "Basic analytics")}</span>
                                    </li>
                                </ul>
                                <Link to="/register" className="btn btn-outline-primary w-100 py-2.5">
                                    {t("landing.pricing.tier_free.cta", "Get Started Free")}
                                </Link>
                            </div>
                        </div>

                        <div className="col-md-6 col-lg-4">
                            <div className="landing-price-card popular">
                                <span className="position-absolute top-0 start-50 translate-middle badge bg-warning text-dark border px-3 py-1.5 rounded-pill fw-bold text-uppercase" style={{ fontSize: "0.75rem", letterSpacing: "0.05em" }}>
                                    {t("landing.pricing.tier_pro.popular", "Most Popular")}
                                </span>
                                <h3 className="h5 text-secondary mb-1">{t("landing.pricing.tier_pro.name", "Pro")}</h3>
                                <div className="d-flex align-items-baseline mb-4">
                                    <span className="display-4 fw-extrabold text-dark">$29</span>
                                    <span className="text-secondary ms-1">/mo</span>
                                </div>
                                <ul className="list-unstyled mb-5 d-flex flex-column gap-3 flex-grow-1">
                                    <li className="d-flex align-items-center gap-2">
                                        <Check size={18} className="text-success flex-shrink-0" />
                                        <span className="text-secondary fs-6 fw-semibold">{t("landing.pricing.tier_pro.f1", "Unlimited courses")}</span>
                                    </li>
                                    <li className="d-flex align-items-center gap-2">
                                        <Check size={18} className="text-success flex-shrink-0" />
                                        <span className="text-secondary fs-6">{t("landing.pricing.tier_pro.f2", "500 students per course")}</span>
                                    </li>
                                    <li className="d-flex align-items-center gap-2">
                                        <Check size={18} className="text-success flex-shrink-0" />
                                        <span className="text-secondary fs-6">{t("landing.pricing.tier_pro.f3", "Full analytics & reports")}</span>
                                    </li>
                                    <li className="d-flex align-items-center gap-2">
                                        <Check size={18} className="text-success flex-shrink-0" />
                                        <span className="text-secondary fs-6">{t("landing.pricing.tier_pro.f4", "Priority support")}</span>
                                    </li>
                                </ul>
                                <Link to="/register" className="btn btn-primary w-100 py-2.5 shadow-sm">
                                    {t("landing.pricing.tier_pro.cta", "Upgrade to Pro")}
                                </Link>
                            </div>
                        </div>

                        <div className="col-md-6 col-lg-4">
                            <div className="landing-price-card">
                                <h3 className="h5 text-secondary mb-1">{t("landing.pricing.tier_enterprise.name", "Enterprise")}</h3>
                                <div className="d-flex align-items-baseline mb-4">
                                    <span className="display-5 fw-extrabold text-dark">{t("landing.pricing.tier_enterprise.price", "Custom")}</span>
                                </div>
                                <ul className="list-unstyled mb-5 d-flex flex-column gap-3 flex-grow-1">
                                    <li className="d-flex align-items-center gap-2">
                                        <Check size={18} className="text-success flex-shrink-0" />
                                        <span className="text-secondary fs-6">{t("landing.pricing.tier_enterprise.f1", "Unlimited everything")}</span>
                                    </li>
                                    <li className="d-flex align-items-center gap-2">
                                        <Check size={18} className="text-success flex-shrink-0" />
                                        <span className="text-secondary fs-6">{t("landing.pricing.tier_enterprise.f2", "Single Sign-On (SSO)")}</span>
                                    </li>
                                    <li className="d-flex align-items-center gap-2">
                                        <Check size={18} className="text-success flex-shrink-0" />
                                        <span className="text-secondary fs-6">{t("landing.pricing.tier_enterprise.f3", "SLA & Dedicated support")}</span>
                                    </li>
                                </ul>
                                <Link to="/contact" className="btn btn-outline-secondary w-100 py-2.5">
                                    {t("landing.pricing.tier_enterprise.cta", "Contact Sales")}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS SECTION */}
            <section id="testimonials" className="landing-section-py landing-section-alt">
                <div className="container px-3 px-md-4 px-lg-5">
                    <div className="text-center mb-5 max-w-2xl mx-auto">
                        <h2 className="display-5 fw-bold text-dark mb-3">
                            {t("landing.testimonials.section_title", "Trusted by Educators Worldwide")}
                        </h2>
                    </div>

                    <div className="row g-4">
                        <div className="col-lg-4">
                            <div className="landing-testimonial-card shadow-sm">
                                <p className="text-secondary fs-6 italic mb-4">
                                    "{t("landing.testimonials.card_1.quote", "ExamSys completely replaced our paper-based system. Grading used to take 3 days — now it is instant.")}"
                                </p>
                                <div className="d-flex align-items-center gap-3 pt-3 border-top">
                                    <img src={avatarSarahImg} alt="Dr. Sarah M." className="landing-avatar" />
                                    <div>
                                        <div className="fw-bold text-dark fs-6">{t("landing.testimonials.card_1.name", "Dr. Sarah M.")}</div>
                                        <div className="text-secondary text-sm" style={{ fontSize: "0.8rem" }}>{t("landing.testimonials.card_1.role", "University Professor")}</div>
                                    </div>
                                    <div className="ms-auto text-warning d-flex">
                                        {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="landing-testimonial-card shadow-sm">
                                <p className="text-secondary fs-6 italic mb-4">
                                    "{t("landing.testimonials.card_2.quote", "My students actually prefer the online format. The interface is clean and the timer does not cause panic.")}"
                                </p>
                                <div className="d-flex align-items-center gap-3 pt-3 border-top">
                                    <img src={avatarJamesImg} alt="James L." className="landing-avatar" />
                                    <div>
                                        <div className="fw-bold text-dark fs-6">{t("landing.testimonials.card_2.name", "James L.")}</div>
                                        <div className="text-secondary text-sm" style={{ fontSize: "0.8rem" }}>{t("landing.testimonials.card_2.role", "Online Instructor")}</div>
                                    </div>
                                    <div className="ms-auto text-warning d-flex">
                                        {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="landing-testimonial-card shadow-sm">
                                <p className="text-secondary fs-6 italic mb-4">
                                    "{t("landing.testimonials.card_3.quote", "The Arabic RTL support is flawless. We run a bilingual institution and both sides work perfectly.")}"
                                </p>
                                <div className="d-flex align-items-center gap-3 pt-3 border-top">
                                    <img src={avatarFatimaImg} alt="Fatima A." className="landing-avatar" />
                                    <div>
                                        <div className="fw-bold text-dark fs-6">{t("landing.testimonials.card_3.name", "Fatima A.")}</div>
                                        <div className="text-secondary text-sm" style={{ fontSize: "0.8rem" }}>{t("landing.testimonials.card_3.role", "Academic Coordinator")}</div>
                                    </div>
                                    <div className="ms-auto text-warning d-flex">
                                        {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ SECTION */}
            <section id="faq" className="landing-section-py">
                <div className="container px-3 px-md-4 px-lg-5">
                    <div className="text-center mb-5 max-w-2xl mx-auto">
                        <h2 className="display-5 fw-bold text-dark mb-3">
                            {t("landing.faq.section_title", "Frequently Asked Questions")}
                        </h2>
                    </div>

                    <div className="max-w-3xl mx-auto">
                        {faqQuestions.map((item, idx) => (
                            <div key={idx} className="landing-faq-item">
                                <button
                                    type="button"
                                    onClick={() => toggleFaq(idx)}
                                    className="landing-faq-trigger"
                                    aria-expanded={faqOpen[idx] ? "true" : "false"}
                                >
                                    <span>{item.q}</span>
                                    <ChevronDown
                                        size={18}
                                        className="text-secondary"
                                        style={{
                                            transform: faqOpen[idx] ? "rotate(180deg)" : "rotate(0deg)",
                                            transition: "transform 0.2s ease"
                                        }}
                                    />
                                </button>
                                <div className={`landing-faq-answer ${faqOpen[idx] ? "open" : ""}`} style={{ display: faqOpen[idx] ? "block" : "none" }}>
                                    <div className="py-2 text-secondary">{item.a}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FINAL CTA BANNER */}
            <section className="landing-section-py">
                <div className="container px-3 px-md-4 px-lg-5">
                    <div className="landing-cta-banner p-4 p-md-5 text-center position-relative" style={{ backgroundImage: `url(${ctaBannerBgImg})`, backgroundSize: "cover" }}>
                        <div className="position-relative z-1 max-w-2xl mx-auto py-3">
                            <h2 className="display-5 fw-bold mb-3">
                                {t("landing.cta_banner.headline", "Ready to transform your assessment workflow?")}
                            </h2>
                            <p className="lead mb-4 opacity-90 fs-5">
                                {t("landing.cta_banner.subtext", "Join 500+ institutions already running on ExamSys. Setup takes under 5 minutes.")}
                            </p>
                            <div className="d-flex justify-content-center gap-3 flex-wrap">
                                <Link to="/register" className="btn btn-light btn-lg px-4 py-2.5 text-success fw-bold">
                                    {t("landing.cta_banner.btn_primary", "Create Free Account")}
                                </Link>
                                <Link to="/contact" className="btn btn-outline-light btn-lg px-4 py-2.5">
                                    {t("landing.cta_banner.btn_secondary", "Schedule a Demo")}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <Footer />
        </div>
    );
};

export default LandingPage;
