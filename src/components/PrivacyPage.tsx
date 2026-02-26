import React, { useMemo } from 'react';
import { CheckCircle2, CloudCog, Database, HardDriveDownload, RefreshCcw, ShieldCheck } from 'lucide-react';
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

interface PrivacyCopy {
  intro: string;
  assurance: string;
  highlights: string[];
  lastUpdatedLabel: string;
  sectionSummaries: Record<SectionKey, string>;
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

const PAGE_COPY: Record<Language, PrivacyCopy> = {
  en: {
    intro: 'This page explains what BondLab stores, what stays on your device, and when external services are involved.',
    assurance: 'Privacy-first by default: BondLab is designed to run locally without account tracking.',
    highlights: ['No login required for core features', 'Most interactions stay in your browser'],
    lastUpdatedLabel: 'Last updated',
    sectionSummaries: {
      dataCollection: 'What information is processed while you use BondLab.',
      localStorageUsage: 'What settings are stored in your browser to improve continuity.',
      externalServices: 'When data may be sent outside your device and how that is disclosed.',
      updatesAndContact: 'How policy changes are communicated and where to ask questions.',
    },
  },
  es: {
    intro: 'Esta pagina explica que guarda BondLab, que permanece en tu dispositivo y cuando intervienen servicios externos.',
    assurance: 'Privacidad primero: BondLab esta disenado para funcionar localmente sin seguimiento de cuentas.',
    highlights: ['No requiere inicio de sesion para funciones principales', 'La mayoria de acciones se procesan en tu navegador'],
    lastUpdatedLabel: 'Ultima actualizacion',
    sectionSummaries: {
      dataCollection: 'Que informacion se procesa mientras usas BondLab.',
      localStorageUsage: 'Que ajustes se guardan en el navegador para mantener la continuidad.',
      externalServices: 'Cuando se puede enviar informacion fuera del dispositivo y como se informa.',
      updatesAndContact: 'Como se notifican cambios de politica y donde consultar dudas.',
    },
  },
  zh: {
    intro: '本页说明 BondLab 会存储什么数据、哪些内容仅保留在本地，以及何时会使用外部服务。',
    assurance: '默认隐私优先：BondLab 以本地运行为主，不依赖账户追踪。',
    highlights: ['核心功能无需登录', '大多数交互仅在浏览器本地处理'],
    lastUpdatedLabel: '最近更新',
    sectionSummaries: {
      dataCollection: '说明你在使用 BondLab 时会被处理的内容。',
      localStorageUsage: '说明浏览器本地会保存哪些设置以便下次继续使用。',
      externalServices: '说明何时可能与外部服务交互以及披露方式。',
      updatesAndContact: '说明政策更新通知方式以及联系渠道。',
    },
  },
  fr: {
    intro: 'Cette page explique ce que BondLab stocke, ce qui reste sur votre appareil et quand des services externes sont utilises.',
    assurance: 'Confidentialite par defaut : BondLab fonctionne localement sans suivi de compte.',
    highlights: ['Aucune connexion requise pour les fonctions principales', 'La plupart des interactions restent dans le navigateur'],
    lastUpdatedLabel: 'Derniere mise a jour',
    sectionSummaries: {
      dataCollection: 'Quelles informations sont traitees pendant votre utilisation de BondLab.',
      localStorageUsage: 'Quels reglages sont gardes localement dans le navigateur.',
      externalServices: 'Quand des donnees peuvent sortir de votre appareil et comment cela est annonce.',
      updatesAndContact: 'Comment les mises a jour sont communiquees et ou poser vos questions.',
    },
  },
  ja: {
    intro: 'このページでは、BondLab が保存するデータ、端末内に留まる情報、外部サービスが関与する条件を説明します。',
    assurance: '初期設定でプライバシー重視: BondLab はアカウント追跡なしでローカル実行を想定しています。',
    highlights: ['主要機能はログイン不要', 'ほとんどの操作はブラウザ内で完結'],
    lastUpdatedLabel: '最終更新日',
    sectionSummaries: {
      dataCollection: 'BondLab 利用時に処理される情報の範囲を示します。',
      localStorageUsage: '継続利用のためにブラウザに保存される設定を示します。',
      externalServices: '外部サービスと連携する条件と通知方法を示します。',
      updatesAndContact: 'ポリシー更新の案内方法と問い合わせ先を示します。',
    },
  },
};

const DATE_LOCALE: Record<Language, string> = {
  en: 'en-US',
  es: 'es-ES',
  zh: 'zh-CN',
  fr: 'fr-FR',
  ja: 'ja-JP',
};

type SectionKey = keyof SectionTitles;

interface PrivacySectionProps {
  heading: string;
  summary: string;
  items: string[];
  icon: React.ReactNode;
  isDark: boolean;
  delayMs: number;
}

function PrivacySection({ heading, summary, items, icon, isDark, delayMs }: PrivacySectionProps) {
  const cardClass = 'info-card info-reveal rounded-2xl border p-4 md:p-5 backdrop-blur-sm';
  const headingClass = isDark ? 'text-zinc-100' : 'text-zinc-900';
  const summaryClass = isDark ? 'text-zinc-300' : 'text-zinc-600';
  const itemClass = isDark ? 'text-zinc-200' : 'text-zinc-700';
  const itemIconClass = isDark ? 'text-emerald-300' : 'text-emerald-600';

  return (
    <section className={cardClass} style={{ animationDelay: `${delayMs}ms` }}>
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 ${isDark ? 'text-indigo-300' : 'text-indigo-600'}`}>{icon}</div>
        <div>
          <h2 className={`info-display text-sm md:text-base font-bold ${headingClass}`}>{heading}</h2>
          <p className={`mt-1 text-xs md:text-sm leading-relaxed ${summaryClass}`}>{summary}</p>
        </div>
      </div>
      <ul className={`mt-4 space-y-3 text-sm md:text-base leading-relaxed ${itemClass}`}>
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <CheckCircle2 size={16} className={`mt-0.5 shrink-0 ${itemIconClass}`} aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function formatPolicyDate(language: Language, version: string) {
  const parsed = new Date(version);
  if (Number.isNaN(parsed.getTime())) return version;
  return parsed.toLocaleDateString(DATE_LOCALE[language], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function PrivacyPage() {
  const language = useStore((state) => state.language);
  const theme = useStore((state) => state.theme);
  const messages = useMemo(() => getMessages(language), [language]);
  const sectionTitles = SECTION_TITLES[language];
  const copy = PAGE_COPY[language];
  const isDark = theme === 'dark';
  const calloutClass = 'info-callout info-reveal rounded-2xl border p-4 md:p-5';
  const calloutTextClass = isDark ? 'text-emerald-100' : 'text-emerald-900';
  const secondaryClass = isDark ? 'text-emerald-200/90' : 'text-emerald-800';

  const sectionDefinitions: Array<{ key: SectionKey; items: string[]; icon: React.ReactNode }> = [
    {
      key: 'dataCollection',
      items: PRIVACY_POLICY.dataCollection,
      icon: <Database size={18} aria-hidden="true" />,
    },
    {
      key: 'localStorageUsage',
      items: PRIVACY_POLICY.localStorageUsage,
      icon: <HardDriveDownload size={18} aria-hidden="true" />,
    },
    {
      key: 'externalServices',
      items: PRIVACY_POLICY.externalServices,
      icon: <CloudCog size={18} aria-hidden="true" />,
    },
    {
      key: 'updatesAndContact',
      items: PRIVACY_POLICY.updatesAndContact,
      icon: <RefreshCcw size={18} aria-hidden="true" />,
    },
  ];

  return (
    <InfoPageLayout
      route="privacy"
      title={messages.ui.privacyTitle}
      description={copy.intro}
      metadata={(
        <span>
          {copy.lastUpdatedLabel}: {formatPolicyDate(language, PRIVACY_POLICY.version)} ({messages.ui.privacyVersion}: {PRIVACY_POLICY.version})
        </span>
      )}
    >
      <section className={calloutClass} style={{ animationDelay: '250ms' }}>
        <div className="flex items-start gap-3">
          <ShieldCheck size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
          <div>
            <p className={`text-sm md:text-base font-semibold ${calloutTextClass}`}>{copy.assurance}</p>
            <ul className={`mt-2 space-y-1 text-xs md:text-sm ${secondaryClass}`}>
              {copy.highlights.map((point) => (
                <li key={point}>• {point}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      {sectionDefinitions.map((section, index) => (
        <PrivacySection
          key={section.key}
          heading={sectionTitles[section.key]}
          summary={copy.sectionSummaries[section.key]}
          items={section.items}
          icon={section.icon}
          isDark={isDark}
          delayMs={320 + index * 75}
        />
      ))}
    </InfoPageLayout>
  );
}
