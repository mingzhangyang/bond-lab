export interface PrivacyPolicy {
  version: string;
  dataCollection: string[];
  localStorageUsage: string[];
  externalServices: string[];
  updatesAndContact: string[];
}

export const PRIVACY_POLICY: PrivacyPolicy = {
  version: '2026-02-26',
  dataCollection: [
    'BondLab runs primarily in your browser and does not require account registration.',
    'Molecule edits, challenge progress, and interactions are processed locally on your device.',
    'No personal profile data is intentionally collected by default.',
  ],
  localStorageUsage: [
    'Theme preference is stored locally so the app remembers light or dark mode.',
    'Language selection is stored locally to keep your preferred locale.',
    'UI preferences such as control panel collapse state are stored locally for convenience.',
  ],
  externalServices: [
    'By default, BondLab works without sending molecule data to external APIs.',
    'If optional AI-assisted features are enabled in the future, service usage will be disclosed in-app before activation.',
    'API keys such as GEMINI_API_KEY should be configured locally and not committed to the repository.',
  ],
  updatesAndContact: [
    'This policy may be updated as features evolve; the version date above reflects the latest change.',
    'For privacy questions or removal requests, contact project maintainers via the repository issue tracker.',
  ],
};
