export type Language = 'en' | 'es';

export interface Messages {
  appTitle: string;
  ui: {
    elements: string;
    controls: string;
    addElement: string;
    selectElement: string;
    clear: string;
    clearAll: string;
    currentMolecule: string;
    valence: string;
    interactionMode: string;
    buildMode: string;
    deleteMode: string;
    removeHint: string;
    themeToggle: string;
    languageToggle: string;
    close: string;
    mobileTipsTitle: string;
    controlsList: string[];
  };
  challenge: {
    title: string;
    target: string;
    start: string;
    next: string;
    retry: string;
    wonHeadline: string;
    wonMessagePrefix: string;
    lostHeadline: string;
    lostMessagePrefix: string;
    secondsShort: string;
    close: string;
  };
  stability: {
    title: string;
  };
  elements: {
    H: string;
    C: string;
    N: string;
    O: string;
  };
}

const EN_MESSAGES: Messages = {
  appTitle: 'BondLab',
  ui: {
    elements: 'Elements',
    controls: 'Controls',
    addElement: 'Add Element',
    selectElement: 'Select Element',
    clear: 'Clear',
    clearAll: 'Clear All',
    currentMolecule: 'Current Molecule',
    valence: 'Valence',
    interactionMode: 'Interaction',
    buildMode: 'Build',
    deleteMode: 'Delete',
    removeHint: 'Switch to Delete mode to remove atoms and bonds.',
    themeToggle: 'Toggle color theme',
    languageToggle: 'Switch language',
    close: 'Close',
    mobileTipsTitle: 'Quick tips',
    controlsList: [
      'Tap an element to add it',
      'Tap two atoms to create a bond',
      'Drag atoms to move them',
      'Tap a bond to upgrade it',
      'Delete mode: tap atom/bond to remove',
      'Drag background to rotate camera',
      'Pinch or scroll to zoom',
    ],
  },
  challenge: {
    title: 'Challenge',
    target: 'Target',
    start: 'Challenge',
    next: 'Next Challenge',
    retry: 'Try Again',
    wonHeadline: 'Brilliant!',
    wonMessagePrefix: 'You successfully built',
    lostHeadline: "Time's Up!",
    lostMessagePrefix: 'The molecule was',
    secondsShort: 's',
    close: 'Stop challenge',
  },
  stability: {
    title: 'Stability',
  },
  elements: {
    H: 'Hydrogen',
    C: 'Carbon',
    N: 'Nitrogen',
    O: 'Oxygen',
  },
};

const ES_MESSAGES: Messages = {
  appTitle: 'BondLab',
  ui: {
    elements: 'Elementos',
    controls: 'Controles',
    addElement: 'Agregar elemento',
    selectElement: 'Seleccionar elemento',
    clear: 'Limpiar',
    clearAll: 'Limpiar todo',
    currentMolecule: 'Molecula actual',
    valence: 'Valencia',
    interactionMode: 'Interaccion',
    buildMode: 'Construir',
    deleteMode: 'Eliminar',
    removeHint: 'Cambia al modo Eliminar para quitar atomos y enlaces.',
    themeToggle: 'Cambiar tema de color',
    languageToggle: 'Cambiar idioma',
    close: 'Cerrar',
    mobileTipsTitle: 'Consejos rapidos',
    controlsList: [
      'Toca un elemento para agregarlo',
      'Toca dos atomos para enlazarlos',
      'Arrastra atomos para moverlos',
      'Toca un enlace para mejorarlo',
      'Modo Eliminar: toca atomo/enlace para quitar',
      'Arrastra el fondo para rotar',
      'Pellizca o usa rueda para zoom',
    ],
  },
  challenge: {
    title: 'Desafio',
    target: 'Objetivo',
    start: 'Desafio',
    next: 'Siguiente desafio',
    retry: 'Intentar de nuevo',
    wonHeadline: 'Excelente!',
    wonMessagePrefix: 'Construiste correctamente',
    lostHeadline: 'Se acabo el tiempo',
    lostMessagePrefix: 'La molecula era',
    secondsShort: 's',
    close: 'Detener desafio',
  },
  stability: {
    title: 'Estabilidad',
  },
  elements: {
    H: 'Hidrogeno',
    C: 'Carbono',
    N: 'Nitrogeno',
    O: 'Oxigeno',
  },
};

const MESSAGES: Record<Language, Messages> = {
  en: EN_MESSAGES,
  es: ES_MESSAGES,
};

const MOLECULE_NAME_MAP: Record<Language, Record<string, string>> = {
  en: {},
  es: {
    Water: 'Agua',
    Methane: 'Metano',
    'Carbon Dioxide': 'Dioxido de carbono',
    Ammonia: 'Amoniaco',
    Ethane: 'Etano',
    Ethene: 'Eteno',
    Ethyne: 'Etino',
    Oxygen: 'Oxigeno',
    Nitrogen: 'Nitrogeno',
    Hydrogen: 'Hidrogeno',
    Methanol: 'Metanol',
    Ethanol: 'Etanol',
    Formaldehyde: 'Formaldehido',
    'Hydrogen Cyanide': 'Cianuro de hidrogeno',
    'Unknown Molecule': 'Molecula desconocida',
  },
};

export function getMessages(language: Language): Messages {
  return MESSAGES[language];
}

export function localizeMoleculeName(language: Language, moleculeName: string): string {
  return MOLECULE_NAME_MAP[language][moleculeName] ?? moleculeName;
}

export function translateStabilityIssue(language: Language, issue: string): string {
  if (language !== 'es') return issue;

  const exceededMatch = issue.match(
    /^([A-Z]) has exceeded its maximum valency \((\d+)\/(\d+) bonds\)\.$/,
  );
  if (exceededMatch) {
    const [, element, current, max] = exceededMatch;
    return `${element} excedio su valencia maxima (${current}/${max} enlaces).`;
  }

  const unsatisfiedMatch = issue.match(
    /^([A-Z]) has unsatisfied valency \((\d+)\/(\d+) bonds\)\.$/,
  );
  if (unsatisfiedMatch) {
    const [, element, current, max] = unsatisfiedMatch;
    return `${element} tiene valencia insatisfecha (${current}/${max} enlaces).`;
  }

  return issue;
}
