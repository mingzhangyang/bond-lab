import type { Language } from './i18n';
import type { AppRoute } from './routes';

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
  useCasesHeading: string;
  useCases: string[];
  audienceHeading: string;
  audiences: string[];
  disclaimerHeading: string;
  disclaimer: string;
  faqHeading: string;
  faqs: SeoFaqItem[];
}

export interface SeoJsonLd {
  '@context': string;
  '@type': 'SoftwareApplication' | 'FAQPage';
  name?: string;
  applicationCategory?: 'EducationalApplication';
  operatingSystem?: 'Web';
  description?: string;
  image?: string;
  keywords?: string;
  inLanguage?: Language;
  offers?: {
    '@type': 'Offer';
    price: string;
    priceCurrency: 'USD';
  };
  mainEntity?: {
    '@type': 'Question';
    name: string;
    acceptedAnswer: {
      '@type': 'Answer';
      text: string;
    };
  }[];
}

export interface SeoBundle {
  meta: SeoMeta;
  content: SeoContent;
  jsonLd: SeoJsonLd;
  faqJsonLd?: SeoJsonLd;
}

export interface SeoRouteConfig {
  description: string;
  keywords: string;
  robots: string;
  canonicalUrl: string;
  ogType: 'website' | 'article';
  ogImageAlt: string;
  jsonLd: Array<Record<string, unknown>>;
}

interface SeoPageCopy {
  title: string;
  description: string;
  keywords: string;
}

const SEO_ROBOTS_INDEX = 'index, follow, max-image-preview:large';
const SEO_ROBOTS_NOINDEX = 'noindex, follow';

export const SEO_BASE_URL = 'https://bondlab.orangely.xyz';
export const SEO_IMAGE_URL = `${SEO_BASE_URL}/og-image.svg`;

