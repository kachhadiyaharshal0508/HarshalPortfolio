const { useEffect, useRef } = React;

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

/* ---------- Load Google Font once ---------- */
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

/* ---------- Global animation styles ---------- */
function GlobalStyles() {
    return (
        <style>{`
            @keyframes floatA { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(60px,50px) scale(1.1); } }
            @keyframes floatB { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-60px,-40px) scale(1.12); } }
            @keyframes floatC { 0%,100% { transform: translate(0,0); } 50% { transform: translate(40px,-60px); } }
            @keyframes hueShift { 0%,100% { filter: blur(10px) hue-rotate(0deg); } 50% { filter: blur(10px) hue-rotate(35deg); } }
            @keyframes fadeUp { from { opacity:0; transform: translateY(24px);} to {opacity:1; transform: translateY(0);} }
            @keyframes popIn { from { opacity:0; transform: scale(0.9);} to {opacity:1; transform: scale(1);} }
            @keyframes pulseDot { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
            @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }

            .fade-up { animation: fadeUp 0.8s cubic-bezier(.16,1,.3,1) both; }
            .pop-in { animation: popIn 0.7s cubic-bezier(.16,1,.3,1) both; }

            .marquee-track {
                display: flex;
                gap: 48px;
                width: max-content;
                animation: marquee 22s linear infinite;
            }
            .marquee-wrap:hover .marquee-track { animation-play-state: paused; }

            .project-card {
                transition: transform 0.35s cubic-bezier(.16,1,.3,1), box-shadow 0.35s ease, border-color 0.35s ease;
            }
            .project-card:hover {
                transform: translateY(-10px);
                box-shadow: 0 24px 48px rgba(13,148,136,0.16);
                border-color: ${colors.teal};
            }
            .project-card:hover .project-thumb { transform: scale(1.06); }
            .project-thumb { transition: transform 0.5s ease; }
            .project-card:hover .project-arrow { transform: translateX(4px); }
            .project-arrow { transition: transform 0.25s ease; display: inline-block; }

            .btn-primary {
                transition: transform 0.25s ease, box-shadow 0.25s ease, filter 0.25s ease;
            }
            .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 14px 28px rgba(13,148,136,0.35); filter: brightness(1.05); }

            .btn-outline { transition: all 0.25s ease; }
            .btn-outline:hover { background: ${colors.navy}; color: #fff; border-color: ${colors.navy}; transform: translateY(-3px); }

            .stat-item { transition: transform 0.3s ease; }
            .stat-item:hover { transform: translateY(-4px); }

            @media (max-width: 760px) {
                .hero-title { font-size: 38px !important; }
                .hero-grid { flex-direction: column-reverse; }
            }
        `}</style>
    );
}

