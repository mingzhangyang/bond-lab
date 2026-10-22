import { MOLECULE_TEMPLATES, type MoleculeTemplate } from './data/moleculeTemplates.ts';
import { HYDROXIDE_DEFINITIONS } from './data/hydroxides.ts';
import type { Language } from './i18n.ts';

export interface MoleculeDefinition extends MoleculeTemplate {
  representation: 'bond-graph' | 'ionic-formula-unit' | 'simplified-compound';
  names?: Record<Language, string>;
  ionNotation?: string;
}

// Explicit classification, not an inference from electronegativity or a metal
// atom alone. AlCl3 is deliberately not described as a simple ionic compound.
const IONIC_FORMULA_UNITS = new Set([
  'Sodium Chloride', 'Potassium Chloride', 'Sodium Fluoride', 'Potassium Fluoride',
  'Magnesium Chloride', 'Calcium Chloride', 'Iron(II) Chloride', 'Iron(III) Chloride',
  'Copper(II) Chloride', 'Calcium Oxide', 'Magnesium Oxide',
]);

const CARBON_MONOXIDE_NAMES: Record<Language, string> = {
  en: 'Carbon Monoxide', zh: '\u4e00\u6c27\u5316\u78b3', es: 'Mon\u00f3xido de carbono',
  fr: 'Monoxyde de carbone', ja: '\u4e00\u9178\u5316\u70ad\u7d20',
};

/** Shared source for recognition, display metadata and challenge eligibility. */
export const MOLECULE_CATALOG: readonly MoleculeDefinition[] = Object.freeze([
  ...MOLECULE_TEMPLATES.map((template): MoleculeDefinition => ({
    ...template,
    representation: IONIC_FORMULA_UNITS.has(template.name) ? 'ionic-formula-unit'
      : template.name === 'Aluminum Chloride' ? 'simplified-compound' : 'bond-graph',
    ...(template.name === 'Carbon Monoxide' ? { names: CARBON_MONOXIDE_NAMES } : {}),
  })),
  ...HYDROXIDE_DEFINITIONS,
].map((definition) => Object.freeze(definition)));

const DEFINITIONS_BY_NAME = new Map(MOLECULE_CATALOG.map((definition) => [definition.name, definition]));

export function getMoleculeDefinition(name: string): MoleculeDefinition | undefined {
  return DEFINITIONS_BY_NAME.get(name);
}
