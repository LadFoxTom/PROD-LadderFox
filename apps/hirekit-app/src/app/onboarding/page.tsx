'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    primaryColor: '#4F46E5',
    template: 'classic',
    sections: {
      personalInfo: { enabled: true, required: true },
      experience: { enabled: true, min: 1 },
      education: { enabled: true, min: 1 },
      skills: { enabled: true },
      photo: { enabled: false }
    },
    installMethod: 'hosted'
  });

  const handleComplete = async () => {
    const response = await fetch('/api/onboarding/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= s ? 'bg-indigo-600 text-white' : 'bg-gray-300'
                }`}>
                  {s}
                </div>
                {s < 3 && <div className="w-24 h-1 bg-gray-300 mx-2" />}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-8">
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Step 1: Branding</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Brand Color</label>
                  <input
                    type="color"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    className="w-full h-12"
                  />
                </div>
              </div>
            </div>
          )}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Step 2: CV Template</h2>
              <div className="grid grid-cols-2 gap-4">
                {['modern', 'classic', 'minimal', 'executive'].map((template) => (
                  <div
                    key={template}
                    onClick={() => setFormData({ ...formData, template })}
                    className={`border-2 rounded-lg p-4 cursor-pointer ${
                      formData.template === template ? 'border-indigo-600' : 'border-gray-200'
                    }`}
                  >
                    <div className="aspect-[3/4] bg-gray-100 rounded mb-2" />
                    <p className="text-center font-medium capitalize">{template}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Step 3: Installation Method</h2>
              <div className="space-y-4">
                {[
                  { id: 'hosted', name: 'Hosted Page', desc: 'yourcompany.hirekit.io - Ready now' },
                  { id: 'widget', name: 'Widget Embed', desc: 'Add to your website with code snippet' },
                  { id: 'custom', name: 'Custom Domain', desc: 'cv.yourcompany.com - DNS setup required' }
                ].map((method) => (
                  <div
                    key={method.id}
                    onClick={() => setFormData({ ...formData, installMethod: method.id })}
                    className={`border-2 rounded-lg p-4 cursor-pointer ${
                      formData.installMethod === method.id ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'
                    }`}
                  >
                    <h3 className="font-semibold">{method.name}</h3>
                    <p className="text-sm text-gray-600">{method.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-between">
            {step > 1 && (
              <button onClick={() => setStep(step - 1)} className="px-4 py-2 text-gray-700 hover:text-gray-900">
                Back
              </button>
            )}
            {step < 3 ? (
              <button onClick={() => setStep(step + 1)} className="ml-auto px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                Continue
              </button>
            ) : (
              <button onClick={handleComplete} className="ml-auto px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                Launch HireKit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
