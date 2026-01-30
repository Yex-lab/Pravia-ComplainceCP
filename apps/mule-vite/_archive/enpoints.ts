export const endpoints = {
  // Auth API endpoints (relative to auth baseURL)
  auth: {
    chat: '/chat',
    kanban: '/kanban',
    calendar: '/calendar',
    me: '/auth/me',
    signIn: '/auth/sign-in',
    signUp: '/auth/sign-up',
    userManagement: {
      users: '/user-management/admin/users',
      user: (id: string) => `/user-management/admin/users/${id}`,
      profile: (id: string) => `/user-management/${id}/profile`,
      createUser: '/user-management/admin/users',
      updateUser: (id: string) => `/user-management/admin/users/${id}`,
      deleteUser: (id: string) => `/user-management/admin/users/${id}`,
      revokeSessions: (id: string) => `/user-management/admin/users/${id}/revoke-sessions`,
      banUser: (id: string) => `/user-management/admin/users/${id}/ban`,
      unbanUser: (id: string) => `/user-management/admin/users/${id}/unban`,
    },
  },

  // Contacts API endpoints (relative to contacts baseURL)
  contacts: {
    list: '/contacts',
    details: (id: string) => `/contacts/${id}`,
    create: '/contacts',
    update: (id: string) => `/contacts/${id}`,
    delete: (id: string) => `/contacts/${id}`,
    sendInvitation: '/contacts/send-invitation',
    createWithInvitation: '/contacts/with-invitation',
    byEmail: (email: string) => `/contacts/by-email?email=${encodeURIComponent(email)}`,
  },

  // Accounts API endpoints (relative to data baseURL)
  accounts: {
    list: '/accounts',
    details: (id: string) => `/accounts/${id}`,
    create: '/accounts',
    update: (id: string) => `/accounts/${id}`,
    delete: (id: string) => `/accounts/${id}`,
  },

  // Submissions API endpoints (relative to data baseURL)
  submissions: {
    list: '/submissions',
    byAccount: (accountId: string) => `/submissions/by-account/${accountId}`,
    details: (id: string) => `/submissions/${id}`,
    create: '/submissions',
    update: (id: string) => `/submissions/${id}`,
    delete: (id: string) => `/submissions/${id}`,
    createWithFile: '/submissions/with-file',
    uploadFile: (id: string) => `/submissions/${id}/upload`,
    status: (id: string) => `/api/submissions/${id}/status`,
  },
  attachments: {
    bySubmission: (submissionId: string) => `/api/attachments/by-submission/${submissionId}`,
  },
} as const;
