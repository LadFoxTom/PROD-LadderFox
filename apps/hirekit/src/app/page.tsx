import Link from 'next/link';
import { ProblemCard, FeatureCard, PricingCard, HeroMockup } from '@/components/InteractiveCards';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.hirekit.io';

/* ═══════════════════════════════════════════
   HEADER
   ═══════════════════════════════════════════ */
function Header() {
  return (
    <header className="sticky top-0 z-50 bg-hk-bg/85 backdrop-blur-md border-b border-slate-200 py-5">
      <div className="max-w-container mx-auto px-6">
        <nav className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-extrabold text-hk-primary flex items-center gap-2">
            <i className="ph-fill ph-circles-three-plus text-[32px]" />
            HireKit
          </Link>
          <div className="hidden md:flex gap-8">
            <a href="#features" className="font-medium text-hk-dark hover:text-hk-primary transition-colors">Product</a>
            <a href="#pricing" className="font-medium text-hk-dark hover:text-hk-primary transition-colors">Pricing</a>
            <a href="#" className="font-medium text-hk-dark hover:text-hk-primary transition-colors">Docs</a>
            <a href={`${APP_URL}/auth/login`} className="font-medium text-hk-dark hover:text-hk-primary transition-colors">Login</a>
          </div>
          <a
            href={`${APP_URL}/auth/signup`}
            className="hidden md:inline-flex items-center gap-2 px-6 py-3 bg-hk-primary text-white rounded-full font-semibold shadow-md shadow-indigo-500/25 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/35 transition-all duration-300"
          >
            Start free trial <i className="ph-bold ph-arrow-right" />
          </a>
        </nav>
      </div>
    </header>
  );
}

/* ═══════════════════════════════════════════
   HERO
   ═══════════════════════════════════════════ */
