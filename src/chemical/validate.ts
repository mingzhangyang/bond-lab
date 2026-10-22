export type LocalChemicalCheck =
  | { status: 'accepted'; smiles: string }
  | { status: 'rejected' | 'unavailable' };

let worker: Worker | null = null;
let nextId = 0;
const pending = new Map<number, {
  resolve: (value: LocalChemicalCheck) => void;
  timeout: ReturnType<typeof setTimeout>;
}>();

function resetWorker(): void {
  worker?.terminate();
  worker = null;
  for (const request of pending.values()) {
    clearTimeout(request.timeout);
    request.resolve({ status: 'unavailable' });
  }
  pending.clear();
}

export function validateWithRDKit(smiles: string, atomCount: number): Promise<LocalChemicalCheck> {
  if (typeof Worker === 'undefined') return Promise.resolve({ status: 'unavailable' });
  try {
    if (!worker) {
      worker = new Worker(new URL('./rdkit.worker.ts', import.meta.url), { type: 'module' });
      worker.onerror = resetWorker;
      worker.onmessage = (event: MessageEvent<{ id: number; status: string; smiles?: string }>) => {
        const { id, status, smiles: normalized } = event.data;
        const request = pending.get(id);
        if (!request) return;
        pending.delete(id);
        clearTimeout(request.timeout);
        if (status === 'accepted' && typeof normalized === 'string') {
          request.resolve({ status: 'accepted', smiles: normalized });
        } else {
          request.resolve({ status: status === 'rejected' ? 'rejected' : 'unavailable' });
        }
      };
    }
    return new Promise<LocalChemicalCheck>((resolve) => {
      const id = ++nextId;
      const timeout = setTimeout(resetWorker, 25000);
      pending.set(id, { resolve, timeout });
      worker!.postMessage({ id, smiles, atomCount });
    });
  } catch {
    resetWorker();
    return Promise.resolve({ status: 'unavailable' });
  }
}
