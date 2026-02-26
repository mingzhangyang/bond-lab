import React, { useMemo } from 'react';
import { getMessages } from '../i18n';
import type { Language } from '../i18n';
import { useStore } from '../store';
import { InfoPageLayout } from './InfoPageLayout';

const INTRO_COPY: Record<Language, string> = {
  en: 'Use these controls to build, adjust, and inspect molecules in BondLab.',
  es: 'Usa estas instrucciones para crear, ajustar e inspeccionar moleculas en BondLab.',
  zh: '使用以下说明在 BondLab 中构建、调整并观察分子。',
  fr: 'Utilisez ces instructions pour creer, ajuster et inspecter des molecules dans BondLab.',
  ja: 'BondLab で分子を作成、調整、確認するための操作ガイドです。',
};

export function InstructionsPage() {
  const language = useStore((state) => state.language);
  const theme = useStore((state) => state.theme);
  const messages = useMemo(() => getMessages(language), [language]);
  const isDark = theme === 'dark';
  const textClass = isDark ? 'text-zinc-200' : 'text-zinc-700';

  return (
    <InfoPageLayout title={messages.ui.instructionsTitle}>
      <p className={`text-sm md:text-base ${textClass}`}>{INTRO_COPY[language]}</p>
      <ol className={`space-y-2 text-sm md:text-base list-decimal pl-5 ${textClass}`}>
        {messages.ui.controlsList.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>
    </InfoPageLayout>
  );
}