function Hero() {
  return (
    <section className="pt-20 pb-36 relative overflow-hidden">
      <div className="max-w-container mx-auto px-6 relative z-[2]">
        {/* Blobs */}
        <div className="absolute -top-[100px] -right-[100px] w-[600px] h-[600px] bg-indigo-100 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] blur-[80px] opacity-60 animate-blob-float z-0" />
        <div className="absolute bottom-[50px] -left-[100px] w-[400px] h-[400px] bg-rose-100 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] blur-[80px] opacity-60 animate-blob-float z-0" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Copy */}
          <div className="relative z-[2]">
            <h1 className="text-5xl lg:text-[64px] mb-6 font-bold tracking-tight leading-[1.1]">
              Stop sorting CVs.{' '}
              <span className="text-hk-primary">Start hiring faster.</span>
            </h1>
            <p className="text-xl mb-10 max-w-[500px] text-slate-500">
              Embed our powerful CV builder directly into your career portal. Give candidates a beautiful experience and get structured data instantly.
            </p>
            <div className="flex gap-4 flex-wrap">
              <a
                href={`${APP_URL}/auth/signup`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-hk-primary text-white rounded-full font-semibold shadow-md shadow-indigo-500/25 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/35 transition-all duration-300"
              >
                Start free trial
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-hk-dark hover:bg-black/[0.03] transition-all duration-300"
              >
                <i className="ph-fill ph-play-circle" /> Watch demo
              </a>
            </div>
          </div>

          {/* Right: Mockup */}
          <div className="relative z-[2]">
            <HeroMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   PROBLEMS
   ═══════════════════════════════════════════ */
function ProblemsSection() {
  return (
    <section className="pt-10 pb-28">
      <div className="max-w-container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ProblemCard
            icon="ph-fill ph-file-x"
            title="PDF Chaos"
            description="Parsing unstructured PDFs is a nightmare. Missing data and broken formatting kill productivity."
            iconBg="#FEE2E2"
            iconColor="#FF6B6B"
            rotate="rotate(-2deg)"
          />
          <ProblemCard
            icon="ph-fill ph-envelope-open"
            title="Inbox Overflow"
            description="Email attachments get lost. Keeping track of versions across threads is impossible."
            iconBg="#E0E7FF"
            iconColor="#4F46E5"
            rotate="rotate(1deg)"
          />
          <ProblemCard
            icon="ph-fill ph-mask-sad"
            title="Bad UX"
            description="Clunky forms drive top talent away. Candidates hate re-typing their resume 50 times."
            iconBg="#DCFCE7"
            iconColor="#51CF66"
            rotate="rotate(2deg)"
          />
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   SOLUTION (code snippet)
   ═══════════════════════════════════════════ */
function SolutionSection() {
  return (
    <section className="py-28 bg-white">
      <div className="max-w-container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Copy */}
          <div>
            <span className="text-hk-primary font-bold uppercase text-sm tracking-widest">
              The Solution
            </span>
            <h2 className="text-4xl mt-4 mb-6 font-bold">Just 5 lines of code.</h2>
            <p className="text-slate-500 text-lg">
              Copy our embed snippet, drop it into your existing React, Vue, or HTML page, and instantly get a full-featured CV builder. It matches your brand automatically.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                'Matches your CSS variables automatically',
                'Export to JSON or PDF',
                'Mobile responsive out of the box',
              ].map((item) => (
                <li key={item} className="flex gap-3 items-center">
                  <i className="ph-fill ph-check-circle text-hk-accent text-2xl" />
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Code block */}
          <div className="bg-hk-dark rounded-2xl p-6 font-mono text-indigo-300 text-sm shadow-lg relative overflow-hidden">
            <div className="flex gap-1.5 mb-5 opacity-50">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <code className="block mb-2">
              <span className="text-pink-400">&lt;script</span>{' '}
              <span className="text-purple-400">src</span>=
              <span className="text-hk-accent">&quot;https://cdn.hirekit.io/v2.js&quot;</span>
              <span className="text-pink-400">&gt;&lt;/script&gt;</span>
            </code>
            <code className="block mb-2" />
            <code className="block mb-2">
              <span className="text-pink-400">&lt;hire-kit-builder</span>
            </code>
            <code className="block mb-2">
              {'  '}
              <span className="text-purple-400">api-key</span>=
              <span className="text-hk-accent">&quot;hk_live_5928...&quot;</span>
            </code>
            <code className="block mb-2">
              {'  '}
              <span className="text-purple-400">theme</span>=
              <span className="text-hk-accent">&quot;system&quot;</span>
            </code>
            <code className="block mb-2">
              {'  '}
              <span className="text-purple-400">on-submit</span>=
              <span className="text-hk-accent">&quot;handleSubmission&quot;</span>
            </code>
            <code className="block mb-2">
              <span className="text-pink-400">/&gt;</span>
            </code>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   FEATURES
   ═══════════════════════════════════════════ */
function FeaturesSection() {
  return (
    <section id="features" className="py-28">
      <div className="max-w-container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold">Everything you need to hire</h2>
          <p className="mt-4 text-slate-500 text-lg">More than just a form builder.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon="ph-duotone ph-paint-brush-broad"
            title="Theme Editor"
            description="Customize fonts, colors, and border radii to match your design system perfectly."
            color="#FF6B6B"
          />
          <FeatureCard
            icon="ph-duotone ph-database"
            title="Structured Data"
            description="Don't guess. Get clean JSON objects for every applicant: work history, skills, education."
            color="#4F46E5"
          />
          <FeatureCard
            icon="ph-duotone ph-translate"
            title="Multi-language"
            description="Auto-detects user locale and translates the interface into 30+ languages."
            color="#51CF66"
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
}

/* ═══════════════════════════════════════════
   HOW IT WORKS
   ═══════════════════════════════════════════ */
function HowItWorksSection() {
  const steps = [
    { num: 1, icon: 'ph-duotone ph-code', title: 'Embed Widget', desc: 'Add the Javascript snippet to your career page.' },
    { num: 2, icon: 'ph-duotone ph-sliders-horizontal', title: 'Configure', desc: 'Set your required fields and branding in our dashboard.' },
    { num: 3, icon: 'ph-duotone ph-paper-plane-tilt', title: 'Receive CVs', desc: 'Candidates apply and data flows into your database.' },
  ];

  return (
    <section className="py-28 bg-white">
      <div className="max-w-container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold">How it works</h2>
        </div>

        <div className="flex flex-col md:flex-row justify-between relative mt-16">
          {/* Gradient line */}
          <div
            className="hidden md:block absolute top-10 left-[50px] right-[50px] h-0.5 opacity-30 z-0"
            style={{ background: 'linear-gradient(90deg, #4F46E5 0%, #FF6B6B 50%, #51CF66 100%)' }}
          />

          {steps.map((step) => (
            <div key={step.num} className="relative z-[1] bg-hk-bg p-4 w-full md:w-[30%] text-center">
              <div className="w-12 h-12 bg-white border-2 border-hk-primary text-hk-primary font-bold rounded-full flex items-center justify-center mx-auto mb-6 text-xl">
                {step.num}
              </div>
              <i className={`${step.icon} text-5xl text-hk-dark mb-4 block`} />
              <h3 className="font-bold">{step.title}</h3>
              <p className="text-[15px] text-slate-500 mt-2">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   PRICING
   ═══════════════════════════════════════════ */
function PricingSection() {
  return (
    <section id="pricing" className="py-28">
      <div className="max-w-container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold">Simple pricing</h2>
          <p className="text-slate-500 text-lg mt-4">No per-user fees. Just flat monthly rates.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <PricingCard
            title="Starter"
            price="$29"
            description="For small startups hiring occasionally."
            features={['50 Applications/mo', 'Standard Theme', 'Email Support']}
            variant="default"
          />
          <PricingCard
            title="Professional"
            price="$79"
            description="For growing teams scaling up."
            features={['Unlimited Applications', 'Full Customization', 'Webhooks & API', 'Remove Branding']}
            variant="popular"
            popular
          />
          <PricingCard
            title="Enterprise"
            price="$299"
            description="For high-volume recruiting agencies."
            features={['Multiple Organizations', 'SSO / SAML', 'Dedicated Manager', 'SLA Guarantee']}
            variant="dark"
          />
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   TESTIMONIAL
   ═══════════════════════════════════════════ */
function TestimonialSection() {
  return (
    <section className="pb-28">
      <div className="max-w-container mx-auto px-6">
        <div className="bg-white p-12 rounded-[32px] text-center max-w-[800px] mx-auto border border-slate-200 relative">
          <i className="ph-fill ph-quotes text-5xl text-slate-200 mb-6 block" />
          <p className="text-2xl text-hk-dark font-medium mb-8">
            &ldquo;HireKit completely changed how we handle engineering applications. The structured JSON data means we can filter by &lsquo;React&rsquo; or &lsquo;Python&rsquo; instantly, without reading 500 PDFs.&rdquo;
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200"
            alt="Sarah Chen"
            className="w-16 h-16 rounded-full object-cover mb-4 mx-auto border-2 border-white shadow-md"
          />
          <div className="font-bold">Sarah Chen</div>
          <div className="text-slate-500 text-sm">CTO, TechFlow</div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   CTA
   ═══════════════════════════════════════════ */
function CTASection() {
  return (
    <div className="max-w-container mx-auto px-6">
      <section
        className="relative rounded-[32px] py-20 px-6 mb-10 text-center text-white overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)' }}
      >
        {/* Blobs */}
        <div className="absolute -top-[50px] -left-[50px] w-[300px] h-[300px] bg-white blur-[80px] opacity-10" />
        <div className="absolute -bottom-[50px] -right-[50px] w-[300px] h-[300px] bg-hk-accent blur-[80px] opacity-20" />

        <h2 className="text-5xl mb-6 relative z-[2] font-bold">Ready to streamline hiring?</h2>
        <p className="text-indigo-200 relative z-[2] mb-8 text-lg">
          Join 2,000+ companies using HireKit today.
        </p>
        <a
          href={`${APP_URL}/auth/signup`}
          className="relative z-[2] inline-flex items-center px-12 py-4 bg-white text-hk-primary rounded-full font-semibold text-lg hover:bg-hk-light hover:shadow-xl transition-all duration-300"
        >
          Get Started for Free
        </a>
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════ */
export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <ProblemsSection />
      <SolutionSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <TestimonialSection />
      <CTASection />
    </main>
  );
}
