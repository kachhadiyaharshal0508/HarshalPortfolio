const { useEffect, useRef, useState } = React;

const colors = {
    navy: '#0a1120',
    navySoft: '#111a2e',
    ink: '#1e293b',
    teal: '#2dd4bf',
    tealDeep: '#0d9488',
    violet: '#818cf8',
    bg: '#fbfbfa',
    card: '#ffffff',
    muted: '#64748b',
    border: '#e9ecf1'
};

/* ---------- Shared font loader ---------- */
function useGoogleFont() {
    useEffect(() => {
        if (document.getElementById('gf-inter')) return;
        const link = document.createElement('link');
        link.id = 'gf-inter';
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Sora:wght@600;700;800&display=swap';
        document.head.appendChild(link);
    }, []);
}

/* ---------- Global styles (shared system) ---------- */
function GlobalStyles() {
    return (
        <style>{`
            @keyframes floatA { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(60px,50px) scale(1.1); } }
            @keyframes floatB { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-60px,-40px) scale(1.12); } }
            @keyframes floatC { 0%,100% { transform: translate(0,0); } 50% { transform: translate(40px,-60px); } }
            @keyframes hueShift { 0%,100% { filter: blur(10px) hue-rotate(0deg); } 50% { filter: blur(10px) hue-rotate(35deg); } }
            @keyframes fadeUp { from { opacity:0; transform: translateY(24px);} to {opacity:1; transform: translateY(0);} }
            @keyframes popIn { from { opacity:0; transform: scale(0.9);} to {opacity:1; transform: scale(1);} }
            @keyframes orbit { from { transform: rotate(0deg) translateX(var(--r)) rotate(0deg); } to { transform: rotate(360deg) translateX(var(--r)) rotate(-360deg); } }
            @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }

            .fade-up { animation: fadeUp 0.8s cubic-bezier(.16,1,.3,1) both; }
            .pop-in { animation: popIn 0.7s cubic-bezier(.16,1,.3,1) both; }

            .btn-primary { transition: transform 0.25s ease, box-shadow 0.25s ease, filter 0.25s ease; }
            .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 14px 28px rgba(13,148,136,0.35); filter: brightness(1.05); }

            .btn-outline { transition: all 0.25s ease; }
            .btn-outline:hover { background: ${colors.navy}; color: #fff; border-color: ${colors.navy}; transform: translateY(-3px); }

            .skill-card { transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease; }
            .skill-card:hover { transform: translateY(-6px); box-shadow: 0 16px 32px rgba(13,148,136,0.14); border-color: ${colors.teal}; }

            .timeline-item { transition: transform 0.25s ease; }
            .timeline-item:hover { transform: translateX(6px); }

            @media (max-width: 760px) {
                .about-hero-title { font-size: 36px !important; }
                .about-hero-grid { flex-direction: column-reverse; }
            }
        `}</style>
    );
}

