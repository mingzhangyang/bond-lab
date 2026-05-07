import type { ChallengeStatus } from './store.ts';

export function shouldOpenMobileChallengeDrawerOnActivation(
  isDrawerLayout: boolean,
  challengeActive: boolean,
): boolean {
  return isDrawerLayout && challengeActive;
}

export function shouldForceOpenMobileChallengeDrawer(
  isDrawerLayout: boolean,
  challengeActive: boolean,
  challengeStatus: ChallengeStatus,
): boolean {
  return isDrawerLayout && challengeActive && challengeStatus !== 'playing';
}

export function getMobileChallengeProgress(
  challengeStatus: ChallengeStatus,
  challengeTimeLeft: number,
  challengeTotalTime: number,
): number | null {
  if (challengeStatus !== 'playing' || challengeTotalTime <= 0) return null;
  return Math.max(0, Math.min(1, challengeTimeLeft / challengeTotalTime));
}

export function shouldShowMobileStatusChip(isDesktopViewport: boolean): boolean {
  return !isDesktopViewport;
}
