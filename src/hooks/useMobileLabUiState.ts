import { useEffect, useState } from 'react';
import type { ChallengeStatus } from '../store.ts';
import {
  shouldForceOpenMobileChallengeDrawer,
  shouldOpenMobileChallengeDrawerOnActivation,
  shouldShowMobileStatusChip,
} from '../mobileLabUi.ts';

function getInitialMobileInfoCollapsed(): boolean {
  return typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && !window.matchMedia('(min-width: 768px)').matches;
}

interface UseMobileLabUiStateParams {
  isDesktopViewport: boolean;
  isDrawerLayout: boolean;
  challengeActive: boolean;
  challengeStatus: ChallengeStatus;
}

export function useMobileLabUiState({
  isDesktopViewport,
  isDrawerLayout,
  challengeActive,
  challengeStatus,
}: UseMobileLabUiStateParams) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMobileChallengeOpen, setIsMobileChallengeOpen] = useState(false);
  const [isMobileInfoCollapsed, setIsMobileInfoCollapsed] = useState(getInitialMobileInfoCollapsed);
  const [mobileStatusChip, setMobileStatusChip] = useState<string | null>(null);

  useEffect(() => {
    if (!isDrawerLayout) {
      setIsMobileChallengeOpen(false);
      return;
    }
    if (shouldOpenMobileChallengeDrawerOnActivation(isDrawerLayout, challengeActive)) {
      setIsMobileChallengeOpen(true);
    }
  }, [challengeActive, isDrawerLayout]);

  useEffect(() => {
    if (shouldForceOpenMobileChallengeDrawer(isDrawerLayout, challengeActive, challengeStatus)) {
      setIsMobileChallengeOpen(true);
    }
  }, [challengeActive, challengeStatus, isDrawerLayout]);

  useEffect(() => {
    if (!mobileStatusChip) return;
    const timeout = window.setTimeout(() => setMobileStatusChip(null), 1200);
    return () => window.clearTimeout(timeout);
  }, [mobileStatusChip]);

  const showMobileStatusChip = (label: string) => {
    if (!shouldShowMobileStatusChip(isDesktopViewport)) return;
    setMobileStatusChip(label);
  };

  return {
    isDrawerOpen,
    setIsDrawerOpen,
    isMobileChallengeOpen,
    setIsMobileChallengeOpen,
    isMobileInfoCollapsed,
    setIsMobileInfoCollapsed,
    mobileStatusChip,
    showMobileStatusChip,
  };
}
