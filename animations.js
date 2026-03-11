/**
 * animations.js
 * React-powered background: interactive particle network + floating orbs.
 * No build step — loads React 18 from CDN automatically.
 */
(function () {
  const CDN = [
    'https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js',
  ];

  let loaded = 0;
  CDN.forEach(src => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = () => { if (++loaded === CDN.length) init(); };
    document.head.appendChild(s);
  });

  function init() {
    const { useEffect, useRef } = React;

    /* ── Particle canvas ── */
    function Particles() {
      const ref = useRef(null);

      useEffect(() => {
        const canvas = ref.current;
        const ctx = canvas.getContext('2d');
        let raf;
        const mouse = { x: -999, y: -999 };

        const resize = () => {
          canvas.width  = window.innerWidth;
          canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

        // Build particles
        const N = 70;
        const pts = Array.from({ length: N }, () => ({
          x:  Math.random() * canvas.width,
          y:  Math.random() * canvas.height,
          vx: (Math.random() - .5) * .35,
          vy: (Math.random() - .5) * .35,
          r:  Math.random() * 1.6 + .3,
          a:  Math.random() * .45 + .08,
          ph: Math.random() * Math.PI * 2,
          ps: .008 + Math.random() * .012,
          red: Math.random() < .28,
        }));

        const draw = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Connections
          for (let i = 0; i < pts.length; i++) {
            for (let j = i + 1; j < pts.length; j++) {
              const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
              const d = Math.hypot(dx, dy);
              if (d < 130) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(192,57,43,${(1 - d/130) * .055})`;
                ctx.lineWidth = .4;
                ctx.moveTo(pts[i].x, pts[i].y);
                ctx.lineTo(pts[j].x, pts[j].y);
                ctx.stroke();
              }
            }
          }

          pts.forEach(p => {
            p.ph += p.ps;
            const alpha = p.a + Math.sin(p.ph) * .08;

            // Mouse repel
            const dx = p.x - mouse.x, dy = p.y - mouse.y;
            const d = Math.hypot(dx, dy);
            if (d < 90) {
              const f = (90 - d) / 90 * .7;
              p.vx += (dx / d) * f;
              p.vy += (dy / d) * f;
            }
            p.vx *= .979; p.vy *= .979;
            p.x  += p.vx;  p.y  += p.vy;
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            const col = p.red
              ? `rgba(192,57,43,${Math.min(1, Math.max(0, alpha))})`
              : `rgba(242,237,232,${Math.min(1, Math.max(0, alpha * .6))})`;
            ctx.fillStyle = col;
            ctx.fill();
          });

          raf = requestAnimationFrame(draw);
        };
        draw();

        return () => {
          cancelAnimationFrame(raf);
          window.removeEventListener('resize', resize);
        };
      }, []);

      return React.createElement('canvas', {
        ref,
        style: {
          position: 'fixed', inset: 0,
          width: '100%', height: '100%',
          pointerEvents: 'none', zIndex: 0,
        }
      });
    }

    /* ── Orbs ── */
    function Orbs() {
      const orbs = [
        { s: 380, t: '8%',  l: '58%', d: '0s',  dur: '18s', o: .032 },
        { s: 220, t: '55%', l: '82%', d: '5s',  dur: '14s', o: .022 },
        { s: 170, t: '72%', l: '10%', d: '9s',  dur: '21s', o: .018 },
        { s: 280, t: '22%', l: '2%',  d: '13s', dur: '17s', o: .016 },
      ];
      return React.createElement(React.Fragment, null,
        orbs.map((o, i) =>
          React.createElement('div', {
            key: i,
            style: {
              position: 'fixed',
              top: o.t, left: o.l,
              width: o.s, height: o.s,
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(192,57,43,${o.o}) 0%, transparent 70%)`,
              transform: 'translate(-50%,-50%)',
              pointerEvents: 'none', zIndex: 0,
              filter: 'blur(3px)',
              animation: `orb ${o.dur} ease-in-out ${o.d} infinite alternate`,
            }
          })
        )
      );
    }

    // Inject orb keyframes
    const s = document.createElement('style');
    s.textContent = `@keyframes orb {
      from { transform: translate(-50%,-50%) scale(1); opacity: .6; }
      to   { transform: translate(-50%,-53%) scale(1.14); opacity: 1; }
    }`;
    document.head.appendChild(s);

    function App() {
      return React.createElement(React.Fragment, null,
        React.createElement(Particles),
        React.createElement(Orbs),
      );
    }

    ReactDOM.createRoot(document.getElementById('react-root'))
            .render(React.createElement(App));
  }
})();
