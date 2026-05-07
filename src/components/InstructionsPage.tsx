import { useMemo } from 'react';
import { BookOpenText, CheckCircle2, Info } from 'lucide-react';
import { getMessages } from '../i18n';
import type { Language } from '../i18n';
import { useStore } from '../store';
import { InfoPageLayout } from './InfoPageLayout';

interface InstructionCopy {
  intro: string;
  controlsLabel: string;
  stepsLabel: string;
  groups: {
    build: string;
    edit: string;
    navigate: string;
  };
  groupDescriptions: {
    build: string;
    edit: string;
    navigate: string;
  };
  quickTips: string[];
}

const INTRO_COPY: Record<Language, InstructionCopy> = {
  en: {
    intro: 'Follow this guide to build molecules faster, edit structures precisely, and inspect geometry with confidence.',
    controlsLabel: 'controls available',
    stepsLabel: 'steps',
    groups: {
      build: 'Build Basics',
      edit: 'Edit and Refine',
      navigate: 'Move the View',
    },
    groupDescriptions: {
      build: 'Start a structure and create bonds between atoms.',
      edit: 'Select a bond to use explicit Upgrade/Delete actions, then refine quickly.',
      navigate: 'Adjust camera and zoom to inspect your molecule clearly.',
    },
    quickTips: [
      'Primary path: tap a bond, then use Upgrade/Delete action buttons.',
      'Use Delete mode as a fast cleanup shortcut; return to Build mode after.',
      'For precise bond rotation, select a single bond before holding Shift and dragging.',
      'On mobile, use two fingers for zoom and avoid covering atoms while dragging.',
    ],
  },
  es: {
    intro: 'Sigue esta guia para construir moleculas mas rapido, editar estructuras con precision e inspeccionar la geometria.',
    controlsLabel: 'controles disponibles',
    stepsLabel: 'pasos',
    groups: {
      build: 'Construccion inicial',
      edit: 'Editar y ajustar',
      navigate: 'Mover la vista',
    },
    groupDescriptions: {
      build: 'Crea la estructura inicial y conecta atomos.',
      edit: 'Selecciona un enlace para usar acciones explicitas de Mejorar/Eliminar y ajustar rapido.',
      navigate: 'Controla camara y zoom para inspeccionar mejor.',
    },
    quickTips: [
      'Ruta principal: toca un enlace y usa los botones de Mejorar/Eliminar.',
      'Usa el modo Eliminar como atajo de limpieza y vuelve a Construir despues.',
      'Para rotar con precision, selecciona un enlace simple y luego manten Shift al arrastrar.',
      'En movil, usa dos dedos para zoom y evita tapar los atomos al arrastrar.',
    ],
  },
  zh: {
    intro: '这份指南可帮助你更快地搭建分子、精细调整结构，并清晰观察几何形态。',
    controlsLabel: '个可用操作',
    stepsLabel: '个步骤',
    groups: {
      build: '基础构建',
      edit: '编辑与微调',
      navigate: '视角控制',
    },
    groupDescriptions: {
      build: '先创建原子与键，完成分子骨架。',
      edit: '先选中化学键，再使用升级/删除按钮进行显式编辑。',
      navigate: '通过旋转和缩放检查分子的空间结构。',
    },
    quickTips: [
      '主路径是先选中化学键，再点击升级/删除按钮。',
      '删除模式作为快速清理捷径，完成后建议切回构建模式。',
      '精确旋转键时，先选中单键，再按住 Shift 拖动。',
      '在移动端请用双指缩放，拖动时尽量避免手指遮挡目标原子。',
    ],
  },
  fr: {
    intro: 'Suivez ce guide pour construire des molecules plus vite, ajuster les structures avec precision et verifier la geometrie.',
    controlsLabel: 'commandes disponibles',
    stepsLabel: 'etapes',
    groups: {
      build: 'Demarrage',
      edit: 'Edition et ajustement',
      navigate: 'Navigation de vue',
    },
    groupDescriptions: {
      build: 'Placez les atomes et creez les liaisons de base.',
      edit: 'Selectionnez une liaison puis utilisez Ameliorer/Supprimer pour editer clairement.',
      navigate: 'Controlez camera et zoom pour mieux observer.',
    },
    quickTips: [
      'Flux principal : touchez une liaison puis utilisez les boutons Ameliorer/Supprimer.',
      'Utilisez le mode Supprimer comme raccourci de nettoyage, puis revenez en mode Construire.',
      'Pour une rotation precise, ciblez une liaison simple avant Shift + glisser.',
      'Sur mobile, zoomez avec deux doigts et evitez de masquer les atomes.',
    ],
  },
  ja: {
    intro: 'このガイドを使うと、分子構築を速く進め、構造を細かく調整し、立体配置を確認しやすくなります。',
    controlsLabel: '個の操作',
    stepsLabel: 'ステップ',
    groups: {
      build: '基本構築',
      edit: '編集と調整',
      navigate: '視点操作',
    },
    groupDescriptions: {
      build: '原子を配置し、結合を作って骨格を組み立てます。',
      edit: '結合を選択して強化/削除ボタンを使い、意図した編集を行います。',
      navigate: 'カメラ回転とズームで分子を詳しく確認します。',
    },
    quickTips: [
      '基本操作は、結合を選んでから強化/削除ボタンを使う流れです。',
      '削除モードは高速な整理ショートカットとして使い、終わったら構築モードへ戻します。',
      '結合を正確に回転するには、単結合を選んでから Shift を押してドラッグします。',
      'モバイルでは 2 本指でズームし、ドラッグ時は原子を隠さないようにします。',
    ],
  },
};

