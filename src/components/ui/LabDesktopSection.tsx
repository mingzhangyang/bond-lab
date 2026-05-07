import type { ComponentProps } from 'react';
import { QuickStartGuide } from '../QuickStartGuide';
import { TopBrandHeader } from './TopBrandHeader';
import { SettingsMenu } from './SettingsMenu';
import { DesktopElementsRail } from './DesktopElementsRail';
import { MoleculeInspectorPanels } from './MoleculeInspectorPanels';

interface LabDesktopSectionProps {
  isOnboardingVisible: boolean;
  quickStartGuideProps: ComponentProps<typeof QuickStartGuide>;
  isDark: boolean;
  isDesktopViewport: boolean;
  topBarPanelClass: string;
  primaryTextClass: string;
  settingsMenuProps: ComponentProps<typeof SettingsMenu>;
  desktopElementsRailProps: ComponentProps<typeof DesktopElementsRail>;
  moleculeInspectorPanelsProps: ComponentProps<typeof MoleculeInspectorPanels>;
}

export function LabDesktopSection({
  isOnboardingVisible,
  quickStartGuideProps,
  isDark,
  isDesktopViewport,
  topBarPanelClass,
  primaryTextClass,
  settingsMenuProps,
  desktopElementsRailProps,
  moleculeInspectorPanelsProps,
}: LabDesktopSectionProps) {
  return (
    <>
      {isOnboardingVisible && (
        <QuickStartGuide {...quickStartGuideProps} />
      )}

      <div className="pointer-events-none absolute inset-0 opacity-80" aria-hidden="true">
        <div className={`lab-orb absolute -top-20 left-1/4 h-64 w-64 rounded-full blur-3xl ${isDark ? 'bg-indigo-500/20' : 'bg-indigo-200/60'}`} />
        <div className={`lab-orb absolute -bottom-24 right-1/5 h-72 w-72 rounded-full blur-3xl ${isDark ? 'bg-cyan-500/12' : 'bg-cyan-100/70'}`} style={{ animationDelay: '1.5s' }} />
      </div>
      <TopBrandHeader
        isDesktopViewport={isDesktopViewport}
        topBarPanelClass={topBarPanelClass}
        primaryTextClass={primaryTextClass}
      />

      <SettingsMenu {...settingsMenuProps} />

      <DesktopElementsRail {...desktopElementsRailProps} />

      <MoleculeInspectorPanels {...moleculeInspectorPanelsProps} />
    </>
  );
}
