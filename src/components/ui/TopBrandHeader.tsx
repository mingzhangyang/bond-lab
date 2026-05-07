import { StabilityDisplay } from '../StabilityDisplay';

interface TopBrandHeaderProps {
  isDesktopViewport: boolean;
  topBarPanelClass: string;
  primaryTextClass: string;
}

export function TopBrandHeader({
  isDesktopViewport,
  topBarPanelClass,
  primaryTextClass,
}: TopBrandHeaderProps) {
  return (
    <div className="lab-reveal relative flex items-start w-full">
      <div className="flex flex-col gap-4 w-full md:w-64">
        <div className={`flex items-center p-3 md:p-4 rounded-2xl pointer-events-auto w-full ${topBarPanelClass}`}>
          <div className="flex items-center gap-3">
            <img
              src="/BondLab-LogoSmall-128x128.svg"
              alt="BondLab logo"
              width={32}
              height={32}
              className="shrink-0"
            />
            <span className={`info-display font-black text-lg sm:text-xl tracking-tight ${primaryTextClass}`}>
              Bond<span className="text-indigo-400">Lab</span>
            </span>
          </div>
        </div>

        {!isDesktopViewport && (
          <div className="pointer-events-auto">
            <StabilityDisplay />
          </div>
        )}
      </div>
    </div>
  );
}