export function InstructionsPage() {
  const language = useStore((state) => state.language);
  const theme = useStore((state) => state.theme);
  const messages = useMemo(() => getMessages(language), [language]);
  const isDark = theme === 'dark';
  const copy = INTRO_COPY[language];
  const textClass = isDark ? 'text-zinc-200' : 'text-zinc-700';
  const cardClass = 'info-card info-reveal rounded-2xl border p-4 md:p-5 backdrop-blur-sm';
  const headingClass = isDark ? 'text-zinc-100' : 'text-zinc-900';
  const mutedClass = isDark ? 'text-zinc-400' : 'text-zinc-600';
  const badgeClass = 'info-accent-pill inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold';
  const tipsClass = 'info-callout info-reveal rounded-2xl border p-4 md:p-5';
  const disclaimerClass = isDark
    ? 'info-reveal rounded-2xl border border-amber-300/20 bg-amber-500/10 p-4 md:p-5'
    : 'info-reveal rounded-2xl border border-amber-300 bg-amber-50/95 p-4 md:p-5';
  const disclaimerTitleClass = isDark ? 'text-amber-100' : 'text-amber-950';
  const disclaimerTextClass = isDark ? 'text-amber-100/85' : 'text-amber-900';
  const disclaimerIconClass = isDark ? 'text-amber-300' : 'text-amber-700';

  const instructionGroups = [
    {
      key: 'build',
      title: copy.groups.build,
      description: copy.groupDescriptions.build,
      steps: messages.ui.controlsList.slice(0, 2),
      startIndex: 0,
    },
    {
      key: 'edit',
      title: copy.groups.edit,
      description: copy.groupDescriptions.edit,
      steps: messages.ui.controlsList.slice(2, 6),
      startIndex: 2,
    },
    {
      key: 'navigate',
      title: copy.groups.navigate,
      description: copy.groupDescriptions.navigate,
      steps: messages.ui.controlsList.slice(6),
      startIndex: 6,
    },
  ];

  return (
    <InfoPageLayout
      title={messages.ui.instructionsTitle}
      description={copy.intro}
      metadata={(
        <span className={badgeClass}>
          {messages.ui.controlsList.length} {copy.controlsLabel}
        </span>
      )}
    >
      <section className={disclaimerClass} style={{ animationDelay: '230ms' }}>
        <div className="flex items-start gap-3">
          <Info size={18} className={`mt-0.5 shrink-0 ${disclaimerIconClass}`} aria-hidden="true" />
          <div>
            <h2 className={`info-display text-sm md:text-base font-bold ${disclaimerTitleClass}`}>
              {messages.ui.educationalDisclaimerTitle}
            </h2>
            <p className={`mt-2 text-xs leading-6 md:text-sm ${disclaimerTextClass}`}>
              {messages.ui.educationalDisclaimerBody}
            </p>
          </div>
        </div>
      </section>

      {instructionGroups.map((group, groupIndex) => (
        <section
          key={group.key}
          className={cardClass}
          style={{ animationDelay: `${260 + groupIndex * 70}ms` }}
        >
          <div className="flex items-center justify-between gap-3">
            <h2 className={`info-display text-sm md:text-base font-bold ${headingClass}`}>{group.title}</h2>
            <span className={`text-[11px] uppercase tracking-[0.12em] ${mutedClass}`}>
              {group.steps.length} {copy.stepsLabel}
            </span>
          </div>
          <p className={`mt-1 text-xs md:text-sm leading-relaxed ${mutedClass}`}>{group.description}</p>
          <ol className={`mt-4 space-y-3 text-sm md:text-base ${textClass}`}>
            {group.steps.map((item, index) => (
              <li key={item} className="flex items-start gap-3 leading-relaxed">
                <span
                  className={`info-accent-pill mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold`}
                >
                  {group.startIndex + index + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </section>
      ))}

      <section className={tipsClass} style={{ animationDelay: '500ms' }}>
        <div className="flex items-start gap-3">
          <BookOpenText size={18} className={`mt-0.5 shrink-0 ${isDark ? 'text-cyan-200' : 'text-cyan-700'}`} aria-hidden="true" />
          <div>
            <h2 className={`info-display text-sm md:text-base font-bold ${isDark ? 'text-cyan-100' : 'text-cyan-900'}`}>{messages.ui.mobileTipsTitle}</h2>
            <ul className={`mt-2 space-y-2 text-xs md:text-sm ${isDark ? 'text-cyan-200' : 'text-cyan-800'}`}>
              {copy.quickTips.map((tip) => (
                <li key={tip} className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </InfoPageLayout>
  );
}
