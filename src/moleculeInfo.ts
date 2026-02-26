interface MoleculeInfo {
  structure: string;
  fact: string;
}

const MOLECULE_INFO: Record<string, MoleculeInfo> = {
  Water: {
    structure: 'H-O-H',
    fact: 'Bent geometry gives water a net dipole, enabling strong hydrogen bonding.',
  },
  Methane: {
    structure: 'H-C(H)3',
    fact: 'Methane is tetrahedral and nonpolar because C-H bond dipoles cancel.',
  },
  'Carbon Dioxide': {
    structure: 'O=C=O',
    fact: 'Linear geometry cancels two polar C=O bonds, making CO2 nonpolar.',
  },
  Ammonia: {
    structure: 'H-N(H)2',
    fact: 'The lone pair on nitrogen gives ammonia a trigonal pyramidal shape and polarity.',
  },
  Ethane: {
    structure: 'H3C-CH3',
    fact: 'Ethane rotates around its central C-C single bond under normal conditions.',
  },
  Ethene: {
    structure: 'H2C=CH2',
    fact: 'The C=C double bond constrains rotation and keeps ethene planar.',
  },
  Ethyne: {
    structure: 'HC≡CH',
    fact: 'A C≡C triple bond gives ethyne a linear geometry.',
  },
  Oxygen: {
    structure: 'O=O',
    fact: 'Dioxygen has a double bond and is essential for aerobic respiration.',
  },
  Nitrogen: {
    structure: 'N≡N',
    fact: 'The N≡N triple bond is very strong, making nitrogen gas relatively inert.',
  },
  Hydrogen: {
    structure: 'H-H',
    fact: 'Hydrogen gas is the lightest diatomic molecule.',
  },
  Methanol: {
    structure: 'CH3-OH',
    fact: 'Methanol combines a nonpolar methyl group with a polar hydroxyl group.',
  },
  Ethanol: {
    structure: 'CH3-CH2-OH',
    fact: 'Ethanol mixes with water because its hydroxyl group is strongly polar.',
  },
  Formaldehyde: {
    structure: 'H2C=O',
    fact: 'The carbonyl bond gives formaldehyde high reactivity.',
  },
  'Hydrogen Cyanide': {
    structure: 'H-C≡N',
    fact: 'Hydrogen cyanide is linear and strongly polar due to the C≡N bond.',
  },
};

export function getMoleculeInfo(name: string): MoleculeInfo | null {
  return MOLECULE_INFO[name] ?? null;
}
