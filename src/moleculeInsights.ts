import { analyzeMolecule } from './identifier.ts';
import type { Language } from './i18n.ts';
import { getMoleculeDefinition } from './moleculeCatalog.ts';
import { getCompoundModelNote, getMoleculeInfo, localizeMoleculeName } from './moleculeDisplay.ts';
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

const NOT_APPLICABLE_LABELS: Record<Language, string> = {
  en: 'Not applicable', es: 'No aplicable', zh: '不适用', fr: 'Sans objet', ja: '対象外',
};

const POLARITY_TITLES: Record<Language, string> = {
  en: 'Polarity',
  es: 'Polaridad',
  zh: '极性',
  fr: 'Polarité',
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
  ja: '豆知識',
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
  const recognition = analyzeMolecule(atoms, bonds);
  const molecule = recognition.molecule;
  const definition = molecule ? getMoleculeDefinition(molecule.name) : undefined;
  const isFormulaUnit = definition !== undefined && definition.representation !== 'bond-graph';
  const moleculeName = molecule ? localizeMoleculeName(language, molecule.name) : null;
  const moleculeInfo = molecule ? getMoleculeInfo(molecule.name, language) : null;
  const polarityReport: PolarityReport = isFormulaUnit
    ? { classification: 'unknown', netDipole: 0, reason: getCompoundModelNote(language) }
    : molecule ? calculateMolecularPolarity(atoms, bonds, positions)
      : { classification: 'unknown', netDipole: 0, reason: 'A single valid connected structure is required.' };

  return {
    molecule,
    moleculeName,
    moleculeInfo,
    polarityReport,
    polarityLabel: isFormulaUnit ? NOT_APPLICABLE_LABELS[language] : POLARITY_LABELS[language][polarityReport.classification],
    polarityTitle: POLARITY_TITLES[language],
    structureTitle: STRUCTURE_TITLES[language],
    factTitle: FACT_TITLES[language],
  };
}