/* ---------- Ambient animated background: glowing particle network + aurora + click bursts ---------- */
function ParticleNetwork() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let width, height, particles, bursts, animId;
        const mouse = { x: null, y: null, radius: 170 };

        const palette = ['#2dd4bf', '#5eead4', '#818cf8', '#0d9488', '#a78bfa'];
        const rand = (a, b) => a + Math.random() * (b - a);

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }

        function makeParticles() {
            const count = Math.min(130, Math.floor((width * height) / 11000));
            particles = Array.from({ length: count }, () => ({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: rand(-0.35, 0.35),
                vy: rand(-0.35, 0.35),
                r: rand(1.6, 3.4),
                color: palette[Math.floor(Math.random() * palette.length)],
                twinkle: Math.random() * Math.PI * 2
            }));
            bursts = [];
        }

        function spawnBurst(x, y) {
            const n = 22;
            for (let i = 0; i < n; i++) {
                const angle = (Math.PI * 2 * i) / n;
                const speed = rand(1.5, 4);
                bursts.push({
                    x, y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    life: 1,
                    color: palette[Math.floor(Math.random() * palette.length)],
                    r: rand(1.5, 3)
                });
            }
        }

        function step(t) {
            ctx.clearRect(0, 0, width, height);

            // connecting lines with gradient glow, brighter near cursor
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                if (mouse.x !== null) {
                    const dx = p.x - mouse.x, dy = p.y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                    if (dist < mouse.radius) {
                        const force = (mouse.radius - dist) / mouse.radius;
                        p.x += (dx / dist) * force * 2.4;
                        p.y += (dy / dist) * force * 2.4;
                    }
                }

                for (let j = i + 1; j < particles.length; j++) {
                    const q = particles[j];
                    const dx = p.x - q.x, dy = p.y - q.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 140) {
                        let alpha = 0.16 * (1 - dist / 140);
                        if (mouse.x !== null) {
                            const dm = Math.min(
                                Math.hypot(p.x - mouse.x, p.y - mouse.y),
                                Math.hypot(q.x - mouse.x, q.y - mouse.y)
                            );
                            if (dm < mouse.radius) alpha += 0.35 * (1 - dm / mouse.radius);
                        }
                        ctx.strokeStyle = `rgba(45,212,191,${Math.min(alpha, 0.55)})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(q.x, q.y);
                        ctx.stroke();
                    }
                }
            }

            // glowing particles with subtle twinkle
            for (const p of particles) {
                p.twinkle += 0.03;
                const glow = 0.55 + Math.sin(p.twinkle) * 0.25;
                ctx.save();
                ctx.shadowBlur = 12;
                ctx.shadowColor = p.color;
                ctx.globalAlpha = glow;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();
                ctx.restore();
            }

            // click burst particles
            for (let i = bursts.length - 1; i >= 0; i--) {
                const b = bursts[i];
                b.x += b.vx; b.y += b.vy;
                b.vx *= 0.96; b.vy *= 0.96;
                b.life -= 0.02;
                if (b.life <= 0) { bursts.splice(i, 1); continue; }
                ctx.save();
                ctx.globalAlpha = b.life;
                ctx.shadowBlur = 14;
                ctx.shadowColor = b.color;
                ctx.beginPath();
                ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
                ctx.fillStyle = b.color;
                ctx.fill();
                ctx.restore();
            }

            animId = requestAnimationFrame(step);
        }

        function onMove(e) { mouse.x = e.clientX; mouse.y = e.clientY; }
        function onLeave() { mouse.x = null; mouse.y = null; }
        function onClick(e) { spawnBurst(e.clientX, e.clientY); }

        resize();
        makeParticles();
        step();

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

    return (
        <canvas ref={canvasRef} style={{
            position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none'
        }} />
    );
}

function AmbientBackground() {
    return (
        <div>
            <div className="aurora-layer" style={{ position: 'fixed', inset: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
                <div className="aurora-blob" style={{
                    position: 'absolute', width: '640px', height: '640px', borderRadius: '50%',
                    top: '-200px', left: '-160px',
                    background: `radial-gradient(circle, ${colors.teal}55, transparent 70%)`,
                    filter: 'blur(10px)', animation: 'floatA 14s ease-in-out infinite, hueShift 12s ease-in-out infinite'
                }} />
                <div className="aurora-blob" style={{
                    position: 'absolute', width: '560px', height: '560px', borderRadius: '50%',
                    top: '5%', right: '-200px',
                    background: `radial-gradient(circle, ${colors.violet}4d, transparent 70%)`,
                    filter: 'blur(10px)', animation: 'floatB 17s ease-in-out infinite, hueShift 15s ease-in-out infinite'
                }} />
                <div className="aurora-blob" style={{
                    position: 'absolute', width: '460px', height: '460px', borderRadius: '50%',
                    bottom: '-140px', left: '30%',
                    background: `radial-gradient(circle, ${colors.tealDeep}45, transparent 70%)`,
                    filter: 'blur(10px)', animation: 'floatC 15s ease-in-out infinite, hueShift 18s ease-in-out infinite'
                }} />
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27120%27 height=%27120%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%272%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27 opacity=%270.035%27/%3E%3C/svg%3E")',
                    mixBlendMode: 'overlay'
                }} />
            </div>
            <ParticleNetwork />
        </div>
    );
}

function AvailabilityBadge() {
    return (
        <div className="fade-up" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: '#fff', border: `1px solid ${colors.border}`,
            padding: '7px 16px', borderRadius: '30px', fontSize: '13px', fontWeight: 600,
            color: colors.ink, marginBottom: '22px', boxShadow: '0 2px 10px rgba(15,23,42,0.05)'
        }}>
            <span style={{
                width: '8px', height: '8px', borderRadius: '50%',
                background: colors.teal, animation: 'pulseDot 2s ease-in-out infinite'
            }} />
            Available for freelance & full-time work
        </div>
    );
}

function StatItem({ value, label }) {
    return (
        <div className="stat-item" style={{ textAlign: 'center', minWidth: '100px' }}>
            <div style={{
                fontFamily: "'Sora', sans-serif", fontSize: '30px', fontWeight: 800,
                background: `linear-gradient(135deg, ${colors.navy}, ${colors.tealDeep})`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>{value}</div>
            <div style={{ fontSize: '13px', color: colors.muted, fontWeight: 600, marginTop: '2px' }}>{label}</div>
        </div>
    );
}

function Button({ children, variant = 'solid', href = '#' }) {
    const solid = {
        background: `linear-gradient(135deg, ${colors.tealDeep}, ${colors.teal})`,
        color: '#fff', border: '2px solid transparent'
    };
    const outline = { background: 'transparent', color: colors.navy, border: `2px solid ${colors.navy}` };

    return (
        <a href={href} className={variant === 'solid' ? 'btn-primary' : 'btn-outline'} style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '15px 32px', borderRadius: '10px', textDecoration: 'none',
            fontWeight: 700, fontSize: '15px',
            ...(variant === 'solid' ? solid : outline)
        }}>
            {children}
        </a>
    );
}

function ProjectCard({ title, desc, tech, link, tags }) {
    return (
        <div className="project-card" style={{
            background: colors.card, border: `1px solid ${colors.border}`,
            borderRadius: '18px', width: '320px', padding: '20px',
            boxShadow: '0 6px 20px rgba(15,23,42,0.05)'
        }}>
            <div className="project-thumb" style={{
                width: '100%', height: '170px', borderRadius: '12px', marginBottom: '18px',
                background: `linear-gradient(135deg, ${colors.teal}, ${colors.tealDeep} 60%, ${colors.navy})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'rgba(255,255,255,0.85)', fontSize: '12px', fontWeight: 700,
                letterSpacing: '1px', position: 'relative', overflow: 'hidden'
            }}>
                PROJECT PREVIEW
            </div>

            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                {tags.map(t => (
                    <span key={t} style={{
                        fontSize: '11px', fontWeight: 700, color: colors.tealDeep,
                        background: '#ecfdf7', padding: '4px 10px', borderRadius: '20px'
                    }}>{t}</span>
                ))}
            </div>

            <h3 style={{ fontFamily: "'Sora', sans-serif", color: colors.navy, marginBottom: '8px', fontSize: '19px' }}>{title}</h3>
            <p style={{ color: colors.muted, fontSize: '14px', marginBottom: '16px', lineHeight: 1.6 }}>{desc}</p>
            <a href={link} target="_blank" rel="noreferrer" style={{
                color: colors.navy, textDecoration: 'none', fontWeight: 700, fontSize: '14px',
                display: 'inline-flex', alignItems: 'center', gap: '6px'
            }}>
                View Project <span className="project-arrow">→</span>
            </a>
        </div>
    );
}