/* ---------- Ambient animated background (shared system) ---------- */
function ParticleNetwork() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let width, height, particles, bursts, animId;
        const mouse = { x: null, y: null, radius: 170 };
        const palette = ['#2dd4bf', '#5eead4', '#818cf8', '#0d9488', '#a78bfa'];
        const rand = (a, b) => a + Math.random() * (b - a);

        function resize() { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; }

        function makeParticles() {
            const count = Math.min(110, Math.floor((width * height) / 13000));
            particles = Array.from({ length: count }, () => ({
                x: Math.random() * width, y: Math.random() * height,
                vx: rand(-0.35, 0.35), vy: rand(-0.35, 0.35),
                r: rand(1.6, 3.2), color: palette[Math.floor(Math.random() * palette.length)],
                twinkle: Math.random() * Math.PI * 2
            }));
            bursts = [];
        }

        function spawnBurst(x, y) {
            const n = 20;
            for (let i = 0; i < n; i++) {
                const angle = (Math.PI * 2 * i) / n;
                const speed = rand(1.5, 4);
                bursts.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 1, color: palette[Math.floor(Math.random() * palette.length)], r: rand(1.5, 3) });
            }
        }

        function step() {
            ctx.clearRect(0, 0, width, height);
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                if (mouse.x !== null) {
                    const dx = p.x - mouse.x, dy = p.y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                    if (dist < mouse.radius) {
                        const force = (mouse.radius - dist) / mouse.radius;
                        p.x += (dx / dist) * force * 2.2;
                        p.y += (dy / dist) * force * 2.2;
                    }
                }

                for (let j = i + 1; j < particles.length; j++) {
                    const q = particles[j];
                    const dx = p.x - q.x, dy = p.y - q.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 130) {
                        let alpha = 0.14 * (1 - dist / 130);
                        if (mouse.x !== null) {
                            const dm = Math.min(Math.hypot(p.x - mouse.x, p.y - mouse.y), Math.hypot(q.x - mouse.x, q.y - mouse.y));
                            if (dm < mouse.radius) alpha += 0.3 * (1 - dm / mouse.radius);
                        }
                        ctx.strokeStyle = `rgba(45,212,191,${Math.min(alpha, 0.5)})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
                    }
                }
            }

            for (const p of particles) {
                p.twinkle += 0.03;
                const glow = 0.5 + Math.sin(p.twinkle) * 0.22;
                ctx.save();
                ctx.shadowBlur = 10; ctx.shadowColor = p.color; ctx.globalAlpha = glow;
                ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = p.color; ctx.fill();
                ctx.restore();
            }

            for (let i = bursts.length - 1; i >= 0; i--) {
                const b = bursts[i];
                b.x += b.vx; b.y += b.vy; b.vx *= 0.96; b.vy *= 0.96; b.life -= 0.02;
                if (b.life <= 0) { bursts.splice(i, 1); continue; }
                ctx.save();
                ctx.globalAlpha = b.life; ctx.shadowBlur = 12; ctx.shadowColor = b.color;
                ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fillStyle = b.color; ctx.fill();
                ctx.restore();
            }

            animId = requestAnimationFrame(step);
        }

        function onMove(e) { mouse.x = e.clientX; mouse.y = e.clientY; }
        function onLeave() { mouse.x = null; mouse.y = null; }
        function onClick(e) { spawnBurst(e.clientX, e.clientY); }

        resize(); makeParticles(); step();
        const onResize = () => { resize(); makeParticles(); };
        window.addEventListener('resize', onResize);
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseleave', onLeave);
        window.addEventListener('click', onClick);

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', onResize);
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseleave', onLeave);
            window.removeEventListener('click', onClick);
        };
    }, []);

    return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />;
}

function AmbientBackground() {
    return (
        <div>
            <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
                <div style={{ position: 'absolute', width: '600px', height: '600px', borderRadius: '50%', top: '-180px', left: '-140px', background: `radial-gradient(circle, ${colors.violet}45, transparent 70%)`, filter: 'blur(10px)', animation: 'floatA 14s ease-in-out infinite, hueShift 12s ease-in-out infinite' }} />
                <div style={{ position: 'absolute', width: '520px', height: '520px', borderRadius: '50%', top: '10%', right: '-180px', background: `radial-gradient(circle, ${colors.teal}40, transparent 70%)`, filter: 'blur(10px)', animation: 'floatB 17s ease-in-out infinite, hueShift 15s ease-in-out infinite' }} />
                <div style={{ position: 'absolute', width: '420px', height: '420px', borderRadius: '50%', bottom: '-120px', left: '30%', background: `radial-gradient(circle, ${colors.violet}38, transparent 70%)`, filter: 'blur(10px)', animation: 'floatC 15s ease-in-out infinite, hueShift 18s ease-in-out infinite' }} />
            </div>
            <ParticleNetwork />
        </div>
    );
}

function Button({ children, variant = 'solid', href = '#' }) {
    const solid = { background: `linear-gradient(135deg, ${colors.tealDeep}, ${colors.teal})`, color: '#fff', border: '2px solid transparent' };
    const outline = { background: 'transparent', color: colors.navy, border: `2px solid ${colors.navy}` };
    return (
        <a href={href} className={variant === 'solid' ? 'btn-primary' : 'btn-outline'} style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '15px 32px',
            borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '15px',
            ...(variant === 'solid' ? solid : outline)
        }}>
            {children}
        </a>
    );
}

function SectionLabel({ children }) {
    return (
        <div style={{
            color: colors.tealDeep, fontWeight: 700, letterSpacing: '1.5px',
            textTransform: 'uppercase', fontSize: '13px', marginBottom: '10px'
        }}>
            {children}
        </div>
    );
}

function SkillCard({ name, level }) {
    return (
        <div className="skill-card" style={{
            background: colors.card, border: `1px solid ${colors.border}`, borderRadius: '14px',
            padding: '18px 20px', boxShadow: '0 4px 14px rgba(15,23,42,0.05)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontWeight: 700, color: colors.navy, fontSize: '14.5px' }}>{name}</span>
                <span style={{ fontSize: '12px', color: colors.muted, fontWeight: 600 }}>{level}%</span>
            </div>
            <div style={{ height: '6px', borderRadius: '10px', background: colors.border, overflow: 'hidden' }}>
                <div style={{
                    width: `${level}%`, height: '100%', borderRadius: '10px',
                    background: `linear-gradient(90deg, ${colors.tealDeep}, ${colors.teal})`
                }} />
            </div>
        </div>
    );
}

function TimelineItem({ year, title, place, desc, isLast }) {
    return (
        <div className="timeline-item" style={{ display: 'flex', gap: '20px', paddingBottom: isLast ? 0 : '34px', position: 'relative' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div style={{
                    width: '14px', height: '14px', borderRadius: '50%',
                    background: `linear-gradient(135deg, ${colors.tealDeep}, ${colors.teal})`,
                    boxShadow: `0 0 0 4px #ecfdf7`
                }} />
                {!isLast && <div style={{ flex: 1, width: '2px', background: colors.border, marginTop: '4px' }} />}
            </div>
            <div style={{ paddingBottom: '4px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: colors.tealDeep, letterSpacing: '0.04em', marginBottom: '4px' }}>{year}</div>
                <h4 style={{ fontFamily: "'Sora', sans-serif", color: colors.navy, fontSize: '17px', margin: '0 0 4px', fontWeight: 700 }}>{title}</h4>
                <div style={{ fontSize: '13.5px', color: colors.muted, fontWeight: 600, marginBottom: '8px' }}>{place}</div>
                <p style={{ fontSize: '14px', color: colors.muted, lineHeight: 1.6, margin: 0, maxWidth: '460px' }}>{desc}</p>
            </div>
        </div>
    );
}

