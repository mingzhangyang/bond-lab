/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Scene } from './components/Scene';
import { UI } from './components/UI';

export default function App() {
  return (
    <div className="w-screen h-screen overflow-hidden bg-black relative font-sans">
      <Scene />
      <UI />
    </div>
  );
}