const SEO_BY_LANGUAGE: Record<Language, SeoBundle> = {
  en: {
    meta: {
      titleSuffix: '3D Molecule Builder for Chemistry Learning',
      description:
        'BondLab is an interactive 3D chemistry learning app where students build molecules, test bond orders, and explore molecular structure, polarity, and stability in real time.',
      keywords:
        '3d molecule builder, chemistry simulator, molecular geometry, bond order, valence electrons, chemistry education, interactive science app',
      ogDescription:
        'Build molecules in 3D, adjust bond order, and explore molecular polarity, geometry, and stability with BondLab.',
      twitterDescription:
        'Interactive 3D chemistry app for molecule building, bond editing, and molecular property exploration.',
    },
    content: {
      heading: 'BondLab Interactive Chemistry Lab',
      intro:
        'BondLab helps learners understand chemistry by letting them construct molecules atom-by-atom, compare bond patterns, and observe how structure changes affect properties.',
      featureHeading: 'What you can do in BondLab',
      features: [
        'Build molecules with hydrogen, carbon, nitrogen, and oxygen atoms.',
        'Create, upgrade, and remove bonds to explore single, double, and triple connectivity.',
        'Inspect identified molecules, formulas, structure notation, and quick science facts.',
        'Analyze molecular polarity and stability feedback while editing in real time.',
        'Practice with challenge mode to recreate target molecules under time pressure.',
      ],
      useCasesHeading: 'Best use cases for BondLab',
      useCases: [
        'Use BondLab in chemistry class to introduce molecular structure and bond order visually.',
        'Practice building small molecules while checking polarity and stability hints as you edit.',
        'Explore how changing a single bond to a double bond affects formula interpretation and geometry cues.',
      ],
      audienceHeading: 'Who BondLab is for',
      audiences: [
        'Students learning introductory chemistry and molecular structure.',
        'Teachers who want a quick visual molecule builder for demonstrations.',
        'Curious learners looking for a playful chemistry sandbox on the web.',
      ],
      disclaimerHeading: 'Educational model notice',
      disclaimer:
        'BondLab is designed for science outreach, classroom demos, and exploration. Its molecule recognition, stability, and polarity outputs are simplified learning aids rather than rigorous chemical analysis.',
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
      image: SEO_IMAGE_URL,
      keywords: 'chemistry, molecule builder, molecular structure, bond order, polarity, stability',
      inLanguage: 'en',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    },
    faqJsonLd: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How does BondLab teach molecular structure?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'BondLab visualizes atoms and bonds in 3D, making geometry and connectivity easier to understand than static diagrams.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can BondLab be used for valence and bond order practice?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. You can add atoms, change bond order, and immediately compare your model with expected valence behavior.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does BondLab include molecule recognition and polarity hints?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. The app identifies supported molecules and provides polarity classification with a short explanation.',
          },
        },
      ],
    },
  },
  es: {
    meta: {
      titleSuffix: 'Constructor 3D de Moleculas para Aprender Quimica',
      description:
        'BondLab es una aplicacion educativa de quimica 3D para construir moleculas, probar ordenes de enlace y explorar estructura molecular, polaridad y estabilidad en tiempo real.',
      keywords:
        'constructor 3D de moleculas, simulador de quimica, geometria molecular, orden de enlace, electrones de valencia, educacion cientifica',
      ogDescription:
        'Construye moleculas en 3D, ajusta el orden de enlace y explora polaridad, geometria y estabilidad con BondLab.',
      twitterDescription:
        'Aplicacion 3D interactiva de quimica para construir moleculas y analizar propiedades moleculares.',
    },
    content: {
      heading: 'BondLab Laboratorio Interactivo de Quimica',
      intro:
        'BondLab ayuda a los estudiantes a comprender quimica construyendo moleculas atomo por atomo y observando como cambian sus propiedades y enlaces.',
      featureHeading: 'Que puedes hacer en BondLab',
      features: [
        'Construir moleculas con hidrogeno, carbono, nitrogeno y oxigeno.',
        'Crear, mejorar y eliminar enlaces para explorar conectividad simple, doble y triple.',
        'Consultar moleculas identificadas, formulas, estructura y datos rapidos.',
        'Analizar polaridad molecular y estabilidad en tiempo real.',
        'Practicar en modo desafio recreando moleculas objetivo contra reloj.',
      ],
      useCasesHeading: 'Mejores usos de BondLab',
      useCases: [
        'Usar BondLab en clase para introducir estructura molecular y orden de enlace de forma visual.',
        'Practicar la construccion de moleculas pequenas mientras revisas pistas de polaridad y estabilidad.',
        'Explorar como cambiar un enlace simple a doble modifica la interpretacion de la estructura.',
      ],
      audienceHeading: 'Para quien es BondLab',
      audiences: [
        'Estudiantes que aprenden quimica introductoria y estructura molecular.',
        'Docentes que buscan una herramienta visual rapida para demostraciones.',
        'Personas curiosas que quieren explorar quimica de forma interactiva en la web.',
      ],
      disclaimerHeading: 'Aviso sobre el modelo educativo',
      disclaimer:
        'BondLab esta pensado para divulgacion cientifica, demostraciones en clase y exploracion. La identificacion molecular, la estabilidad y la polaridad son ayudas simplificadas y no sustituyen un analisis quimico riguroso.',
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
      image: SEO_IMAGE_URL,
      keywords: 'quimica, constructor de moleculas, estructura molecular, orden de enlace, polaridad, estabilidad',
      inLanguage: 'es',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    },
    faqJsonLd: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Como ensena BondLab la estructura molecular?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'BondLab muestra atomos y enlaces en 3D para entender geometria y conectividad mejor que con diagramas estaticos.',
          },
        },
        {
          '@type': 'Question',
          name: 'Se puede practicar valencia y orden de enlace?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Si. Puedes agregar atomos, cambiar el orden de enlace y comparar al instante con el comportamiento de valencia esperado.',
          },
        },
        {
          '@type': 'Question',
          name: 'Incluye reconocimiento de moleculas y pistas de polaridad?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Si. La aplicacion identifica moleculas compatibles y muestra clasificacion de polaridad con una breve explicacion.',
          },
        },
      ],
    },
  },
  zh: {
    meta: {
      titleSuffix: '3D 化学学习分子构建器',
      description:
        'BondLab 是一款 3D 交互式化学学习应用，可用于构建分子、测试键级，并实时探索分子结构、极性与稳定性。',
      keywords: '3D 分子构建器, 化学模拟器, 分子构建, 分子几何, 键级, 价电子, 化学教育, 互动科学应用',
      ogDescription: '在 BondLab 中以 3D 方式构建分子，调整键级并探索极性、几何与稳定性。',
      twitterDescription: '用于分子构建、键编辑与分子性质探索的 3D 交互式化学应用。',
    },
    content: {
      heading: 'BondLab 交互式化学实验室',
      intro:
        'BondLab 通过逐个原子构建分子，帮助学习者理解结构变化、键级变化如何影响分子性质。',
      featureHeading: 'BondLab 可以做什么',
      features: [
        '使用氢、碳、氮、氧构建分子。',
        '创建、升级和移除化学键，探索单键、双键和三键连接。',
        '查看已识别分子的名称、分子式、结构表示和知识点。',
        '在编辑过程中实时分析分子极性与稳定性反馈。',
        '在挑战模式中限时复现目标分子。',
      ],
      useCasesHeading: '适合如何使用 BondLab',
      useCases: [
        '在化学课堂中用它直观演示分子结构、键级和几何关系。',
        '在练习小分子构建时，结合极性和稳定性提示进行观察。',
        '对比单键、双键和三键变化对结构理解带来的影响。',
      ],
      audienceHeading: 'BondLab 适合谁',
      audiences: [
        '正在学习入门化学和分子结构的学生。',
        '需要快速演示分子构建过程的教师。',
        '希望在网页上轻松体验化学构建的科普用户。',
      ],
      disclaimerHeading: '教育模型说明',
      disclaimer:
        'BondLab 主要用于科普展示、课堂演示与互动探索。分子识别、稳定性和极性结果基于简化规则，更适合作为学习提示，而非严格的化学分析。',
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
      image: SEO_IMAGE_URL,
      keywords: '化学, 分子构建, 分子结构, 键级, 极性, 稳定性',
      inLanguage: 'zh',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    },
    faqJsonLd: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'BondLab 如何帮助理解分子结构？',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'BondLab 以 3D 方式可视化原子与化学键，比静态图更容易理解几何结构和连接关系。',
          },
        },
        {
          '@type': 'Question',
          name: '可以用于练习价态与键级吗？',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '可以。你可以添加原子、修改键级，并立即对照预期的价态行为。',
          },
        },
        {
          '@type': 'Question',
          name: '是否提供分子识别与极性提示？',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '是的。应用会识别已支持分子，并给出极性分类与简要说明。',
          },
        },
      ],
    },
  },
  fr: {
    meta: {
      titleSuffix: 'Constructeur Moleculaire 3D pour Apprendre la Chimie',
      description:
        'BondLab est une application educative de chimie 3D pour construire des molecules, tester les ordres de liaison et explorer structure moleculaire, polarite et stabilite en temps reel.',
      keywords:
        'constructeur 3D de molecules, simulateur de chimie, geometrie moleculaire, ordre de liaison, electrons de valence, education scientifique',
      ogDescription:
        'Construisez des molecules en 3D, ajustez les liaisons et explorez polarite, geometrie et stabilite avec BondLab.',
      twitterDescription:
        'Application 3D de chimie interactive pour construire des molecules et analyser leurs proprietes.',
    },
    content: {
      heading: 'BondLab Laboratoire de Chimie Interactif',
      intro:
        'BondLab aide les apprenants a comprendre la chimie en construisant des molecules atome par atome et en observant les effets des liaisons.',
      featureHeading: 'Ce que vous pouvez faire dans BondLab',
      features: [
        'Construire des molecules avec hydrogene, carbone, azote et oxygene.',
        'Creer, ameliorer et supprimer des liaisons simples, doubles et triples.',
        'Consulter molecules identifiees, formules, structures et informations rapides.',
        'Analyser polarite moleculaire et stabilite en temps reel.',
        'S entrainer avec le mode defi pour reconstruire des molecules cibles.',
      ],
      useCasesHeading: 'Meilleurs usages de BondLab',
      useCases: [
        'Presenter visuellement la structure moleculaire et l ordre de liaison en cours de chimie.',
        'S exercer a construire de petites molecules avec des indices de polarite et de stabilite.',
        'Comparer l effet d une liaison simple, double ou triple sur la lecture de la structure.',
      ],
      audienceHeading: 'Pour qui est BondLab',
      audiences: [
        'Les eleves qui apprennent la chimie introductive et la structure moleculaire.',
        'Les enseignants qui veulent un outil visuel rapide pour leurs demonstrations.',
        'Les curieux qui souhaitent explorer la chimie de facon ludique sur le web.',
      ],
      disclaimerHeading: 'Note sur le modele educatif',
      disclaimer:
        'BondLab est concu pour la vulgarisation scientifique, les demonstrations en classe et l exploration. Les resultats de stabilite, de polarite et d identification des molecules sont simplifies et ne remplacent pas une analyse chimique rigoureuse.',
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
      image: SEO_IMAGE_URL,
      keywords: 'chimie, constructeur de molecules, structure moleculaire, ordre de liaison, polarite, stabilite',
      inLanguage: 'fr',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    },
    faqJsonLd: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Comment BondLab enseigne la structure moleculaire ?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'BondLab visualise atomes et liaisons en 3D pour mieux comprendre geometrie et connectivite.',
          },
        },
        {
          '@type': 'Question',
          name: 'Peut-on pratiquer valence et ordre de liaison ?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Oui. Vous ajoutez des atomes, modifiez les liaisons et comparez immediatement au comportement attendu.',
          },
        },
        {
          '@type': 'Question',
          name: 'BondLab propose-t-il identification et polarite ?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Oui. L application reconnait les molecules prises en charge et affiche une classification de polarite.',
          },
        },
      ],
    },
  },
  ja: {
    meta: {
      titleSuffix: '化学学習向け 3D 分子ビルダー',
      description:
        'BondLab は分子を組み立てながら結合次数を試し、分子構造・極性・安定性をリアルタイムで学べる 3D 化学学習アプリです。',
      keywords: '3D 分子ビルダー, 化学シミュレーター, 分子作成, 分子構造, 結合次数, 価電子, 化学教育, インタラクティブ学習',
      ogDescription: '3D で分子を作成し、結合次数、極性、幾何、安定性を学べる BondLab。',
      twitterDescription: '分子作成と結合編集を通じて分子特性を学べる 3D インタラクティブ化学アプリ。',
    },
    content: {
      heading: 'BondLab インタラクティブ化学ラボ',
      intro:
        'BondLab は原子を一つずつ配置して分子を作ることで、構造変化や結合の違いが性質に与える影響を理解しやすくします。',
      featureHeading: 'BondLab でできること',
      features: [
        '水素、炭素、窒素、酸素を使って分子を構築。',
        '単結合・二重結合・三重結合を作成、強化、削除。',
        '認識した分子名、分子式、構造情報、豆知識を確認。',
        '編集しながら極性と安定性をリアルタイム解析。',
        'チャレンジモードで目標分子を時間内に再現。',
      ],
      useCasesHeading: 'BondLab の活用シーン',
      useCases: [
        '授業で分子構造や結合次数を視覚的に説明したいとき。',
        '小さな分子を作りながら極性や安定性のヒントを確認したいとき。',
        '単結合、二重結合、三重結合の違いを比べながら理解したいとき。',
      ],
      audienceHeading: 'BondLab が向いている人',
      audiences: [
        '入門化学や分子構造を学ぶ学生。',
        '短時間で分子構築を見せたい先生や講師。',
        'ブラウザで気軽に化学を体験したい学習者。',
      ],
      disclaimerHeading: '学習モデルに関する注意',
      disclaimer:
        'BondLab は科学コミュニケーション、授業デモ、探索体験のためのアプリです。分子認識、安定性、極性の結果は簡略化された学習補助であり、厳密な化学解析の代わりにはなりません。',
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
      image: SEO_IMAGE_URL,
      keywords: '化学, 分子作成, 分子構造, 結合次数, 極性, 安定性',
      inLanguage: 'ja',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    },
    faqJsonLd: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'BondLab は分子構造をどう学習できますか？',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '原子と結合を 3D 可視化することで、静的な図より幾何構造と結合関係を理解しやすくします。',
          },
        },
        {
          '@type': 'Question',
          name: '価数や結合次数の練習に使えますか？',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'はい。原子追加や結合次数変更を行い、期待される価数挙動とすぐ比較できます。',
          },
        },
        {
          '@type': 'Question',
          name: '分子認識や極性のヒントはありますか？',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'あります。対応分子を識別し、極性分類と簡潔な説明を表示します。',
          },
        },
      ],
    },
  },
};

