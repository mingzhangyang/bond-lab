import type { ComponentProps } from 'react';
import { ChallengeMode } from '../ChallengeMode';
import { MobileElementsDrawer } from './MobileElementsDrawer';
import { MobileActionDock } from './MobileActionDock';
import { InteractionModeFab } from './InteractionModeFab';
import { DeleteModeHint } from './DeleteModeHint';
import { BondUndoToast } from './BondUndoToast';
import { BondActionBar } from './BondActionBar';

interface LabMobileSectionProps {
  isDesktopViewport: boolean;
  mobileElementsDrawerProps: ComponentProps<typeof MobileElementsDrawer>;
  mobileActionDockProps: ComponentProps<typeof MobileActionDock>;
  challengeModeProps: ComponentProps<typeof ChallengeMode>;
  interactionModeFabProps: ComponentProps<typeof InteractionModeFab>;
  deleteModeHintProps: ComponentProps<typeof DeleteModeHint>;
  bondUndoToastProps: ComponentProps<typeof BondUndoToast>;
  bondActionBarProps: ComponentProps<typeof BondActionBar>;
}

export function LabMobileSection({
  isDesktopViewport,
  mobileElementsDrawerProps,
  mobileActionDockProps,
  challengeModeProps,
  interactionModeFabProps,
  deleteModeHintProps,
  bondUndoToastProps,
  bondActionBarProps,
}: LabMobileSectionProps) {
  return (
    <>
      <MobileElementsDrawer {...mobileElementsDrawerProps} />

      <MobileActionDock {...mobileActionDockProps} />

      {!isDesktopViewport && (
        <div className="pointer-events-auto md:hidden">
          <ChallengeMode {...challengeModeProps} />
        </div>
      )}

      <InteractionModeFab {...interactionModeFabProps} />

      <DeleteModeHint {...deleteModeHintProps} />

      <BondUndoToast {...bondUndoToastProps} />

      <BondActionBar {...bondActionBarProps} />
    </>
  );
}
