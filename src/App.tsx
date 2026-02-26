/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useMemo } from 'react';
import { Scene } from './components/Scene';
import { UI } from './components/UI';
import { useStore } from './store';
import { getMessages } from './i18n';

export default function App() {
  const theme = useStore((state) => state.theme);
  const language = useStore((state) => state.language);
  const messages = useMemo(() => getMessages(language), [language]);
  const isDark = theme === 'dark';

  useEffect(() => {
    document.title = messages.appTitle;
  }, [messages.appTitle]);

  return (
    <div className={`w-screen h-screen overflow-hidden relative font-sans ${isDark ? 'bg-black' : 'bg-slate-100'}`}>
      <Scene />
      <UI />
    </div>
  );
}
