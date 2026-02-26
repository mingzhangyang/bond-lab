import React, { useMemo } from 'react';
import { getMessages } from '../i18n';
import type { Language } from '../i18n';
import { PRIVACY_POLICY } from '../privacy';
import { useStore } from '../store';
import { InfoPageLayout } from './InfoPageLayout';

interface SectionTitles {
  dataCollection: string;
  localStorageUsage: string;
  externalServices: string;
  updatesAndContact: string;
}

const SECTION_TITLES: Record<Language, SectionTitles> = {
  en: {
    dataCollection: 'Data Collected and Stored',
    localStorageUsage: 'Local Storage Usage',
    externalServices: 'External Service Usage',
    updatesAndContact: 'Updates and Contact',
  },
  es: {
    dataCollection: 'Datos recopilados y almacenados',
    localStorageUsage: 'Uso de almacenamiento local',
    externalServices: 'Uso de servicios externos',
    updatesAndContact: 'Actualizaciones y contacto',
  },
  zh: {
    dataCollection: '收集和存储的数据',
    localStorageUsage: '本地存储使用',
    externalServices: '外部服务使用',
    updatesAndContact: '更新与联系方式',
  },
  fr: {
    dataCollection: 'Donnees collecte es et stockees',
    localStorageUsage: 'Utilisation du stockage local',
    externalServices: 'Utilisation des services externes',
    updatesAndContact: 'Mises a jour et contact',
  },
  ja: {
    dataCollection: '収集および保存されるデータ',
    localStorageUsage: 'ローカルストレージの利用',
    externalServices: '外部サービスの利用',
    updatesAndContact: '更新と連絡先',
  },
};

interface PrivacySectionProps {
  heading: string;
  items: string[];
  headingClass: string;
  textClass: string;
}

function PrivacySection({ heading, items, headingClass, textClass }: PrivacySectionProps) {
  return (
    <section>
      <h2 className={`text-xs md:text-sm font-bold uppercase tracking-wider ${headingClass}`}>{heading}</h2>
      <ul className={`mt-2 space-y-2 text-sm md:text-base ${textClass}`}>
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </section>
  );
}

export function PrivacyPage() {
  const language = useStore((state) => state.language);
  const theme = useStore((state) => state.theme);
  const messages = useMemo(() => getMessages(language), [language]);
  const sectionTitles = SECTION_TITLES[language];
  const isDark = theme === 'dark';
  const headingClass = isDark ? 'text-zinc-400' : 'text-zinc-500';
  const textClass = isDark ? 'text-zinc-200' : 'text-zinc-700';

  return (
    <InfoPageLayout title={messages.ui.privacyTitle}>
      <p className={`text-sm ${headingClass}`}>
        {messages.ui.privacyVersion}: {PRIVACY_POLICY.version}
      </p>
      <PrivacySection
        heading={sectionTitles.dataCollection}
        items={PRIVACY_POLICY.dataCollection}
        headingClass={headingClass}
        textClass={textClass}
      />
      <PrivacySection
        heading={sectionTitles.localStorageUsage}
        items={PRIVACY_POLICY.localStorageUsage}
        headingClass={headingClass}
        textClass={textClass}
      />
      <PrivacySection
        heading={sectionTitles.externalServices}
        items={PRIVACY_POLICY.externalServices}
        headingClass={headingClass}
        textClass={textClass}
      />
      <PrivacySection
        heading={sectionTitles.updatesAndContact}
        items={PRIVACY_POLICY.updatesAndContact}
        headingClass={headingClass}
        textClass={textClass}
      />
    </InfoPageLayout>
  );
}
