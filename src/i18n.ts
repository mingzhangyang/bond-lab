import type { ElementType } from './chemistry.ts';

export type Language = 'en' | 'es' | 'zh' | 'fr' | 'ja';

export interface Messages {
  appTitle: string;
  ui: {
    elements: string;
    menu: string;
    controls: string;
    instructions: string;
    instructionsTitle: string;
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
    collapse: string;
    expand: string;
    close: string;
    backToLab: string;
    privacy: string;
    privacyTitle: string;
    privacyVersion: string;
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
  elements: Record<ElementType, string>;
}

const EN_MESSAGES: Messages = {
  appTitle: 'BondLab',
  ui: {
    elements: 'Elements',
    menu: 'Menu',
    controls: 'Controls',
    instructions: 'Instructions',
    instructionsTitle: 'Instructions',
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
    collapse: 'Collapse',
    expand: 'Expand',
    close: 'Close',
    backToLab: 'Back to Lab',
    privacy: 'Privacy',
    privacyTitle: 'Privacy Policy',
    privacyVersion: 'Version',
    mobileTipsTitle: 'Quick tips',
    controlsList: [
      'Tap an element to add it',
      'Tap two atoms to create a bond',
      'Drag atoms to move them',
      'Hold Shift + drag a single bond to rotate',
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
    S: 'Sulfur',
    P: 'Phosphorus',
    F: 'Fluorine',
    Cl: 'Chlorine',
    Fe: 'Iron',
    Mg: 'Magnesium',
    Cu: 'Copper',
    Al: 'Aluminum',
    Ca: 'Calcium',
    Na: 'Sodium',
    K: 'Potassium',
  },
};

const ES_MESSAGES: Messages = {
  appTitle: 'BondLab',
  ui: {
    elements: 'Elementos',
    menu: 'Menu',
    controls: 'Controles',
    instructions: 'Instrucciones',
    instructionsTitle: 'Instrucciones',
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
    collapse: 'Colapsar',
    expand: 'Expandir',
    close: 'Cerrar',
    backToLab: 'Volver al laboratorio',
    privacy: 'Privacidad',
    privacyTitle: 'Politica de privacidad',
    privacyVersion: 'Version',
    mobileTipsTitle: 'Consejos rapidos',
    controlsList: [
      'Toca un elemento para agregarlo',
      'Toca dos atomos para enlazarlos',
      'Arrastra atomos para moverlos',
      'Manten Shift y arrastra un enlace simple para rotarlo',
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
    S: 'Azufre',
    P: 'Fosforo',
    F: 'Fluor',
    Cl: 'Cloro',
    Fe: 'Hierro',
    Mg: 'Magnesio',
    Cu: 'Cobre',
    Al: 'Aluminio',
    Ca: 'Calcio',
    Na: 'Sodio',
    K: 'Potasio',
  },
};

const ZH_MESSAGES: Messages = {
  appTitle: 'BondLab',
  ui: {
    elements: '元素',
    menu: '菜单',
    controls: '操作指南',
    instructions: '说明',
    instructionsTitle: '操作说明',
    addElement: '添加元素',
    selectElement: '选择元素',
    clear: '清空',
    clearAll: '全部清空',
    currentMolecule: '当前分子',
    valence: '价态',
    interactionMode: '交互',
    buildMode: '构建',
    deleteMode: '删除',
    removeHint: '切换到删除模式可移除原子和键。',
    themeToggle: '切换主题',
    languageToggle: '切换语言',
    collapse: '收起',
    expand: '展开',
    close: '关闭',
    backToLab: '返回实验室',
    privacy: '隐私',
    privacyTitle: '隐私政策',
    privacyVersion: '版本',
    mobileTipsTitle: '快速提示',
    controlsList: [
      '点击元素以添加原子',
      '点击两个原子以创建键',
      '拖动原子可移动位置',
      '按住 Shift 并拖动单键可旋转',
      '点击键可升级键级',
      '删除模式：点击原子/键可移除',
      '拖动背景可旋转视角',
      '双指缩放或滚轮缩放',
    ],
  },
  challenge: {
    title: '挑战',
    target: '目标',
    start: '开始挑战',
    next: '下一关',
    retry: '重试',
    wonHeadline: '太棒了！',
    wonMessagePrefix: '你成功构建了',
    lostHeadline: '时间到！',
    lostMessagePrefix: '目标分子是',
    secondsShort: '秒',
    close: '停止挑战',
  },
  stability: {
    title: '稳定性',
  },
  elements: {
    H: '氢',
    C: '碳',
    N: '氮',
    O: '氧',
    S: '硫',
    P: '磷',
    F: '氟',
    Cl: '氯',
    Fe: '铁',
    Mg: '镁',
    Cu: '铜',
    Al: '铝',
    Ca: '钙',
    Na: '钠',
    K: '钾',
  },
};

const FR_MESSAGES: Messages = {
  appTitle: 'BondLab',
  ui: {
    elements: 'Elements',
    menu: 'Menu',
    controls: 'Controles',
    instructions: 'Instructions',
    instructionsTitle: 'Instructions',
    addElement: 'Ajouter un element',
    selectElement: 'Selectionner un element',
    clear: 'Effacer',
    clearAll: 'Tout effacer',
    currentMolecule: 'Molecule actuelle',
    valence: 'Valence',
    interactionMode: 'Interaction',
    buildMode: 'Construire',
    deleteMode: 'Supprimer',
    removeHint: 'Passez en mode Supprimer pour retirer atomes et liaisons.',
    themeToggle: 'Changer le theme',
    languageToggle: 'Changer la langue',
    collapse: 'Reduire',
    expand: 'Etendre',
    close: 'Fermer',
    backToLab: 'Retour au labo',
    privacy: 'Confidentialite',
    privacyTitle: 'Politique de confidentialite',
    privacyVersion: 'Version',
    mobileTipsTitle: 'Conseils rapides',
    controlsList: [
      'Touchez un element pour l ajouter',
      'Touchez deux atomes pour creer une liaison',
      'Faites glisser les atomes pour les deplacer',
      'Maintenez Shift et glissez une liaison simple pour la faire tourner',
      'Touchez une liaison pour l ameliorer',
      'Mode Supprimer : touchez atome/liaison pour retirer',
      'Glissez le fond pour tourner la camera',
      'Pincez ou utilisez la molette pour zoomer',
    ],
  },
  challenge: {
    title: 'Defi',
    target: 'Cible',
    start: 'Defi',
    next: 'Defi suivant',
    retry: 'Reessayer',
    wonHeadline: 'Bravo!',
    wonMessagePrefix: 'Vous avez construit',
    lostHeadline: 'Temps ecoule!',
    lostMessagePrefix: 'La molecule etait',
    secondsShort: 's',
    close: 'Arreter le defi',
  },
  stability: {
    title: 'Stabilite',
  },
  elements: {
    H: 'Hydrogene',
    C: 'Carbone',
    N: 'Azote',
    O: 'Oxygene',
    S: 'Soufre',
    P: 'Phosphore',
    F: 'Fluor',
    Cl: 'Chlore',
    Fe: 'Fer',
    Mg: 'Magnesium',
    Cu: 'Cuivre',
    Al: 'Aluminium',
    Ca: 'Calcium',
    Na: 'Sodium',
    K: 'Potassium',
  },
};

const JA_MESSAGES: Messages = {
  appTitle: 'BondLab',
  ui: {
    elements: '元素',
    menu: 'メニュー',
    controls: '操作',
    instructions: '説明',
    instructionsTitle: '操作説明',
    addElement: '元素を追加',
    selectElement: '元素を選択',
    clear: 'クリア',
    clearAll: 'すべてクリア',
    currentMolecule: '現在の分子',
    valence: '価数',
    interactionMode: '操作モード',
    buildMode: '作成',
    deleteMode: '削除',
    removeHint: '原子と結合を削除するには削除モードに切り替えてください。',
    themeToggle: 'テーマ切替',
    languageToggle: '言語切替',
    collapse: '折りたたむ',
    expand: '展開',
    close: '閉じる',
    backToLab: 'ラボに戻る',
    privacy: 'プライバシー',
    privacyTitle: 'プライバシーポリシー',
    privacyVersion: '版',
    mobileTipsTitle: 'クイックヒント',
    controlsList: [
      '元素をタップして追加',
      '2つの原子をタップして結合を作成',
      '原子をドラッグして移動',
      'Shiftを押しながら単結合をドラッグして回転',
      '結合をタップして結合次数を上げる',
      '削除モード：原子/結合をタップして削除',
      '背景をドラッグしてカメラ回転',
      'ピンチまたはホイールでズーム',
    ],
  },
  challenge: {
    title: 'チャレンジ',
    target: '目標',
    start: '開始',
    next: '次のチャレンジ',
    retry: 'もう一度',
    wonHeadline: 'すばらしい！',
    wonMessagePrefix: '作成に成功しました',
    lostHeadline: '時間切れ！',
    lostMessagePrefix: '正解は',
    secondsShort: '秒',
    close: 'チャレンジ停止',
  },
  stability: {
    title: '安定性',
  },
  elements: {
    H: '水素',
    C: '炭素',
    N: '窒素',
    O: '酸素',
    S: '硫黄',
    P: 'リン',
    F: 'フッ素',
    Cl: '塩素',
    Fe: '鉄',
    Mg: 'マグネシウム',
    Cu: '銅',
    Al: 'アルミニウム',
    Ca: 'カルシウム',
    Na: 'ナトリウム',
    K: 'カリウム',
  },
};

const MESSAGES: Record<Language, Messages> = {
  en: EN_MESSAGES,
  es: ES_MESSAGES,
  zh: ZH_MESSAGES,
  fr: FR_MESSAGES,
  ja: JA_MESSAGES,
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
    'Hydrogen Fluoride': 'Fluoruro de hidrogeno',
    'Hydrogen Chloride': 'Cloruro de hidrogeno',
    'Hydrogen Sulfide': 'Sulfuro de hidrogeno',
    'Sulfur Dioxide': 'Dioxido de azufre',
    Phosphine: 'Fosfina',
    'Phosphorus Trichloride': 'Tricloruro de fosforo',
    'Carbon Tetrachloride': 'Tetracloruro de carbono',
    'Unknown Molecule': 'Molecula desconocida',
  },
  zh: {
    Water: '水',
    Methane: '甲烷',
    'Carbon Dioxide': '二氧化碳',
    Ammonia: '氨',
    Ethane: '乙烷',
    Ethene: '乙烯',
    Ethyne: '乙炔',
    Oxygen: '氧气',
    Nitrogen: '氮气',
    Hydrogen: '氢气',
    Methanol: '甲醇',
    Ethanol: '乙醇',
    Formaldehyde: '甲醛',
    'Hydrogen Cyanide': '氰化氢',
    'Hydrogen Fluoride': '氟化氢',
    'Hydrogen Chloride': '氯化氢',
    'Hydrogen Sulfide': '硫化氢',
    'Sulfur Dioxide': '二氧化硫',
    Phosphine: '膦',
    'Phosphorus Trichloride': '三氯化磷',
    'Carbon Tetrachloride': '四氯化碳',
    'Unknown Molecule': '未知分子',
  },
  fr: {
    Water: 'Eau',
    Methane: 'Methane',
    'Carbon Dioxide': 'Dioxyde de carbone',
    Ammonia: 'Ammoniac',
    Ethane: 'Ethane',
    Ethene: 'Ethene',
    Ethyne: 'Ethyne',
    Oxygen: 'Oxygene',
    Nitrogen: 'Azote',
    Hydrogen: 'Hydrogene',
    Methanol: 'Methanol',
    Ethanol: 'Ethanol',
    Formaldehyde: 'Formaldehyde',
    'Hydrogen Cyanide': "Cyanure d hydrogene",
    'Hydrogen Fluoride': 'Fluorure d hydrogene',
    'Hydrogen Chloride': 'Chlorure d hydrogene',
    'Hydrogen Sulfide': 'Sulfure d hydrogene',
    'Sulfur Dioxide': 'Dioxyde de soufre',
    Phosphine: 'Phosphine',
    'Phosphorus Trichloride': 'Trichlorure de phosphore',
    'Carbon Tetrachloride': 'Tetrachlorure de carbone',
    'Unknown Molecule': 'Molecule inconnue',
  },
  ja: {
    Water: '水',
    Methane: 'メタン',
    'Carbon Dioxide': '二酸化炭素',
    Ammonia: 'アンモニア',
    Ethane: 'エタン',
    Ethene: 'エチレン',
    Ethyne: 'アセチレン',
    Oxygen: '酸素',
    Nitrogen: '窒素',
    Hydrogen: '水素',
    Methanol: 'メタノール',
    Ethanol: 'エタノール',
    Formaldehyde: 'ホルムアルデヒド',
    'Hydrogen Cyanide': 'シアン化水素',
    'Hydrogen Fluoride': 'フッ化水素',
    'Hydrogen Chloride': '塩化水素',
    'Hydrogen Sulfide': '硫化水素',
    'Sulfur Dioxide': '二酸化硫黄',
    Phosphine: 'ホスフィン',
    'Phosphorus Trichloride': '三塩化リン',
    'Carbon Tetrachloride': '四塩化炭素',
    'Unknown Molecule': '不明な分子',
  },
};

export function getMessages(language: Language): Messages {
  return MESSAGES[language];
}

export function localizeMoleculeName(language: Language, moleculeName: string): string {
  return MOLECULE_NAME_MAP[language][moleculeName] ?? moleculeName;
}

export function translateStabilityIssue(language: Language, issue: string): string {
  const exceededMatch = issue.match(
    /^([A-Z][a-z]?) has exceeded its maximum valency \((\d+)\/(\d+) bonds\)\.$/,
  );
  if (exceededMatch) {
    const [, element, current, max] = exceededMatch;
    if (language === 'es') {
      return `${element} excedio su valencia maxima (${current}/${max} enlaces).`;
    }
    if (language === 'zh') {
      return `${element} 已超过其最大价态（${current}/${max} 键）。`;
    }
    if (language === 'fr') {
      return `${element} a depasse sa valence maximale (${current}/${max} liaisons).`;
    }
    if (language === 'ja') {
      return `${element} の最大原子価を超えています (${current}/${max} 結合)。`;
    }
    return issue;
  }

  const unsatisfiedMatch = issue.match(
    /^([A-Z][a-z]?) has unsatisfied valency \((\d+)\/(\d+) bonds\)\.$/,
  );
  if (unsatisfiedMatch) {
    const [, element, current, max] = unsatisfiedMatch;
    if (language === 'es') {
      return `${element} tiene valencia insatisfecha (${current}/${max} enlaces).`;
    }
    if (language === 'zh') {
      return `${element} 的价态未满足（${current}/${max} 键）。`;
    }
    if (language === 'fr') {
      return `${element} a une valence non satisfaite (${current}/${max} liaisons).`;
    }
    if (language === 'ja') {
      return `${element} の原子価が未充足です (${current}/${max} 結合)。`;
    }
    return issue;
  }

  return issue;
}
