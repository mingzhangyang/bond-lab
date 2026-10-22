import { localizeMoleculeName as localizeBuiltInName, type Language } from './i18n.ts';
import { getMoleculeInfo as getBuiltInInfo, type MoleculeInfo } from './moleculeInfo.ts';
import { getMoleculeDefinition } from './moleculeCatalog.ts';

const UNKNOWN_NAMES: Record<Language, string> = {
  en: 'Unrecognized structure', zh: '\u672a\u8bc6\u522b\u7684\u7ed3\u6784', es: 'Estructura no reconocida',
  fr: 'Structure non reconnue', ja: '\u672a\u8a8d\u8b58\u306e\u69cb\u9020',
};

const COMPOUND_MODEL_NOTES: Record<Language, string> = {
  en: 'Simplified formula-unit model: the connectors do not represent a discrete molecule or a crystal lattice. Molecular polarity is not assigned to this representation.',
  zh: '\u8fd9\u662f\u5316\u5b66\u5f0f\u5355\u5143\u7684\u7b80\u5316\u793a\u610f\u3002\u8fde\u7ebf\u4e0d\u4ee3\u8868\u72ec\u7acb\u5206\u5b50\u6216\u771f\u5b9e\u6676\u683c\uff0c\u4e0d\u5bf9\u6b64\u793a\u610f\u5224\u5b9a\u5206\u5b50\u6781\u6027\u3002',
  es: 'Modelo simplificado de unidad de f\u00f3rmula: las conexiones no representan una mol\u00e9cula aislada ni una red cristalina. No se asigna polaridad molecular a esta representaci\u00f3n.',
  fr: "Mod\u00e8le simplifi\u00e9 d'unit\u00e9 de formule : les connexions ne repr\u00e9sentent ni une mol\u00e9cule isol\u00e9e ni un r\u00e9seau cristallin. Aucune polarit\u00e9 mol\u00e9culaire n'est attribu\u00e9e.",
  ja: '\u5316\u5b66\u5f0f\u5358\u4f4d\u306e\u7c21\u7565\u30e2\u30c7\u30eb\u3067\u3059\u3002\u7dda\u306f\u72ec\u7acb\u3057\u305f\u5206\u5b50\u3084\u5b9f\u969b\u306e\u7d50\u6676\u683c\u5b50\u3092\u8868\u3055\u305a\u3001\u5206\u5b50\u306e\u6975\u6027\u306f\u5224\u5b9a\u3057\u307e\u305b\u3093\u3002',
};

export function getCompoundModelNote(language: Language): string {
  return COMPOUND_MODEL_NOTES[language];
}

export function localizeMoleculeName(language: Language, name: string): string {
  if (name === 'Unknown Molecule') return UNKNOWN_NAMES[language];
  return getMoleculeDefinition(name)?.names?.[language] ?? localizeBuiltInName(language, name);
}

export function getMoleculeInfo(name: string, language: Language = 'en'): MoleculeInfo | null {
  const definition = getMoleculeDefinition(name);
  const info = getBuiltInInfo(name);
  if (!definition || definition.representation === 'bond-graph') return info;
  return {
    structure: definition.ionNotation ?? info?.structure ?? definition.formula,
    fact: [info?.fact, getCompoundModelNote(language)].filter(Boolean).join(' '),
  };
}
