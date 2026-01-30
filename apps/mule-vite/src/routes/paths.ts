// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  ADMIN: '/admin',
  MY_WORKSPACE: '/my-workspace',
  STARTUP: '/startup',
};

// ----------------------------------------------------------------------

export const paths = {
  root: '/',
  // ERROR
  error: {
    forbidden: '/error/403',
    badRequest: '/error/400',
    serverError: '/error/500',
    notFound: '/error/404',
  },
  // STARTUP
  startup: {
    initialize: '/initialize',
    publicStartup: '/public-startup',
  },
  // REGISTER
  register: {
    organization: `${ROOTS.REGISTER}/organization`,
    requestOrganizationAccess: `${ROOTS.REGISTER}/request-organization-access`,
    accessRequestConfirmation: `${ROOTS.REGISTER}/access-request-confirmation`,
  },
  // AUTH
  auth: {
    callback: `${ROOTS.AUTH}/callback`,
    signIn: `${ROOTS.AUTH}/sign-in`,
    signUp: `${ROOTS.AUTH}/sign-up`,
    forgotPassword: `${ROOTS.AUTH}/forgot-password`,
    updatePassword: `${ROOTS.AUTH}/update-password`,
    emailVerification: `${ROOTS.AUTH}/email-verification`,
    verifyOtp: `${ROOTS.AUTH}/verify-otp`,
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    compliance: `${ROOTS.DASHBOARD}/compliance`,
  },
  // MY WORKSPACE
  myWorkspace: {
    root: ROOTS.MY_WORKSPACE,
    organization: `${ROOTS.MY_WORKSPACE}/organization`,
    contacts: `${ROOTS.MY_WORKSPACE}/contacts`,
    submissions: `${ROOTS.MY_WORKSPACE}/submissions`,
    submission: (id: string) => `${ROOTS.MY_WORKSPACE}/submissions/${id}`,
    submissionUpload: `${ROOTS.MY_WORKSPACE}/submissions/upload`,
  },
  // RESOURCES
  resources: {
    faqs: '/resources/faqs',
  },
  // ADMIN
  admin: {
    root: ROOTS.ADMIN,
    userManagement: {
      users: `${ROOTS.ADMIN}/user-management/users`,
      user: (id: string) => `${ROOTS.ADMIN}/user-management/users/${id}`,
      roles: `${ROOTS.ADMIN}/user-management/roles`,
      groups: `${ROOTS.ADMIN}/user-management/groups`,
      permissions: `${ROOTS.ADMIN}/user-management/permissions`,
    },
  },
};
