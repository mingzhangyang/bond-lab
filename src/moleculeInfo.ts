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
  'Hydrogen Fluoride': {
    structure: 'H-F',
    fact: 'Hydrogen fluoride is highly polar because fluorine strongly attracts electrons.',
  },
  'Hydrogen Chloride': {
    structure: 'H-Cl',
    fact: 'Hydrogen chloride forms hydrochloric acid when dissolved in water.',
  },
  'Hydrogen Sulfide': {
    structure: 'H-S-H',
    fact: 'Hydrogen sulfide is bent and polar, with weaker hydrogen bonding than water.',
  },
  'Sulfur Dioxide': {
    structure: 'O=S=O',
    fact: 'Sulfur dioxide is bent and polar despite having two S=O double bonds.',
  },
  Phosphine: {
    structure: 'H-P(H)2',
    fact: 'Phosphine is trigonal pyramidal and much less basic than ammonia.',
  },
  'Phosphorus Trichloride': {
    structure: 'Cl-P(Cl)2',
    fact: 'Phosphorus trichloride is a reactive precursor used to make many organophosphorus compounds.',
  },
  'Carbon Tetrachloride': {
    structure: 'Cl-C(Cl)3',
    fact: 'Carbon tetrachloride is tetrahedral and nonpolar because C-Cl dipoles cancel.',
  },
  Benzene: {
    structure: 'C₆H₆ (ring)',
    fact: 'Benzene is aromatic: its six π electrons are delocalized around the ring, giving it exceptional stability.',
  },
  Fluorine: {
    structure: 'F-F',
    fact: 'Fluorine is the most electronegative element, making F₂ highly reactive.',
  },
  Chlorine: {
    structure: 'Cl-Cl',
    fact: 'Chlorine gas was historically used as a disinfectant and is essential for water treatment.',
  },
  'Nitric Oxide': {
    structure: 'N=O',
    fact: 'Nitric oxide is a signaling molecule in the body that helps regulate blood pressure.',
  },
  'Hydrogen Peroxide': {
    structure: 'H-O-O-H',
    fact: 'The O-O single bond in hydrogen peroxide is weak, making it a powerful oxidizer.',
  },
  'Sulfur Trioxide': {
    structure: 'O=S(=O)=O',
    fact: 'Sulfur trioxide reacts violently with water to form sulfuric acid.',
  },
  Ozone: {
    structure: 'O=O-O',
    fact: 'Ozone in the stratosphere absorbs harmful UV radiation, protecting life on Earth.',
  },
  Propane: {
    structure: 'H3C-CH2-CH3',
    fact: 'Propane is widely used as a fuel for heating and cooking in portable gas cylinders.',
  },
  Propene: {
    structure: 'H2C=CH-CH3',
    fact: 'Propene is one of the most important feedstocks in the petrochemical industry.',
  },
  Propyne: {
    structure: 'HC≡C-CH3',
    fact: 'Propyne is used in welding and as a starting material for specialty chemicals.',
  },
  Butane: {
    structure: 'H3C-CH2-CH2-CH3',
    fact: 'Butane is the fuel in disposable lighters and is highly flammable.',
  },
  '1,3-Butadiene': {
    structure: 'H2C=CH-CH=CH2',
    fact: '1,3-Butadiene has two conjugated double bonds and is a key monomer for synthetic rubber.',
  },
  'Formic Acid': {
    structure: 'H-C(=O)-OH',
    fact: 'Formic acid is the simplest carboxylic acid and is responsible for ant sting pain.',
  },
  'Acetic Acid': {
    structure: 'CH3-C(=O)-OH',
    fact: 'Acetic acid gives vinegar its sharp taste and smell, and is widely used in food preservation.',
  },
  Acetaldehyde: {
    structure: 'CH3-CH=O',
    fact: 'Acetaldehyde is formed when ethanol is metabolized in the liver.',
  },
  Acetone: {
    structure: 'CH3-CO-CH3',
    fact: 'Acetone is the simplest ketone and is the active ingredient in nail polish remover.',
  },
  'Dimethyl Ether': {
    structure: 'CH3-O-CH3',
    fact: 'Dimethyl ether is an isomer of ethanol with entirely different properties, used as a propellant.',
  },
  Methylamine: {
    structure: 'CH3-NH2',
    fact: 'Methylamine has a strong fishy odor and is used in the synthesis of pharmaceuticals.',
  },
  Acetonitrile: {
    structure: 'CH3-C≡N',
    fact: 'Acetonitrile is a common polar aprotic solvent used in chromatography.',
  },
  Urea: {
    structure: 'H2N-CO-NH2',
    fact: 'Urea is the main nitrogen-containing compound in mammalian urine and is widely used as a fertilizer.',
  },
  Methanethiol: {
    structure: 'CH3-SH',
    fact: 'Methanethiol has a strong odor and is added to natural gas to make leaks detectable.',
  },
  'Dimethyl Sulfide': {
    structure: 'CH3-S-CH3',
    fact: 'Dimethyl sulfide is produced by marine algae and contributes to the smell of the ocean.',
  },
  Fluoromethane: {
    structure: 'CH3-F',
    fact: 'Fluoromethane is the simplest fluorocarbon and has a very strong C-F bond.',
  },
  Chloromethane: {
    structure: 'CH3-Cl',
    fact: 'Chloromethane is produced naturally by ocean algae and is used in silicone production.',
  },
  Dichloromethane: {
    structure: 'H2C(Cl)2',
    fact: 'Dichloromethane is a versatile solvent used in paint stripping and pharmaceutical manufacturing.',
  },
  Chloroform: {
    structure: 'HCCl3',
    fact: 'Chloroform was one of the first anesthetics used in surgery in the 19th century.',
  },
  'Sodium Chloride': {
    structure: 'Na-Cl',
    fact: 'Sodium chloride (table salt) is essential for life and has been used as a food preservative for millennia.',
  },
  'Potassium Chloride': {
    structure: 'K-Cl',
    fact: 'Potassium chloride is used as a potassium supplement and as a salt substitute in low-sodium diets.',
  },
  'Sodium Fluoride': {
    structure: 'Na-F',
    fact: 'Sodium fluoride is added to toothpaste and water supplies to prevent tooth decay.',
  },
  'Potassium Fluoride': {
    structure: 'K-F',
    fact: 'Potassium fluoride is used in the manufacture of glass and as a fluorinating agent.',
  },
  'Magnesium Chloride': {
    structure: 'Cl-Mg-Cl',
    fact: 'Magnesium chloride is used to de-ice roads and is found in seawater.',
  },
  'Calcium Chloride': {
    structure: 'Cl-Ca-Cl',
    fact: 'Calcium chloride absorbs moisture strongly and is used as a desiccant and road de-icer.',
  },
  'Aluminum Chloride': {
    structure: 'Cl-Al(Cl)2',
    fact: 'Aluminum chloride is a strong Lewis acid used as a catalyst in organic reactions.',
  },
  'Iron(II) Chloride': {
    structure: 'Cl-Fe-Cl',
    fact: 'Iron(II) chloride (ferrous chloride) is used in water treatment and as a reducing agent.',
  },
  'Iron(III) Chloride': {
    structure: 'Cl-Fe(Cl)2',
    fact: 'Iron(III) chloride (ferric chloride) is used to etch copper in circuit board manufacturing.',
  },
  'Copper(II) Chloride': {
    structure: 'Cl-Cu-Cl',
    fact: 'Copper(II) chloride is used as a catalyst and gives fireworks a blue-green color.',
  },
  'Calcium Oxide': {
    structure: 'Ca-O',
    fact: 'Calcium oxide (quicklime) reacts violently with water and is used in cement production.',
  },
  'Magnesium Oxide': {
    structure: 'Mg-O',
    fact: 'Magnesium oxide has an extremely high melting point and is used as a refractory material.',
  },
  Glycine: { structure: 'H2N-CH2-COOH', fact: 'Glycine is the simplest amino acid and the only one without a chiral center.' },
  Alanine: { structure: 'H2N-CH(CH3)-COOH', fact: 'Alanine is a major source of energy for muscles and is involved in glucose metabolism.' },
  Valine: { structure: 'H2N-CH(CHMe2)-COOH', fact: 'Valine is a branched-chain essential amino acid important for muscle metabolism.' },
  Leucine: { structure: 'H2N-CH(CH2CHMe2)-COOH', fact: 'Leucine is the most common amino acid in proteins and a key activator of muscle protein synthesis.' },
  Isoleucine: { structure: 'H2N-CH(CH(Me)Et)-COOH', fact: 'Isoleucine is a branched-chain essential amino acid that plays a key role in energy regulation.' },
  Proline: { structure: 'cyclic-pyrrolidine-COOH', fact: 'Proline is unique in having its side chain bonded back to the backbone nitrogen, creating a rigid ring.' },
  Phenylalanine: { structure: 'H2N-CH(CH2Ph)-COOH', fact: 'Phenylalanine is the precursor to tyrosine and the neurotransmitters dopamine and adrenaline.' },
  Tryptophan: { structure: 'H2N-CH(CH2-indolyl)-COOH', fact: 'Tryptophan is the precursor to serotonin and the largest of the standard amino acids.' },
  Methionine: { structure: 'H2N-CH(CH2CH2SMe)-COOH', fact: 'Methionine is the start codon amino acid and a key methyl group donor in metabolism.' },
  Serine: { structure: 'H2N-CH(CH2OH)-COOH', fact: 'Serine is an important site for phosphorylation in signal transduction pathways.' },
  Threonine: { structure: 'H2N-CH(CH(OH)Me)-COOH', fact: 'Threonine is an essential amino acid that promotes normal growth and gut function.' },
  Cysteine: { structure: 'H2N-CH(CH2SH)-COOH', fact: 'The thiol group of cysteine can form disulfide bonds that stabilize protein structure.' },
  Tyrosine: { structure: 'H2N-CH(CH2-pOHPh)-COOH', fact: 'Tyrosine is the precursor to dopamine, adrenaline, and thyroid hormones.' },
  Asparagine: { structure: 'H2N-CH(CH2CONH2)-COOH', fact: 'Asparagine is involved in N-linked glycosylation and was the first amino acid to be isolated.' },
  Glutamine: { structure: 'H2N-CH(CH2CH2CONH2)-COOH', fact: 'Glutamine is the most abundant amino acid in blood and a key nitrogen transporter.' },
  'Aspartic Acid': { structure: 'H2N-CH(CH2COOH)-COOH', fact: 'Aspartic acid is a neurotransmitter and a key component of the urea cycle.' },
  'Glutamic Acid': { structure: 'H2N-CH(CH2CH2COOH)-COOH', fact: 'Glutamic acid is the most abundant excitatory neurotransmitter in the nervous system.' },
  Lysine: { structure: 'H2N-CH((CH2)4NH2)-COOH', fact: 'Lysine is an essential amino acid crucial for collagen synthesis and calcium absorption.' },
  Arginine: { structure: 'H2N-CH(CH2CH2CH2NHC(=NH)NH2)-COOH', fact: 'Arginine is the precursor to nitric oxide and plays key roles in the urea cycle.' },
  Histidine: { structure: 'H2N-CH(CH2-imidazolyl)-COOH', fact: 'The imidazole group of histidine acts as a proton shuttle in enzyme active sites.' },
  'Oxaloacetic Acid': { structure: 'HOOC-C(=O)-CH2-COOH', fact: 'Oxaloacetate is the entry point of the TCA cycle, accepting acetyl-CoA to form citrate.' },
  'Citric Acid': { structure: 'HOOC-CH2-C(OH)(COOH)-CH2-COOH', fact: 'Citric acid gives the TCA cycle its name and is produced in the first step of the cycle.' },
  'Isocitric Acid': { structure: 'HOOC-CH2-CH(COOH)-CHOH-COOH', fact: 'Isocitrate is formed from citrate by aconitase and is the first oxidation step in the TCA cycle.' },
  'Alpha-Ketoglutaric Acid': { structure: 'HOOC-C(=O)-CH2-CH2-COOH', fact: 'Alpha-ketoglutarate links the TCA cycle to amino acid metabolism as a hub molecule.' },
  'Succinic Acid': { structure: 'HOOC-CH2-CH2-COOH', fact: 'Succinic acid oxidation by succinate dehydrogenase is the only TCA cycle step linked directly to the electron transport chain.' },
  'Fumaric Acid': { structure: 'HOOC-CH=CH-COOH', fact: 'Fumarate is the trans isomer of maleate and is also produced in the urea cycle.' },
  'Malic Acid': { structure: 'HOOC-CHOH-CH2-COOH', fact: 'Malic acid gives apples their tart flavor and is oxidized to oxaloacetate to complete the TCA cycle.' },
  'D-Glucose': { structure: 'CHO-(CHOH)4-CH2OH', fact: 'D-Glucose is the primary energy source for most living organisms and the product of photosynthesis.' },
};

export function getMoleculeInfo(name: string): MoleculeInfo | null {
  return MOLECULE_INFO[name] ?? null;
}
