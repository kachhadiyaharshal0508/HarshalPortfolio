const { useState, useEffect, useRef } = React;

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
    border: '#e9ecf1',
    danger: '#e0574a'
};

/* ---------- Shared font loader (same as Home) ---------- */
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

/* ---------- Global styles (same system as Home) ---------- */
function GlobalStyles() {
    return (
        <style>{`
            @keyframes floatA { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(60px,50px) scale(1.1); } }
            @keyframes floatB { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-60px,-40px) scale(1.12); } }
            @keyframes floatC { 0%,100% { transform: translate(0,0); } 50% { transform: translate(40px,-60px); } }
            @keyframes hueShift { 0%,100% { filter: blur(10px) hue-rotate(0deg); } 50% { filter: blur(10px) hue-rotate(35deg); } }
            @keyframes fadeUp { from { opacity:0; transform: translateY(24px);} to {opacity:1; transform: translateY(0);} }
            @keyframes popIn { from { opacity:0; transform: scale(0.9);} to {opacity:1; transform: scale(1);} }

            .fade-up { animation: fadeUp 0.8s cubic-bezier(.16,1,.3,1) both; }
            .pop-in { animation: popIn 0.7s cubic-bezier(.16,1,.3,1) both; }

            .btn-primary { transition: transform 0.25s ease, box-shadow 0.25s ease, filter 0.25s ease; }
            .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 14px 28px rgba(13,148,136,0.35); filter: brightness(1.05); }

            .btn-outline { transition: all 0.25s ease; }
            .btn-outline:hover { background: ${colors.teal}; color: ${colors.navy}; border-color: ${colors.teal}; transform: translateY(-3px); }

            .field-shell { transition: border-color 0.2s ease; }
            .field-label { transition: all 0.18s ease; pointer-events: none; }

            @media (max-width: 900px) {
                .contact-grid { flex-direction: column; }
            }
        `}</style>
    );
}

/* ---------- Ambient animated background (same system as Home) ---------- */
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
                <div style={{ position: 'absolute', width: '600px', height: '600px', borderRadius: '50%', top: '-180px', left: '-140px', background: `radial-gradient(circle, ${colors.teal}45, transparent 70%)`, filter: 'blur(10px)', animation: 'floatA 14s ease-in-out infinite, hueShift 12s ease-in-out infinite' }} />
                <div style={{ position: 'absolute', width: '520px', height: '520px', borderRadius: '50%', top: '10%', right: '-180px', background: `radial-gradient(circle, ${colors.violet}40, transparent 70%)`, filter: 'blur(10px)', animation: 'floatB 17s ease-in-out infinite, hueShift 15s ease-in-out infinite' }} />
                <div style={{ position: 'absolute', width: '420px', height: '420px', borderRadius: '50%', bottom: '-120px', left: '30%', background: `radial-gradient(circle, ${colors.tealDeep}38, transparent 70%)`, filter: 'blur(10px)', animation: 'floatC 15s ease-in-out infinite, hueShift 18s ease-in-out infinite' }} />
            </div>
            <ParticleNetwork />
        </div>
    );
}

/* ---------- Form config ---------- */
const fields = [
    { name: 'name', label: 'Name', type: 'text', placeholder: 'Riya Shah', required: true },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'riya@company.com', required: true },
    { name: 'company', label: 'Company', type: 'text', placeholder: 'Optional', required: false },
    {
        name: 'budget', label: 'Budget range', type: 'select', required: true,
        options: ['Under ₹50k', '₹50k – ₹1.5L', '₹1.5L – ₹5L', 'Let\'s discuss']
    }
];

