import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

const customStyles = {
  root: {
    '--primary': '#4F46E5',
    '--secondary': '#FF6B6B',
    '--accent': '#51CF66',
    '--neutral-dark': '#1E293B',
    '--neutral-light': '#F8FAFC',
    '--bg-color': '#FAFBFC',
    '--white': '#FFFFFF',
    '--radius-sm': '8px',
    '--radius-md': '16px',
    '--radius-lg': '24px',
    '--radius-pill': '999px',
    '--shadow-subtle': '0 4px 20px -2px rgba(30, 41, 59, 0.05)',
    '--shadow-hover': '0 20px 40px -4px rgba(79, 70, 229, 0.12)',
    '--shadow-float': '0 12px 32px rgba(0, 0, 0, 0.08)',
    '--border-light': '1px solid #E2E8F0',
    '--border-thick': '2px solid #E2E8F0',
    '--border-active': '2px solid var(--primary)',
    '--spacing-unit': '8px',
    '--container-width': '1200px'
  },
  body: {
    fontFamily: "'Inter', sans-serif",
    backgroundColor: 'var(--bg-color)',
    color: 'var(--neutral-dark)',
    lineHeight: 1.6,
    overflowX: 'hidden',
    margin: 0,
    padding: 0,
    WebkitFontSmoothing: 'antialiased'
  },
  hero: {
    paddingTop: '80px',
    paddingBottom: '140px',
    position: 'relative',
    overflow: 'hidden'
  },
  heroBlobAnimation: {
    animation: 'blob-float 10s infinite alternate ease-in-out'
  },
  mockupWindow: {
    transform: 'rotateY(-10deg) rotateX(5deg)',
    transition: 'transform 0.5s ease'
  },
  mockupWindowHover: {
    transform: 'rotateY(0) rotateX(0)'
  },
  floatingIcon: {
    animation: 'bounce 3s infinite ease-in-out'
  },
  problemCardRotate1: {
    transform: 'rotate(-2deg)'
  },
  problemCardRotate2: {
    transform: 'rotate(1deg)',
    zIndex: 2
  },
  problemCardRotate3: {
    transform: 'rotate(2deg)'
  },
  timelineLine: {
    content: "''",
    position: 'absolute',
    top: '40px',
    left: '50px',
    right: '50px',
    height: '2px',
    background: 'linear-gradient(90deg, var(--primary) 0%, var(--secondary) 50%, var(--accent) 100%)',
    zIndex: 0,
    opacity: 0.3
  },
  ctaGradient: {
    background: 'linear-gradient(135deg, var(--primary) 0%, #4338CA 100%)'
  }
};

