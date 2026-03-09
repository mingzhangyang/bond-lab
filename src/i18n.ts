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
    educationalDisclaimerTitle: string;
    educationalDisclaimerBody: string;
    educationalDisclaimerShort: string;
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
  onboarding: {
    menu: string;
    replay: string;
    welcomeBadge: string;
    welcomeTitle: string;
    welcomeDescription: string;
    welcomeHint: string;
    start: string;
    skip: string;
    openElements: string;
    finish: string;
    viewInstructions: string;
    stepLabel: string;
    steps: {
      addAtoms: {
        title: string;
        descriptionDesktop: string;
        descriptionMobile: string;
        progress: string;
        complete: string;
        canvasHint: string;
      };
      createBond: {
        title: string;
        description: string;
        progress: string;
        complete: string;
        canvasHint: string;
      };
      explore: {
        title: string;
        description: string;
        points: string[];
      };
    };
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
    themeToggle: 'Theme',
    languageToggle: 'Language',
    collapse: 'Collapse',
    expand: 'Expand',
    close: 'Close',
    backToLab: 'Back to Lab',
    privacy: 'Privacy',
    privacyTitle: 'Privacy Policy',
    privacyVersion: 'Version',
    mobileTipsTitle: 'Quick tips',
    educationalDisclaimerTitle: 'About the science in BondLab',
    educationalDisclaimerBody: 'BondLab is designed for science outreach, classroom demos, and playful exploration. Stability, polarity, and molecule identification use simplified rules and should be treated as guidance rather than rigorous chemical analysis.',
    educationalDisclaimerShort: 'For education and fun — simplified chemistry model.',
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
  onboarding: {
    menu: 'Quick Start',
    replay: 'Replay Quick Start',
    welcomeBadge: 'First time here?',
    welcomeTitle: 'Build your first molecule in 30 seconds',
    welcomeDescription: 'Start a short guided tour that teaches atom placement, bond creation, and the most important lab controls.',
    welcomeHint: 'You can reopen this guide anytime from the menu.',
    start: 'Start guide',
    skip: 'Skip for now',
    openElements: 'Open elements',
    finish: 'Start building',
    viewInstructions: 'Full instructions',
    stepLabel: 'Step',
    steps: {
      addAtoms: {
        title: 'Add your first atoms',
        descriptionDesktop: 'Click an element on the left, or drag one into the drawing area. Add 2 atoms to continue.',
        descriptionMobile: 'Tap the add button, then choose 2 elements to place in the lab.',
        progress: 'Add 2 atoms',
        complete: 'Great — your first atoms are in place.',
        canvasHint: 'Drop elements here',
      },
      createBond: {
        title: 'Create a bond',
        description: 'Tap one atom, then another, to connect them. One bond is enough to continue.',
        progress: 'Create 1 bond',
        complete: 'Nice — your structure now has a bond.',
        canvasHint: 'Tap two atoms here',
      },
      explore: {
        title: 'Move, inspect, and clean up',
        description: 'Before you begin, learn the three controls you will use most often.',
        points: [
          'Drag atoms to reposition them in the structure.',
          'Drag the background to rotate the view, then scroll or pinch to zoom.',
          'Use Delete mode to remove atoms or bonds you do not want.',
          'Open Challenge when you are ready for a timed molecule task.',
        ],
      },
    },
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
    themeToggle: 'Tema',
    languageToggle: 'Idioma',
    collapse: 'Colapsar',
    expand: 'Expandir',
    close: 'Cerrar',
    backToLab: 'Volver al laboratorio',
    privacy: 'Privacidad',
    privacyTitle: 'Politica de privacidad',
    privacyVersion: 'Version',
    mobileTipsTitle: 'Consejos rapidos',
    educationalDisclaimerTitle: 'Sobre la ciencia en BondLab',
    educationalDisclaimerBody: 'BondLab esta pensado para divulgacion cientifica, demostraciones en clase y exploracion interactiva. La estabilidad, la polaridad y la identificacion de moleculas usan reglas simplificadas y deben tomarse como referencia, no como un analisis quimico riguroso.',
    educationalDisclaimerShort: 'Solo para divulgacion y entretenimiento; modelo quimico simplificado.',
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
  onboarding: {
    menu: 'Inicio rapido',
    replay: 'Repetir inicio rapido',
    welcomeBadge: 'Primera vez aqui?',
    welcomeTitle: 'Construye tu primera molecula en 30 segundos',
    welcomeDescription: 'Inicia una guia corta para aprender a colocar atomos, crear enlaces y usar los controles principales del laboratorio.',
    welcomeHint: 'Puedes abrir esta guia otra vez desde el menu.',
    start: 'Iniciar guia',
    skip: 'Omitir por ahora',
    openElements: 'Abrir elementos',
    finish: 'Empezar a construir',
    viewInstructions: 'Instrucciones completas',
    stepLabel: 'Paso',
    steps: {
      addAtoms: {
        title: 'Agrega tus primeros atomos',
        descriptionDesktop: 'Haz clic en un elemento a la izquierda o arrastralo al area de dibujo. Agrega 2 atomos para continuar.',
        descriptionMobile: 'Toca el boton de agregar y elige 2 elementos para colocarlos en el laboratorio.',
        progress: 'Agregar 2 atomos',
        complete: 'Perfecto: tus primeros atomos ya estan colocados.',
        canvasHint: 'Suelta elementos aqui',
      },
      createBond: {
        title: 'Crea un enlace',
        description: 'Toca un atomo y luego otro para conectarlos. Un enlace es suficiente para continuar.',
        progress: 'Crear 1 enlace',
        complete: 'Bien: tu estructura ya tiene un enlace.',
        canvasHint: 'Toca dos atomos aqui',
      },
      explore: {
        title: 'Mover, observar y limpiar',
        description: 'Antes de empezar, revisa los tres controles que mas usaras.',
        points: [
          'Arrastra atomos para cambiar su posicion.',
          'Arrastra el fondo para rotar la vista y usa zoom con rueda o pellizco.',
          'Usa el modo Eliminar para quitar atomos o enlaces.',
          'Abre Desafio cuando quieras probar una meta con tiempo.',
        ],
      },
    },
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
    themeToggle: '主题',
    languageToggle: '语言',
    collapse: '收起',
    expand: '展开',
    close: '关闭',
    backToLab: '返回实验室',
    privacy: '隐私',
    privacyTitle: '隐私政策',
    privacyVersion: '版本',
    mobileTipsTitle: '快速提示',
    educationalDisclaimerTitle: '关于 BondLab 中的科学说明',
    educationalDisclaimerBody: 'BondLab 主要用于科普展示、课堂演示和互动体验。稳定性、极性与分子识别基于简化规则，仅供参考，不应视为严格的化学分析。',
    educationalDisclaimerShort: '仅供科普与娱乐参考',
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
  onboarding: {
    menu: '快速上手',
    replay: '重新查看快速上手',
    welcomeBadge: '第一次来到这里？',
    welcomeTitle: '30 秒完成你的第一个分子',
    welcomeDescription: '开始一个简短引导，快速学会放置原子、创建化学键，以及实验室里最重要的几个操作。',
    welcomeHint: '之后你也可以随时从菜单重新打开这份引导。',
    start: '开始引导',
    skip: '暂时跳过',
    openElements: '打开元素面板',
    finish: '开始构建',
    viewInstructions: '查看完整说明',
    stepLabel: '步骤',
    steps: {
      addAtoms: {
        title: '先放入原子',
        descriptionDesktop: '点击左侧元素，或直接拖到绘图区。放入 2 个原子后继续。',
        descriptionMobile: '点击添加按钮，然后选择 2 个元素放入实验区。',
        progress: '放入 2 个原子',
        complete: '很好，你已经放好了第一批原子。',
        canvasHint: '可拖拽到此处',
      },
      createBond: {
        title: '创建化学键',
        description: '先点一个原子，再点另一个原子，即可把它们连接起来。创建 1 根键即可继续。',
        progress: '创建 1 根键',
        complete: '很好，结构中已经有化学键了。',
        canvasHint: '在这里点击两个原子',
      },
      explore: {
        title: '移动、观察与清理',
        description: '开始实验前，先记住最常用的 3 类操作。',
        points: [
          '拖动原子可以调整它们在结构中的位置。',
          '拖动背景可旋转视角，滚轮或双指可缩放。',
          '切换到删除模式后，可以移除原子或化学键。',
          '准备好后，可以打开挑战模式进行限时搭建。',
        ],
      },
    },
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
    themeToggle: 'Theme',
    languageToggle: 'Langue',
    collapse: 'Reduire',
    expand: 'Etendre',
    close: 'Fermer',
    backToLab: 'Retour au labo',
    privacy: 'Confidentialite',
    privacyTitle: 'Politique de confidentialite',
    privacyVersion: 'Version',
    mobileTipsTitle: 'Conseils rapides',
    educationalDisclaimerTitle: 'A propos de la science dans BondLab',
    educationalDisclaimerBody: 'BondLab est concu pour la vulgarisation scientifique, les demonstrations en classe et l exploration ludique. La stabilite, la polarite et l identification des molecules reposent sur des regles simplifiees et doivent etre considerees comme des indications, pas comme une analyse chimique rigoureuse.',
    educationalDisclaimerShort: 'Pour apprendre et s amuser : modele chimique simplifie.',
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
  onboarding: {
    menu: 'Demarrage rapide',
    replay: 'Revoir le demarrage rapide',
    welcomeBadge: 'Premiere visite ?',
    welcomeTitle: 'Construisez votre premiere molecule en 30 secondes',
    welcomeDescription: 'Lancez une courte visite guidee pour apprendre a placer des atomes, creer des liaisons et utiliser les commandes essentielles du labo.',
    welcomeHint: 'Vous pourrez rouvrir ce guide a tout moment depuis le menu.',
    start: 'Demarrer le guide',
    skip: 'Passer pour le moment',
    openElements: 'Ouvrir les elements',
    finish: 'Commencer a construire',
    viewInstructions: 'Instructions completes',
    stepLabel: 'Etape',
    steps: {
      addAtoms: {
        title: 'Ajoutez vos premiers atomes',
        descriptionDesktop: 'Cliquez sur un element a gauche ou faites-le glisser dans la zone de dessin. Ajoutez 2 atomes pour continuer.',
        descriptionMobile: 'Touchez le bouton d ajout puis choisissez 2 elements a placer dans le labo.',
        progress: 'Ajouter 2 atomes',
        complete: 'Parfait : vos premiers atomes sont en place.',
        canvasHint: 'Deposez des elements ici',
      },
      createBond: {
        title: 'Creez une liaison',
        description: 'Touchez un atome puis un autre pour les relier. Une seule liaison suffit pour continuer.',
        progress: 'Creer 1 liaison',
        complete: 'Bien : votre structure contient maintenant une liaison.',
        canvasHint: 'Touchez deux atomes ici',
      },
      explore: {
        title: 'Deplacer, observer et nettoyer',
        description: 'Avant de commencer, retenez les trois controles les plus utiles.',
        points: [
          'Faites glisser les atomes pour ajuster leur position.',
          'Faites glisser le fond pour tourner la vue puis zoomez avec molette ou pincement.',
          'Utilisez le mode Supprimer pour retirer des atomes ou des liaisons.',
          'Ouvrez le defi quand vous etes pret pour un objectif chronometre.',
        ],
      },
    },
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
    themeToggle: 'テーマ',
    languageToggle: '言語',
    collapse: '折りたたむ',
    expand: '展開',
    close: '閉じる',
    backToLab: 'ラボに戻る',
    privacy: 'プライバシー',
    privacyTitle: 'プライバシーポリシー',
    privacyVersion: '版',
    mobileTipsTitle: 'クイックヒント',
    educationalDisclaimerTitle: 'BondLab の科学的な位置づけ',
    educationalDisclaimerBody: 'BondLab は科学コミュニケーション、授業デモ、気軽な探索体験のために設計されています。安定性、極性、分子識別は簡略化したルールに基づくため、厳密な化学解析ではなく参考情報として扱ってください。',
    educationalDisclaimerShort: '学習と体験向けの簡略化した化学モデルです。',
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
  onboarding: {
    menu: 'クイックスタート',
    replay: 'クイックスタートをもう一度見る',
    welcomeBadge: '初めてですか？',
    welcomeTitle: '30 秒で最初の分子を作ってみましょう',
    welcomeDescription: '短いガイドで、原子の配置、結合の作成、ラボでよく使う操作をすぐに学べます。',
    welcomeHint: 'このガイドは後でメニューからいつでも開き直せます。',
    start: 'ガイドを始める',
    skip: '今はスキップ',
    openElements: '元素パネルを開く',
    finish: '構築を始める',
    viewInstructions: '詳しい説明を見る',
    stepLabel: 'ステップ',
    steps: {
      addAtoms: {
        title: '最初の原子を置く',
        descriptionDesktop: '左の元素をクリックするか、描画エリアへドラッグしてください。2 個の原子を置くと次へ進みます。',
        descriptionMobile: '追加ボタンを押して、2 つの元素を選んでラボに配置してください。',
        progress: '原子を 2 個置く',
        complete: 'よくできました。最初の原子が配置されました。',
        canvasHint: 'ここにドロップ',
      },
      createBond: {
        title: '結合を作る',
        description: '1 つの原子をタップしてから、もう 1 つをタップすると結合できます。1 本作れば先へ進めます。',
        progress: '結合を 1 本作る',
        complete: '構造に結合が追加されました。',
        canvasHint: 'ここで 2 つの原子をタップ',
      },
      explore: {
        title: '動かす・観察する・整理する',
        description: '始める前に、よく使う 3 つの操作を確認しましょう。',
        points: [
          '原子をドラッグして位置を調整できます。',
          '背景をドラッグして視点を回転し、ホイールやピンチで拡大縮小できます。',
          '削除モードを使うと原子や結合を消せます。',
          '準備ができたら、チャレンジで時間制の課題に挑戦できます。',
        ],
      },
    },
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
    Benzene: 'Benceno',
    Fluorine: 'Fluor',
    Chlorine: 'Cloro',
    'Nitric Oxide': 'Oxido nitrico',
    'Hydrogen Peroxide': 'Peroxido de hidrogeno',
    'Sulfur Trioxide': 'Trioxido de azufre',
    Ozone: 'Ozono',
    Propane: 'Propano',
    Propene: 'Propeno',
    Propyne: 'Propino',
    Butane: 'Butano',
    '1,3-Butadiene': '1,3-Butadieno',
    'Formic Acid': 'Acido formico',
    'Acetic Acid': 'Acido acetico',
    Acetaldehyde: 'Acetaldehido',
    Acetone: 'Acetona',
    'Dimethyl Ether': 'Eter dimetilico',
    Methylamine: 'Metilamina',
    Acetonitrile: 'Acetonitrilo',
    Urea: 'Urea',
    Methanethiol: 'Metanotiol',
    'Dimethyl Sulfide': 'Sulfuro de dimetilo',
    Fluoromethane: 'Fluorometano',
    Chloromethane: 'Clorometano',
    Dichloromethane: 'Diclorometano',
    Chloroform: 'Cloroformo',
    'Sodium Chloride': 'Cloruro de sodio',
    'Potassium Chloride': 'Cloruro de potasio',
    'Sodium Fluoride': 'Fluoruro de sodio',
    'Potassium Fluoride': 'Fluoruro de potasio',
    'Magnesium Chloride': 'Cloruro de magnesio',
    'Calcium Chloride': 'Cloruro de calcio',
    'Aluminum Chloride': 'Cloruro de aluminio',
    'Iron(II) Chloride': 'Cloruro ferroso',
    'Iron(III) Chloride': 'Cloruro ferrico',
    'Copper(II) Chloride': 'Cloruro cuprico',
    'Calcium Oxide': 'Oxido de calcio',
    'Magnesium Oxide': 'Oxido de magnesio',
    Glycine: 'Glicina',
    Alanine: 'Alanina',
    Valine: 'Valina',
    Leucine: 'Leucina',
    Isoleucine: 'Isoleucina',
    Proline: 'Prolina',
    Phenylalanine: 'Fenilalanina',
    Tryptophan: 'Triptofano',
    Methionine: 'Metionina',
    Serine: 'Serina',
    Threonine: 'Treonina',
    Cysteine: 'Cisteina',
    Tyrosine: 'Tirosina',
    Asparagine: 'Asparagina',
    Glutamine: 'Glutamina',
    'Aspartic Acid': 'Acido aspartico',
    'Glutamic Acid': 'Acido glutamico',
    Lysine: 'Lisina',
    Arginine: 'Arginina',
    Histidine: 'Histidina',
    'Oxaloacetic Acid': 'Acido oxalacetico',
    'Citric Acid': 'Acido citrico',
    'Isocitric Acid': 'Acido isocitrico',
    'Alpha-Ketoglutaric Acid': 'Acido alfa-cetoglutarico',
    'Succinic Acid': 'Acido succinico',
    'Fumaric Acid': 'Acido fumarico',
    'Malic Acid': 'Acido malico',
    'D-Glucose': 'D-Glucosa',
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
    Benzene: '苯',
    Fluorine: '氟气',
    Chlorine: '氯气',
    'Nitric Oxide': '一氧化氮',
    'Hydrogen Peroxide': '过氧化氢',
    'Sulfur Trioxide': '三氧化硫',
    Ozone: '臭氧',
    Propane: '丙烷',
    Propene: '丙烯',
    Propyne: '丙炔',
    Butane: '丁烷',
    '1,3-Butadiene': '1,3-丁二烯',
    'Formic Acid': '甲酸',
    'Acetic Acid': '乙酸',
    Acetaldehyde: '乙醛',
    Acetone: '丙酮',
    'Dimethyl Ether': '甲醚',
    Methylamine: '甲胺',
    Acetonitrile: '乙腈',
    Urea: '尿素',
    Methanethiol: '甲硫醇',
    'Dimethyl Sulfide': '二甲硫醚',
    Fluoromethane: '氟甲烷',
    Chloromethane: '氯甲烷',
    Dichloromethane: '二氯甲烷',
    Chloroform: '氯仿',
    'Sodium Chloride': '氯化钠',
    'Potassium Chloride': '氯化钾',
    'Sodium Fluoride': '氟化钠',
    'Potassium Fluoride': '氟化钾',
    'Magnesium Chloride': '氯化镁',
    'Calcium Chloride': '氯化钙',
    'Aluminum Chloride': '氯化铝',
    'Iron(II) Chloride': '氯化亚铁',
    'Iron(III) Chloride': '氯化铁',
    'Copper(II) Chloride': '氯化铜',
    'Calcium Oxide': '氧化钙',
    'Magnesium Oxide': '氧化镁',
    Glycine: '甘氨酸',
    Alanine: '丙氨酸',
    Valine: '缬氨酸',
    Leucine: '亮氨酸',
    Isoleucine: '异亮氨酸',
    Proline: '脯氨酸',
    Phenylalanine: '苯丙氨酸',
    Tryptophan: '色氨酸',
    Methionine: '甲硫氨酸',
    Serine: '丝氨酸',
    Threonine: '苏氨酸',
    Cysteine: '半胱氨酸',
    Tyrosine: '酪氨酸',
    Asparagine: '天冬酰胺',
    Glutamine: '谷氨酰胺',
    'Aspartic Acid': '天冬氨酸',
    'Glutamic Acid': '谷氨酸',
    Lysine: '赖氨酸',
    Arginine: '精氨酸',
    Histidine: '组氨酸',
    'Oxaloacetic Acid': '草酰乙酸',
    'Citric Acid': '柠檬酸',
    'Isocitric Acid': '异柠檬酸',
    'Alpha-Ketoglutaric Acid': 'α-酮戊二酸',
    'Succinic Acid': '琥珀酸',
    'Fumaric Acid': '富马酸',
    'Malic Acid': '苹果酸',
    'D-Glucose': 'D-葡萄糖',
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
    Benzene: 'Benzene',
    Fluorine: 'Fluor',
    Chlorine: 'Chlore',
    'Nitric Oxide': 'Monoxyde d azote',
    'Hydrogen Peroxide': 'Peroxyde d hydrogene',
    'Sulfur Trioxide': 'Trioxyde de soufre',
    Ozone: 'Ozone',
    Propane: 'Propane',
    Propene: 'Propene',
    Propyne: 'Propyne',
    Butane: 'Butane',
    '1,3-Butadiene': '1,3-Butadiene',
    'Formic Acid': 'Acide formique',
    'Acetic Acid': 'Acide acetique',
    Acetaldehyde: 'Acetaldehyde',
    Acetone: 'Acetone',
    'Dimethyl Ether': 'Ether dimethylique',
    Methylamine: 'Methylamine',
    Acetonitrile: 'Acetonitrile',
    Urea: 'Uree',
    Methanethiol: 'Methanethiol',
    'Dimethyl Sulfide': 'Sulfure de dimethyle',
    Fluoromethane: 'Fluoromethane',
    Chloromethane: 'Chloromethane',
    Dichloromethane: 'Dichloromethane',
    Chloroform: 'Chloroforme',
    'Sodium Chloride': 'Chlorure de sodium',
    'Potassium Chloride': 'Chlorure de potassium',
    'Sodium Fluoride': 'Fluorure de sodium',
    'Potassium Fluoride': 'Fluorure de potassium',
    'Magnesium Chloride': 'Chlorure de magnesium',
    'Calcium Chloride': 'Chlorure de calcium',
    'Aluminum Chloride': 'Chlorure d aluminium',
    'Iron(II) Chloride': 'Chlorure de fer II',
    'Iron(III) Chloride': 'Chlorure de fer III',
    'Copper(II) Chloride': 'Chlorure de cuivre II',
    'Calcium Oxide': 'Oxyde de calcium',
    'Magnesium Oxide': 'Oxyde de magnesium',
    Glycine: 'Glycine',
    Alanine: 'Alanine',
    Valine: 'Valine',
    Leucine: 'Leucine',
    Isoleucine: 'Isoleucine',
    Proline: 'Proline',
    Phenylalanine: 'Phenylalanine',
    Tryptophan: 'Tryptophane',
    Methionine: 'Methionine',
    Serine: 'Serine',
    Threonine: 'Threonine',
    Cysteine: 'Cysteine',
    Tyrosine: 'Tyrosine',
    Asparagine: 'Asparagine',
    Glutamine: 'Glutamine',
    'Aspartic Acid': 'Acide aspartique',
    'Glutamic Acid': 'Acide glutamique',
    Lysine: 'Lysine',
    Arginine: 'Arginine',
    Histidine: 'Histidine',
    'Oxaloacetic Acid': 'Acide oxaloacetique',
    'Citric Acid': 'Acide citrique',
    'Isocitric Acid': 'Acide isocitrique',
    'Alpha-Ketoglutaric Acid': 'Acide alpha-cetoglutarique',
    'Succinic Acid': 'Acide succinique',
    'Fumaric Acid': 'Acide fumarique',
    'Malic Acid': 'Acide malique',
    'D-Glucose': 'D-Glucose',
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
    Benzene: 'ベンゼン',
    Fluorine: 'フッ素',
    Chlorine: '塩素',
    'Nitric Oxide': '一酸化窒素',
    'Hydrogen Peroxide': '過酸化水素',
    'Sulfur Trioxide': '三酸化硫黄',
    Ozone: 'オゾン',
    Propane: 'プロパン',
    Propene: 'プロペン',
    Propyne: 'プロピン',
    Butane: 'ブタン',
    '1,3-Butadiene': '1,3-ブタジエン',
    'Formic Acid': 'ギ酸',
    'Acetic Acid': '酢酸',
    Acetaldehyde: 'アセトアルデヒド',
    Acetone: 'アセトン',
    'Dimethyl Ether': 'ジメチルエーテル',
    Methylamine: 'メチルアミン',
    Acetonitrile: 'アセトニトリル',
    Urea: '尿素',
    Methanethiol: 'メタンチオール',
    'Dimethyl Sulfide': 'ジメチルスルフィド',
    Fluoromethane: 'フルオロメタン',
    Chloromethane: 'クロロメタン',
    Dichloromethane: 'ジクロロメタン',
    Chloroform: 'クロロホルム',
    'Sodium Chloride': '塩化ナトリウム',
    'Potassium Chloride': '塩化カリウム',
    'Sodium Fluoride': 'フッ化ナトリウム',
    'Potassium Fluoride': 'フッ化カリウム',
    'Magnesium Chloride': '塩化マグネシウム',
    'Calcium Chloride': '塩化カルシウム',
    'Aluminum Chloride': '塩化アルミニウム',
    'Iron(II) Chloride': '塩化鉄II',
    'Iron(III) Chloride': '塩化鉄III',
    'Copper(II) Chloride': '塩化銅II',
    'Calcium Oxide': '酸化カルシウム',
    'Magnesium Oxide': '酸化マグネシウム',
    Glycine: 'グリシン',
    Alanine: 'アラニン',
    Valine: 'バリン',
    Leucine: 'ロイシン',
    Isoleucine: 'イソロイシン',
    Proline: 'プロリン',
    Phenylalanine: 'フェニルアラニン',
    Tryptophan: 'トリプトファン',
    Methionine: 'メチオニン',
    Serine: 'セリン',
    Threonine: 'スレオニン',
    Cysteine: 'システイン',
    Tyrosine: 'チロシン',
    Asparagine: 'アスパラギン',
    Glutamine: 'グルタミン',
    'Aspartic Acid': 'アスパラギン酸',
    'Glutamic Acid': 'グルタミン酸',
    Lysine: 'リシン',
    Arginine: 'アルギニン',
    Histidine: 'ヒスチジン',
    'Oxaloacetic Acid': 'オキサロ酢酸',
    'Citric Acid': 'クエン酸',
    'Isocitric Acid': 'イソクエン酸',
    'Alpha-Ketoglutaric Acid': 'α-ケトグルタル酸',
    'Succinic Acid': 'コハク酸',
    'Fumaric Acid': 'フマル酸',
    'Malic Acid': 'リンゴ酸',
    'D-Glucose': 'D-グルコース',
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
