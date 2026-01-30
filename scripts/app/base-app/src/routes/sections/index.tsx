import type { RouteObject } from 'react-router';

import { lazy } from 'react';

import { authRoutes } from './auth';
import { registerRoutes } from './register';
import { dashboardRoutes } from './dashboard';

// ----------------------------------------------------------------------

const LandingPage = lazy(() => import('src/pages/marketing/landing'));
const ErrorPage = lazy(() => import('src/pages/error'));

export const routesSection: RouteObject[] = [
  {
    path: '/',
    element: <LandingPage />,
  },

  // Auth
  ...authRoutes,

  // Register
  ...registerRoutes,

  // Dashboard
  ...dashboardRoutes,

  // Error pages
  { path: '/error/:code', element: <ErrorPage /> },

  // No match - redirect to 404
  { path: '*', element: <ErrorPage /> },
];