const Button = ({ children, onClick, variant = 'primary', style, ...props }) => {
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    borderRadius: 'var(--radius-pill)',
    fontWeight: 600,
    transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
    cursor: 'pointer',
    border: 'none'
  };

  const variants = {
    primary: {
      backgroundColor: 'var(--primary)',
      color: 'white',
      boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--neutral-dark)'
    },
    white: {
      background: 'white',
      color: 'var(--primary)',
      padding: '16px 48px',
      fontSize: '18px'
    }
  };

  const [isHovered, setIsHovered] = useState(false);

  const hoverStyles = {
    primary: {
      transform: 'translateY(-2px) scale(1.02)',
      boxShadow: '0 8px 16px rgba(79, 70, 229, 0.35)'
    },
    ghost: {
      background: 'rgba(0,0,0,0.03)'
    },
    white: {
      background: '#F8FAFC',
      boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
    }
  };

  return (
    <button
      style={{
        ...baseStyle,
        ...variants[variant],
        ...(isHovered ? hoverStyles[variant] : {}),
        ...style
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

const Header = () => {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(250, 251, 252, 0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: 'var(--border-light)',
      padding: '20px 0'
    }}>
      <div className="container" style={{
        maxWidth: 'var(--container-width)',
        margin: '0 auto',
        padding: '0 24px'
      }}>
        <nav style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Link to="/" className="logo" style={{
            fontSize: '24px',
            fontWeight: 800,
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none'
          }}>
            <i className="ph-fill ph-circles-three-plus" style={{ fontSize: '32px' }}></i>
            HireKit
          </Link>
          <div style={{ display: 'flex', gap: '32px' }}>
            <a href="#" style={{ fontWeight: 500, color: 'var(--neutral-dark)', textDecoration: 'none' }}>Product</a>
            <a href="#" style={{ fontWeight: 500, color: 'var(--neutral-dark)', textDecoration: 'none' }}>Pricing</a>
            <a href="#" style={{ fontWeight: 500, color: 'var(--neutral-dark)', textDecoration: 'none' }}>Docs</a>
            <a href="#" style={{ fontWeight: 500, color: 'var(--neutral-dark)', textDecoration: 'none' }}>Login</a>
          </div>
          <Button variant="primary">
            Start free trial <i className="ph-bold ph-arrow-right"></i>
          </Button>
        </nav>
      </div>
    </header>
  );
};

const Hero = () => {
  const [windowHovered, setWindowHovered] = useState(false);

  return (
    <section style={customStyles.hero}>
      <div className="container" style={{
        maxWidth: 'var(--container-width)',
        margin: '0 auto',
        padding: '0 24px',
        position: 'relative',
        zIndex: 2
      }}>
        <div className="blob" style={{
          position: 'absolute',
          filter: 'blur(80px)',
          zIndex: 0,
          opacity: 0.6,
          top: '-100px',
          right: '-100px',
          width: '600px',
          height: '600px',
          background: '#E0E7FF',
          borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%',
          ...customStyles.heroBlobAnimation
        }}></div>
        <div className="blob" style={{
          position: 'absolute',
          filter: 'blur(80px)',
          zIndex: 0,
          opacity: 0.6,
          bottom: '50px',
          left: '-100px',
          width: '400px',
          height: '400px',
          background: '#FFE4E6',
          borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
          ...customStyles.heroBlobAnimation
        }}></div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '64px',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{ fontSize: '64px', marginBottom: '24px', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Stop sorting CVs. Start hiring faster.
            </h1>
            <p style={{ fontSize: '20px', marginBottom: '40px', maxWidth: '500px', color: '#64748B' }}>
              Embed our powerful CV builder directly into your career portal. Give candidates a beautiful experience and get structured data instantly.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <Button variant="primary">Start free trial</Button>
              <Button variant="ghost">
                <i className="ph-fill ph-play-circle"></i> Watch demo
              </Button>
            </div>
          </div>
          
          <div style={{ position: 'relative', perspective: '1000px' }}>
            <div style={{
              position: 'absolute',
              background: 'white',
              padding: '16px',
              borderRadius: '20px',
              boxShadow: 'var(--shadow-subtle)',
              fontSize: '32px',
              top: '-20px',
              left: '-20px',
              ...customStyles.floatingIcon
            }}>
              <i className="ph-duotone ph-file-text" style={{ color: 'var(--primary)' }}></i>
            </div>
            <div style={{
              position: 'absolute',
              background: 'white',
              padding: '16px',
              borderRadius: '20px',
              boxShadow: 'var(--shadow-subtle)',
              fontSize: '32px',
              bottom: '40px',
              right: '-30px',
              animation: 'bounce 3s infinite ease-in-out',
              animationDelay: '1.5s'
            }}>
              <i className="ph-duotone ph-check-circle" style={{ color: 'var(--accent)' }}></i>
            </div>

            <div
              style={{
                background: 'white',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-float)',
                border: 'var(--border-light)',
                overflow: 'hidden',
                width: '100%',
                height: '450px',
                position: 'relative',
                ...(windowHovered ? customStyles.mockupWindowHover : customStyles.mockupWindow)
              }}
              onMouseEnter={() => setWindowHovered(true)}
              onMouseLeave={() => setWindowHovered(false)}
            >
              <div style={{
                height: '40px',
                background: '#F1F5F9',
                display: 'flex',
                alignItems: 'center',
                padding: '0 16px',
                gap: '8px',
                borderBottom: 'var(--border-light)'
              }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444' }}></div>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F59E0B' }}></div>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981' }}></div>
              </div>
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ width: '40%', height: '24px', background: '#E2E8F0', borderRadius: '4px' }}></div>
                  <div style={{ width: '32px', height: '32px', background: '#E2E8F0', borderRadius: '50%' }}></div>
                </div>
                <div style={{ width: '100%', height: '12px', background: '#F1F5F9', borderRadius: '4px' }}></div>
                <div style={{ width: '70%', height: '12px', background: '#F1F5F9', borderRadius: '4px' }}></div>
                
                <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                  <div style={{
                    flex: 1,
                    height: '120px',
                    background: '#F8FAFC',
                    border: '2px dashed #CBD5E1',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#94A3B8'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <i className="ph-bold ph-users" style={{ fontSize: '24px', marginBottom: '8px' }}></i>
                      <div style={{ fontSize: '12px', fontWeight: 600 }}>Candidates</div>
                    </div>
                  </div>
                  <div style={{
                    flex: 1,
                    height: '120px',
                    background: '#F8FAFC',
                    border: '2px dashed #CBD5E1',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#94A3B8'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <i className="ph-bold ph-chart-bar" style={{ fontSize: '24px', marginBottom: '8px' }}></i>
                      <div style={{ fontSize: '12px', fontWeight: 600 }}>Analytics</div>
                    </div>
                  </div>
                </div>
                
                <div style={{
                  background: '#F1F5F9',
                  borderRadius: '8px',
                  padding: '12px',
                  marginTop: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{ width: '40px', height: '40px', background: 'white', borderRadius: '50%' }}></div>
                  <div>
                    <div style={{ width: '120px', height: '8px', background: '#CBD5E1', borderRadius: '4px', marginBottom: '4px' }}></div>
                    <div style={{ width: '80px', height: '8px', background: '#E2E8F0', borderRadius: '4px' }}></div>
                  </div>
                  <div style={{ marginLeft: 'auto', width: '24px', height: '24px', background: '#4F46E5', borderRadius: '4px' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ProblemCard = ({ icon, title, description, iconBg, iconColor, rotate }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        background: 'white',
        padding: '32px',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-subtle)',
        transition: 'all 0.3s ease',
        position: 'relative',
        border: 'var(--border-light)',
        transform: isHovered ? 'translateY(-10px) rotate(0)' : rotate,
        zIndex: isHovered ? 10 : 1
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '32px',
        marginBottom: '24px',
        background: iconBg,
        color: iconColor
      }}>
        <i className={icon}></i>
      </div>
      <h3 style={{ fontWeight: 700 }}>{title}</h3>
      <p style={{ fontSize: '16px', marginTop: '12px', color: '#64748B' }}>{description}</p>
    </div>
  );
};

const ProblemsSection = () => {
  return (
    <section style={{ padding: '40px 0 120px 0' }}>
      <div className="container" style={{
        maxWidth: 'var(--container-width)',
        margin: '0 auto',
        padding: '0 24px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '32px'
        }}>
          <ProblemCard
            icon="ph-fill ph-file-x"
            title="PDF Chaos"
            description="Parsing unstructured PDFs is a nightmare. Missing data and broken formatting kill productivity."
            iconBg="#FEE2E2"
            iconColor="var(--secondary)"
            rotate="rotate(-2deg)"
          />
          <ProblemCard
            icon="ph-fill ph-envelope-open"
            title="Inbox Overflow"
            description="Email attachments get lost. Keeping track of versions across threads is impossible."
            iconBg="#E0E7FF"
            iconColor="var(--primary)"
            rotate="rotate(1deg)"
          />
          <ProblemCard
            icon="ph-fill ph-mask-sad"
            title="Bad UX"
            description="Clunky forms drive top talent away. Candidates hate re-typing their resume 50 times."
            iconBg="#DCFCE7"
            iconColor="var(--accent)"
            rotate="rotate(2deg)"
          />
        </div>
      </div>
    </section>
  );
};

const SolutionSection = () => {
  return (
    <section style={{ padding: '120px 0', background: 'white' }}>
      <div className="container" style={{
        maxWidth: 'var(--container-width)',
        margin: '0 auto',
        padding: '0 24px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '64px',
          alignItems: 'center'
        }}>
          <div>
            <span style={{
              color: 'var(--primary)',
              fontWeight: 700,
              textTransform: 'uppercase',
              fontSize: '14px',
              letterSpacing: '1px'
            }}>The Solution</span>
            <h2 style={{ fontSize: '40px', marginTop: '16px', marginBottom: '24px', fontWeight: 700 }}>
              Just 5 lines of code.
            </h2>
            <p style={{ color: '#64748B', fontSize: '1.125rem' }}>
              Copy our embed snippet, drop it into your existing React, Vue, or HTML page, and instantly get a full-featured CV builder. It matches your brand automatically.
            </p>
            
            <ul style={{ marginTop: '32px', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <li style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <i className="ph-fill ph-check-circle" style={{ color: 'var(--accent)', fontSize: '24px' }}></i>
                <span style={{ fontWeight: 500 }}>Matches your CSS variables automatically</span>
              </li>
              <li style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <i className="ph-fill ph-check-circle" style={{ color: 'var(--accent)', fontSize: '24px' }}></i>
                <span style={{ fontWeight: 500 }}>Export to JSON or PDF</span>
              </li>
              <li style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <i className="ph-fill ph-check-circle" style={{ color: 'var(--accent)', fontSize: '24px' }}></i>
                <span style={{ fontWeight: 500 }}>Mobile responsive out of the box</span>
              </li>
            </ul>
          </div>
          
          <div style={{
            background: '#1E293B',
            borderRadius: 'var(--radius-md)',
            padding: '24px',
            fontFamily: "'Courier New', monospace",
            color: '#A5B4FC',
            fontSize: '14px',
            boxShadow: 'var(--shadow-float)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', opacity: 0.5 }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444' }}></div>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F59E0B' }}></div>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }}></div>
            </div>
            <code style={{ display: 'block', marginBottom: '8px' }}>
              <span style={{ color: '#F472B6' }}>&lt;script</span> <span style={{ color: '#C084FC' }}>src</span>=<span style={{ color: '#51CF66' }}>"https://cdn.hirekit.io/v2.js"</span><span style={{ color: '#F472B6' }}>&gt;&lt;/script&gt;</span>
            </code>
            <code style={{ display: 'block', marginBottom: '8px' }}></code>
            <code style={{ display: 'block', marginBottom: '8px' }}>
              <span style={{ color: '#F472B6' }}>&lt;hire-kit-builder</span>
            </code>
            <code style={{ display: 'block', marginBottom: '8px' }}>
              {'  '}<span style={{ color: '#C084FC' }}>api-key</span>=<span style={{ color: '#51CF66' }}>"hk_live_5928..."</span>
            </code>
            <code style={{ display: 'block', marginBottom: '8px' }}>
              {'  '}<span style={{ color: '#C084FC' }}>theme</span>=<span style={{ color: '#51CF66' }}>"system"</span>
            </code>
            <code style={{ display: 'block', marginBottom: '8px' }}>
              {'  '}<span style={{ color: '#C084FC' }}>on-submit</span>=<span style={{ color: '#51CF66' }}>"handleSubmission"</span>
            </code>
            <code style={{ display: 'block', marginBottom: '8px' }}>
              <span style={{ color: '#F472B6' }}/&gt;</span>
            </code>
          </div>
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon, title, description, color }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        background: isHovered ? 'white' : 'var(--bg-color)',
        padding: '32px',
        borderRadius: 'var(--radius-md)',
        border: isHovered ? '1px solid #E2E8F0' : '1px solid transparent',
        transition: 'all 0.3s ease',
        transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
        boxShadow: isHovered ? 'var(--shadow-hover)' : 'none'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <i className={icon} style={{ fontSize: '40px', color }}></i>
      <h3 style={{ margin: '16px 0 8px', fontWeight: 700 }}>{title}</h3>
      <p style={{ fontSize: '16px', color: '#64748B' }}>{description}</p>
    </div>
  );
};

const FeaturesSection = () => {
  return (
    <section style={{ padding: '120px 0' }}>
      <div className="container" style={{
        maxWidth: 'var(--container-width)',
        margin: '0 auto',
        padding: '0 24px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 style={{ fontWeight: 700, fontSize: '40px' }}>Everything you need to hire</h2>
          <p style={{ marginTop: '16px', color: '#64748B', fontSize: '1.125rem' }}>More than just a form builder.</p>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '32px'
        }}>
          <FeatureCard
            icon="ph-duotone ph-paint-brush-broad"
            title="Theme Editor"
            description="Customize fonts, colors, and border radii to match your design system perfectly."
            color="var(--secondary)"
          />
          <FeatureCard
            icon="ph-duotone ph-database"
            title="Structured Data"
            description="Don't guess. Get clean JSON objects for every applicant: work history, skills, education."
            color="var(--primary)"
          />
          <FeatureCard
            icon="ph-duotone ph-translate"
            title="Multi-language"
            description="Auto-detects user locale and translates the interface into 30+ languages."
            color="var(--accent)"
          />
          <FeatureCard
            icon="ph-duotone ph-cloud-arrow-up"
            title="Webhook Sync"
            description="Send data instantly to Slack, Notion, Airtable, or your internal ATS."
            color="#F59E0B"
          />
          <FeatureCard
            icon="ph-duotone ph-magic-wand"
            title="AI Assistant"
            description="Built-in writing helper suggests improvements to candidates as they type."
            color="#8B5CF6"
          />
          <FeatureCard
            icon="ph-duotone ph-lock-key"
            title="GDPR Compliant"
            description="We handle the data privacy heavy lifting so you don't have to worry about it."
            color="#EC4899"
          />
        </div>
      </div>
    </section>
  );
};

const HowItWorksSection = () => {
  return (
    <section style={{ padding: '120px 0', background: 'white' }}>
      <div className="container" style={{
        maxWidth: 'var(--container-width)',
        margin: '0 auto',
        padding: '0 24px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontWeight: 700, fontSize: '40px' }}>How it works</h2>
        </div>
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          position: 'relative',
          marginTop: '64px'
        }}>
          <div style={{
            position: 'absolute',
            top: '40px',
            left: '50px',
            right: '50px',
            height: '2px',
            background: 'linear-gradient(90deg, var(--primary) 0%, var(--secondary) 50%, var(--accent) 100%)',
            zIndex: 0,
            opacity: 0.3
          }}></div>
          
          <div style={{
            position: 'relative',
            zIndex: 1,
            background: 'var(--bg-color)',
            padding: '16px',
            width: '30%',
            textAlign: 'center'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'white',
              border: '2px solid var(--primary)',
              color: 'var(--primary)',
              fontWeight: 700,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              fontSize: '20px'
            }}>1</div>
            <i className="ph-duotone ph-code" style={{ fontSize: '48px', color: 'var(--neutral-dark)', marginBottom: '16px' }}></i>
            <h3 style={{ fontWeight: 700 }}>Embed Widget</h3>
            <p style={{ fontSize: '15px', color: '#64748B' }}>Add the Javascript snippet to your career page.</p>
          </div>
          
          <div style={{
            position: 'relative',
            zIndex: 1,
            background: 'var(--bg-color)',
            padding: '16px',
            width: '30%',
            textAlign: 'center'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'white',
              border: '2px solid var(--primary)',
              color: 'var(--primary)',
              fontWeight: 700,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              fontSize: '20px'
            }}>2</div>
            <i className="ph-duotone ph-sliders-horizontal" style={{ fontSize: '48px', color: 'var(--neutral-dark)', marginBottom: '16px' }}></i>
            <h3 style={{ fontWeight: 700 }}>Configure</h3>
            <p style={{ fontSize: '15px', color: '#64748B' }}>Set your required fields and branding in our dashboard.</p>
          </div>
          
          <div style={{
            position: 'relative',
            zIndex: 1,
            background: 'var(--bg-color)',
            padding: '16px',
            width: '30%',
            textAlign: 'center'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'white',
              border: '2px solid var(--primary)',
              color: 'var(--primary)',
              fontWeight: 700,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              fontSize: '20px'
            }}>3</div>
            <i className="ph-duotone ph-paper-plane-tilt" style={{ fontSize: '48px', color: 'var(--neutral-dark)', marginBottom: '16px' }}></i>
            <h3 style={{ fontWeight: 700 }}>Receive CVs</h3>
            <p style={{ fontSize: '15px', color: '#64748B' }}>Candidates apply and data flows into your database.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const PricingCard = ({ title, price, description, features, variant = 'default', popular }) => {
  const [isHovered, setIsHovered] = useState(false);

  const variants = {
    default: {
      background: 'white',
      color: 'var(--neutral-dark)',
      border: 'var(--border-light)'
    },
    popular: {
      background: '#F0FDF4',
      color: 'var(--neutral-dark)',
      border: '2px solid var(--accent)'
    },
    dark: {
      background: 'var(--neutral-dark)',
      color: 'white',
      border: 'none'
    }
  };

  return (
    <div
      style={{
        ...variants[variant],
        borderRadius: 'var(--radius-md)',
        padding: '40px',
        transition: 'all 0.3s',
        position: 'relative',
        transform: isHovered ? 'scale(1.02)' : 'scale(1)',
        boxShadow: isHovered ? 'var(--shadow-hover)' : 'none'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {popular && (
        <div style={{
          position: 'absolute',
          top: '-12px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--accent)',
          color: 'white',
          padding: '4px 12px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: 700
        }}>MOST POPULAR</div>
      )}
      <h3 style={{ fontWeight: 700, color: variant === 'dark' ? 'white' : 'inherit' }}>{title}</h3>
      <div style={{ fontSize: '48px', fontWeight: 800, margin: '24px 0' }}>
        {price}
        <span style={{ fontSize: '18px', color: variant === 'dark' ? '#94A3B8' : '#64748B', fontWeight: 500 }}>/mo</span>
      </div>
      <p style={{ fontSize: '15px', color: variant === 'dark' ? '#94A3B8' : '#64748B' }}>{description}</p>
      <ul style={{ listStyle: 'none', margin: '32px 0' }}>
        {features.map((feature, idx) => (
          <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <i className="ph-bold ph-check" style={{ color: variant === 'dark' ? 'white' : 'var(--accent)', fontSize: '20px' }}></i>
            <span style={{ color: variant === 'dark' ? 'white' : 'inherit' }}>{feature}</span>
          </li>
        ))}
      </ul>
      <Button
        variant={variant === 'dark' ? 'white' : (popular ? 'primary' : 'ghost')}
        style={{ width: '100%', ...(variant === 'default' && !popular ? { border: '1px solid #E2E8F0' } : {}) }}
      >
        {variant === 'dark' ? 'Contact Sales' : (popular ? 'Start Free Trial' : 'Get Started')}
      </Button>
    </div>
  );
};

const PricingSection = () => {
  return (
    <section style={{ padding: '120px 0' }}>
      <div className="container" style={{
        maxWidth: 'var(--container-width)',
        margin: '0 auto',
        padding: '0 24px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 style={{ fontWeight: 700, fontSize: '40px' }}>Simple pricing</h2>
          <p style={{ color: '#64748B', fontSize: '1.125rem' }}>No per-user fees. Just flat monthly rates.</p>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '32px'
        }}>
          <PricingCard
            title="Starter"
            price="$29"
            description="For small startups hiring occasionally."
            features={[
              '50 Applications/mo',
              'Standard Theme',
              'Email Support'
            ]}
            variant="default"
          />
          
          <PricingCard
            title="Professional"
            price="$79"
            description="For growing teams scaling up."
            features={[
              'Unlimited Applications',
              'Full Customization',
              'Webhooks & API',
              'Remove Branding'
            ]}
            variant="popular"
            popular
          />
          
          <PricingCard
            title="Enterprise"
            price="$299"
            description="For high-volume recruiting agencies."
            features={[
              'Multiple Organizations',
              'SSO / SAML',
              'Dedicated Manager',
              'SLA Guarantee'
            ]}
            variant="dark"
          />
        </div>
      </div>
    </section>
  );
};

const TestimonialSection = () => {
  return (
    <section style={{ padding: '0 0 120px 0' }}>
      <div className="container" style={{
        maxWidth: 'var(--container-width)',
        margin: '0 auto',
        padding: '0 24px'
      }}>
        <div style={{
          background: 'white',
          padding: '48px',
          borderRadius: '32px',
          textAlign: 'center',
          maxWidth: '800px',
          margin: '0 auto',
          border: 'var(--border-light)',
          position: 'relative'
        }}>
          <i className="ph-fill ph-quotes-fill" style={{ fontSize: '48px', color: '#E2E8F0', marginBottom: '24px' }}></i>
          <p style={{
            fontSize: '24px',
            color: 'var(--neutral-dark)',
            fontWeight: 500,
            marginBottom: '32px'
          }}>
            "HireKit completely changed how we handle engineering applications. The structured JSON data means we can filter by 'React' or 'Python' instantly, without reading 500 PDFs."
          </p>
          <img
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200"
            alt="Sarah Chen"
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              objectFit: 'cover',
              marginBottom: '16px',
              border: '2px solid white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          />
          <div style={{ fontWeight: 700 }}>Sarah Chen</div>
          <div style={{ color: '#64748B', fontSize: '14px' }}>CTO, TechFlow</div>
        </div>
      </div>
    </section>
  );
};

const CTASection = () => {
  return (
    <div className="container" style={{
      maxWidth: 'var(--container-width)',
      margin: '0 auto',
      padding: '0 24px'
    }}>
      <section style={{
        background: 'linear-gradient(135deg, var(--primary) 0%, #4338CA 100%)',
        color: 'white',
        textAlign: 'center',
        borderRadius: '32px',
        padding: '80px 24px',
        marginBottom: '40px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="blob" style={{
          position: 'absolute',
          filter: 'blur(80px)',
          background: 'white',
          top: '-50px',
          left: '-50px',
          width: '300px',
          height: '300px',
          opacity: 0.1
        }}></div>
        <div className="blob" style={{
          position: 'absolute',
          filter: 'blur(80px)',
          background: 'var(--accent)',
          bottom: '-50px',
          right: '-50px',
          width: '300px',
          height: '300px',
          opacity: 0.2
        }}></div>
        
        <h2 style={{
          fontSize: '48px',
          marginBottom: '24px',
          position: 'relative',
          zIndex: 2,
          fontWeight: 700
        }}>Ready to streamline hiring?</h2>
        <p style={{
          color: '#E0E7FF',
          zIndex: 2,
          position: 'relative',
          marginBottom: '32px',
          fontSize: '1.125rem'
        }}>Join 2,000+ companies using HireKit today.</p>
        <Button variant="white">Get Started for Free</Button>
      </section>
    </div>
  );
};

const HomePage = () => {
  return (
    <>
      <Hero />
      <ProblemsSection />
      <SolutionSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <TestimonialSection />
      <CTASection />
    </>
  );
};

const App = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
      
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        -webkit-font-smoothing: antialiased;
      }
      
      @keyframes blob-float {
        0% { transform: translate(0, 0) scale(1); }
        100% { transform: translate(20px, -20px) scale(1.1); }
      }
      
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-15px); }
      }
      
      h1, h2, h3, h4 {
        font-weight: 700;
        letter-spacing: -0.02em;
        line-height: 1.2;
      }
      
      p {
        color: #64748B;
        font-size: 1.125rem;
      }
      
      a {
        text-decoration: none;
        color: inherit;
      }
      
      @media (max-width: 900px) {
        .grid-3, .grid-2 { grid-template-columns: 1fr !important; }
        h1 { font-size: 40px !important; }
      }
    `;
    document.head.appendChild(style);

    const phosphorScript = document.createElement('script');
    phosphorScript.src = 'https://unpkg.com/@phosphor-icons/web';
    document.head.appendChild(phosphorScript);

    return () => {
      document.head.removeChild(style);
      document.head.removeChild(phosphorScript);
    };
  }, []);

  return (
    <Router basename="/">
      <div style={{ ...customStyles.root, ...customStyles.body }}>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;