import React from 'react';
import { X } from 'lucide-react';
import { PRIVACY_POLICY } from '../privacy';

interface PrivacyProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  title: string;
  versionLabel: string;
  closeLabel: string;
}

interface PrivacySectionProps {
  heading: string;
  items: string[];
  textClass: string;
  headingClass: string;
}

function PrivacySection({ heading, items, textClass, headingClass }: PrivacySectionProps) {
  return (
    <section>
      <h3 className={`text-sm font-bold uppercase tracking-wider ${headingClass}`}>{heading}</h3>
      <ul className={`mt-2 space-y-2 text-sm ${textClass}`}>
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </section>
  );
}

export function Privacy({
  isOpen,
  onClose,
  isDark,
  title,
  versionLabel,
  closeLabel,
}: PrivacyProps) {
  if (!isOpen) return null;

  const panelClass = isDark
    ? 'bg-zinc-900/95 border-white/10 shadow-black/60'
    : 'bg-white/95 border-zinc-200 shadow-zinc-400/40';
  const primaryTextClass = isDark ? 'text-white' : 'text-zinc-900';
  const secondaryTextClass = isDark ? 'text-zinc-300' : 'text-zinc-700';
  const headingTextClass = isDark ? 'text-zinc-400' : 'text-zinc-500';
  const iconButtonClass = isDark
    ? 'text-zinc-400 hover:text-white hover:bg-white/10'
    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100';

  return (
    <div className="fixed inset-0 z-[70] pointer-events-auto">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <article
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`absolute left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-2xl max-h-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 rounded-3xl border shadow-2xl backdrop-blur-xl overflow-hidden ${panelClass}`}
      >
        <header className={`flex items-start justify-between gap-3 p-5 border-b ${isDark ? 'border-white/10' : 'border-zinc-200'}`}>
          <div>
            <h2 className={`text-xl font-black tracking-tight ${primaryTextClass}`}>{title}</h2>
            <p className={`text-xs mt-1 ${headingTextClass}`}>{versionLabel}: {PRIVACY_POLICY.version}</p>
          </div>
          <button
            onClick={onClose}
            aria-label={closeLabel}
            className={`min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center transition-colors ${iconButtonClass}`}
          >
            <X size={18} />
          </button>
        </header>
        <div className="p-5 overflow-y-auto max-h-[calc(100vh-12rem)] space-y-5">
          <PrivacySection
            heading="Data Collected and Stored"
            items={PRIVACY_POLICY.dataCollection}
            textClass={secondaryTextClass}
            headingClass={headingTextClass}
          />
          <PrivacySection
            heading="Local Storage Usage"
            items={PRIVACY_POLICY.localStorageUsage}
            textClass={secondaryTextClass}
            headingClass={headingTextClass}
          />
          <PrivacySection
            heading="External Service Usage"
            items={PRIVACY_POLICY.externalServices}
            textClass={secondaryTextClass}
            headingClass={headingTextClass}
          />
          <PrivacySection
            heading="Updates and Contact"
            items={PRIVACY_POLICY.updatesAndContact}
            textClass={secondaryTextClass}
            headingClass={headingTextClass}
          />
        </div>
      </article>
    </div>
  );
}
