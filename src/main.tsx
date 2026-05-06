import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { useStore } from './store';
import './index.css';

if (import.meta.env.MODE === 'test' && typeof window !== 'undefined') {
  (window as Window & { __bondlabStore?: typeof useStore }).__bondlabStore = useStore;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