const SEO_PAGE_COPY: Record<Language, Record<Exclude<AppRoute, 'lab'>, SeoPageCopy>> = {
  en: {
    instructions: {
      title: 'Instructions',
      description:
        'Read the BondLab usage guide to learn molecule-building controls, bond editing, view navigation, and chemistry learning tips.',
      keywords:
        'BondLab instructions, molecule builder guide, chemistry app tutorial, bond editing help, molecular structure learning',
    },
    privacy: {
      title: 'Privacy Policy',
      description:
        'Review the BondLab privacy policy to understand local storage usage, saved preferences, and how the app handles user data.',
      keywords:
        'BondLab privacy policy, chemistry app privacy, local storage settings, educational app data usage',
    },
  },
  es: {
    instructions: {
      title: 'Instrucciones',
      description:
        'Consulta la guia de uso de BondLab para aprender controles de construccion molecular, edicion de enlaces y navegacion de la vista.',
      keywords:
        'instrucciones BondLab, guia de moleculas, tutorial de quimica, ayuda de enlaces, aprendizaje de estructura molecular',
    },
    privacy: {
      title: 'Politica de privacidad',
      description:
        'Revisa la politica de privacidad de BondLab para conocer el uso de almacenamiento local, preferencias guardadas y tratamiento de datos.',
      keywords:
        'privacidad BondLab, politica de privacidad, almacenamiento local, datos de aplicacion educativa',
    },
  },
  zh: {
    instructions: {
      title: '使用说明',
      description:
        '查看 BondLab 使用说明，了解分子构建、键编辑、视角控制与化学学习提示。',
      keywords:
        'BondLab 使用说明, 分子构建教程, 化学应用指南, 键编辑帮助, 分子结构学习',
    },
    privacy: {
      title: '隐私政策',
      description:
        '阅读 BondLab 隐私政策，了解本地存储、偏好设置保存方式以及应用如何处理用户数据。',
      keywords:
        'BondLab 隐私政策, 化学应用隐私, 本地存储, 教育应用数据说明',
    },
  },
  fr: {
    instructions: {
      title: 'Instructions',
      description:
        'Consultez le guide BondLab pour apprendre les controles de construction moleculaire, l edition des liaisons et la navigation dans la vue.',
      keywords:
        'instructions BondLab, guide de molecules, tutoriel de chimie, aide sur les liaisons, apprentissage structure moleculaire',
    },
    privacy: {
      title: 'Politique de confidentialite',
      description:
        'Consultez la politique de confidentialite de BondLab pour comprendre le stockage local, les preferences sauvegardees et le traitement des donnees.',
      keywords:
        'confidentialite BondLab, politique de confidentialite, stockage local, donnees application educative',
    },
  },
  ja: {
    instructions: {
      title: '操作説明',
      description:
        'BondLab の操作説明で、分子構築、結合編集、視点操作、学習ヒントを確認できます。',
      keywords:
        'BondLab 操作説明, 分子作成ガイド, 化学アプリ使い方, 結合編集ヘルプ, 分子構造学習',
    },
    privacy: {
      title: 'プライバシーポリシー',
      description:
        'BondLab のプライバシーポリシーで、ローカル保存、設定保持、ユーザーデータの扱いを確認できます。',
      keywords:
        'BondLab プライバシー, プライバシーポリシー, ローカル保存, 教育アプリのデータ利用',
    },
  },
};

