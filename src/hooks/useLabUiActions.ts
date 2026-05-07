import { useCallback } from 'react';
import type { Dispatch, DragEvent, SetStateAction } from 'react';
import { KNOWN_MOLECULES } from '../identifier.ts';
import type { Messages } from '../i18n.ts';
import { toggleInteractionMode, type InteractionMode } from '../preferences.ts';
import type { ChallengeTarget, ElementType } from '../store.ts';
import { setElementDragData } from '../drag.ts';
import { createChallengeRound } from '../challengeTargets.ts';

interface UseLabUiActionsParams {
  messages: Messages;
  interactionMode: InteractionMode;
  challengeActive: boolean;
  isDrawerLayout: boolean;
  addAtom: (element: ElementType) => string;
  clear: () => void;
  startChallenge: (target: ChallengeTarget, timeLimit: number) => void;
  setInteractionMode: (mode: InteractionMode) => void;
  setIsDrawerOpen: (open: boolean) => void;
  setIsMobileChallengeOpen: Dispatch<SetStateAction<boolean>>;
  showMobileStatusChip: (label: string) => void;
}

export function useLabUiActions({
  messages,
  interactionMode,
  challengeActive,
  isDrawerLayout,
  addAtom,
  clear,
  startChallenge,
  setInteractionMode,
  setIsDrawerOpen,
  setIsMobileChallengeOpen,
  showMobileStatusChip,
}: UseLabUiActionsParams) {
  const handleStartChallenge = useCallback(() => {
    const round = createChallengeRound(KNOWN_MOLECULES, Math.random());
    if (!round) return;

    startChallenge({ name: round.name, formula: round.formula }, round.timeLimit);
    if (isDrawerLayout) {
      setIsMobileChallengeOpen(true);
    }
    showMobileStatusChip(messages.challenge.title);
  }, [isDrawerLayout, messages.challenge.title, setIsMobileChallengeOpen, showMobileStatusChip, startChallenge]);

  const handleElementDragStart = useCallback((event: DragEvent<HTMLButtonElement>, element: ElementType) => {
    setElementDragData(event.dataTransfer, element);
    event.dataTransfer.effectAllowed = 'copy';
  }, []);

  const handleToggleInteractionMode = useCallback(() => {
    const nextMode = toggleInteractionMode(interactionMode);
    setInteractionMode(nextMode);
    showMobileStatusChip(nextMode === 'build' ? messages.ui.buildMode : messages.ui.removeHint);
  }, [interactionMode, messages.ui.buildMode, messages.ui.removeHint, setInteractionMode, showMobileStatusChip]);

  const handleMobileAddAtom = useCallback((element: ElementType) => {
    addAtom(element);
    setIsDrawerOpen(false);
    showMobileStatusChip(messages.elements[element]);
  }, [addAtom, messages.elements, setIsDrawerOpen, showMobileStatusChip]);

  const handleMobileClear = useCallback(() => {
    clear();
    setIsDrawerOpen(false);
    showMobileStatusChip(messages.ui.clearAll);
  }, [clear, messages.ui.clearAll, setIsDrawerOpen, showMobileStatusChip]);

  const handleMobileAddClick = useCallback(() => {
    setIsDrawerOpen(true);
    showMobileStatusChip(messages.ui.addElement);
  }, [messages.ui.addElement, setIsDrawerOpen, showMobileStatusChip]);

  const handleChallengeClick = useCallback(() => {
    if (challengeActive) {
      setIsMobileChallengeOpen((isOpen) => !isOpen);
      return;
    }
    handleStartChallenge();
  }, [challengeActive, handleStartChallenge, setIsMobileChallengeOpen]);

  return {
    handleStartChallenge,
    handleElementDragStart,
    handleToggleInteractionMode,
    handleMobileAddAtom,
    handleMobileClear,
    handleMobileAddClick,
    handleChallengeClick,
  };
}
