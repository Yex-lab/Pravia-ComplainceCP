import type { QuerySliceState } from '@asyml8/ui';
import type { FluxTypes, FoundryTypes } from '@asyml8/api-types';

import { create } from 'zustand';
import { registerSlice } from '@asyml8/ui';
import { devtools } from 'zustand/middleware';

import { fluxSlices, foundrySlices } from 'src/api';

type Account = FluxTypes.AccountDto;
type Contact = FluxTypes.ContactResponseDto;
type Submission = FluxTypes.SubmissionDto;
type User = FoundryTypes.CreateUserResponseDto;
type Role = FoundryTypes.RoleDto;
type DocumentType = FluxTypes.DocumentTypeDto;
type Designee = FluxTypes.DesigneeDto;

interface ServiceError {
  service: string;
  error: string;
  critical: boolean;
}

export interface AppConfig {
  organizationId: string;
  stateId: string;
  currentUser?: any;
  currentContact?: Contact;
  currentAccount?: Account;
  contactRoles?: Role[];
  contactAssignedDocumentTypes?: DocumentType[];
}

interface AppState {
  // Startup state
  isPublicStartupComplete: boolean;
  isAuthenticatedStartupComplete: boolean;
  startupErrors: ServiceError[];
  appConfig: AppConfig;
  targetRedirectPath: string | null;
  invitePending: boolean;

  // UI state
  selectedContactIds: string[];
  selectedSubmissionIds: string[];

  // Slices
  slices: {
    contacts: QuerySliceState<Contact>;
    accounts: QuerySliceState<Account>;
    accountsPublic: QuerySliceState<Account>;
    users: QuerySliceState<User>;
    roles: QuerySliceState<Role>;
    organizationRoles: QuerySliceState<any>;
    organizationDocuments: QuerySliceState<any>;
    documentTypes: QuerySliceState<DocumentType>;
    designees: QuerySliceState<Designee>;
    submissions: QuerySliceState<Submission>;
  };

  // Actions
  setPublicStartupComplete: (value: boolean) => void;
  setAuthenticatedStartupComplete: (value: boolean) => void;
  addError: (error: ServiceError) => void;
  clearErrors: () => void;
  setAppConfig: (data: Partial<AppConfig>) => void;
  setSelectedContactIds: (ids: string[]) => void;
  setSelectedSubmissionIds: (ids: string[]) => void;
  setTargetRedirectPath: (path: string | null) => void;
  setInvitePending: (value: boolean) => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    (set, get) => {
      // Initialize slices using generated code
      const contactsSlice = registerSlice('contacts', fluxSlices.contacts.createSlice, set, get);
      const accountsSlice = registerSlice('accounts', fluxSlices.accounts.createSlice, set, get);
      const accountsPublicSlice = registerSlice(
        'accountsPublic',
        fluxSlices.public.createSlice,
        set,
        get
      );
      const usersSlice = registerSlice('users', foundrySlices.userManagement.createSlice, set, get);
      const rolesSlice = registerSlice('roles', foundrySlices.roles.createSlice, set, get);
      const organizationRolesSlice = registerSlice(
        'organizationRoles',
        foundrySlices.roles.createSlice,
        set,
        get
      );
      const organizationDocumentsSlice = registerSlice(
        'organizationDocuments',
        fluxSlices.organizationMembers.createSlice,
        set,
        get
      );
      const documentTypesSlice = registerSlice(
        'documentTypes',
        fluxSlices.documentTypes.createSlice,
        set,
        get
      );
      const designeesSlice = registerSlice('designees', fluxSlices.designees.createSlice, set, get);
      const submissionsSlice = registerSlice(
        'submissions',
        fluxSlices.submissions.createSlice,
        set,
        get
      );

      return {
        // App state
        isPublicStartupComplete: false,
        isAuthenticatedStartupComplete: false,
        startupErrors: [],
        appConfig: {
          organizationId: '',
          stateId: '',
        },
        targetRedirectPath: null,
        invitePending: false,

        // UI state
        selectedContactIds: [],
        selectedSubmissionIds: [],

        // Slices
        slices: {
          contacts: contactsSlice,
          accounts: accountsSlice,
          accountsPublic: accountsPublicSlice,
          users: usersSlice,
          roles: rolesSlice,
          organizationRoles: organizationRolesSlice,
          organizationDocuments: organizationDocumentsSlice,
          documentTypes: documentTypesSlice,
          designees: designeesSlice,
          submissions: submissionsSlice,
        },

        // Actions
        setPublicStartupComplete: (value) => set({ isPublicStartupComplete: value }),
        setAuthenticatedStartupComplete: (value) => set({ isAuthenticatedStartupComplete: value }),
        addError: (error) =>
          set((state) => ({
            startupErrors: [...state.startupErrors, error],
          })),
        clearErrors: () => set({ startupErrors: [] }),
        setAppConfig: (data) => set((state) => ({ appConfig: { ...state.appConfig, ...data } })),
        setTargetRedirectPath: (path) => set({ targetRedirectPath: path }),
        setInvitePending: (value) => set({ invitePending: value }),
        setSelectedContactIds: (ids) => set({ selectedContactIds: ids }),
        setSelectedSubmissionIds: (ids) => set({ selectedSubmissionIds: ids }),
      };
    },
    { name: 'Pravia Mule App' }
  )
);

