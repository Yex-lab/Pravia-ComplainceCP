import type { FluxTypes } from '@asyml8/api-types';
import type { Column, FilterTab, ActionItem, SearchConfig } from '@asyml8/ui';

import { useMemo, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  ICONS,
  Iconify,
  IconCell,
  ChipCell,
  useRouter,
  DataTable,
  ActionsCell,
  DashboardContent,
} from '@asyml8/ui';

import { useTheme } from '@mui/material/styles';
import {
  Box,
  Stack,
  Button,
  Dialog,
  Select,
  MenuItem,
  Typography,
  IconButton,
  FormControl,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { useTranslation } from 'src/hooks/use-translation';
import { usePermissions } from 'src/hooks/use-permissions';

import { viewDocument, downloadDocument } from 'src/utils/document.util';

import { fluxServices } from 'src/api';
import { useAuthContext } from 'src/hooks';
import {
  useAppStore,
  useContactsData,
  useAccountsData,
  useSubmissionsData,
  useDocumentTypesData,
} from 'src/store/app.store';

import { SubmissionCell } from 'src/components/data-table/cells/submission-cell';

import { SupportingDocumentsDrawer } from 'src/sections/my-workspace/submissions/supporting-documents-drawer';

import { ComplianceCard } from '../compliance-card';
import { ComplianceBanner } from '../compliance-banner';

type Submission = FluxTypes.SubmissionDto;
type Contact = FluxTypes.ContactResponseDto;
type DocumentType = FluxTypes.DocumentTypeDto;
type Designee = FluxTypes.DesigneeDto;

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const getStatusLabel = (statusCode: number): string => {
  switch (statusCode) {
    case 448150001:
      return 'PENDING';
    case 448150002:
      return 'ACTION NEEDED';
    case 448150003:
      return 'VALIDATED';
    case 448150004:
      return 'REJECTED';
    case 1:
      return 'ACTIVE';
    default:
      return 'Inactive';
  }
};

const getStatusColor = (
  statusCode: number
): 'info' | 'default' | 'warning' | 'error' | 'success' => {
  switch (statusCode) {
    case 448150001:
      return 'warning';
    case 448150002:
      return 'error';
    case 448150003:
      return 'success';
    case 448150004:
      return 'error';
    case 1:
      return 'info';
    default:
      return 'default';
  }
};

export function ComplianceDashboardView() {
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();
  const router = useRouter();
  const theme = useTheme();
  const { user: loggedInUser } = useAuthContext();

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [submissionToDelete, setSubmissionToDelete] = useState<Submission | null>(null);
  const [documentsDrawerOpen, setDocumentsDrawerOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('cards');
  const [selectedFiscalYear, setSelectedFiscalYear] = useState<number>(new Date().getFullYear());
  const [allDesigneesExpanded, setAllDesigneesExpanded] = useState(true);

  const setSelectedSubmissionIds = useAppStore((state) => state.setSelectedSubmissionIds);
  const designees = useAppStore((state) => state.slices.designees?.data || []);

  const submissions = useSubmissionsData();
  const contacts = useContactsData();
  const documentTypes = useDocumentTypesData();
  const accountsData = useAccountsData();
  const isAuthenticatedStartupComplete = useAppStore(
    (state) => state.isAuthenticatedStartupComplete
  );
  const isLoading = !isAuthenticatedStartupComplete;
  // Query attachments for selected submission
  const { data: attachments, isLoading: attachmentsLoading } = useQuery({
    queryKey: ['attachments', selectedSubmission?.id],
    queryFn: () =>
      fluxServices.attachments.getAttachmentsBySubmissionBySubmissionId(selectedSubmission!.id),
    enabled: !!selectedSubmission?.id && documentsDrawerOpen,
  });
  // Generate fiscal year options (current year and 4 years back)
  const currentYear = new Date().getFullYear();
  const fiscalYearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);

  // Filter submissions by selected fiscal year
  const filteredSubmissions =
    submissions?.filter((submission) => {
      const submissionYear = new Date(submission.createdOn).getFullYear();
      return submissionYear === selectedFiscalYear;
    }) || [];

  const organization = accountsData?.[0];
  const organizationName = organization?.name || 'Organization';
  const loggedInUserName =
    loggedInUser?.displayName ?? loggedInUser?.email?.split('@')[0] ?? 'User';

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('greeting.morning');
    if (hour < 18) return t('greeting.afternoon');
    return t('greeting.evening');
  };

  const getContactName = (contactId: string | undefined) => {
    if (!contactId) return '-';
    const contact = contacts.find((c) => c.id === contactId);
    return contact?.fullName || contactId;
  };

  const getDocumentTypeName = (documentTypeId: string | undefined) => {
    if (!documentTypeId) return '-';
    const docType = documentTypes.find((d) => d.id === documentTypeId);
    return docType?.name || documentTypeId;
  };

  const getContactInfo = (contactId: string | undefined) => {
    if (!contactId) return { email: '-', phone: '-' };
    const contact = contacts?.find((c) => c.id === contactId);
    return {
      email: contact?.email || '-',
      phone: contact?.phone || contact?.mobilePhone || '-',
    };
  };

  const formatPhoneNumber = (phone: string) => {
    if (!phone || phone === '-') return phone;
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  const submissionsWithTypeName = useMemo(
    () =>
      filteredSubmissions.map((s) => ({
        ...s,
        documentTypeName: getDocumentTypeName(s.documentTypeId),
      })),
    [filteredSubmissions, documentTypes]
  );
  // Map attachments to drawer format
  const mappedAttachments = useMemo(() => {
    if (!attachments) return [];
    return (attachments.supporting || []).map((att: any) => ({
      id: att.id,
      name: att.name,
      size: att.size,
      uploadedAt: att.uploadedAt,
      url: att.url,
    }));
  }, [attachments]);
  const stats = useMemo(
    () => ({
      validated: submissions.filter((s) => s.statusCode === 448150003).length,
      pendingReview: submissions.filter((s) => s.statusCode === 448150001).length,
      actionNeeded: submissions.filter((s) => s.statusCode === 448150002).length,
      rejected: submissions.filter((s) => s.statusCode === 448150004).length,
    }),
    [submissions]
  );

  const deleteSubmissionMutation = useMutation({
    mutationFn: (id: string) => fluxServices.submissions.deleteSubmissionsById(id),
    onSuccess: () => {
      setDeleteConfirmOpen(false);
      setSubmissionToDelete(null);
    },
  });

  const handleViewSubmission = (submission: Submission) => {
    setSelectedSubmission(submission);
    setDocumentsDrawerOpen(true);
  };

  const handleViewDocument = (submission: Submission) => viewDocument(submission.id);

  const handleDeleteSubmission = (submission: Submission) => {
    setSubmissionToDelete(submission);
    setDeleteConfirmOpen(true);
  };

  const handleDownloadDocument = (submission: Submission) => downloadDocument(submission.id);

  const confirmDeleteSubmission = () => {
    if (submissionToDelete) {
      deleteSubmissionMutation.mutate(submissionToDelete.id);
    }
  };

  const columns: Column<Submission>[] = [
    {
      id: 'name',
      label: 'Title',
      sortable: true,
      width: 250,
      minWidth: 250,
      maxWidth: 250,
      render: (_, submission) => (
        <SubmissionCell
          title={submission.name || '-'}
          documentType={getDocumentTypeName(submission.documentTypeId)}
          onClick={() => handleViewSubmission(submission)}
        />
      ),
    },
    {
      id: 'statusCode',
      label: 'Status',
      width: 110,
      minWidth: 110,
      maxWidth: 110,
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
      id: 'complianceDueDate' as any,
      label: 'Due Date',
      width: 130,
      minWidth: 130,
      maxWidth: 130,
      sortable: true,
      render: (_, submission) => (
        <IconCell
          value={
            organization?.complianceDueDate
              ? (() => {
                  const date = organization.complianceDueDate.split('T')[0];
                  const [year, month, day] = date.split('-');
                  return `${month}/${day}/${year}`;
                })()
              : '-'
          }
          icon={ICONS.CALENDAR}
        />
      ),
    },
    {
      id: 'createdOn',
      label: 'Last Submitted',
      width: 130,
      minWidth: 130,
      maxWidth: 130,
      sortable: true,
      render: (_, submission) => (
        <IconCell value={submission.createdOn} icon={ICONS.CALENDAR} formatAsDate />
      ),
    },
    {
      id: 'id' as any,
      label: '',
      width: 60,
      minWidth: 60,
      maxWidth: 60,
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
          {
            id: 'delete',
            label: t('submissions.actions.delete'),
            icon: ICONS.TRASH_BIN,
            onClick: () => handleDeleteSubmission(submission),
            color: 'error',
          },
        ];

        return <ActionsCell actions={actions} moreIcon={ICONS.MORE_VERTICAL} />;
      },
    },
  ];

  const filterTabs: FilterTab<Submission>[] = [
    {
      id: 'all',
      label: t('submissions.filters.all'),
      filter: (data) => data,
    },
    {
      id: 'validated',
      label: 'Validated',
      filter: (data) => data.filter((item) => item.statusCode === 448150003),
      color: 'success',
    },
    {
      id: 'pendingReview',
      label: t('submissions.filters.pendingReview'),
      filter: (data) => data.filter((item) => item.statusCode === 448150001),
      color: 'warning',
    },
    {
      id: 'actionNeeded',
      label: 'Action Needed',
      filter: (data) => data.filter((item) => item.statusCode === 448150002),
      color: 'error',
    },
    {
      id: 'rejected',
      label: t('submissions.filters.rejected'),
      filter: (data) => data.filter((item) => item.statusCode === 448150004),
      color: 'error',
    },
  ];

  const searchConfig: SearchConfig<Submission> = {
    placeholder: t('dataTable.search'),
    searchFields: ['name'],
    filterOptions: [
      {
        label: t('submissions.columns.type'),
        value: 'documentTypeName',
        options: documentTypes.map((dt) => dt.name),
      },
    ],
  };

  const handleUploadDocument = () => {
    router.push(paths.myWorkspace.submissionUpload);
  };

  return (
    <DashboardContent maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          {getGreeting()}, {loggedInUserName}{' '}
          <span style={{ color: theme.palette.primary.main }}>👋</span>
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          Last login: {new Date(loggedInUser?.lastSignInAt || Date.now()).toLocaleString()}
        </Typography>
      </Box>

      <ComplianceBanner
        organizationName={organizationName}
        description={t('compliance.description')}
        dueDateLabel={t('compliance.dueDate')}
        dueDate={
          organization?.complianceDueDate
            ? (() => {
                const date = organization.complianceDueDate.split('T')[0];
                const [year, month, day] = date.split('-');
                return `${month}/${day}/${year}`;
              })()
            : '-'
        }
        stats={{
          validated: stats.validated,
          pendingReview: stats.pendingReview,
          actionNeeded: stats.actionNeeded,
          rejected: stats.rejected,
        }}
        labels={{
          validated: 'VALIDATED',
          pending: t('submissions.stats.pendingReview'),
          actionNeeded: 'ACTION NEEDED',
          rejected: t('submissions.stats.rejected'),
        }}
        isLoading={isLoading}
      />

      {/* List View */}
      {viewMode === 'list' && (
        <>
          {/* Designees Section for List View */}
          {designees.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                {t('compliance.designees.title')}
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                  gap: 2,
                }}
              >
                {designees.map((designee) => {
                  const contactInfo = getContactInfo(designee.contactId);
                  return (
                    <ComplianceCard
                      key={designee.id}
                      type="designee"
                      data={designee}
                      icon={ICONS.USER_CIRCLE}
                      iconColor="secondary.main"
                      title={designee.name}
                      subtitle={designee.documentTypeName || 'Unknown Document Type'}
                      rows={[
                        {
                          icon: ICONS.LETTER,
                          label: '',
                          value: contactInfo.email,
                        },
                        {
                          icon: ICONS.PHONE,
                          label: '',
                          value: formatPhoneNumber(contactInfo.phone),
                        },
                      ]}
                    />
                  );
                })}
              </Box>
            </Box>
          )}

          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {t('compliance.submissions.title')}
              </Typography>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <Select
                  value={selectedFiscalYear}
                  onChange={(e) => setSelectedFiscalYear(Number(e.target.value))}
                  displayEmpty
                >
                  {fiscalYearOptions.map((year) => (
                    <MenuItem key={year} value={year}>
                      FY {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Stack direction="row" spacing={1}>
              <IconButton
                onClick={() => setViewMode('list')}
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                }}
              >
                <Iconify icon={ICONS.LIST} width={20} />
              </IconButton>
              <IconButton
                onClick={() => setViewMode('cards')}
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: 'transparent',
                  color: 'text.secondary',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <Iconify icon={ICONS.DOT_GRID} width={20} />
              </IconButton>
            </Stack>
          </Box>

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
              {...(hasPermission('delete_submissions') && {
                onRowSelect: setSelectedSubmissionIds,
              })}
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
        </>
      )}

      {/* Cards View */}
      {viewMode === 'cards' && (
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
          {/* Submissions - 2/3 width */}
          <Box sx={{ flex: 2 }}>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {t('compliance.submissions.title')}
                </Typography>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <Select
                    value={selectedFiscalYear}
                    onChange={(e) => setSelectedFiscalYear(Number(e.target.value))}
                    displayEmpty
                  >
                    {fiscalYearOptions.map((year) => (
                      <MenuItem key={year} value={year}>
                        FY {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Stack direction="row" spacing={1}>
                <IconButton
                  onClick={() => setViewMode('list')}
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: 'transparent',
                    color: 'text.secondary',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <Iconify icon={ICONS.LIST} width={20} />
                </IconButton>
                <IconButton
                  onClick={() => setViewMode('cards')}
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                  }}
                >
                  <Iconify icon={ICONS.DOT_GRID} width={20} />
                </IconButton>
              </Stack>
            </Box>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                gap: 3,
              }}
            >
              {submissionsWithTypeName.map((submission) => (
                <ComplianceCard
                  key={submission.id}
                  type="submission"
                  data={submission}
                  icon={ICONS.DOCUMENT_TEXT_DUOTONE}
                  iconColor="primary.main"
                  title={submission.name || '-'}
                  subtitle={getDocumentTypeName(submission.documentTypeId)}
                  statusChip={{
                    label: getStatusLabel(submission.statusCode),
                    color: getStatusColor(submission.statusCode),
                  }}
                  rows={[
                    {
                      icon: ICONS.CALENDAR,
                      label: 'Due:',
                      value: organization?.complianceDueDate
                        ? formatDate(organization.complianceDueDate)
                        : '-',
                    },
                    {
                      icon: ICONS.CALENDAR,
                      label: 'Submitted:',
                      value: submission.createdOn ? formatDate(submission.createdOn) : '-',
                    },
                  ]}
                  actions={[
                    {
                      icon: ICONS.EYE,
                      title: t('submissions.actions.view'),
                      onClick: () => handleViewDocument(submission),
                    },
                    {
                      icon: ICONS.ARROW_DOWNWARD,
                      title: t('actions.download'),
                      onClick: () => handleDownloadDocument(submission),
                    },
                    {
                      icon: ICONS.DOCUMENT_TEXT,
                      title: t('actions.details'),
                      onClick: () => handleViewSubmission(submission),
                    },
                    {
                      icon: ICONS.TRASH_BIN,
                      title: t('submissions.actions.delete'),
                      onClick: () => handleDeleteSubmission(submission),
                      color: 'error' as const,
                    },
                  ]}
                />
              ))}
            </Box>
          </Box>

          {/* Designees - 1/3 width */}
          {designees.length > 0 && (
            <Box sx={{ flex: 1 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 2,
                  minHeight: '40px',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {t('compliance.designees.title')}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => setAllDesigneesExpanded(!allDesigneesExpanded)}
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: allDesigneesExpanded ? 'transparent' : 'primary.main',
                    color: allDesigneesExpanded ? 'text.secondary' : 'primary.contrastText',
                    '&:hover': {
                      bgcolor: allDesigneesExpanded ? 'action.hover' : 'primary.dark',
                    },
                  }}
                >
                  <Iconify
                    icon={allDesigneesExpanded ? ICONS.CHEVRON_UP : ICONS.CHEVRON_DOWN}
                    width={28}
                  />
                </IconButton>
              </Box>
              <Stack spacing={2}>
                {designees.map((designee) => {
                  const contactInfo = getContactInfo(designee.contactId);
                  return (
                    <ComplianceCard
                      key={designee.id}
                      type="designee"
                      data={designee}
                      icon={ICONS.USER_CIRCLE}
                      iconColor="secondary.main"
                      title={designee.name}
                      subtitle={designee.documentTypeName || 'Unknown Document Type'}
                      expanded={allDesigneesExpanded}
                      rows={[
                        {
                          icon: ICONS.LETTER,
                          label: '',
                          value: contactInfo.email,
                        },
                        {
                          icon: ICONS.PHONE,
                          label: '',
                          value: formatPhoneNumber(contactInfo.phone),
                        },
                      ]}
                    />
                  );
                })}
              </Stack>
            </Box>
          )}
        </Box>
      )}

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
        onClose={() => setDocumentsDrawerOpen(false)}
        submissionId={selectedSubmission?.id}
        submissionName={selectedSubmission?.name}
        documentType={getDocumentTypeName(selectedSubmission?.documentTypeId)}
        documents={mappedAttachments}
        loading={attachmentsLoading}
      />
    </DashboardContent>
  );
}
