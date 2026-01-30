'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  ICONS,
  Upload,
  Iconify,
  useRouter,
  showError,
  PageHeader,
  showSuccess,
  DashboardContent,
  showNotification,
  dismissNotification,
} from '@asyml8/ui';

import {
  Box,
  Card,
  Alert,
  Button,
  TextField,
  Typography,
  Autocomplete,
  LinearProgress,
  CircularProgress,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { useTranslation } from 'src/hooks/use-translation';

import { apiLogger } from 'src/utils/logger.util';

import { fluxServices } from 'src/api/flux.api';
import { useAppStore, useDocumentTypesData } from 'src/store/app.store';
import { useSubmissionProcessingStore } from 'src/store/submission-processing.store';

import { SupportingDocuments } from './supporting-documents';

const MAX_FILE_SIZE = 90 * 1024 * 1024; // 90MB
const isDesignationLetter = (docType: any) => {
  const label = String(docType?.label ?? docType?.name ?? docType?.title ?? '').toLowerCase();
  return label.includes('designation') && label.includes('5330');
};

export function SubmissionUploadView() {
  const { t } = useTranslation();
  const router = useRouter();

  const [primaryFile, setPrimaryFile] = useState<File | null>(null);
  const [supportingFiles, setSupportingFiles] = useState<File[]>([]);
  const [hasSupportingDocs, setHasSupportingDocs] = useState<boolean>(false);

  const [documentType, setDocumentType] = useState<any | null>(null);
  const [documentTitle, setDocumentTitle] = useState<string>('');

  const documentTypes = useDocumentTypesData();
  const loggedInContact = useAppStore((state) => state.appConfig.currentContact);

  const validateFile = (file: File): boolean => {
    if (file.size > MAX_FILE_SIZE) {
      showError(t('submissions.upload.errors.fileTooLarge'));
      return false;
    }

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      showError(t('submissions.upload.errors.invalidType'));
      return false;
    }

    return true;
  };

  const uploadMutation = useMutation({
    mutationFn: async (params: { primaryFile: File; title: string; documentType: any }) => {
      const { primaryFile: file, title, documentType: docType } = params;

      // Show loading notification
      const loadingId = showNotification({
        type: 'info',
        message: t('submissions.upload.progress.uploading'),
        icon: <CircularProgress size={20} color="info" />,
        duration: null,
      });

      try {
        // Create submission with file
        const contact = loggedInContact;
        if (!contact?.id) throw new Error('Contact not found');

        const accountId = contact.organizationId;
        if (!accountId) throw new Error('Contact has no organization/state entity');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', title.trim());
        formData.append('accountId', accountId);
        formData.append('primaryContactId', contact.id);
        formData.append('documentTypeId', docType.id);

        const newSubmission = await fluxServices.submissions.createSubmissionsWithFile(
          formData as any
        );
        console.log('Created submission:', newSubmission);

        const submissionId = newSubmission?.id;

        const shouldShowProcessingWidget = isDesignationLetter(docType);

        if (submissionId && shouldShowProcessingWidget) {
          useSubmissionProcessingStore.getState().start({
            submissionId,
            fileName: file.name,
          });
        } else if (!submissionId) {
          console.error('❌ No submissionId found in response', newSubmission);
        }

        if (hasSupportingDocs && supportingFiles.length > 0) {
          if (!submissionId) {
            throw new Error('Cannot upload supporting files: missing submissionId');
          }

          const supportingFormData = new FormData();
          supportingFormData.append('submissionId', submissionId);
          for (const supportingFile of supportingFiles) {
            supportingFormData.append('files', supportingFile);
          }

          await fluxServices.submissions.createSubmissionsPortalSupportingFiles(
            supportingFormData as any
          );
        }

        dismissNotification(loadingId);
        return newSubmission;
      } catch (error) {
        dismissNotification(loadingId);
        throw error;
      }
    },

    onSuccess: (newSubmission) => {
      apiLogger.info('Upload success:', newSubmission);

      // Only update store if we have valid submission data
      if (newSubmission && newSubmission.id) {
        const store = useAppStore.getState();
        store.slices.submissions.setData([newSubmission, ...store.slices.submissions.data]);
      }

      showSuccess(t('submissions.upload.success.uploaded'));

      // Navigate back to submissions list
      // Navigate back to submissions list after a short delay to ensure store update
      setTimeout(() => {
        router.push(paths.myWorkspace.submissions);
      }, 100);
    },

    onError: (error: any) => {
      apiLogger.error('Upload error:', error);
      showError(`${t('submissions.upload.errors.uploadFailed')} ${error?.message ?? ''}`);
    },
  });

  // Primary doc
  const handlePrimaryDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    if (!validateFile(file)) return;
    setPrimaryFile(file);
  };

  const handlePrimaryRemove = () => setPrimaryFile(null);

  // Supporting docs
  const handleSupportingDrop = (acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter((f) => validateFile(f));
    if (validFiles.length === 0) return;
    setSupportingFiles((prev) => [...prev, ...validFiles]);
  };

  const handleSupportingRemove = (indexToRemove: number) => {
    setSupportingFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = () => {
    if (!primaryFile) {
      showError(t('submissions.upload.errors.primaryRequired'));
      return;
    }

    if (!documentType?.id) {
      showError(t('submissions.upload.errors.typeRequired'));
      return;
    }

    if (!documentTitle.trim()) {
      showError(t('submissions.upload.errors.titleRequired'));
      return;
    }

    if (!validateFile(primaryFile)) return;
    for (const file of supportingFiles) {
      if (!validateFile(file)) return;
    }

    uploadMutation.mutate({
      primaryFile,
      title: documentTitle.trim(),
      documentType,
    });
  };

  const isSubmitting = uploadMutation.isPending;

  return (
    <DashboardContent>
      <PageHeader
        title={t('submissions.upload.title')}
        description={t('submissions.upload.description')}
        backHref={paths.myWorkspace.submissions}
        breadcrumbs={[
          { label: t('nav.workspace') },
          { label: t('submissions.breadcrumb.submissions') },
          { label: t('submissions.upload.breadcrumb') },
        ]}
      />

      <Box sx={{ display: 'flex', maxWidth: 900, flexDirection: 'column', gap: 3 }}>
        <Card sx={{ p: 3 }}>
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {t('submissions.upload.alert.title')}
            </Typography>
            <Typography variant="body2" component="div">
              • {t('submissions.upload.alert.requiredFields')}
              <br />• {t('submissions.upload.alert.approvedFormat')}
              <br />• {t('submissions.upload.alert.primaryRequired')}
              <br />• {t('submissions.upload.alert.encrypted')}
              <br />• {t('submissions.upload.alert.confirmation')}
            </Typography>
          </Alert>

          <Box sx={{ width: '50%', mb: 3 }}>
            <Autocomplete
              value={documentType}
              options={documentTypes}
              getOptionLabel={(option) => option?.name ?? ''}
              isOptionEqualToValue={(opt, val) => opt.id === val.id}
              onChange={(_, newValue) => setDocumentType(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t('submissions.upload.documentType.label')}
                  helperText={t('submissions.upload.documentType.helper')}
                  required
                />
              )}
            />
          </Box>

          <Box sx={{ width: '100%', mb: 3 }}>
            <TextField
              fullWidth
              label={t('submissions.upload.documentTitle.label')}
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              placeholder={t('submissions.upload.documentTitle.placeholder')}
              required
              helperText={t('submissions.upload.documentTitle.helper')}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              {t('submissions.upload.primaryDocument.title')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {t('submissions.upload.primaryDocument.description')}
            </Typography>

            <Upload
              value={primaryFile ?? null}
              previewMode="list"
              previewLayout="stacked"
              minHeight={140}
              maxHeight={180}
              onDrop={handlePrimaryDrop}
              onDelete={handlePrimaryRemove}
              accept={{ 'application/pdf': ['.pdf'] }}
              maxSize={MAX_FILE_SIZE}
              placeholder={
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Iconify
                    icon={ICONS.CLOUD_UPLOAD_SOLAR}
                    sx={{ width: 40, height: 40, mb: 1.5, color: 'text.disabled' }}
                  />
                  <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
                    {t('submissions.upload.primaryDocument.uploadTitle')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('submissions.upload.primaryDocument.dragDrop')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('submissions.upload.primaryDocument.supportedFormat')}
                  </Typography>
                </Box>
              }
            />
          </Box>

          <SupportingDocuments
            hasSupportingDocs={hasSupportingDocs}
            supportingFiles={supportingFiles}
            maxFileSize={MAX_FILE_SIZE}
            onToggle={(checked) => {
              setHasSupportingDocs(checked);
              if (!checked) setSupportingFiles([]);
            }}
            onDrop={handleSupportingDrop}
            onRemove={handleSupportingRemove}
          />

          {isSubmitting && (
            <Box sx={{ mt: 2 }}>
              <LinearProgress />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', mt: 0.5 }}
              >
                {t('submissions.upload.progress.uploading')}
              </Typography>
            </Box>
          )}
        </Card>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="outlined" href={paths.myWorkspace.submissions}>
            {t('submissions.upload.actions.cancel')}
          </Button>
          <Button
            variant="contained"
            disabled={!primaryFile || !documentType || !documentTitle.trim() || isSubmitting}
            onClick={handleSubmit}
            startIcon={
              isSubmitting ? (
                <CircularProgress size={20} />
              ) : (
                <Iconify icon={ICONS.CLOUD_UPLOAD_SOLAR} />
              )
            }
          >
            {isSubmitting
              ? t('submissions.upload.actions.uploading')
              : t('submissions.upload.actions.upload')}
          </Button>
        </Box>
      </Box>
    </DashboardContent>
  );
}
