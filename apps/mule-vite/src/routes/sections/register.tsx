import type { RouteObject } from 'react-router';

import { lazy } from 'react';

import { PublicStartupGuard } from 'src/guards';

const OrganizationPage = lazy(() => import('src/pages/register/register-organization'));
const RequestOrganizationAccessPage = lazy(
  () => import('src/pages/register/request-organization-access')
);
const AccessRequestConfirmationPage = lazy(
  () => import('src/pages/register/access-request-confirmation')
);
const PublicStartupPage = lazy(() => import('src/pages/startup/public.startup'));

export const registerRoutes: RouteObject[] = [
  {
    path: 'register',
    children: [
      {
        path: 'organization',
        element: (
          <PublicStartupGuard>
            <OrganizationPage />
          </PublicStartupGuard>
        ),
      },
      {
        path: 'request-organization-access',
        element: (
          <PublicStartupGuard>
            <RequestOrganizationAccessPage />
          </PublicStartupGuard>
        ),
      },
      {
        path: 'access-request-confirmation',
        element: <AccessRequestConfirmationPage />,
      },
    ],
  },
  {
    path: 'public-startup',
    element: <PublicStartupPage />,
  },
];
