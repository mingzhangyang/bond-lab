import type { Language } from './i18n';

export interface SeoFaqItem {
  question: string;
  answer: string;
}

export interface SeoMeta {
  titleSuffix: string;
  description: string;
  keywords: string;
  ogDescription: string;
  twitterDescription: string;
}

export interface SeoContent {
  heading: string;
  intro: string;
  featureHeading: string;
  features: string[];
  faqHeading: string;
  faqs: SeoFaqItem[];
}

export interface SeoJsonLd {
  '@context': string;
  '@type': 'SoftwareApplication';
  name: string;
  applicationCategory: 'EducationalApplication';
  operatingSystem: 'Web';
  description: string;
  image: string;
  keywords: string;
  inLanguage: Language;
  offers: {
    '@type': 'Offer';
    price: string;
    priceCurrency: 'USD';
  };
}

export interface SeoBundle {
  meta: SeoMeta;
  content: SeoContent;
  jsonLd: SeoJsonLd;
}

const SEO_BY_LANGUAGE: Record<Language, SeoBundle> = {
  en: {
    meta: {
      titleSuffix: 'Interactive Molecule Builder',
      description:
        'BondLab is an interactive 3D chemistry sandbox where students build molecules, test bond orders, and explore molecular structure, polarity, and stability in real time.',
      keywords:
        'chemistry simulator, molecule builder, molecular geometry, bond order, valence electrons, chemistry education, interactive science app',
      ogDescription:
        'Build molecules in 3D, adjust bond order, and learn molecular polarity and stability with BondLab.',
      twitterDescription:
        'Interactive chemistry app for molecule building, bond editing, and molecular property exploration.',
    },
    content: {
      heading: 'BondLab Interactive Chemistry Lab',
      intro:
        'BondLab helps learners understand chemistry by letting them construct molecules atom-by-atom and observe how structure changes affect properties.',
      featureHeading: 'What you can do in BondLab',
      features: [
        'Build molecules with hydrogen, carbon, nitrogen, and oxygen atoms.',
        'Create, upgrade, and remove bonds to explore single, double, and triple connectivity.',
        'Inspect identified molecules, formulas, structure notation, and quick science facts.',
        'Analyze molecular polarity and stability feedback while editing in real time.',
        'Practice with challenge mode to recreate target molecules under time pressure.',
      ],
      faqHeading: 'Chemistry topics covered in BondLab',
      faqs: [
        {
          question: 'How does BondLab teach molecular structure?',
          answer:
            'BondLab visualizes atoms and bonds in 3D, making geometry and connectivity easier to understand than static diagrams.',
        },
        {
          question: 'Can BondLab be used for valence and bond order practice?',
          answer:
            'Yes. You can add atoms, change bond order, and immediately compare your model with expected valence behavior.',
        },
        {
          question: 'Does BondLab include molecule recognition and polarity hints?',
          answer:
            'Yes. The app identifies supported molecules and provides polarity classification with a short explanation.',
        },
      ],
    },
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'BondLab',
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'Web',
      description:
        'Interactive molecule builder for chemistry learning with real-time structure, polarity, and stability feedback.',
      image: '/og-image.svg',
      keywords: 'chemistry, molecule builder, molecular structure, bond order, polarity, stability',
      inLanguage: 'en',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    },
  },
  es: {
    meta: {
      titleSuffix: 'Constructor Interactivo de Moleculas',
      description:
        'BondLab es un laboratorio de quimica 3D interactivo para construir moleculas, probar ordenes de enlace y explorar estructura molecular, polaridad y estabilidad en tiempo real.',
      keywords:
        'simulador de quimica, constructor de moleculas, geometria molecular, orden de enlace, electrones de valencia, educacion cientifica',
      ogDescription:
        'Construye moleculas en 3D, ajusta el orden de enlace y estudia polaridad y estabilidad con BondLab.',
      twitterDescription:
        'Aplicacion interactiva de quimica para construir moleculas y analizar propiedades moleculares.',
    },
    content: {
      heading: 'BondLab Laboratorio Interactivo de Quimica',
      intro:
        'BondLab ayuda a los estudiantes a comprender quimica construyendo moleculas atomo por atomo y observando como cambian sus propiedades.',
      featureHeading: 'Que puedes hacer en BondLab',
      features: [
        'Construir moleculas con hidrogeno, carbono, nitrogeno y oxigeno.',
        'Crear, mejorar y eliminar enlaces para explorar conectividad simple, doble y triple.',
        'Consultar moleculas identificadas, formulas, estructura y datos rapidos.',
        'Analizar polaridad molecular y estabilidad en tiempo real.',
        'Practicar en modo desafio recreando moleculas objetivo contra reloj.',
      ],
      faqHeading: 'Temas de quimica cubiertos en BondLab',
      faqs: [
        {
          question: 'Como ensena BondLab la estructura molecular?',
          answer:
            'BondLab muestra atomos y enlaces en 3D para entender geometria y conectividad mejor que con diagramas estaticos.',
        },
        {
          question: 'Se puede practicar valencia y orden de enlace?',
          answer:
            'Si. Puedes agregar atomos, cambiar el orden de enlace y comparar al instante con el comportamiento de valencia esperado.',
        },
        {
          question: 'Incluye reconocimiento de moleculas y pistas de polaridad?',
          answer:
            'Si. La aplicacion identifica moleculas compatibles y muestra clasificacion de polaridad con una breve explicacion.',
        },
      ],
    },
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'BondLab',
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'Web',
      description:
        'Constructor interactivo de moleculas para aprender quimica con retroalimentacion de estructura, polaridad y estabilidad.',
      image: '/og-image.svg',
      keywords: 'quimica, constructor de moleculas, estructura molecular, orden de enlace, polaridad, estabilidad',
      inLanguage: 'es',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    },
  },
  zh: {
    meta: {
      titleSuffix: '交互式分子构建器',
      description:
        'BondLab 是一款 3D 交互式化学实验室，可用于构建分子、测试键级，并实时探索分子结构、极性与稳定性。',
      keywords: '化学模拟器, 分子构建, 分子几何, 键级, 价电子, 化学教育, 互动科学应用',
      ogDescription: '在 BondLab 中以 3D 方式构建分子，调整键级并学习极性与稳定性。',
      twitterDescription: '用于分子构建、键编辑与分子性质探索的交互式化学应用。',
    },
    content: {
      heading: 'BondLab 交互式化学实验室',
      intro:
        'BondLab 通过逐个原子构建分子，帮助学习者理解结构变化如何影响分子性质。',
      featureHeading: 'BondLab 可以做什么',
      features: [
        '使用氢、碳、氮、氧构建分子。',
        '创建、升级和移除化学键，探索单键、双键和三键连接。',
        '查看已识别分子的名称、分子式、结构表示和知识点。',
        '在编辑过程中实时分析分子极性与稳定性反馈。',
        '在挑战模式中限时复现目标分子。',
      ],
      faqHeading: 'BondLab 覆盖的化学主题',
      faqs: [
        {
          question: 'BondLab 如何帮助理解分子结构？',
          answer:
            'BondLab 以 3D 方式可视化原子与化学键，比静态图更容易理解几何结构和连接关系。',
        },
        {
          question: '可以用于练习价态与键级吗？',
          answer:
            '可以。你可以添加原子、修改键级，并立即对照预期的价态行为。',
        },
        {
          question: '是否提供分子识别与极性提示？',
          answer:
            '是的。应用会识别已支持分子，并给出极性分类与简要说明。',
        },
      ],
    },
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'BondLab',
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'Web',
      description: '用于化学学习的交互式分子构建器，提供结构、极性和稳定性实时反馈。',
      image: '/og-image.svg',
      keywords: '化学, 分子构建, 分子结构, 键级, 极性, 稳定性',
      inLanguage: 'zh',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    },
  },
  fr: {
    meta: {
      titleSuffix: 'Constructeur Moleculaire Interactif',
      description:
        'BondLab est un laboratoire de chimie 3D interactif pour construire des molecules, tester les ordres de liaison et explorer structure moleculaire, polarite et stabilite en temps reel.',
      keywords:
        'simulateur de chimie, constructeur de molecules, geometrie moleculaire, ordre de liaison, electrons de valence, education scientifique',
      ogDescription:
        'Construisez des molecules en 3D, ajustez les liaisons et etudiez polarite et stabilite avec BondLab.',
      twitterDescription:
        'Application de chimie interactive pour construire des molecules et analyser leurs proprietes.',
    },
    content: {
      heading: 'BondLab Laboratoire de Chimie Interactif',
      intro:
        'BondLab aide les apprenants a comprendre la chimie en construisant des molecules atome par atome.',
      featureHeading: 'Ce que vous pouvez faire dans BondLab',
      features: [
        'Construire des molecules avec hydrogene, carbone, azote et oxygene.',
        'Creer, ameliorer et supprimer des liaisons simples, doubles et triples.',
        'Consulter molecules identifiees, formules, structures et informations rapides.',
        'Analyser polarite moleculaire et stabilite en temps reel.',
        'S entrainer avec le mode defi pour reconstruire des molecules cibles.',
      ],
      faqHeading: 'Sujets de chimie couverts par BondLab',
      faqs: [
        {
          question: 'Comment BondLab enseigne la structure moleculaire ?',
          answer:
            'BondLab visualise atomes et liaisons en 3D pour mieux comprendre geometrie et connectivite.',
        },
        {
          question: 'Peut-on pratiquer valence et ordre de liaison ?',
          answer:
            'Oui. Vous ajoutez des atomes, modifiez les liaisons et comparez immediatement au comportement attendu.',
        },
        {
          question: 'BondLab propose-t-il identification et polarite ?',
          answer:
            'Oui. L application reconnait les molecules prises en charge et affiche une classification de polarite.',
        },
      ],
    },
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'BondLab',
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'Web',
      description:
        'Constructeur interactif de molecules pour apprendre la chimie avec retour en temps reel sur structure, polarite et stabilite.',
      image: '/og-image.svg',
      keywords: 'chimie, constructeur de molecules, structure moleculaire, ordre de liaison, polarite, stabilite',
      inLanguage: 'fr',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    },
  },
  ja: {
    meta: {
      titleSuffix: 'インタラクティブ分子ビルダー',
      description:
        'BondLab は分子を組み立てながら結合次数を試し、分子構造・極性・安定性をリアルタイムで学べる 3D 化学学習アプリです。',
      keywords: '化学シミュレーター, 分子作成, 分子構造, 結合次数, 価電子, 化学教育, インタラクティブ学習',
      ogDescription: '3D で分子を作成し、結合次数や極性、安定性を学べる BondLab。',
      twitterDescription: '分子作成と結合編集を通じて分子特性を学べるインタラクティブ化学アプリ。',
    },
    content: {
      heading: 'BondLab インタラクティブ化学ラボ',
      intro:
        'BondLab は原子を一つずつ配置して分子を作ることで、構造変化が性質に与える影響を理解しやすくします。',
      featureHeading: 'BondLab でできること',
      features: [
        '水素、炭素、窒素、酸素を使って分子を構築。',
        '単結合・二重結合・三重結合を作成、強化、削除。',
        '認識した分子名、分子式、構造情報、豆知識を確認。',
        '編集しながら極性と安定性をリアルタイム解析。',
        'チャレンジモードで目標分子を時間内に再現。',
      ],
      faqHeading: 'BondLab が扱う化学トピック',
      faqs: [
        {
          question: 'BondLab は分子構造をどう学習できますか？',
          answer:
            '原子と結合を 3D 可視化することで、静的な図より幾何構造と結合関係を理解しやすくします。',
        },
        {
          question: '価数や結合次数の練習に使えますか？',
          answer:
            'はい。原子追加や結合次数変更を行い、期待される価数挙動とすぐ比較できます。',
        },
        {
          question: '分子認識や極性のヒントはありますか？',
          answer:
            'あります。対応分子を識別し、極性分類と簡潔な説明を表示します。',
        },
      ],
    },
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'BondLab',
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'Web',
      description:
        '分子構造・極性・安定性をリアルタイムで学べる化学向けインタラクティブ分子ビルダー。',
      image: '/og-image.svg',
      keywords: '化学, 分子作成, 分子構造, 結合次数, 極性, 安定性',
      inLanguage: 'ja',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    },
  },
};

export const SEO_META = SEO_BY_LANGUAGE.en.meta;
export const SEO_CONTENT = SEO_BY_LANGUAGE.en.content;

export function getSeo(language: Language): SeoBundle {
  return SEO_BY_LANGUAGE[language];
}
