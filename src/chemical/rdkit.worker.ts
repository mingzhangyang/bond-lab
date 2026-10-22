import initRDKitModule from '@rdkit/rdkit';
import wasmUrl from '@rdkit/rdkit/RDKit_minimal.wasm?url';

type CheckRequest = { id: number; smiles: string; atomCount: number };
let initialized: ReturnType<typeof initRDKitModule> | null = null;

self.onmessage = async (event: MessageEvent<CheckRequest>) => {
  const { id, smiles, atomCount } = event.data;
  if (!Number.isInteger(id) || typeof smiles !== 'string' || smiles.length > 1200
    || !Number.isInteger(atomCount) || atomCount < 2 || atomCount > 80) return;

  try {
    if (!initialized) initialized = initRDKitModule({ locateFile: () => wasmUrl });
    const engine = await initialized;
    const mol = engine.get_mol(smiles, JSON.stringify({ sanitize: true, removeHs: false }));
    if (!mol) {
      self.postMessage({ id, status: 'rejected' });
      return;
    }
    try {
      if (mol.get_num_atoms() !== atomCount) {
        self.postMessage({ id, status: 'rejected' });
        return;
      }
      const canonicalSmiles = mol.get_smiles();
      if (typeof canonicalSmiles !== 'string' || canonicalSmiles.length > 1200) {
        self.postMessage({ id, status: 'rejected' });
        return;
      }
      self.postMessage({ id, status: 'accepted', smiles: canonicalSmiles });
    } finally {
      mol.delete();
    }
  } catch {
    initialized = null;
    self.postMessage({ id, status: 'unavailable' });
  }
};