function getCanonicalUrl(route: AppRoute): string {
  if (route === 'lab') {
    return `${SEO_BASE_URL}/`;
  }

  return `${SEO_BASE_URL}/${route}`;
}

function getWebsiteJsonLd(language: Language, description: string): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'BondLab',
    url: `${SEO_BASE_URL}/`,
    inLanguage: language,
    description,
  };
}

function getWebPageJsonLd(language: Language, title: string, description: string, url: string): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `BondLab | ${title}`,
    url,
    inLanguage: language,
    description,
    isPartOf: {
      '@type': 'WebSite',
      name: 'BondLab',
      url: `${SEO_BASE_URL}/`,
    },
  };
}

export const SEO_META = SEO_BY_LANGUAGE.en.meta;
export const SEO_CONTENT = SEO_BY_LANGUAGE.en.content;

export function getSeo(language: Language): SeoBundle {
  return SEO_BY_LANGUAGE[language];
}

export function getRouteSeo(language: Language, route: AppRoute): SeoRouteConfig {
  const seo = SEO_BY_LANGUAGE[language];
  const canonicalUrl = getCanonicalUrl(route);
  const ogImageAlt = `${seo.content.heading} preview image`;

  if (route === 'lab') {
    return {
      description: seo.meta.description,
      keywords: seo.meta.keywords,
      robots: SEO_ROBOTS_INDEX,
      canonicalUrl,
      ogType: 'website',
      ogImageAlt,
      jsonLd: [
        getWebsiteJsonLd(language, seo.meta.description),
        seo.jsonLd as Record<string, unknown>,
        ...(seo.faqJsonLd ? [seo.faqJsonLd as Record<string, unknown>] : []),
      ],
    };
  }

  const page = SEO_PAGE_COPY[language][route];

  return {
    description: page.description,
    keywords: page.keywords,
    robots: route === 'privacy' ? SEO_ROBOTS_NOINDEX : SEO_ROBOTS_INDEX,
    canonicalUrl,
    ogType: 'article',
    ogImageAlt,
    jsonLd: [
      getWebsiteJsonLd(language, seo.meta.description),
      getWebPageJsonLd(language, page.title, page.description, canonicalUrl),
    ],
  };
}
