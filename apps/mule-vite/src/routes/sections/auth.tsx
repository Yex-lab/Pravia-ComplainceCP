import type { RouteObject } from 'react-router';

import { Outlet } from 'react-router';
import { lazy, Suspense } from 'react';
import { SplashScreen } from '@asyml8/ui';

import { GuestGuard } from 'src/guards';

// ----------------------------------------------------------------------

// Auth pages (currently using Supabase implementation)
const Auth = {
  SignInPage: lazy(() => import('src/pages/auth/supabase/sign-in')),
  // SignUpPage: lazy(() => import('src/pages/auth/supabase/sign-up')),
  ForgotPasswordPage: lazy(() => import('src/pages/auth/supabase/forgot-password')),
  UpdatePasswordPage: lazy(() => import('src/pages/auth/supabase/update-password')),
  EmailVerificationPage: lazy(() => import('src/pages/auth/supabase/email-verification')),
  VerifyOtpPage: lazy(() => import('src/pages/auth/supabase/verify-otp')),
  CallbackPage: lazy(() => import('src/pages/auth/callback')),
};

// ----------------------------------------------------------------------

export const authRoutes: RouteObject[] = [
  {
    path: 'auth',
    element: (
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    ),
    children: [
      {
        path: 'callback',
        element: <Auth.CallbackPage />,
      },
      {
        path: 'sign-in',
        element: (
          <GuestGuard>
            <Auth.SignInPage />
          </GuestGuard>
        ),
      },
      // {
      //   path: 'sign-up',
      //   element: (
      //     <GuestGuard>
      //       <Auth.SignUpPage />
      //     </GuestGuard>
      //   ),
      // },
      {
        path: 'forgot-password',
        element: (
          <GuestGuard>
            <Auth.ForgotPasswordPage />
          </GuestGuard>
        ),
      },
      {
        path: 'update-password',
        element: <Auth.UpdatePasswordPage />,
      },
      {
        path: 'email-verification',
        element: <Auth.EmailVerificationPage />,
      },
      {
        path: 'verify-otp',
        element: <Auth.VerifyOtpPage />,
      },
    ],
  },
];
