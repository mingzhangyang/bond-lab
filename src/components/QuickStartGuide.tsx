import React, { useMemo } from 'react';
import {
  BookOpenText,
  CheckCircle2,
  Compass,
  Link2,
  MousePointerClick,
  Sparkles,
} from 'lucide-react';
import type { Messages } from '../i18n';
import { getPathForRoute } from '../routes';
import { getOnboardingStepIndex, type OnboardingStep } from '../onboarding';

interface QuickStartGuideProps {
  messages: Messages;
  isDark: boolean;
  isDesktopViewport: boolean;
  step: OnboardingStep;
  atomCount: number;
  bondCount: number;
  onStart: () => void;
  onSkip: () => void;
  onFinish: () => void;
  onOpenElements: () => void;
}

export function QuickStartGuide({
  messages,
  isDark,
  isDesktopViewport,
  step,
  atomCount,
  bondCount,
  onStart,
  onSkip,
  onFinish,
  onOpenElements,
}: QuickStartGuideProps) {
  const overlayToneClass = isDark ? 'bg-black/48' : 'bg-slate-950/22';
  const cardClass = isDark
    ? 'border-white/12 bg-zinc-950/88 text-zinc-100 shadow-[0_24px_80px_rgba(0,0,0,0.45)]'
    : 'border-slate-200/90 bg-white/92 text-slate-900 shadow-[0_24px_80px_rgba(15,23,42,0.2)]';
  const subduedTextClass = isDark ? 'text-zinc-300' : 'text-slate-600';
  const subtleButtonClass = isDark
    ? 'border-white/12 bg-white/6 text-zinc-100 hover:bg-white/10'
    : 'border-slate-200 bg-slate-100/85 text-slate-900 hover:bg-slate-200/85';
  const primaryButtonClass = 'bg-indigo-500 text-white hover:bg-indigo-400';
  const badgeClass = isDark
    ? 'bg-indigo-500/18 text-indigo-100 border border-indigo-400/20'
    : 'bg-indigo-100 text-indigo-700 border border-indigo-200';
  const guideCardBaseClass = `rounded-[28px] border backdrop-blur-xl ${cardClass}`;

  const stepProgress = useMemo(() => {
    if (step === 'add-atoms') {
      const current = Math.min(atomCount, 2);
      return {
        value: current / 2,
        label: `${current}/2`,
        detail: current >= 2
          ? messages.onboarding.steps.addAtoms.complete
          : messages.onboarding.steps.addAtoms.progress,
      };
    }

    if (step === 'create-bond') {
      const current = Math.min(bondCount, 1);
      return {
        value: current,
        label: `${current}/1`,
        detail: current >= 1
          ? messages.onboarding.steps.createBond.complete
          : messages.onboarding.steps.createBond.progress,
      };
    }

    return null;
  }, [atomCount, bondCount, messages, step]);

  if (step === 'welcome') {
    return (
      <div className="fixed inset-0" style={{ zIndex: 80 }}>
        <div className={`absolute inset-0 ${overlayToneClass}`} />
        <div className="absolute inset-0 flex items-center justify-center p-4 md:p-6">
          <div className={`pointer-events-auto w-full max-w-lg p-6 md:p-7 ${guideCardBaseClass}`}>
            <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}>
              <Sparkles size={14} />
              <span>{messages.onboarding.welcomeBadge}</span>
            </div>
            <h2 className="info-display mt-4 text-3xl font-black tracking-tight md:text-4xl">
              {messages.onboarding.welcomeTitle}
            </h2>
            <p className={`mt-3 text-sm leading-6 md:text-base ${subduedTextClass}`}>
              {messages.onboarding.welcomeDescription}
            </p>
            <p className={`mt-3 text-xs leading-5 md:text-sm ${subduedTextClass}`}>
              {messages.onboarding.welcomeHint}
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={onStart}
                className={`inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold transition-colors ${primaryButtonClass}`}
              >
                <MousePointerClick size={16} />
                <span>{messages.onboarding.start}</span>
              </button>
              <button
                onClick={onSkip}
                className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border px-5 py-3 text-sm font-semibold transition-colors ${subtleButtonClass}`}
              >
                <span>{messages.onboarding.skip}</span>
              </button>
            </div>

            <a
              href={getPathForRoute('instructions')}
              className={`mt-4 inline-flex items-center gap-2 text-sm font-medium ${isDark ? 'text-cyan-200' : 'text-cyan-700'}`}
            >
              <BookOpenText size={16} />
              <span>{messages.onboarding.viewInstructions}</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  const stepIndex = getOnboardingStepIndex(step);
  const isAddAtomsStep = step === 'add-atoms';
  const isCreateBondStep = step === 'create-bond';
  const isExploreStep = step === 'explore';
  const showSceneTarget = isAddAtomsStep || isCreateBondStep;
  const sceneHint = isAddAtomsStep
    ? messages.onboarding.steps.addAtoms.canvasHint
    : messages.onboarding.steps.createBond.canvasHint;

  return (
    <div className="pointer-events-none fixed inset-0" style={{ zIndex: 80 }}>
      <div className={`absolute inset-0 ${overlayToneClass}`} />

      {showSceneTarget && (
        <div
          className={`lab-onboarding-scene-target absolute rounded-4xl border border-dashed ${
            isDesktopViewport
              ? 'top-24 bottom-24'
              : 'inset-x-4 top-24 bottom-44'
          } ${isDark ? 'border-indigo-300/35 bg-indigo-400/6' : 'border-indigo-500/35 bg-indigo-500/6'}`}
          style={isDesktopViewport ? { left: 'calc(20rem + 2.5rem)', right: 'calc(20rem + 2.5rem)' } : undefined}
          aria-hidden="true"
        >
          <div className={`absolute left-1/2 top-4 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}>
            {sceneHint}
          </div>
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 flex justify-center p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] md:p-6">
        <div className={`pointer-events-auto w-full max-w-xl p-5 md:p-6 ${guideCardBaseClass}`}>
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}>
                <span>{messages.onboarding.stepLabel} {stepIndex}/3</span>
              </div>
              <h2 className="info-display mt-3 text-2xl font-black tracking-tight">
                {isAddAtomsStep
                  ? messages.onboarding.steps.addAtoms.title
                  : isCreateBondStep
                    ? messages.onboarding.steps.createBond.title
                    : messages.onboarding.steps.explore.title}
              </h2>
              <p className={`mt-2 text-sm leading-6 ${subduedTextClass}`}>
                {isAddAtomsStep
                  ? (isDesktopViewport
                    ? messages.onboarding.steps.addAtoms.descriptionDesktop
                    : messages.onboarding.steps.addAtoms.descriptionMobile)
                  : isCreateBondStep
                    ? messages.onboarding.steps.createBond.description
                    : messages.onboarding.steps.explore.description}
              </p>
            </div>

            {stepProgress && (
              <div className="min-w-28 md:max-w-36">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span>{stepProgress.detail}</span>
                  <span>{stepProgress.label}</span>
                </div>
                <div className={`mt-2 h-2 overflow-hidden rounded-full ${isDark ? 'bg-white/8' : 'bg-slate-200'}`}>
                  <div
                    className="h-full rounded-full bg-indigo-500 transition-[width] duration-300"
                    style={{ width: `${Math.max(8, stepProgress.value * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {isExploreStep && (
            <ul className="mt-4 space-y-2">
              {messages.onboarding.steps.explore.points.map((point) => (
                <li key={point} className={`flex items-start gap-2 text-sm ${subduedTextClass}`}>
                  <CheckCircle2 size={16} className={`mt-0.5 shrink-0 ${isDark ? 'text-emerald-300' : 'text-emerald-600'}`} />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {isAddAtomsStep && !isDesktopViewport && (
              <button
                onClick={onOpenElements}
                className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition-colors ${subtleButtonClass}`}
              >
                <MousePointerClick size={16} />
                <span>{messages.onboarding.openElements}</span>
              </button>
            )}

            {isExploreStep ? (
              <>
                <button
                  onClick={onFinish}
                  className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold transition-colors ${primaryButtonClass}`}
                >
                  <Compass size={16} />
                  <span>{messages.onboarding.finish}</span>
                </button>
                <a
                  href={getPathForRoute('instructions')}
                  className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border px-5 py-3 text-sm font-semibold transition-colors ${subtleButtonClass}`}
                >
                  <BookOpenText size={16} />
                  <span>{messages.onboarding.viewInstructions}</span>
                </a>
              </>
            ) : (
              <div className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium ${subtleButtonClass}`}>
                {isAddAtomsStep ? <MousePointerClick size={16} /> : <Link2 size={16} />}
                <span>
                  {isAddAtomsStep
                    ? messages.onboarding.steps.addAtoms.progress
                    : messages.onboarding.steps.createBond.progress}
                </span>
              </div>
            )}

            <button
              onClick={onSkip}
              className={`inline-flex min-h-11 items-center justify-center rounded-2xl border px-4 py-3 text-sm font-semibold transition-colors ${subtleButtonClass}`}
            >
              {messages.onboarding.skip}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