function Home() {
    useGoogleFont();

    const projects = [
        { title: 'E-Commerce Platform', desc: 'Full-stack shopping app with cart, checkout, and an admin dashboard for inventory.', tech: 'ASP.NET • SQL Server • Bootstrap', tags: ['Full-Stack', 'ASP.NET'], link: 'https://github.com/yourname/project1' },
        { title: 'Task Manager', desc: 'Drag-and-drop to-do app with persistent local storage and keyboard shortcuts.', tech: 'C# • jQuery • LocalStorage', tags: ['Productivity', 'JS'], link: 'https://github.com/yourname/project2' },
        { title: 'This Portfolio', desc: 'The site you\'re on right now — ASP.NET Web Forms serving a React front end.', tech: 'ASP.NET • React • Master Pages', tags: ['React', 'Design'], link: 'https://github.com/yourname/project3' }
    ];

    const skills = ['C# / .NET', 'ASP.NET Web Forms', 'React.js', 'SQL Server', 'JavaScript', 'HTML5 & CSS3', 'REST APIs', 'Git'];

    return (
        <div style={{
            position: 'relative', fontFamily: "'Inter', 'Segoe UI', sans-serif",
            background: colors.bg, color: '#222', overflow: 'hidden'
        }}>
            <GlobalStyles />
            <AmbientBackground />

            <div style={{ position: 'relative', zIndex: 1 }}>
                {/* HERO */}
                <section className="hero-grid" style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    gap: '50px', padding: '90px 40px 60px', flexWrap: 'wrap',
                    maxWidth: '1140px', margin: '0 auto'
                }}>
                    <div style={{ flex: 1, minWidth: '300px' }}>
                        <AvailabilityBadge />
                        <h1 className="hero-title fade-up" style={{
                            fontFamily: "'Sora', sans-serif",
                            fontSize: '52px', color: colors.navy, margin: '0 0 18px',
                            lineHeight: 1.15, fontWeight: 800
                        }}>
                            Hi, I'm Harshal —<br />
                            <span style={{
                                background: `linear-gradient(135deg, ${colors.tealDeep}, ${colors.violet})`,
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                            }}>Web Developer</span>
                        </h1>
                        <p className="fade-up" style={{
                            color: colors.muted, fontSize: '17.5px', maxWidth: '480px',
                            marginBottom: '32px', lineHeight: 1.7
                        }}>
                            I design and build clean, functional web applications using
                            ASP.NET, C#, and modern front-end tools like React —
                            turning ideas into products people enjoy using.
                        </p>
                        <div className="fade-up" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '40px' }}>
                            <Button variant="solid" href="Projects.aspx">View Projects →</Button>
                            <Button variant="outline" href="Contact.aspx">Contact Me</Button>
                        </div>

                        <div className="fade-up" style={{ display: 'flex', gap: '36px' }}>
                            <StatItem value="15+" label="Projects Worked On" />
                            <StatItem value="3+" label="Years Learning" />
                            <StatItem value="100%" label="Client Focus" />
                        </div>
                    </div>

                    <div className="pop-in" style={{ flexShrink: 0, position: 'relative' }}>
                        <div style={{
                            position: 'absolute', inset: '-14px', borderRadius: '50%',
                            background: `conic-gradient(from 0deg, ${colors.teal}, ${colors.violet}, ${colors.teal})`,
                            filter: 'blur(2px)', opacity: 0.5
                        }} />
                        <div style={{
                            position: 'relative', width: '270px', height: '270px', borderRadius: '50%',
                            overflow: 'hidden', border: '5px solid #fff',
                            boxShadow: '0 25px 55px rgba(13,148,136,0.28)'
                        }}>
                            <img src="/Img/Profile.jpeg" alt="Profile photo"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    </div>
                </section>

                {/* SKILLS MARQUEE */}
                <div className="marquee-wrap" style={{
                    padding: '26px 0', borderTop: `1px solid ${colors.border}`,
                    borderBottom: `1px solid ${colors.border}`, overflow: 'hidden',
                    background: '#fff', marginBottom: '80px'
                }}>
                    <div className="marquee-track">
                        {[...skills, ...skills].map((s, i) => (
                            <span key={i} style={{
                                fontFamily: "'Sora', sans-serif", fontSize: '15px', fontWeight: 700,
                                color: colors.ink, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '10px'
                            }}>
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: colors.teal }} />
                                {s}
                            </span>
                        ))}
                    </div>
                </div>

                {/* FEATURED PROJECTS */}
                <div style={{ maxWidth: '1140px', margin: '0 auto', padding: '0 20px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '44px' }}>
                        <div style={{
                            color: colors.tealDeep, fontWeight: 700, letterSpacing: '1.5px',
                            textTransform: 'uppercase', fontSize: '13px', marginBottom: '10px'
                        }}>My Work</div>
                        <h2 style={{ fontFamily: "'Sora', sans-serif", color: colors.navy, fontSize: '34px', margin: 0, fontWeight: 800 }}>
                            Featured Projects
                        </h2>
                    </div>

                    <div style={{ display: 'flex', gap: '26px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {projects.map(p => <ProjectCard key={p.title} {...p} />)}
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '44px' }}>
                        <Button variant="outline" href="Projects.aspx">See All Projects →</Button>
                    </div>
                </div>

                {/* CTA BAND */}
                <div style={{
                    position: 'relative', overflow: 'hidden',
                    background: `linear-gradient(135deg, ${colors.navy}, ${colors.navySoft})`,
                    borderRadius: '24px', padding: '64px 30px', textAlign: 'center',
                    maxWidth: '1040px', margin: '90px auto 60px',
                    boxShadow: '0 30px 60px rgba(10,17,32,0.3)'
                }}>
                    <div style={{
                        position: 'absolute', width: '300px', height: '300px', borderRadius: '50%',
                        background: `radial-gradient(circle, ${colors.teal}33, transparent 70%)`,
                        top: '-100px', right: '-60px'
                    }} />
                    <h2 style={{ fontFamily: "'Sora', sans-serif", color: '#fff', fontSize: '30px', marginBottom: '12px', fontWeight: 800, position: 'relative' }}>
                        Let's build something great together
                    </h2>
                    <p style={{ color: '#94a3b8', marginBottom: '30px', fontSize: '16px', position: 'relative' }}>
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

ReactDOM.createRoot(document.getElementById("root")).render(<Home />);