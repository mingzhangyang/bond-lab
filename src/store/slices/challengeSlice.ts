import type { StateCreator } from 'zustand';
import type {
  ChallengeActions,
  ChallengeState,
  GameState,
} from '../types.ts';

export type ChallengeSlice = ChallengeState & ChallengeActions;

export const createChallengeSlice: StateCreator<GameState, [], [], ChallengeSlice> = (set) => ({
  challengeActive: false,
  challengeTarget: null,
  challengeTimeLeft: 0,
  challengeTotalTime: 0,
  challengeStatus: 'idle',

  startChallenge: (target, timeLimit) => set({
    atoms: [],
    bonds: [],
    selectedAtom: null,
    rotatingBond: null,
    challengeActive: true,
    challengeTarget: target,
    challengeTimeLeft: timeLimit,
    challengeTotalTime: timeLimit,
    challengeStatus: 'playing',
  }),

  tickChallenge: () => set((state) => {
    if (state.challengeStatus !== 'playing') return state;
    const nextTime = state.challengeTimeLeft - 1;
    if (nextTime <= 0) {
      return { challengeTimeLeft: 0, challengeStatus: 'lost' };
    }
    return { challengeTimeLeft: nextTime };
  }),

  winChallenge: () => set({ challengeStatus: 'won' }),

  stopChallenge: () => set({
    challengeActive: false,
    challengeTarget: null,
    challengeStatus: 'idle',
    rotatingBond: null,
  }),
});
