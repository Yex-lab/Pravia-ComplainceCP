import type { Column, FilterTab, ActionItem, SearchConfig } from '@asyml8/ui';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ICONS,
  Iconify,
  IconCell,
  ChipCell,
  useRouter,
  DataTable,
  PageHeader,
  ActionsCell,
  DashboardContent,
} from '@asyml8/ui';

import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Dialog,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { useTranslation } from 'src/hooks/use-translation';
import { usePermissions } from 'src/hooks/use-permissions';
import { useAuthContext } from 'src/hooks/use-auth-context';

import { viewDocument, downloadDocument } from 'src/utils/document.util';

import { fluxServices } from 'src/api';
import {
  useAppStore,
  useContactsData,
  useSubmissionsData,
  useDocumentTypesData,
} from 'src/store/app.store';

import { SubmissionCell } from 'src/components/data-table/cells/submission-cell';

import { SupportingDocumentsDrawer } from '../supporting-documents-drawer';

interface Submission {
  id: string;
  name: string;
  createdAt: string;
  updatedAt?: string;
  title?: string;
  documentType?: string;
  documentTypeId?: string;
  primaryContact?: string;
  organization?: string;
  designeesAuthorized?: boolean;
  signedBy?: string;
  statusReason?: string;
}

export function SubmissionListView() {
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();
  const { user } = useAuthContext();
  const queryClient = useQueryClient();
  const router = useRouter();
  const theme = useTheme();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [submissionToDelete, setSubmissionToDelete] = useState<Submission | null>(null);
  const [documentsDrawerOpen, setDocumentsDrawerOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  // Sync selection with app store
  const setSelectedSubmissionIds = useAppStore((state) => state.setSelectedSubmissionIds);

  // Get data from store (pre-loaded at startup)
  const submissions = useSubmissionsData();
  const contacts = useContactsData();
  const documentTypes = useDocumentTypesData();
  const isAuthenticatedStartupComplete = useAppStore(
    (state) => state.isAuthenticatedStartupComplete
  );
  const isLoading = !isAuthenticatedStartupComplete;

  // Helper to get contact name by ID
  const getContactName = (contactId: string | undefined) => {
    if (!contactId) return '-';
    const contact = contacts.find((c: any) => c.id === contactId);
    return contact?.fullName || contactId;
  };

  // Helper to convert name to Pascal Case
  const toPascalCase = (name: string) => {
    if (!name || name === '-') return name;
    return name
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Helper to get document type name by ID
  const getDocumentTypeName = (documentTypeId: string | undefined) => {
    if (!documentTypeId) return '-';
    const docType = documentTypes.find((d: any) => d.id === documentTypeId);
    return docType?.name || documentTypeId;
  };

  const { data: docsResponse, isLoading: isDocsLoading } = useQuery({
    queryKey: ['submission-documents', selectedSubmission?.id],
    enabled: Boolean(documentsDrawerOpen && selectedSubmission?.id),
    queryFn: () =>
      fluxServices.attachments.getAttachmentsBySubmissionBySubmissionId(selectedSubmission!.id),
  });
  const handleCloseDrawer = () => {
    setDocumentsDrawerOpen(false);
    setSelectedSubmission(null);
  };
  // Add document type name to submissions for filtering
  const submissionsWithTypeName = submissions.map((s: any) => ({
    ...s,
    documentTypeName: getDocumentTypeName(s.documentTypeId),
  }));

  const deleteSubmissionMutation = useMutation({
    mutationFn: (id: string) => fluxServices.submissions.deleteSubmissionsById(id),
    onSuccess: () => {
      // Store will be updated automatically
      setDeleteConfirmOpen(false);
      setSubmissionToDelete(null);
    },
  });

  const handleViewSubmission = (submission: Submission) => {
    setSelectedSubmission(submission);
    setDocumentsDrawerOpen(true);
  };

  const handleViewDocument = (submission: Submission) => viewDocument(submission.id);

  const handleDownloadDocument = (submission: Submission) => downloadDocument(submission.id);

  const handleDeleteSubmission = (submission: Submission) => {
    setSubmissionToDelete(submission);
    setDeleteConfirmOpen(true);
  };
  const docsBody = (docsResponse as any)?.body ?? docsResponse;
  const documentsForDrawer = docsBody?.supporting ?? [];
  const primaryDocumentsForDrawer = docsBody?.primary ?? [];

  const confirmDeleteSubmission = () => {
    if (submissionToDelete) {
      deleteSubmissionMutation.mutate(submissionToDelete.id);
    }
  };

  const columns: Column<any>[] = [
    {
      id: 'name',
      label: t('submissions.columns.title'),
      sortable: true,
      width: 300,
      minWidth: 300,
      maxWidth: 300,
      render: (_, submission) => (
        <SubmissionCell
          title={submission.name || '-'}
          documentType={getDocumentTypeName(submission.documentTypeId)}
          onClick={() => handleViewSubmission(submission)}
        />
      ),
    },
    {
      id: 'createdOn',
      label: t('submissions.columns.submittedOn'),
      width: 150,
      sortable: true,
      render: (_, submission) => (
        <IconCell value={submission.createdOn} icon={ICONS.CALENDAR} formatAsDate />
      ),
    },
    {
      id: 'primaryContactId',
      label: t('submissions.columns.signedBy'),
      width: 150,
      sortable: true,
      render: (_, submission) => {
        const contactName = getContactName(submission.primaryContactId);
        const pascalName = toPascalCase(contactName);
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                position: 'relative',
                width: 24,
                height: 24,
                flexShrink: 0,
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  bgcolor: 'text.secondary',
                  opacity: 0.15,
                }}
              />
              <Iconify
                icon={ICONS.USER_ROUNDED}
                width={16}
                sx={{
                  color: 'text.secondary',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              />
            </Box>
            <Typography
              variant="body2"
              color="text.secondary"
              fontWeight={600}
              noWrap
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {pascalName}
            </Typography>
          </Box>
        );
      },
    },
    {
      id: 'statusCode',
      label: t('submissions.columns.status'),
      width: 100,
      sortable: true,
      render: (_, submission) => {
        let status = 'Active';
        let color: 'info' | 'default' | 'warning' | 'error' | 'success' = 'info';

        switch (submission.statusCode) {
          case 448150001:
            status = 'PENDING';
            color = 'warning';
            break;
          case 448150002:
            status = 'ACTION NEEDED';
            color = 'error';
            break;
          case 448150003:
            status = 'VALIDATED';
            color = 'success';
            break;
          case 448150004:
            status = 'REJECTED';
            color = 'error';
            break;
          case 1:
            status = 'ACTIVE';
            color = 'info';
            break;
          default:
            status = 'Inactive';
            color = 'default';
        }

        return <ChipCell value={status} color={color} />;
      },
    },
    {
      id: 'actions',
      label: '',
      width: 80,
      minWidth: 80,
      maxWidth: 80,
      render: (_, submission) => {
        const actions: ActionItem[] = [
          {
            id: 'view-document',
            label: 'View Document',
            icon: ICONS.EYE,
            onClick: () => handleViewDocument(submission),
          },
          {
            id: 'download-document',
            label: 'Download Document',
            icon: ICONS.ARROW_DOWNWARD,
            onClick: () => handleDownloadDocument(submission),
          },
          {
            id: 'documents',
            label: t('submissions.actions.documents'),
            icon: ICONS.DOCUMENT_TEXT,
            onClick: () => handleViewSubmission(submission),
          },
          // Delete action - only if user has permission
          ...(hasPermission('delete_submissions')
            ? [
                {
                  id: 'delete',
                  label: t('submissions.actions.delete'),
                  icon: ICONS.TRASH_BIN,
                  onClick: () => handleDeleteSubmission(submission),
                  color: 'error' as const,
                },
              ]
            : []),
        ];

        return <ActionsCell actions={actions} moreIcon={ICONS.MORE_VERTICAL} />;
      },
    },
  ];

  const filterTabs: FilterTab<any>[] = [
    {
      id: 'all',
      label: t('submissions.filters.all'),
      filter: (data) => data,
    },
    {
      id: 'validated',
      label: 'Validated',
      filter: (data) => data.filter((item: any) => item.statusCode === 448150003),
      color: 'success',
    },
    {
      id: 'pendingReview',
      label: t('submissions.filters.pendingReview'),
      filter: (data) => data.filter((item: any) => item.statusCode === 448150001),
      color: 'warning',
    },
    {
      id: 'actionNeeded',
      label: 'Action Needed',
      filter: (data) => data.filter((item: any) => item.statusCode === 448150002),
      color: 'error',
    },
    {
      id: 'rejected',
      label: t('submissions.filters.rejected'),
      filter: (data) => data.filter((item: any) => item.statusCode === 448150004),
      color: 'error',
    },
  ];

  const searchConfig: SearchConfig<any> = {
    placeholder: t('dataTable.search'),
    searchFields: ['name'],
    filterOptions: [
      {
        label: t('submissions.columns.type'),
        value: 'documentTypeName',
        options: documentTypes.map((dt: any) => dt.name),
      },
    ],
  };

  const handleUploadDocument = () => {
    router.push(paths.myWorkspace.submissionUpload);
  };

  return (
    <DashboardContent>
      <PageHeader
        title={t('submissions.title')}
        description={t('submissions.description')}
        breadcrumbs={[
          { label: t('submissions.breadcrumb.workspace') },
          { label: t('submissions.breadcrumb.submissions') },
        ]}
        action={
          hasPermission('create_submissions')
            ? {
                label: t('submissions.upload.title'),
                onClick: handleUploadDocument,
                icon: <Iconify icon={ICONS.ADD} />,
              }
            : undefined
        }
      />

      <Box
        sx={{
          ...(!hasPermission('delete_submissions') && {
            '& .MuiCheckbox-root': { display: 'none' },
            '& th:first-of-type, & td:first-of-type': { display: 'none' },
          }),
        }}
      >
        <DataTable
          store={{
            useQuery: () => ({
              data: submissionsWithTypeName,
              isLoading,
              error: null,
              refetch: () => {},
            }),
          }}
          columns={columns}
          getRowId={(submission) => submission.id}
          filterTabs={filterTabs}
          searchConfig={searchConfig}
          onRefresh={async () => {
            const organizationId = (user as any)?.user_metadata?.organization_id;
            if (organizationId) {
              const data = await queryClient.fetchQuery({
                queryKey: ['submissions', 'by-account'],
                queryFn: () =>
                  fluxServices.submissions.getSubmissionsByAccountByAccountId(organizationId),
              });
              useAppStore.getState().slices.submissions.setData(data);
            }
          }}
          refreshTooltip={t('actions.refresh')}
          {...(hasPermission('delete_submissions') && { onRowSelect: setSelectedSubmissionIds })}
          labels={{
            search: t('dataTable.search'),
            keyword: t('dataTable.keyword'),
            clear: t('dataTable.clear'),
            resultsFound: t('dataTable.resultsFound'),
            dense: t('dataTable.dense'),
            rowsPerPage: t('dataTable.rowsPerPage'),
          }}
        />
      </Box>

      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>{t('submissions.delete.title')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('submissions.delete.message', { name: submissionToDelete?.name })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>
            {t('submissions.delete.cancel')}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={confirmDeleteSubmission}
            disabled={deleteSubmissionMutation.isPending}
          >
            {deleteSubmissionMutation.isPending
              ? t('submissions.delete.deleting')
              : t('submissions.delete.confirm')}
          </Button>
        </DialogActions>
      </Dialog>

      <SupportingDocumentsDrawer
        open={documentsDrawerOpen}
        onClose={handleCloseDrawer}
        submissionId={selectedSubmission?.id}
        submissionName={selectedSubmission?.name}
        documentType={getDocumentTypeName(selectedSubmission?.documentTypeId)}
        documents={documentsForDrawer}
        loading={isDocsLoading}
      />
    </DashboardContent>
  );
}