function FloatingField({ field, value, error, onChange }) {
    const [focused, setFocused] = useState(false);
    const filled = value && value.length > 0;
    const isSelect = field.type === 'select';

    const shellStyle = {
        position: 'relative',
        borderBottom: `2px solid ${error ? colors.danger : (focused ? colors.teal : colors.border)}`,
        paddingTop: '22px', paddingBottom: '8px'
    };

    const labelStyle = {
        position: 'absolute', left: 0,
        top: focused || filled ? '0px' : '22px',
        fontSize: focused || filled ? '12px' : '15px',
        color: error ? colors.danger : (focused ? colors.tealDeep : colors.muted),
        fontWeight: 600,
        letterSpacing: focused || filled ? '0.04em' : '0',
        textTransform: focused || filled ? 'uppercase' : 'none'
    };

    const inputStyle = {
        width: '100%', border: 'none', outline: 'none', background: 'transparent',
        fontSize: '17px', color: colors.ink, fontFamily: 'inherit', padding: 0,
        appearance: isSelect ? 'none' : undefined, cursor: isSelect ? 'pointer' : 'text'
    };

    return (
        <div style={{ marginBottom: '30px' }}>
            <div className="field-shell" style={shellStyle}>
                <span className="field-label" style={labelStyle}>
                    {field.label}{field.required ? ' *' : ''}
                </span>
                {isSelect ? (
                    <select name={field.name} value={value} onChange={onChange}
                        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={inputStyle}>
                        <option value="" disabled hidden></option>
                        {field.options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                ) : (
                    <input name={field.name} type={field.type} value={value} onChange={onChange}
                        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                        placeholder={focused ? field.placeholder : ''} style={inputStyle} />
                )}
            </div>
            {error && <p style={{ margin: '6px 0 0', fontSize: '12px', color: colors.danger, fontWeight: 600 }}>{error}</p>}
        </div>
    );
}

function ContactPage() {
    useGoogleFont();

    const [values, setValues] = useState({ name: '', email: '', company: '', budget: '', message: '' });
    const [errors, setErrors] = useState({});
    const [sent, setSent] = useState(false);

    const YOUR_EMAIL = 'kachhadiyaharshal653@gmail.com';
    const YOUR_WHATSAPP = '919904193464';

    const buildMessage = (v) => {
        const lines = [`Hi, I'm ${v.name} — reaching out about a project.`, '', `Email: ${v.email}`];
        if (v.company) lines.push(`Company: ${v.company}`);
        if (v.budget) lines.push(`Budget: ${v.budget}`);
        lines.push('', v.message);
        return lines.join('\n');
    };

    const validate = () => {
        const e = {};
        if (!values.name.trim()) e.name = 'Tell us who you are.';
        if (!values.email.trim()) e.email = 'We need a way to reply.';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) e.email = 'That email doesn\'t look right.';
        if (!values.budget) e.budget = 'Pick a range so we can scope things properly.';
        if (!values.message.trim()) e.message = 'A few lines about the project will help.';
        return e;
    };

    const update = (e) => {
        const { name, value } = e.target;
        setValues((v) => ({ ...v, [name]: value }));
        if (errors[name]) setErrors((er) => ({ ...er, [name]: null }));
    };

    const sendViaEmail = () => {
        const e = validate();
        if (Object.keys(e).length) { setErrors(e); return; }
        setSent(true);
        const subject = encodeURIComponent(`New inquiry from ${values.name}`);
        const body = encodeURIComponent(buildMessage(values));
        window.location.href = `mailto:${YOUR_EMAIL}?subject=${subject}&body=${body}`;
    };

    const sendViaWhatsApp = () => {
        const e = validate();
        if (Object.keys(e).length) { setErrors(e); return; }
        setSent(true);
        const text = encodeURIComponent(buildMessage(values));
        window.open(`https://wa.me/${YOUR_WHATSAPP}?text=${text}`, '_blank');
    };

    return (
        <div style={{
            position: 'relative', minHeight: '100vh',
            background: colors.bg, fontFamily: "'Inter', 'Segoe UI', sans-serif",
            overflow: 'hidden'
        }}>
            <GlobalStyles />
            <AmbientBackground />

            <div className="contact-grid" style={{
                position: 'relative', zIndex: 1,
                display: 'flex', flexWrap: 'wrap',
                maxWidth: '1140px', margin: '0 auto',
                minHeight: '100vh'
            }}>
                {/* Left — dark editorial panel, matches CTA band on Home */}
                <div className="fade-up" style={{
                    flex: '1 1 380px',
                    background: `linear-gradient(135deg, ${colors.navy}, ${colors.navySoft})`,
                    color: '#fff', padding: '80px 56px',
                    display: 'flex', alignItems: 'center',
                    position: 'relative', overflow: 'hidden'
                }}>
                    <div style={{
                        position: 'absolute', width: '340px', height: '340px', borderRadius: '50%',
                        background: `radial-gradient(circle, ${colors.teal}33, transparent 70%)`,
                        top: '-140px', right: '-100px'
                    }} />

                    <div style={{ position: 'relative', maxWidth: '380px' }}>
                        <div style={{
                            fontSize: '13px', fontWeight: 700, letterSpacing: '0.08em',
                            textTransform: 'uppercase', color: colors.teal, marginBottom: '20px'
                        }}>
                            Let's build something
                        </div>

                        <h1 style={{
                            fontFamily: "'Sora', sans-serif", fontSize: '40px', lineHeight: 1.2,
                            fontWeight: 800, margin: '0 0 20px'
                        }}>
                            Tell me about<br />your project.
                        </h1>

                        <p style={{ fontSize: '15.5px', lineHeight: 1.8, color: 'rgba(255,255,255,0.72)', margin: '0 0 52px' }}>
                            Share a few details below — timeline, scope, whatever you have.
                            I read every message myself and reply within a day or two.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                            {[
                                { label: 'EMAIL', value: YOUR_EMAIL },
                                { label: 'CONTACT NO.', value: '9904193464' },
                                { label: 'BASED IN', value: 'Rajkot, Gujarat' }
                            ].map((item) => (
                                <div key={item.label}>
                                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px', letterSpacing: '0.04em' }}>{item.label}</div>
                                    <div style={{ fontSize: '15px', fontWeight: 600 }}>{item.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right — form */}
                <div style={{ flex: '1 1 420px', padding: '80px 56px', display: 'flex', alignItems: 'center', background: '#fff' }}>
                    <div style={{ width: '100%', maxWidth: '440px', margin: '0 auto' }}>
                        {sent ? (
                            <div className="pop-in">
                                <div style={{
                                    width: '56px', height: '56px', borderRadius: '50%',
                                    background: '#ecfdf7', color: colors.tealDeep,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '26px', fontWeight: 700, marginBottom: '24px'
                                }}>✓</div>
                                <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: '24px', fontWeight: 800, color: colors.navy, margin: '0 0 10px' }}>
                                    Message ready.
                                </h2>
                                <p style={{ fontSize: '15px', color: colors.muted, lineHeight: 1.7 }}>
                                    Your email or WhatsApp app should have opened with the details filled in — just hit send there to reach me.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={(e) => e.preventDefault()} noValidate>
                                {fields.map((f) => (
                                    <FloatingField key={f.name} field={f} value={values[f.name]} error={errors[f.name]} onChange={update} />
                                ))}

                                <div style={{ marginBottom: '10px' }}>
                                    <label style={{
                                        display: 'block', fontSize: '12px', fontWeight: 700,
                                        letterSpacing: '0.04em', color: errors.message ? colors.danger : colors.muted,
                                        marginBottom: '10px', textTransform: 'uppercase'
                                    }}>
                                        Project details *
                                    </label>
                                    <textarea
                                        name="message" value={values.message} onChange={update} rows={4}
                                        placeholder="What are you looking to build?"
                                        style={{
                                            width: '100%',
                                            border: `1.5px solid ${errors.message ? colors.danger : colors.border}`,
                                            borderRadius: '10px', padding: '14px 16px', fontSize: '15px',
                                            fontFamily: 'inherit', color: colors.ink, outline: 'none',
                                            resize: 'vertical', boxSizing: 'border-box'
                                        }}
                                    />
                                    {errors.message && <p style={{ margin: '6px 0 0', fontSize: '12px', color: colors.danger, fontWeight: 600 }}>{errors.message}</p>}
                                </div>

                                <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
                                    <button type="button" onClick={sendViaEmail} className="btn-primary" style={{
                                        flex: '1 1 160px', padding: '16px', borderRadius: '10px', border: 'none',
                                        background: `linear-gradient(135deg, ${colors.tealDeep}, ${colors.teal})`,
                                        color: '#fff', fontSize: '15px', fontWeight: 700, letterSpacing: '0.02em', cursor: 'pointer'
                                    }}>
                                        Send via email
                                    </button>

                                    <button type="button" onClick={sendViaWhatsApp} className="btn-outline" style={{
                                        flex: '1 1 160px', padding: '16px', borderRadius: '10px',
                                        border: `1.5px solid ${colors.teal}`, background: 'transparent',
                                        color: colors.tealDeep, fontSize: '15px', fontWeight: 700, letterSpacing: '0.02em', cursor: 'pointer'
                                    }}>
                                        Send via WhatsApp
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

ReactDOM.createRoot(document.getElementById("root")).render(<ContactPage />);