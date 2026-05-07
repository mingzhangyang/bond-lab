import { identifyMolecule } from './identifier.ts';
import { localizeMoleculeName, type Language } from './i18n.ts';
import { getMoleculeInfo } from './moleculeInfo.ts';
import {
  calculateMolecularPolarity,
  type PolarityClass,
  type PolarityReport,
  type Position3D,
} from './polarity.ts';
import type { Atom, Bond } from './store.ts';

const POLARITY_LABELS: Record<Language, Record<PolarityClass, string>> = {
  en: { polar: 'Polar', nonpolar: 'Nonpolar', unknown: 'Unknown' },
  es: { polar: 'Polar', nonpolar: 'No polar', unknown: 'Desconocido' },
  zh: { polar: '极性', nonpolar: '非极性', unknown: '未知' },
  fr: { polar: 'Polaire', nonpolar: 'Apolaire', unknown: 'Inconnu' },
  ja: { polar: '極性', nonpolar: '無極性', unknown: '不明' },
};

const POLARITY_TITLES: Record<Language, string> = {
  en: 'Polarity',
  es: 'Polaridad',
  zh: '极性',
  fr: 'Polarite',
  ja: '極性',
};

const STRUCTURE_TITLES: Record<Language, string> = {
  en: 'Structure',
  es: 'Estructura',
  zh: '结构式',
  fr: 'Structure',
  ja: '構造式',
};

const FACT_TITLES: Record<Language, string> = {
  en: 'Quick Fact',
  es: 'Dato',
  zh: '小知识',
  fr: 'Info',
  ja: '豆知识',
};

export interface MoleculeInsights {
  molecule: { name: string; formula: string } | null;
  moleculeName: string | null;
  moleculeInfo: ReturnType<typeof getMoleculeInfo>;
  polarityReport: PolarityReport;
  polarityLabel: string;
  polarityTitle: string;
  structureTitle: string;
  factTitle: string;
}

interface DeriveMoleculeInsightsParams {
  atoms: Atom[];
  bonds: Bond[];
  language: Language;
  positions?: Record<string, Position3D | undefined>;
}

export function deriveMoleculeInsights({
  atoms,
  bonds,
  language,
  positions,
}: DeriveMoleculeInsightsParams): MoleculeInsights {
  const molecule = identifyMolecule(atoms, bonds);
  const moleculeName = molecule ? localizeMoleculeName(language, molecule.name) : null;
  const moleculeInfo = molecule ? getMoleculeInfo(molecule.name) : null;
  const polarityReport = calculateMolecularPolarity(atoms, bonds, positions);

  return {
    molecule,
    moleculeName,
    moleculeInfo,
    polarityReport,
    polarityLabel: POLARITY_LABELS[language][polarityReport.classification],
    polarityTitle: POLARITY_TITLES[language],
    structureTitle: STRUCTURE_TITLES[language],
    factTitle: FACT_TITLES[language],
  };
}