function Typewriter({ words }) {
    const [text, setText] = useState('');
    const [wordIdx, setWordIdx] = useState(0);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const current = words[wordIdx % words.length];
        const speed = deleting ? 40 : 80;
        const pause = 1400;

        const timer = setTimeout(() => {
            if (!deleting) {
                if (text.length < current.length) {
                    setText(current.slice(0, text.length + 1));
                } else {
                    setTimeout(() => setDeleting(true), pause);
                }
            } else {
                if (text.length > 0) {
                    setText(current.slice(0, text.length - 1));
                } else {
                    setDeleting(false);
                    setWordIdx((i) => i + 1);
                }
            }
        }, speed);

        return () => clearTimeout(timer);
    }, [text, deleting, wordIdx, words]);

    return (
        <span style={{ color: colors.tealDeep, fontWeight: 700 }}>
            {text}
            <span style={{ animation: 'blink 0.9s step-start infinite' }}>|</span>
        </span>
    );
}

function OrbitBadge({ label, radius, duration, delay, size }) {
    return (
        <div style={{
            position: 'absolute', top: '50%', left: '50%',
            width: '0px', height: '0px',
            animation: `orbit ${duration}s linear infinite`,
            animationDelay: `${delay}s`,
            '--r': `${radius}px`
        }}>
            <div style={{
                width: `${size}px`, height: `${size}px`, borderRadius: '50%',
                background: '#fff', border: `2px solid ${colors.teal}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '11px', fontWeight: 800, color: colors.navy,
                boxShadow: '0 6px 16px rgba(13,148,136,0.25)',
                transform: 'translate(-50%, -50%)'
            }}>
                {label}
            </div>
        </div>
    );
}

function About() {
    useGoogleFont();

    const skills = [
        { name: 'C# / .NET', level: 75 },
        { name: 'ASP.NET Web Forms', level: 80 },
        { name: 'React.js', level: 85 },
        { name: 'SQL Server', level: 78 },
        { name: 'JavaScript', level: 82 },
        { name: 'HTML5 & CSS3', level: 88 }
    ];

    const experience = [    
        { year: '2025 — 2026', title: 'Junior Software Developer', place: 'Infinity Transoft Solution Pvt. Ltd., Rajkot', desc: '1+ year of experience working on a parcel booking module and site — built a dynamic booking module usable on a single page across multiple companies, each with its own field configuration.' },
        { year: '2023 — 2025', title: 'Junior Developer Intern', place: 'Infinity Transoft Solution Pvt. Ltd., Rajkot', desc: 'Worked on internal tools and client websites, contributing to both backend logic and UI.' }
    ];

    const education = [
        { year: '2022 — 2025', title: 'Bachelor Of Computer Application (Industry Integrated Program)', place: 'Atmiya University, Rajkot', desc: 'Focused on web development, databases, and software engineering fundamentals.' },
        { year: '2020 — 2022', title: 'Higher Secondary (Commerce)', place: 'Krishna Royal School, Dhoraji', desc: 'Studied accounts, economics, and business studies, building a strong foundation in analytical and organizational thinking.' }
    ];

    return (
        <div style={{ position: 'relative', fontFamily: "'Inter', 'Segoe UI', sans-serif", background: colors.bg, color: '#222', overflow: 'hidden' }}>
            <GlobalStyles />
            <AmbientBackground />

            <div style={{ position: 'relative', zIndex: 1 }}>
                {/* HERO */}
                <section className="about-hero-grid" style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    gap: '50px', padding: '90px 40px 60px', flexWrap: 'wrap-reverse',
                    maxWidth: '1140px', margin: '0 auto'
                }}>
                    <div className="pop-in" style={{ flexShrink: 0, position: 'relative', width: '250px', height: '250px' }}>
                        <div style={{
                            position: 'absolute', inset: '-14px', borderRadius: '50%',
                            background: `conic-gradient(from 0deg, ${colors.violet}, ${colors.teal}, ${colors.violet})`,
                            filter: 'blur(2px)', opacity: 0.45
                        }} />
                        <div style={{
                            position: 'relative', width: '250px', height: '250px', borderRadius: '50%',
                            overflow: 'hidden', border: '5px solid #fff', boxShadow: '0 25px 55px rgba(129,140,248,0.28)'
                        }}>
                            <img src="/Img/Profile.jpeg" alt="Profile photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <OrbitBadge label="C#" radius={155} duration={18} delay={0} size={40} />
                        <OrbitBadge label="JS" radius={155} duration={18} delay={-6} size={40} />
                        <OrbitBadge label="React" radius={155} duration={18} delay={-12} size={40} />
                        <OrbitBadge label="SQL" radius={195} duration={26} delay={-9} size={36} />
                        <OrbitBadge label=".NET" radius={195} duration={26} delay={-22} size={36} />
                    </div>

                    <div className="fade-up" style={{ flex: 1, minWidth: '300px', textAlign: 'left' }}>
                        <SectionLabel>About Me</SectionLabel>
                        <h1 className="about-hero-title" style={{
                            fontFamily: "'Sora', sans-serif", fontSize: '46px', color: colors.navy,
                            margin: '0 0 10px', lineHeight: 1.2, fontWeight: 800
                        }}>
                            The developer behind<br />
                            <span style={{
                                background: `linear-gradient(135deg, ${colors.violet}, ${colors.tealDeep})`,
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                            }}>this portfolio.</span>
                        </h1>
                        <div style={{ fontSize: '18px', fontFamily: "'Sora', sans-serif", marginBottom: '20px', minHeight: '26px', color: colors.ink }}>
                            <Typewriter words={['Web Developer', 'Problem Solver', 'Lifelong Learner', 'React Enthusiast']} />
                        </div>
                        <p style={{ color: colors.muted, fontSize: '17px', maxWidth: '480px', marginBottom: '28px', lineHeight: 1.7 }}>
                            I'm Harshal, a web developer based in Rajkot, Gujarat. I enjoy turning
                            ideas into clean, working products — from database design to the last
                            pixel of the UI. Always learning, always building.
                        </p>
                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                            <Button variant="solid" href="Contact.aspx">Let's Talk →</Button>
                            <Button variant="outline" href="/Resume.pdf">Download Resume</Button>
                        </div>
                    </div>
                </section>

                {/* SKILLS */}
                <div style={{ maxWidth: '1140px', margin: '0 auto 80px', padding: '0 20px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <SectionLabel>What I Work With</SectionLabel>
                        <h2 style={{ fontFamily: "'Sora', sans-serif", color: colors.navy, fontSize: '32px', margin: 0, fontWeight: 800 }}>Skills & Tools</h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
                        {skills.map(s => <SkillCard key={s.name} {...s} />)}
                    </div>
                </div>

                {/* EXPERIENCE + EDUCATION */}
                <div style={{ maxWidth: '1140px', margin: '0 auto 90px', padding: '0 20px', display: 'flex', gap: '60px', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 400px' }}>
                        <SectionLabel>Where I've Worked</SectionLabel>
                        <h2 style={{ fontFamily: "'Sora', sans-serif", color: colors.navy, fontSize: '26px', margin: '0 0 28px', fontWeight: 800 }}>Experience</h2>
                        {experience.map((e, i) => <TimelineItem key={e.title} {...e} isLast={i === experience.length - 1} />)}
                    </div>

                    <div style={{ flex: '1 1 400px' }}>
                        <SectionLabel>Where I've Studied</SectionLabel>
                        <h2 style={{ fontFamily: "'Sora', sans-serif", color: colors.navy, fontSize: '26px', margin: '0 0 28px', fontWeight: 800 }}>Education</h2>
                        {education.map((e, i) => <TimelineItem key={e.title} {...e} isLast={i === education.length - 1} />)}
                    </div>
                </div>

                {/* CTA BAND */}
                <div style={{
                    position: 'relative', overflow: 'hidden',
                    background: `linear-gradient(135deg, ${colors.navy}, ${colors.navySoft})`,
                    borderRadius: '24px', padding: '64px 30px', textAlign: 'center',
                    maxWidth: '1040px', margin: '0 auto 60px', boxShadow: '0 30px 60px rgba(10,17,32,0.3)'
                }}>
                    <div style={{
                        position: 'absolute', width: '300px', height: '300px', borderRadius: '50%',
                        background: `radial-gradient(circle, ${colors.teal}33, transparent 70%)`, top: '-100px', right: '-60px'
                    }} />
                    <h2 style={{ fontFamily: "'Sora', sans-serif", color: '#fff', fontSize: '28px', marginBottom: '12px', fontWeight: 800, position: 'relative' }}>
                        Want to work together?
                    </h2>
                    <p style={{ color: '#94a3b8', marginBottom: '28px', fontSize: '16px', position: 'relative' }}>
                        I'm open to freelance work and full-time opportunities.
                    </p>
                    <div style={{ position: 'relative' }}>
                        <Button variant="solid" href="Contact.aspx">Get In Touch →</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

ReactDOM.createRoot(document.getElementById("root")).render(<About />);