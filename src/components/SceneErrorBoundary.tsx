import { Component, type ReactNode } from 'react';
import { useStore } from '../store';
import { SceneBackdrop } from './SceneBackdrop';

const COPY = {
  en: ['3D scene unavailable', 'The scene could not load or the graphics connection was lost. Reload the page to try again.', 'Reload page'],
  zh: ['3D 场景暂不可用', '场景加载失败或图形连接已中断。请重新加载页面后再试。', '重新加载页面'],
  es: ['Escena 3D no disponible', 'No se pudo cargar la escena o se perdió la conexión gráfica. Recarga la página para volver a intentarlo.', 'Recargar página'],
  fr: ['Scène 3D indisponible', 'La scène ne peut pas être chargée ou la connexion graphique a été perdue. Rechargez la page pour réessayer.', 'Recharger la page'],
  ja: ['3D シーンを利用できません', 'シーンを読み込めないか、グラフィックス接続が失われました。ページを再読み込みしてください。', 'ページを再読み込み'],
};

function SceneFailure() {
  const language = useStore((state) => state.language);
  const theme = useStore((state) => state.theme);
  const [title, description, action] = COPY[language];
  return (
    <div className="absolute inset-0">
      <SceneBackdrop />
      <div className="pointer-events-none absolute inset-0 z-[45] grid place-items-center px-6">
        <section role="alert" className={`pointer-events-auto max-w-sm rounded-2xl border p-6 text-center shadow-xl ${theme === 'dark' ? 'border-zinc-700 bg-zinc-900 text-zinc-100' : 'border-slate-300 bg-white text-slate-900'}`}>
          <h2 className="font-bold text-lg">{title}</h2>
          <p className="mt-3 text-sm leading-relaxed">{description}</p>
          <button className="mt-5 min-h-[44px] rounded-xl bg-indigo-700 px-4 text-sm font-semibold text-white" onClick={() => window.location.reload()}>
            {action}
          </button>
        </section>
      </div>
    </div>
  );
}

// This boundary lives outside the lazy scene module so download failures are
// isolated from the UI and navigation, just like renderer failures.
export class SceneErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? <SceneFailure /> : this.props.children;
  }
}
