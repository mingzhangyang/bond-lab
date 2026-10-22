import type { ElementType } from '../chemistry.ts';
import type { Language } from '../i18n.ts';
import type { MoleculeTemplate } from './moleculeTemplates.ts';

export interface HydroxideDefinition extends MoleculeTemplate {
  names: Record<Language, string>;
  representation: 'ionic-formula-unit';
  ionNotation: string;
}

interface HydroxideRecipe {
  metal: ElementType;
  charge: 1 | 2 | 3;
  names: Record<Language, string>;
}

// The charge determines both OH-group count and formula. Connections to the
// metal are educational associations, not a claim of discrete covalent molecules.
const RECIPES: HydroxideRecipe[] = [
  {
    metal: 'Na', charge: 1,
    names: { en: 'Sodium Hydroxide', zh: '\u6c22\u6c27\u5316\u94a0', es: 'Hidr\u00f3xido de sodio', fr: 'Hydroxyde de sodium', ja: '\u6c34\u9178\u5316\u30ca\u30c8\u30ea\u30a6\u30e0' },
  },
  {
    metal: 'K', charge: 1,
    names: { en: 'Potassium Hydroxide', zh: '\u6c22\u6c27\u5316\u94be', es: 'Hidr\u00f3xido de potasio', fr: 'Hydroxyde de potassium', ja: '\u6c34\u9178\u5316\u30ab\u30ea\u30a6\u30e0' },
  },
  {
    metal: 'Mg', charge: 2,
    names: { en: 'Magnesium Hydroxide', zh: '\u6c22\u6c27\u5316\u9541', es: 'Hidr\u00f3xido de magnesio', fr: 'Hydroxyde de magn\u00e9sium', ja: '\u6c34\u9178\u5316\u30de\u30b0\u30cd\u30b7\u30a6\u30e0' },
  },
  {
    metal: 'Ca', charge: 2,
    names: { en: 'Calcium Hydroxide', zh: '\u6c22\u6c27\u5316\u9499', es: 'Hidr\u00f3xido de calcio', fr: 'Hydroxyde de calcium', ja: '\u6c34\u9178\u5316\u30ab\u30eb\u30b7\u30a6\u30e0' },
  },
  {
    metal: 'Al', charge: 3,
    names: { en: 'Aluminum Hydroxide', zh: '\u6c22\u6c27\u5316\u94dd', es: 'Hidr\u00f3xido de aluminio', fr: "Hydroxyde d'aluminium", ja: '\u6c34\u9178\u5316\u30a2\u30eb\u30df\u30cb\u30a6\u30e0' },
  },
  {
    metal: 'Fe', charge: 2,
    names: { en: 'Iron(II) Hydroxide', zh: '\u6c22\u6c27\u5316\u4e9a\u94c1', es: 'Hidr\u00f3xido de hierro(II)', fr: 'Hydroxyde de fer(II)', ja: '\u6c34\u9178\u5316\u9244(II)' },
  },
  {
    metal: 'Fe', charge: 3,
    names: { en: 'Iron(III) Hydroxide', zh: '\u6c22\u6c27\u5316\u94c1', es: 'Hidr\u00f3xido de hierro(III)', fr: 'Hydroxyde de fer(III)', ja: '\u6c34\u9178\u5316\u9244(III)' },
  },
  {
    metal: 'Cu', charge: 2,
    names: { en: 'Copper(II) Hydroxide', zh: '\u6c22\u6c27\u5316\u94dc', es: 'Hidr\u00f3xido de cobre(II)', fr: 'Hydroxyde de cuivre(II)', ja: '\u6c34\u9178\u5316\u9285(II)' },
  },
];

function makeHydroxide({ metal, charge, names }: HydroxideRecipe): HydroxideDefinition {
  const atoms: ElementType[] = [metal];
  const bonds: MoleculeTemplate['bonds'] = [];
  for (let i = 0; i < charge; i++) {
    const oxygen = atoms.length;
    atoms.push('O', 'H');
    bonds.push({ a: 0, b: oxygen, order: 1 }, { a: oxygen, b: oxygen + 1, order: 1 });
  }
  return {
    name: names.en,
    names,
    formula: charge === 1 ? `${metal}OH` : `${metal}(OH)${charge === 2 ? '\u2082' : '\u2083'}`,
    atoms,
    bonds,
    representation: 'ionic-formula-unit',
    ionNotation: `${metal}${charge === 1 ? '' : charge}+ + ${charge === 1 ? '' : `${charge} `}OH-`,
  };
}

export const HYDROXIDE_DEFINITIONS: HydroxideDefinition[] = RECIPES.map(makeHydroxide);
