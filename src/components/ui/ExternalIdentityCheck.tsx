import { useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from '../../store.ts';
import { exportChemicalStructure } from '../../chemical/structure.ts';
import { validateWithRDKit } from '../../chemical/validate.ts';
import type { Language } from '../../i18n.ts';

type RemoteIdentity =
  | { status: 'matched'; cid: number; iupacName: string; molecularFormula: string }
  | { status: 'not_found' | 'unavailable' | 'ambiguous' };
type CheckState =
  | { phase: 'idle' | 'loading' }
  | { phase: 'unsupported' | 'rejected' | 'local_unavailable'; reason?: string }
  | { phase: 'remote'; result: RemoteIdentity };

const WORDING: Record<Language, {
  action: string; checking: string; accepted: string; unsupported: string; rejected: string;
  localUnavailable: string; missing: string; remoteUnavailable: string; ambiguous: string;
  matched: string; disclaimer: string; details: string;
}> = {
  en: { action: 'Check structure / PubChem', checking: 'Checking structure locally, then PubChem…',
    accepted: 'RDKit could parse this structure.', unsupported: 'Cannot export this simplified structure reliably.',
    rejected: 'RDKit could not parse this explicit structure.', localUnavailable: 'Local chemistry engine unavailable; no remote query was made.',
    missing: 'No exact PubChem identity found.', remoteUnavailable: 'PubChem unavailable. Local result is unchanged.',
    ambiguous: 'Several PubChem identities were returned; no single name was selected.',
    matched: 'PubChem identity match (not proof of stability)', disclaimer: 'The result is supplemental. Unlisted does not mean impossible, and parsing does not prove stability.',
    details: 'Open PubChem record' },
  zh: { action: '检查结构 / 查询 PubChem', checking: '正在本地检查结构，再查询 PubChem…',
    accepted: 'RDKit 能解析此结构。', unsupported: '无法可靠导出此简化结构。',
    rejected: 'RDKit 无法解析这份显式结构。', localUnavailable: '本地化学引擎不可用；未进行远程查询。',
    missing: 'PubChem 未找到精确对应的身份记录。', remoteUnavailable: 'PubChem 暂不可用，本地结果不受影响。',
    ambiguous: 'PubChem 返回多个身份，未擅自选择名称。',
    matched: 'PubChem 身份匹配（不代表物质一定稳定）', disclaimer: '结果仅为补充资料。未收录不等于不可能，能解析也不代表稳定。',
    details: '查看 PubChem 记录' },
  es: { action: 'Comprobar estructura / PubChem', checking: 'Validando localmente y consultando PubChem…',
    accepted: 'RDKit pudo interpretar la estructura.', unsupported: 'No se puede exportar con fidelidad este modelo simplificado.',
    rejected: 'RDKit no pudo interpretar la estructura explícita.', localUnavailable: 'Motor local no disponible; no se consultó PubChem.',
    missing: 'No se encontró identidad exacta en PubChem.', remoteUnavailable: 'PubChem no disponible; resultado local conservado.',
    ambiguous: 'Varias identidades, sin nombre único.', matched: 'Coincidencia de PubChem (no prueba estabilidad)',
    disclaimer: 'No encontrado no significa imposible; interpretar no demuestra estabilidad.', details: 'Ver registro de PubChem' },
  fr: { action: 'Vérifier la structure / PubChem', checking: 'Vérification locale puis interrogation de PubChem…',
    accepted: 'RDKit a pu analyser la structure.', unsupported: 'Modèle simplifié non exportable fidèlement.',
    rejected: 'RDKit n’a pas pu analyser la structure explicite.', localUnavailable: 'Moteur local indisponible ; aucune requête distante.',
    missing: 'Aucune identité exacte trouvée sur PubChem.', remoteUnavailable: 'PubChem indisponible ; résultat local préservé.',
    ambiguous: 'Plusieurs identités ; aucun nom choisi.', matched: 'Identité PubChem (pas une preuve de stabilité)',
    disclaimer: 'Absence de résultat ne signifie pas impossibilité ; analyse ne prouve pas stabilité.', details: 'Ouvrir PubChem' },
  ja: { action: '構造チェック / PubChem', checking: 'ローカルで構造を確認し、PubChem を検索中…',
    accepted: 'RDKit が構造を解析できました。', unsupported: 'この簡略モデルは正確に書き出せません。',
    rejected: 'RDKit は明示的な構造を解析できませんでした。', localUnavailable: 'ローカル解析が使えないため、外部照会なし。',
    missing: 'PubChem に一致する構造が見つかりません。', remoteUnavailable: 'PubChem を利用できません。ローカル判定は維持されます。',
    ambiguous: '複数の結果があり、名前を選択していません。', matched: 'PubChem の一致（安定性の証明ではありません）',
    disclaimer: '未登録は不可能を意味せず、構造解析は安定性を保証しません。', details: 'PubChem の情報を見る' },
};

export function ExternalIdentityCheck({ isDark }: { isDark: boolean }) {
  const atoms = useStore((state) => state.atoms);
  const bonds = useStore((state) => state.bonds);
  const language = useStore((state) => state.language);
  const wording = WORDING[language];
  const [state, setState] = useState<CheckState>({ phase: 'idle' });
  const sequence = useRef(0);
  const controller = useRef<AbortController | null>(null);

  const signature = useMemo(() => JSON.stringify({
    atoms: atoms.map((atom) => [atom.id, atom.element, atom.formalCharge ?? null, atom.isotope ?? null]).sort(),
    bonds: bonds.map((bond) => [
      [bond.source, bond.target].sort().join(':'), bond.order, bond.kind ?? null,
    ]).sort(),
  }), [atoms, bonds]);
  const currentSignature = useRef(signature);
  currentSignature.current = signature;

  useEffect(() => {
    sequence.current++;
    controller.current?.abort();
    setState({ phase: 'idle' });
    return () => { sequence.current++; controller.current?.abort(); };
  }, [signature]);

  const inspect = async () => {
    if (state.phase === 'loading') return;
    const snapshot = signature;
    const id = ++sequence.current;
    setState({ phase: 'loading' });
    const exported = exportChemicalStructure(atoms, bonds);
    if (exported.status === 'unsupported') {
      if (currentSignature.current === snapshot && sequence.current === id) {
        setState({ phase: 'unsupported', reason: exported.reason });
      }
      return;
    }
    const local = await validateWithRDKit(exported.smiles, exported.atomCount);
    if (currentSignature.current !== snapshot || sequence.current !== id) return;
    if (local.status !== 'accepted') {
      setState({ phase: local.status === 'rejected' ? 'rejected' : 'local_unavailable' });
      return;
    }
    const abort = new AbortController();
    controller.current = abort;
    try {
      const response = await fetch('/api/pubchem/identity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ smiles: local.smiles }),
        signal: abort.signal,
      });
      const payload: unknown = await response.json();
      if (currentSignature.current !== snapshot || sequence.current !== id) return;
      const data = payload && typeof payload === 'object' ? payload as Record<string, unknown> : {};
      if (response.ok && data.status === 'matched'
        && Number.isSafeInteger(data.cid) && typeof data.iupacName === 'string'
        && typeof data.molecularFormula === 'string') {
        setState({ phase: 'remote', result: {
          status: 'matched', cid: data.cid as number,
          iupacName: data.iupacName, molecularFormula: data.molecularFormula,
        } });
      } else if (response.ok && (data.status === 'not_found' || data.status === 'ambiguous')) {
        setState({ phase: 'remote', result: { status: data.status } });
      } else {
        setState({ phase: 'remote', result: { status: 'unavailable' } });
      }
    } catch {
      if (currentSignature.current === snapshot && sequence.current === id) {
        setState({ phase: 'remote', result: { status: 'unavailable' } });
      }
    }
  };

  return (
    <div className={`rounded-xl border p-3 text-xs space-y-2 ${isDark ? 'border-white/10 bg-white/5' : 'border-zinc-200 bg-zinc-50'}`}
      data-testid="external-identity">
      <button type="button" onClick={() => void inspect()} disabled={state.phase === 'loading'}
        className="w-full min-h-[44px] rounded-lg font-semibold border border-indigo-500/40 bg-indigo-500/10 px-3 py-2 text-indigo-400 disabled:opacity-60 touch-manipulation">
        {state.phase === 'loading' ? wording.checking : wording.action}
      </button>
      {state.phase === 'unsupported' && <p>{wording.unsupported} ({state.reason})</p>}
      {state.phase === 'rejected' && <p>{wording.rejected}</p>}
      {state.phase === 'local_unavailable' && <p>{wording.localUnavailable}</p>}
      {state.phase === 'remote' && (
        <>
          <p>{wording.accepted}</p>
          {state.result.status === 'matched' ? (
            <div data-testid="pubchem-match" className="space-y-1">
              <p className="font-semibold">{wording.matched}</p>
              <p>{state.result.iupacName} · {state.result.molecularFormula}</p>
              <a href={`https://pubchem.ncbi.nlm.nih.gov/compound/${state.result.cid}`}
                target="_blank" rel="noopener noreferrer" className="underline text-indigo-400">
                {wording.details} (CID {state.result.cid})
              </a>
            </div>
          ) : <p>{state.result.status === 'not_found' ? wording.missing
            : state.result.status === 'ambiguous' ? wording.ambiguous : wording.remoteUnavailable}</p>}
          <p className="opacity-70 leading-relaxed">{wording.disclaimer}</p>
        </>
      )}
    </div>
  );
}