// ============================================================================
// Selector Hooks
// ============================================================================

// App config selector
export const useAppConfig = () => useAppStore((state) => state.appConfig);

// Contacts slice selectors
export const useContactsSlice = () => useAppStore((state) => state.slices.contacts);
export const useContactsData = () => useAppStore((state) => state.slices.contacts.data);
export const useContactsFilters = () => useAppStore((state) => state.slices.contacts.filters);
export const useContactsSelected = () => useAppStore((state) => state.slices.contacts.selectedIds);

// Accounts slice selectors
export const useAccountsSlice = () => useAppStore((state) => state.slices.accounts);
export const useAccountsData = () => useAppStore((state) => state.slices.accounts.data);
export const useAccountsFilters = () => useAppStore((state) => state.slices.accounts.filters);

// Public Accounts slice selectors
export const useAccountsPublicSlice = () => useAppStore((state) => state.slices.accountsPublic);
export const useAccountsPublicData = () => useAppStore((state) => state.slices.accountsPublic.data);

// Users slice selectors
export const useUsersSlice = () => useAppStore((state) => state.slices.users);
export const useUsersData = () => useAppStore((state) => state.slices.users.data);
export const useUsersFilters = () => useAppStore((state) => state.slices.users.filters);
export const useUsersSelected = () => useAppStore((state) => state.slices.users.selectedIds);

// Roles slice selectors
export const useRolesSlice = () => useAppStore((state) => state.slices.roles);
export const useRolesData = () => useAppStore((state) => state.slices.roles.data);
export const useRolesFilters = () => useAppStore((state) => state.slices.roles.filters);
export const useRolesSelected = () => useAppStore((state) => state.slices.roles.selectedIds);

// Organization Roles slice selectors
export const useOrganizationRolesSlice = () =>
  useAppStore((state) => state.slices.organizationRoles);
export const useOrganizationRolesData = () =>
  useAppStore((state) => state.slices.organizationRoles.data);
export const useOrganizationRolesFilters = () =>
  useAppStore((state) => state.slices.organizationRoles.filters);
export const useOrganizationRolesSelected = () =>
  useAppStore((state) => state.slices.organizationRoles.selectedIds);

// Organization Documents slice selectors
export const useOrganizationDocumentsSlice = () =>
  useAppStore((state) => state.slices.organizationDocuments);
export const useOrganizationDocumentsData = () =>
  useAppStore((state) => state.slices.organizationDocuments.data);
export const useOrganizationDocumentsFilters = () =>
  useAppStore((state) => state.slices.organizationDocuments.filters);
export const useOrganizationDocumentsSelected = () =>
  useAppStore((state) => state.slices.organizationDocuments.selectedIds);

// Document Types slice selectors
export const useDocumentTypesSlice = () => useAppStore((state) => state.slices.documentTypes);
export const useDocumentTypesData = () => useAppStore((state) => state.slices.documentTypes.data);
export const useDocumentTypesFilters = () =>
  useAppStore((state) => state.slices.documentTypes.filters);
export const useDocumentTypesSelected = () =>
  useAppStore((state) => state.slices.documentTypes.selectedIds);

// Submissions slice selectors
export const useSubmissionsSlice = () => useAppStore((state) => state.slices.submissions);
export const useSubmissionsData = () => useAppStore((state) => state.slices.submissions.data);
export const useSubmissionsFilters = () => useAppStore((state) => state.slices.submissions.filters);
export const useSubmissionsSelected = () =>
  useAppStore((state) => state.slices.submissions.selectedIds);

// Derived selectors - raw data only
export const useContactStatusData = (email: string) => {
  const users = useAppStore((state) => state.slices.users.data);

  if (!email) return null;

  const userRecord = users.find((u) => u.user?.email?.toLowerCase() === email.toLowerCase());

  if (!userRecord?.user) return { email, status: 'not_registered' as const };

  // Check if banned first
  if ((userRecord.user as any).user_metadata?.banned) {
    return { email, status: 'banned' as const };
  }

  if (userRecord.user.email_confirmed_at) {
    return { email, status: 'confirmed' as const };
  }

  return { email, status: 'pending' as const };
};

export const useContactsWithStatusData = () => {
  const contacts = useAppStore((state) => state.slices.contacts.data);
  const users = useAppStore((state) => state.slices.users.data);

  return { contacts, users };
};
