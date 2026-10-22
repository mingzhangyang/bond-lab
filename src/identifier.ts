import { MOLECULE_CATALOG } from './moleculeCatalog.ts';
import { createMoleculeRecognizer } from './moleculeRecognition.ts';

export { isValidMoleculeGraph, isConnectedMoleculeGraph } from './moleculeRecognition.ts';
export type { MoleculeMatch, MoleculeRecognition, RecognitionStatus } from './moleculeRecognition.ts';

const recognizer = createMoleculeRecognizer(MOLECULE_CATALOG);

export const KNOWN_MOLECULES = recognizer.knownMolecules;
export const analyzeMolecule = recognizer.analyze;
// Preserve the small match-or-null API used by the challenge and existing UI.
export const identifyMolecule = recognizer.identify;
