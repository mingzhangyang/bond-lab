import { useEffect, useMemo, useState } from 'react';
import { useStore, type Bond } from '../store';
import type { InteractionMode } from '../preferences';
import type { Messages } from '../i18n';

interface UseBondActionsParams {
  bonds: Bond[];
  interactionMode: InteractionMode;
  setInteractionMode: (mode: InteractionMode) => void;
  showMobileStatusChip: (label: string) => void;
  messages: Messages;
}

export function useBondActions({
  bonds,
  interactionMode,
  setInteractionMode,
  showMobileStatusChip,
  messages,
}: UseBondActionsParams) {
  const addBond = useStore((state) => state.addBond);
  const removeBond = useStore((state) => state.removeBond);
  const selectedBondId = useStore((state) => state.selectedBond);
  const setSelectedBond = useStore((state) => state.setSelectedBond);
  const lastRemovedBond = useStore((state) => state.lastRemovedBond);
  const restoreLastRemovedBond = useStore((state) => state.restoreLastRemovedBond);
  const discardLastRemovedBond = useStore((state) => state.discardLastRemovedBond);
  const [showBondUndoToast, setShowBondUndoToast] = useState(false);

  const selectedBond = useMemo(
    () => bonds.find((bond) => bond.id === selectedBondId) ?? null,
    [bonds, selectedBondId],
  );

  useEffect(() => {
    if (!lastRemovedBond) {
      setShowBondUndoToast(false);
      return;
    }
    setShowBondUndoToast(true);
    const timeout = window.setTimeout(() => {
      setShowBondUndoToast(false);
      discardLastRemovedBond();
    }, 3000);
    return () => window.clearTimeout(timeout);
  }, [lastRemovedBond, discardLastRemovedBond]);

  useEffect(() => {
    if (interactionMode !== 'delete') return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setInteractionMode('build');
      showMobileStatusChip(messages.ui.buildMode);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [interactionMode, messages.ui.buildMode, setInteractionMode, showMobileStatusChip]);

  const handleUndoBondRemoval = () => {
    restoreLastRemovedBond();
    setShowBondUndoToast(false);
    showMobileStatusChip(messages.ui.undo);
  };

  const handleUpgradeSelectedBond = () => {
    if (!selectedBond) return;
    addBond(selectedBond.source, selectedBond.target);
    showMobileStatusChip(messages.ui.upgradeBond);
  };

  const handleRemoveSelectedBond = () => {
    if (!selectedBond) return;
    removeBond(selectedBond.id);
    setSelectedBond(null);
    showMobileStatusChip(messages.ui.bondRemoved);
  };

  return {
    selectedBond,
    lastRemovedBond,
    showBondUndoToast,
    handleUndoBondRemoval,
    handleUpgradeSelectedBond,
    handleRemoveSelectedBond,
  };
}
