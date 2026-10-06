import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// HashRouter keeps routing working everywhere with zero server config:
// opening dist/index.html from disk (file://), static hosts, and GitHub
// Pages subpaths all work without rewrite rules. URLs look like /#/quiz/...
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
);
