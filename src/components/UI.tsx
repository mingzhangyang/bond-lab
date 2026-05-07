import { useLabUiController } from '../hooks/useLabUiController';
import { LabDesktopSection } from './ui/LabDesktopSection';
import { LabMobileSection } from './ui/LabMobileSection';

export function UI() {
  const {
    rootClassName,
    themeVars,
    isDark,
    isDesktopViewport,
    topBarPanelClass,
    primaryTextClass,
    quickStartGuideProps,
    settingsMenuProps,
    desktopElementsRailProps,
    moleculeInspectorPanelsProps,
    interactionModeFabProps,
    deleteModeHintProps,
    bondUndoToastProps,
    bondActionBarProps,
    mobileElementsDrawerProps,
    mobileActionDockProps,
    challengeModeProps,
    isOnboardingVisible,
  } = useLabUiController();

  return (
    <div
      className={rootClassName}
      style={themeVars}
    >
      <LabDesktopSection
        isOnboardingVisible={isOnboardingVisible}
        quickStartGuideProps={quickStartGuideProps}
        isDark={isDark}
        isDesktopViewport={isDesktopViewport}
        topBarPanelClass={topBarPanelClass}
        primaryTextClass={primaryTextClass}
        settingsMenuProps={settingsMenuProps}
        desktopElementsRailProps={desktopElementsRailProps}
        moleculeInspectorPanelsProps={moleculeInspectorPanelsProps}
      />

      <LabMobileSection
        isDesktopViewport={isDesktopViewport}
        mobileElementsDrawerProps={mobileElementsDrawerProps}
        mobileActionDockProps={mobileActionDockProps}
        challengeModeProps={challengeModeProps}
        interactionModeFabProps={interactionModeFabProps}
        deleteModeHintProps={deleteModeHintProps}
        bondUndoToastProps={bondUndoToastProps}
        bondActionBarProps={bondActionBarProps}
      />
    </div>
  );
}
