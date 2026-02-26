export type ChallengeStatus = 'idle' | 'playing' | 'won' | 'lost';

export function shouldExpandMobileChallenge(status: ChallengeStatus): boolean {
  return status !== 'playing';
}

export function getProgressColorClass(progress: number): string {
  if (progress < 20) return 'bg-red-500';
  if (progress < 50) return 'bg-yellow-500';
  return 'bg-emerald-500';
}
