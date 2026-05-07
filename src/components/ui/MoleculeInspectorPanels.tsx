import { StabilityDisplay } from '../StabilityDisplay';
import { MoleculeInspector } from './MoleculeInspector';
import { getMessages } from '../../i18n';
import type { MoleculeInfo } from '../../moleculeInfo';

interface MoleculeMatch {
  name: string;
  formula: string;
}

type Messages = ReturnType<typeof getMessages>;

interface MoleculeInspectorPanelsProps {
  isDesktopViewport: boolean;
  isMobileChallengeOpen: boolean;
  atomsLength: number;
  molecule: MoleculeMatch | null;
  moleculeName: string | null;
  moleculeInfo: MoleculeInfo | null;
  isMobileInfoCollapsed: boolean;
  setIsMobileInfoCollapsed: (isCollapsed: boolean) => void;
  panelClass: string;
  headingTextClass: string;
  primaryTextClass: string;
  secondaryTextClass: string;
  ghostButtonClass: string;
  isDark: boolean;
  structureTitle: string;
  factTitle: string;
  polarityTitle: string;
  polarityLabel: string;
  polarityClassification: 'polar' | 'nonpolar' | 'unknown';
  polarityReason: string;
  messages: Messages;
}

export function MoleculeInspectorPanels({
  isDesktopViewport,
  isMobileChallengeOpen,
  atomsLength,
  molecule,
  moleculeName,
  moleculeInfo,
  isMobileInfoCollapsed,
  setIsMobileInfoCollapsed,
  panelClass,
  headingTextClass,
  primaryTextClass,
  secondaryTextClass,
  ghostButtonClass,
  isDark,
  structureTitle,
  factTitle,
  polarityTitle,
  polarityLabel,
  polarityClassification,
  polarityReason,
  messages,
}: MoleculeInspectorPanelsProps) {
  const sharedInspectorProps = {
    molecule,
    moleculeName,
    moleculeInfo,
    isMobileInfoCollapsed,
    setIsMobileInfoCollapsed,
    panelClass,
    headingTextClass,
    primaryTextClass,
    secondaryTextClass,
    ghostButtonClass,
    isDark,
    structureTitle,
    factTitle,
    polarityTitle,
    polarityLabel,
    polarityClassification,
    polarityReason,
    messages,
  };

  return (
    <>
      {isDesktopViewport && (atomsLength > 0 || molecule) && (
        <div
          className="hidden md:flex fixed right-6 top-[calc(env(safe-area-inset-top)+5.75rem)] bottom-[calc(env(safe-area-inset-bottom)+1.5rem)] z-40 pointer-events-none"
        >
          <div className="flex h-full w-80 flex-col gap-4">
            {atomsLength > 0 && (
              <div className="pointer-events-auto shrink-0">
                <StabilityDisplay />
              </div>
            )}

            <MoleculeInspector
              isDesktopViewport={true}
              {...sharedInspectorProps}
            />
          </div>
        </div>
      )}

      <div className="flex flex-col items-center gap-4 w-full mt-auto">
        {!isDesktopViewport && !isMobileChallengeOpen && (
          <MoleculeInspector
            isDesktopViewport={false}
            {...sharedInspectorProps}
          />
        )}
      </div>
    </>
  );
}
