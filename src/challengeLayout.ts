export type ChallengeStatus = 'idle' | 'playing' | 'won' | 'lost';

export function shouldExpandMobileChallenge(status: ChallengeStatus): boolean {
  return status !== 'playing';
}

export function isCompactChallengeView(
  status: ChallengeStatus,
  isExpanded: boolean,
  isMobileViewport: boolean,
): boolean {
  return status === 'playing' && !isExpanded && isMobileViewport;
}

export function shouldUseMobileChallengeDrawer(
  isNarrowViewport: boolean,
  _isCoarsePointer: boolean,
  _hasTouchInput: boolean,
): boolean {
  return isNarrowViewport;
}

export function getProgressColorClass(progress: number): string {
  if (progress < 20) return 'bg-red-500';
  if (progress < 50) return 'bg-yellow-500';
  return 'bg-emerald-500';
}

export interface ChallengeTimerArc {
  remainingRatio: number;
  circumference: number;
  strokeDasharray: string;
  strokeDashoffset: number;
}

export function getChallengeTimerArc(
  timeLeft: number,
  totalTime: number,
  radius: number,
): ChallengeTimerArc {
  const circumference = 2 * Math.PI * radius;
  if (totalTime <= 0) {
    return {
      remainingRatio: 0,
      circumference,
      strokeDasharray: `${circumference} ${circumference}`,
      strokeDashoffset: circumference,
    };
  }

  const remainingRatio = Math.max(0, Math.min(1, timeLeft / totalTime));
  return {
    remainingRatio,
    circumference,
    strokeDasharray: `${circumference} ${circumference}`,
    strokeDashoffset: circumference * (1 - remainingRatio),
  };
}
