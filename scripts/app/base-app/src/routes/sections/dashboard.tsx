import type { RouteObject } from 'react-router';

import { lazy, Suspense } from 'react';
import { Outlet, useParams } from 'react-router';
import { usePathname, LoadingScreen } from '@asyml8/ui';

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { CONFIG } from 'src/global-config';
import { useAppConfig } from 'src/store/app.store';
import { AuthGuard, AuthStartupGuard } from 'src/guards';
import { DefaultDashboardLayout } from 'src/layouts/default-dashboard-layout';

// ----------------------------------------------------------------------

const AuthStartupPage = lazy(() => import('src/pages/startup/auth.startup'));
const CompliancePage = lazy(() => import('src/pages/dashboard/compliance'));

// My Workspace pages
const OrganizationPage = lazy(() => import('src/pages/my-workspace/organization'));
const ContactsPage = lazy(() => import('src/pages/my-workspace/contacts'));
const SubmissionsPage = lazy(() => import('src/pages/my-workspace/submissions'));

// Resources pages
const FaqsPage = lazy(() => import('src/pages/resources/faqs'));

// Admin pages
const UserProfileView = lazy(() =>
  import('src/sections/admin/user-management/users/view/user-profile-view').then((module) => ({
    default: module.UserProfileView,
  }))
);

function UserProfilePage() {
  const { userId } = useParams();
  return <UserProfileView userId={userId!} />;
}

//submissions
const SubmissionUploadPage = lazy(() => import('src/sections/my-workspace/submissions/upload'));

// ----------------------------------------------------------------------

function SuspenseOutlet() {
  const pathname = usePathname();

  return (
    <Suspense key={pathname} fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  );
}

function DashboardLayout() {
  const { currentAccount } = useAppConfig();
  const orgName = currentAccount?.name || 'Organization';

  return (
    <DefaultDashboardLayout
      infoCard={{
        title: currentAccount?.acronym?.toUpperCase() || 'ORG',
        subtitle: (
          <Tooltip title={orgName} arrow>
            <Box>
              <Typography
                variant="body2"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {orgName}
              </Typography>
            </Box>
          </Tooltip>
        ) as any,
        icon: 'solar:buildings-bold-duotone',
        variant: 'glassmorphism-light',
      }}
    >
      <SuspenseOutlet />
    </DefaultDashboardLayout>
  );
}

function AdminLayout() {
  return (
    <DefaultDashboardLayout
      infoCard={{
        title: 'ADMIN',
        subtitle: 'System Administration',
        icon: 'solar:shield-bold-duotone',
        variant: 'glassmorphism-light',
      }}
    >
      <SuspenseOutlet />
    </DefaultDashboardLayout>
  );
}

const protectedRoutes: RouteObject[] = [
  {
    path: 'dashboard',
    element: <DashboardLayout />,
    children: [
      { element: <CompliancePage />, index: true },
      { path: 'compliance', element: <CompliancePage /> },
    ],
  },
  {
    path: 'my-workspace',
    element: <DashboardLayout />,
    children: [
      { path: 'organization', element: <OrganizationPage /> },
      { path: 'contacts', element: <ContactsPage /> },
      { path: 'submissions', element: <SubmissionsPage /> },
      { path: 'submissions/upload', element: <SubmissionUploadPage /> },
    ],
  },
  {
    path: 'resources',
    element: <DashboardLayout />,
    children: [{ path: 'faqs', element: <FaqsPage /> }],
  },
  {
    path: 'admin',
    element: <AdminLayout />,
    children: [
      {
        path: 'user-management/users/:userId',
        element: <UserProfilePage />,
      },
    ],
  },
];

export const dashboardRoutes: RouteObject[] = [
  {
    path: 'initialize',
    element: CONFIG.auth.skip ? (
      <AuthStartupPage />
    ) : (
      <AuthGuard>
        <AuthStartupPage />
      </AuthGuard>
    ),
  },
  ...(CONFIG.auth.skip
    ? [
        {
          element: (
            <AuthStartupGuard>
              <Outlet />
            </AuthStartupGuard>
          ),
          children: protectedRoutes,
        },
      ]
    : [
        {
          element: (
            <AuthGuard>
              <AuthStartupGuard>
                <Outlet />
              </AuthStartupGuard>
            </AuthGuard>
          ),
          children: protectedRoutes,
        },
      ]),
];
