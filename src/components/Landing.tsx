"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

const introWords = [
  { text: "BUILD", color: "#ffffff" },
  { text: "THINGS", color: "#ffffff" },
  { text: "THAT", color: "#ffffff" },
  { text: "MATTER", color: "#8a2828" },
];

const navLinks = ["Home", "Works", "About", "Contact"];

export default function Portfolio() {
  const [phase, setPhase] = useState("intro");
  const [currentWord, setCurrentWord] = useState(-1);
  const [wordVisible, setWordVisible] = useState(false);
  const [introFade, setIntroFade] = useState(false);
  const [landingReady, setLandingReady] = useState(false);
  const [stagger, setStagger] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const [drag, setDrag] = useState({
    x: 0,
    y: 0,
    dragging: false,
    startX: 0,
    startY: 0,
    origX: 0,
    origY: 0,
  });
  const imgRef = useRef(null);

  /* ---- INTRO SEQUENCE ---- */
  useEffect(() => {
    if (phase !== "intro") return;
    const t = setTimeout(() => {
      setCurrentWord(0);
      setWordVisible(true);
    }, 400);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "intro" || currentWord < 0) return;
    if (currentWord < introWords.length - 1) {
      const t1 = setTimeout(() => setWordVisible(false), 600);
      const t2 = setTimeout(() => {
        setCurrentWord((c) => c + 1);
        setWordVisible(true);
      }, 950);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    } else {
      const t = setTimeout(() => {
        setIntroFade(true);
        setTimeout(() => {
          setPhase("main");
          setLandingReady(true);
          let s = 1;
          const tick = () => {
            setStagger((v) => v + 1);
            s++;
            if (s <= 6) setTimeout(tick, 150);
          };
          setTimeout(tick, 100);
        }, 600);
      }, 1200);
      return () => clearTimeout(t);
    }
  }, [currentWord, phase]);

  const skipIntro = useCallback(() => {
    if (phase !== "intro") return;
    setIntroFade(true);
    setTimeout(() => {
      setPhase("main");
      setLandingReady(true);
      setStagger(6);
    }, 400);
  }, [phase]);

  /* ---- DRAG HANDLERS ---- */
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDrag((d) => ({
      ...d,
      dragging: true,
      startX: e.clientX,
      startY: e.clientY,
      origX: d.x,
      origY: d.y,
    }));
  };
  const onPointerMove = useCallback((e: PointerEvent) => {
    setDrag((d) => {
      if (!d.dragging) return d;
      return {
        ...d,
        x: d.origX + (e.clientX - d.startX),
        y: d.origY + (e.clientY - d.startY),
      };
    });
  }, []);
  const onPointerUp = useCallback(() => {
    setDrag((d) => ({ ...d, dragging: false }));
  }, []);

  useEffect(() => {
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [onPointerMove, onPointerUp]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const s = (n: number) => stagger >= n;

  return (
    <div>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }

        .fade-up {
          opacity: 0; transform: translateY(30px);
          transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1);
        }
        .fade-up.show { opacity: 1; transform: translateY(0); }

        /* ===== LANDING SHELL — exactly 100vh ===== */
        .landing-shell {
          height: 100vh; width: 100%;
          background: #f5f5f0; color: #111;
          display: flex; flex-direction: column;
          overflow: hidden;
        }

        /* ===== NAV ===== */
        .site-nav {
          display: flex; justify-content: space-between; align-items: center;
          padding: 24px 40px; flex-shrink: 0;
        }
        .nav-logo { font-size: 18px; font-weight: 700; color: #111; letter-spacing: -0.5px; }
        .desktop-nav-center { display: flex; gap: 8px; }
        .desktop-nav-right { display: flex; gap: 20px; }
        .mobile-menu-btn { display: none; }

        .nav-link {
          color: #222; text-decoration: none; font-size: 15px;
          font-weight: 400; transition: color 0.3s; cursor: pointer;
        }
        .nav-link:hover { color: #8a2828; }

        .social-link {
          color: #111; text-decoration: none; font-size: 13px;
          font-weight: 500; letter-spacing: 0.5px; transition: color 0.3s; cursor: pointer;
        }
        .social-link:hover { color: #8a2828; }

        .drag-label {
          font-size: 11px; font-weight: 700; letter-spacing: 2px;
          text-transform: uppercase; color: #111;
        }
        .drag-label span { color: #8a2828; }

        /* ===== DESKTOP GRID — fills remaining space ===== */
        .landing-grid {
          flex: 1; display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 1fr auto;
          padding: 0 40px;
          min-height: 0; /* allow grid to shrink */
        }

        /* top-left: tagline */
        .cell-tagline {
          display: flex; flex-direction: column;
          justify-content: flex-start; padding-top: 20px;
        }

        /* top-right: title + photo */
        .cell-title {
          display: flex; flex-direction: column;
          align-items: flex-end;
          min-height: 0; overflow: hidden;
        }

        .hero-title {
          font-size: clamp(44px, 6.5vw, 100px);
          font-weight: 900; line-height: 0.92; letter-spacing: -3px;
          text-transform: uppercase; text-align: right; color: #111;
          flex-shrink: 0;
        }

        .photo-container { margin-top: 16px; position: relative; flex-shrink: 1; min-height: 0; }

        .photo-wrapper {
          width: clamp(240px, 28vw, 420px);
          height: clamp(160px, 22vh, 300px);
          overflow: hidden; position: relative;
          border: 3px solid #111;
        }

        /* bottom-left: name */
        .cell-name {
          display: flex; align-items: flex-end;
          padding-bottom: 0;
        }  

        .hero-name {
          font-size: clamp(36px, 5.5vw, 85px);
          font-weight: 900; line-height: 0.92; letter-spacing: -3px;
          text-transform: uppercase; color: #111;
        }

        /* bottom-right: bio */
         .cell-bio {
         display: flex; align-items: flex-end;
         justify-content: flex-end; gap: 16px;
        padding-bottom: 0;
        }

        /* ===== FOOTER — pinned bottom ===== */
        .landing-footer {
          display: flex; justify-content: space-between; align-items: center;
          padding: 16px 40px; flex-shrink: 0;
          border-top: 1px solid #e0e0d8;
          font-size: 12px; color: #888; font-weight: 400;
        }

        /* ===== MOBILE MENU OVERLAY ===== */
        .menu-overlay {
          position: fixed; inset: 0; background: #000; z-index: 200;
          display: flex; flex-direction: column;
          opacity: 0; pointer-events: none;
          transition: opacity 0.4s ease;
        }
        .menu-overlay.open { opacity: 1; pointer-events: all; }

        .menu-overlay-nav {
          display: flex; justify-content: space-between; align-items: center;
          padding: 24px 20px;
        }

        .menu-overlay-links {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 32px;
        }

        .menu-overlay-link {
          font-size: clamp(40px, 12vw, 72px);
          font-weight: 900; color: #8a2828; text-transform: uppercase;
          cursor: pointer; transition: opacity 0.3s;
          letter-spacing: -1px;
        }
        .menu-overlay-link:hover { opacity: 0.7; }

        .menu-overlay-footer {
          display: flex; justify-content: space-between; align-items: flex-end;
          padding: 24px 20px;
        }

        /* ===== MOBILE LANDING LAYOUT ===== */
        .mobile-landing { display: none; }

        /* ===== TABLET ===== */
        @media (max-width: 1024px) {
          .site-nav { padding: 20px 28px; }
          .landing-grid { padding: 0 28px; }
          .hero-title { font-size: clamp(36px, 5.5vw, 72px); }
          .hero-name { font-size: clamp(32px, 5vw, 64px); }
          .photo-wrapper {
            width: clamp(200px, 30vw, 320px);
            height: clamp(120px, 18vw, 200px);
          }
          .landing-footer { padding: 14px 28px; }
        }

        /* ===== MOBILE (<768px) ===== */
        @media (max-width: 768px) {
          .desktop-nav-center { display: none; }
          .desktop-nav-right { display: none; }
          .mobile-menu-btn {
            display: block; font-size: 14px; font-weight: 600;
            color: #111; cursor: pointer; letter-spacing: 0.5px;
            font-style: italic;
          }
          .site-nav { padding: 20px 20px; }

          /* hide desktop grid, show mobile layout */
          .landing-grid { display: none; }
          .mobile-landing {
            display: flex; flex-direction: column;
            flex: 1; padding: 0 20px;
            min-height: 0;
          }

          .landing-footer { padding: 14px 20px; }
        }
      `}</style>

      {/* ===== INTRO ANIMATION ===== */}
      {phase === "intro" && (
        <div
          onClick={skipIntro}
          style={{
            position: "fixed",
            inset: 0,
            background: "#000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            cursor: "pointer",
            opacity: introFade ? 0 : 1,
            transition: "opacity 0.6s ease",
          }}
        >
          {introWords.map((word, i) => (
            <div
              key={word.text}
              style={{
                position: "absolute",
                color: word.color,
                fontSize: "clamp(52px, 11vw, 140px)",
                fontWeight: 900,
                letterSpacing: "-3px",
                textTransform: "uppercase",
                opacity: currentWord === i && wordVisible ? 1 : 0,
                transform:
                  currentWord === i && wordVisible
                    ? "translateY(0) scale(1)"
                    : "translateY(25px) scale(0.96)",
                transition:
                  "opacity 0.3s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1)",
              }}
            >
              {word.text}
            </div>
          ))}
          <div
            style={{
              position: "absolute",
              bottom: 40,
              color: "#333",
              fontSize: 11,
              letterSpacing: 3,
              textTransform: "uppercase",
              opacity: currentWord >= 0 ? 1 : 0,
              transition: "opacity 0.5s",
            }}
          >
            tap to skip
          </div>
        </div>
      )}

      {/* ===== MOBILE MENU OVERLAY ===== */}
      <div className={`menu-overlay ${menuOpen ? "open" : ""}`}>
        <div className="menu-overlay-nav">
          <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>
            Iynk
          </div>
          <div
            onClick={() => setMenuOpen(false)}
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#fff",
              cursor: "pointer",
              fontStyle: "italic",
            }}
          >
            Close
          </div>
        </div>
        <div className="menu-overlay-links">
          {navLinks.map((link, i) => (
            <div
              key={link}
              style={{ position: "relative", textAlign: "center" }}
            >
              {i === 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: -6,
                    left: -20,
                    fontSize: 9,
                    color: "#fff",
                    fontWeight: 400,
                    letterSpacing: 1,
                  }}
                >
                  intro
                </span>
              )}
              <div
                className="menu-overlay-link"
                onClick={() => setMenuOpen(false)}
              >
                {link}
              </div>
            </div>
          ))}
        </div>
        <div className="menu-overlay-footer">
          <div>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>
              iynguuuuu2002@gmail.com
            </div>
            <div style={{ fontSize: 12, color: "#888" }}>+94 77 349 6679</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: 12,
                color: "#fff",
                marginBottom: 4,
                cursor: "pointer",
              }}
            >
              Github
            </div>
            <div style={{ fontSize: 12, color: "#fff", cursor: "pointer" }}>
              LinkedIn
            </div>
          </div>
        </div>
      </div>

      {/* ===== LANDING PAGE ===== */}
      {phase === "main" && (
        <div
          className="landing-shell"
          style={{
            opacity: landingReady ? 1 : 0,
            transition: "opacity 0.5s ease",
          }}
        >
          {/* --- NAV --- */}
          <nav className={`site-nav fade-up ${s(1) ? "show" : ""}`}>
            <div className="nav-logo">Iynk</div>
            <div className="desktop-nav-center">
              {["Works", "About", "Contact"].map((l, i) => (
                <span key={l}>
                  <span className="nav-link">{l}</span>
                  {i < 2 && (
                    <span style={{ color: "#bbb", margin: "0 4px" }}>,</span>
                  )}
                </span>
              ))}
            </div>
            <div className="desktop-nav-right">
              {["Github", "LinkedIn", "Email"].map((l) => (
                <span key={l} className="social-link">
                  {l}
                </span>
              ))}
            </div>
            <div className="mobile-menu-btn" onClick={() => setMenuOpen(true)}>
              Menu
            </div>
          </nav>

          {/* --- DESKTOP GRID --- */}
          <div className="landing-grid">
            {/* top-left */}
            <div className={`cell-tagline fade-up ${s(2) ? "show" : ""}`}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 400,
                  color: "#888",
                  marginBottom: 6,
                }}
              >
                01/
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#111",
                  lineHeight: 1.5,
                  maxWidth: 160,
                }}
              >
                From Sri Lanka
                <br />
                with Love
              </div>
            </div>

            {/* top-right */}
            <div className="cell-title">
              <div className={`hero-title fade-up ${s(2) ? "show" : ""}`}>
                SOFTWARE
                <br />
                ENGINEER
              </div>
              <div className={`photo-container fade-up ${s(3) ? "show" : ""}`}>
                <div className="drag-label" style={{ marginBottom: 6 }}>
                  DR<span>A</span>G ME
                </div>
                <div
                  ref={imgRef}
                  onPointerDown={onPointerDown}
                  className="photo-wrapper"
                  style={{
                    cursor: drag.dragging ? "grabbing" : "grab",
                    transform: `translate(${drag.x}px, ${drag.y}px)`,
                    transition: drag.dragging
                      ? "none"
                      : "transform 0.4s cubic-bezier(0.16,1,0.3,1)",
                    userSelect: "none",
                    touchAction: "none",
                  }}
                >
                  <Image
                    src="/iynk.jpg"
                    alt="Iynkaran Pavanantham"
                    fill
                    style={{
                      objectFit: "cover",
                      objectPosition: "center top",
                    }}
                    priority
                    draggable={false}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      pointerEvents: "none",
                      background:
                        "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* bottom-left */}
            <div className={`cell-name fade-up ${s(4) ? "show" : ""}`}>
              <div className="hero-name">
                IYNKARAN
                <br />
                PAVANANTHAM
              </div>
            </div>

            {/* bottom-right */}
            <div className={`cell-bio fade-up ${s(5) ? "show" : ""}`}>
              <span
                style={{
                  fontSize: 28,
                  color: "#8a2828",
                  display: "inline-block",
                }}
              >
                →
              </span>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#333",
                  lineHeight: 1.7,
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                  maxWidth: 300,
                }}
              >
                Based in Colombo, Sri Lanka.
                <br />
                Passionate in Web, Mobile
                <br />& AI-Driven Systems.
              </div>
            </div>
          </div>

          {/* --- MOBILE LAYOUT --- */}
          <div className="mobile-landing">
            {/* Tagline row */}
            <div
              className={`fade-up ${s(2) ? "show" : ""}`}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                paddingTop: 12,
              }}
            >
              <div style={{ fontSize: 13, color: "#888", fontWeight: 400 }}>
                01/
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#111",
                  lineHeight: 1.5,
                }}
              >
                From Sri Lanka
                <br />
                with Love
              </div>
            </div>

            {/* Name */}
            <div
              className={`fade-up ${s(3) ? "show" : ""}`}
              style={{ paddingTop: 16 }}
            >
              <div
                style={{
                  fontSize: "clamp(32px, 10vw, 52px)",
                  fontWeight: 900,
                  lineHeight: 0.92,
                  letterSpacing: "-2px",
                  textTransform: "uppercase",
                  color: "#111",
                }}
              >
                IYNKARAN
                <br />
                PAVANANTHAM
              </div>
            </div>

            {/* Photo — fills available space */}
            <div
              className={`fade-up ${s(3) ? "show" : ""}`}
              style={{
                flex: 1,
                marginTop: 16,
                position: "relative",
                minHeight: 0,
                border: "3px solid #111",
                overflow: "hidden",
              }}
            >
              <Image
                src="/iynk.jpg"
                alt="Iynkaran Pavanantham"
                fill
                style={{ objectFit: "cover", objectPosition: "center top" }}
                priority
                draggable={false}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                  background:
                    "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
                }}
              />
            </div>

            {/* Bottom row: bio left, title right */}
            <div
              className={`fade-up ${s(4) ? "show" : ""}`}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                paddingTop: 16,
                paddingBottom: 8,
                gap: 12,
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: "#555",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  lineHeight: 1.6,
                  maxWidth: 100,
                }}
              >
                Colombo, Sri Lanka ·
                <br />
                Web, Mobile & AI
              </div>
              <div
                style={{
                  fontSize: "clamp(32px, 10vw, 52px)",
                  fontWeight: 900,
                  lineHeight: 0.88,
                  letterSpacing: "-2px",
                  textTransform: "uppercase",
                  color: "#111",
                  textAlign: "right",
                }}
              >
                SOFTWARE
                <br />
                ENGINEER
              </div>
            </div>
          </div>

          {/* --- FOOTER --- */}
          <div className={`landing-footer fade-up ${s(6) ? "show" : ""}`}>
            <span>© 2026 Portfolio</span>
            <span>
              Design & code by{" "}
              <span style={{ color: "#111", fontWeight: 600 }}>Iynk</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
