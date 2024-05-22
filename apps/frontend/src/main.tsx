import { RouterProvider, createRouter } from '@tanstack/react-router';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import './globals.css';

import App from './app';
import { routeTree } from './routeTree.gen';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const root = ReactDOM.createRoot(
  document.getElementById('root') ?? document.body
);

root.render(
  <StrictMode>
    <App />
    <RouterProvider router={router} />
  </StrictMode>
);
