'use client';

import { useEffect, useRef, useState } from 'react';

interface ApplicationFormProps {
  companyId: string;
  jobId: string;
  primaryColor: string;
}

export function ApplicationForm({ companyId, jobId, primaryColor }: ApplicationFormProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current || loaded) return;

    // Create the widget container
    const widgetDiv = document.createElement('div');
    widgetDiv.id = `hirekit-widget-${jobId}`;
    containerRef.current.appendChild(widgetDiv);

    // Determine the script URL based on the current page URL
    const origin = window.location.origin;
    const scriptUrl = `${origin}/widget/hirekit-widget.iife.js`;

    // Load the widget script
    const script = document.createElement('script');
    script.src = scriptUrl;
    script.onload = () => {
      if ((window as any).HireKit) {
        (window as any).HireKit.init({
          companyId,
          jobId,
          container: `#hirekit-widget-${jobId}`,
        });
      }
    };
    document.body.appendChild(script);
    setLoaded(true);

    return () => {
      script.remove();
    };
  }, [companyId, jobId, loaded]);

  return (
    <div className="mt-8">
      <div className="border-t border-slate-200 pt-8">
        <h2 className="text-xl font-bold text-slate-900 mb-6" style={{ color: primaryColor }}>
          Apply for this position
        </h2>
        <div ref={containerRef} className="min-h-[400px]" />
      </div>
    </div>
  );
}
