import * as React from 'react';
import { useState, useCallback, useMemo } from 'react';
import type { CVBuilderProps, CVData } from '@repo/types';
import { Button } from '@repo/ui';
import { PersonalInfoStep } from './steps/PersonalInfoStep';
import { ExperienceStep } from './steps/ExperienceStep';
import { EducationStep } from './steps/EducationStep';
import { SkillsStep } from './steps/SkillsStep';
import { ReviewStep } from './steps/ReviewStep';
import { ScreeningQuestionsStep } from './steps/ScreeningQuestionsStep';

interface StepDefinition {
  id: string;
  label: string;
  icon: string;
  component: React.ReactNode;
}

export function CVBuilder({
  branding,
  sections,
  screeningQuestions,
  onComplete,
  onChange,
  onError,
  initialData,
  context,
  showProgress = true,
}: CVBuilderProps) {
  const [cvData, setCvData] = useState<Partial<CVData>>(initialData || {});
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const primaryColor = branding?.primaryColor || '#4F46E5';

  const handleDataChange = useCallback(
    (partial: Partial<CVData>) => {
      setCvData((prev) => {
        const updated = { ...prev, ...partial };
        if (partial.contact) {
          updated.contact = { ...prev.contact, ...partial.contact };
        }
        onChange?.(updated);
        return updated;
      });
    },
    [onChange]
  );

  const steps = useMemo((): StepDefinition[] => {
    const allSteps: StepDefinition[] = [];

    if (sections?.personalInfo?.enabled !== false) {
      allSteps.push({
        id: 'personal-info',
        label: 'Personal',
        icon: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z',
        component: (
          <PersonalInfoStep
            data={cvData}
            onChange={handleDataChange}
            primaryColor={primaryColor}
          />
        ),
      });
    }

    if (sections?.experience?.enabled !== false) {
      allSteps.push({
        id: 'experience',
        label: 'Experience',
        icon: 'M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0',
        component: (
          <ExperienceStep
            data={cvData}
            onChange={handleDataChange}
            primaryColor={primaryColor}
            min={sections?.experience?.min}
            max={sections?.experience?.max}
          />
        ),
      });
    }

    if (sections?.education?.enabled !== false) {
      allSteps.push({
        id: 'education',
        label: 'Education',
        icon: 'M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5',
        component: (
          <EducationStep
            data={cvData}
            onChange={handleDataChange}
            primaryColor={primaryColor}
            min={sections?.education?.min}
            max={sections?.education?.max}
          />
        ),
      });
    }

    if (sections?.skills?.enabled !== false) {
      allSteps.push({
        id: 'skills',
        label: 'Skills',
        icon: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z',
        component: (
          <SkillsStep
            data={cvData}
            onChange={handleDataChange}
            primaryColor={primaryColor}
          />
        ),
      });
    }

    if (screeningQuestions && screeningQuestions.length > 0) {
      allSteps.push({
        id: 'screening',
        label: 'Questions',
        icon: 'M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z',
        component: (
          <ScreeningQuestionsStep
            data={cvData}
            onChange={handleDataChange}
            primaryColor={primaryColor}
            questions={screeningQuestions}
          />
        ),
      });
    }

    allSteps.push({
      id: 'review',
      label: 'Review',
      icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      component: (
        <ReviewStep data={cvData} primaryColor={primaryColor} screeningQuestions={screeningQuestions} />
      ),
    });

    return allSteps;
  }, [cvData, handleDataChange, primaryColor, sections, screeningQuestions]);

  const currentStep = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;
  const progressPercentage = ((currentStepIndex + 1) / steps.length) * 100;

  const goNext = () => {
    if (!isLastStep) setCurrentStepIndex((prev) => prev + 1);
  };

  const goBack = () => {
    if (!isFirstStep) setCurrentStepIndex((prev) => prev - 1);
  };

  const goToStep = (index: number) => {
    if (index >= 0 && index < steps.length) setCurrentStepIndex(index);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onComplete(cvData as CVData);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Submission failed');
      onError?.(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto font-[Inter,system-ui,sans-serif]">
      {/* Company Branding Header */}
      {branding && (context === 'b2b' || context === 'widget') && (
        <div className="flex items-center gap-3 mb-8 pb-5 border-b border-slate-200">
          {branding.logo && (
            <img
              src={branding.logo}
              alt={branding.companyName || 'Company logo'}
              className="h-9 w-auto object-contain"
            />
          )}
          {branding.showCompanyName !== false && branding.companyName && (
            <span
              className="text-lg font-bold"
              style={{ color: primaryColor }}
            >
              {branding.companyName}
            </span>
          )}
        </div>
      )}

      {/* Step Navigation */}
      {showProgress && (
        <div className="mb-10">
          {/* Equal-width step buttons */}
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${steps.length}, 1fr)` }}>
            {steps.map((step, index) => {
              const isActive = index === currentStepIndex;
              const isCompleted = index < currentStepIndex;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => goToStep(index)}
                  className="group flex flex-col items-center gap-2 py-3 px-2 rounded-2xl transition-all duration-300"
                  style={{
                    backgroundColor: isActive ? `${primaryColor}08` : 'transparent',
                  }}
                >
                  {/* Icon circle */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{
                      backgroundColor: isActive
                        ? primaryColor
                        : isCompleted
                          ? `${primaryColor}15`
                          : '#F1F5F9',
                      color: isActive
                        ? '#ffffff'
                        : isCompleted
                          ? primaryColor
                          : '#94A3B8',
                      boxShadow: isActive ? `0 4px 12px ${primaryColor}30` : 'none',
                    }}
                  >
                    {isCompleted ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d={step.icon} />
                      </svg>
                    )}
                  </div>
                  {/* Label */}
                  <span
                    className="text-xs font-semibold transition-colors duration-300"
                    style={{
                      color: isActive ? primaryColor : isCompleted ? '#1E293B' : '#94A3B8',
                    }}
                  >
                    {step.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="mt-4 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${progressPercentage}%`,
                backgroundColor: primaryColor,
              }}
            />
          </div>
        </div>
      )}

      {/* Step Content */}
      <div className="mb-10">{currentStep.component}</div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-5 border-t border-slate-200">
        <div>
          {!isFirstStep && (
            <Button variant="outline" onClick={goBack} disabled={isSubmitting}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Back
            </Button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-400 font-medium hidden sm:inline">
            {currentStepIndex + 1} / {steps.length}
          </span>

          {isLastStep ? (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              size="lg"
              style={{ backgroundColor: primaryColor, borderColor: primaryColor }}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  Submit Application
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={goNext}
              style={{ backgroundColor: primaryColor, borderColor: primaryColor }}
            >
              Continue
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
