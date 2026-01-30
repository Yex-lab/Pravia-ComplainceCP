import { useRef, useState } from 'react';
import { ICONS, Iconify, QuantumFileUpload } from '@asyml8/ui';

import Box from '@mui/material/Box';
import Step from '@mui/material/Step';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Stepper from '@mui/material/Stepper';
import Tooltip from '@mui/material/Tooltip';
import StepLabel from '@mui/material/StepLabel';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import StepContent from '@mui/material/StepContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import { useTranslation } from 'src/hooks/use-translation';

type DocumentType = {
  id: string;
  label: string;
  required: boolean;
  icon: string;
  description: string;
};

const DOCUMENT_TYPES: DocumentType[] = [
  {
    id: 'articles',
    label: 'Articles of Incorporation',
    required: true,
    icon: ICONS.FILE,
    description: "Upload your organization's articles of incorporation or charter document",
  },
  {
    id: 'authorization',
    label: 'Government Authorization Letter',
    required: true,
    icon: ICONS.BUILDINGS,
    description: 'Upload official authorization letter from your governing body',
  },
  {
    id: 'tax_id',
    label: 'Tax ID Verification',
    required: false,
    icon: ICONS.DOCUMENT,
    description: 'Upload IRS determination letter or tax identification documents',
  },
  {
    id: 'other',
    label: 'Other Supporting Documents',
    required: false,
    icon: ICONS.FILE,
    description: 'Upload any additional supporting documents for your registration',
  },
];

type DocumentsFormProps = {
  files: File[];
  onFilesChange: (files: File[]) => void;
};

export function DocumentsForm({ files, onFilesChange }: DocumentsFormProps) {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [queuedFiles, setQueuedFiles] = useState<File[]>([]);
  const processQueueRef = useRef<(() => Promise<void>) | null>(null);

  const handleUploadAll = async () => {
    if (processQueueRef.current) {
      await processQueueRef.current();
    }
  };

  const handleFileSelect = (documentType: string, event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files).map((file) => {
        // Add document type metadata to file
        Object.defineProperty(file, 'documentType', {
          value: documentType,
          writable: false,
        });
        return file;
      });
      onFilesChange([...files, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  const getFilesForType = (documentType: string) =>
    files.filter((file: any) => file.documentType === documentType);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  return (
    <Stack spacing={3}>
      <Stepper
        activeStep={activeStep}
        orientation="vertical"
        sx={{
          '& .MuiStepConnector-line': {
            minHeight: 8,
          },
        }}
      >
        {DOCUMENT_TYPES.map((docType, index) => {
          const typeFiles = getFilesForType(docType.id);
          const hasFiles = typeFiles.length > 0;

          return (
            <Step key={docType.id}>
              <StepLabel
                StepIconComponent={() => (
                  <Box
                    onClick={handleStep(index)}
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      bgcolor: hasFiles
                        ? 'success.main'
                        : activeStep === index
                          ? 'primary.main'
                          : 'action.disabled',
                      color: 'white',
                    }}
                  >
                    {hasFiles ? (
                      <Iconify
                        icon={ICONS.CHECK_CIRCLE}
                        sx={{ width: 24, height: 24, color: 'white' }}
                      />
                    ) : (
                      <Iconify
                        icon={docType.icon as any}
                        sx={{ width: 16, height: 16, color: 'white' }}
                      />
                    )}
                  </Box>
                )}
              >
                <Typography
                  variant="subtitle2"
                  onClick={handleStep(index)}
                  sx={{
                    cursor: 'pointer',
                    color: activeStep === index ? 'primary.main' : 'text.primary',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {docType.label}
                  {docType.required && (
                    <Typography component="span" color="error.main">
                      {' '}
                      *
                    </Typography>
                  )}
                </Typography>
              </StepLabel>
              <StepContent>
                <Stack
                  spacing={2}
                  sx={{
                    pt: 2,
                    p: 2,
                    border: 1,
                    borderStyle: 'dashed',
                    borderColor: 'divider',
                    borderRadius: 1,
                    bgcolor: 'action.hover',
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {docType.description}
                  </Typography>

                  {typeFiles.length === 0 && (
                    <Stack spacing={1.5}>
                      <Alert severity="info" sx={{ py: 0.5 }}>
                        <Typography variant="caption">
                          {docType.required && '* '}
                          {t('register.documents.helperText')}
                        </Typography>
                      </Alert>

                      <Button
                        variant="outlined"
                        component="label"
                        startIcon={<Iconify icon={ICONS.UPLOAD} />}
                        sx={{ alignSelf: 'flex-start' }}
                      >
                        Upload Document
                        <input
                          type="file"
                          hidden
                          multiple
                          accept=".pdf,application/pdf"
                          onChange={(e) => handleFileSelect(docType.id, e)}
                        />
                      </Button>
                    </Stack>
                  )}

                  {typeFiles.length > 0 && (
                    <Stack spacing={1}>
                      {typeFiles.map((file, idx) => {
                        const globalIndex = files.indexOf(file);
                        return (
                          <Box
                            key={idx}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: 2,
                              p: 1.5,
                              border: 1,
                              borderColor: 'primary.main',
                              borderRadius: 1,
                              bgcolor: (theme) => theme.palette.primary.main + '14',
                            }}
                          >
                            <Stack
                              direction="row"
                              spacing={2}
                              alignItems="center"
                              sx={{ flex: 1, minWidth: 0 }}
                            >
                              <Iconify
                                icon={ICONS.DOCUMENT_TEXT_DUOTONE}
                                width={32}
                                sx={{ color: 'primary.main', flexShrink: 0 }}
                              />
                              <Typography
                                variant="body2"
                                sx={{
                                  flex: 1,
                                  minWidth: 0,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {file.name}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ flexShrink: 0 }}
                              >
                                {(file.size / 1024).toFixed(2)} KB
                              </Typography>
                            </Stack>
                            <Tooltip title={t('register.documents.removeFile')}>
                              <IconButton
                                size="small"
                                onClick={() => handleRemoveFile(globalIndex)}
                                sx={{
                                  color: 'primary.main',
                                  '&:hover': {
                                    bgcolor: 'primary.dark',
                                    color: 'white',
                                  },
                                }}
                              >
                                <Iconify icon={ICONS.TRASH} width={20} />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        );
                      })}
                    </Stack>
                  )}

                  <Box sx={{ display: 'flex', gap: 1, pt: 1 }}>
                    <Tooltip title={t('register.documents.previousStep')}>
                      <span>
                        <IconButton
                          disabled={activeStep === 0}
                          onClick={handleBack}
                          size="small"
                          sx={{
                            border: 1,
                            borderColor: 'divider',
                            color: 'text.primary',
                            '&:hover': {
                              bgcolor: 'action.hover',
                            },
                          }}
                        >
                          <Iconify icon={ICONS.ARROW_IOS_BACK} width={20} />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title={t('register.documents.nextStep')}>
                      <span>
                        <IconButton
                          onClick={handleNext}
                          disabled={
                            activeStep === DOCUMENT_TYPES.length - 1 ||
                            (docType.required && typeFiles.length === 0)
                          }
                          size="small"
                          sx={{
                            border: 1,
                            borderColor: 'primary.main',
                            color: 'primary.main',
                            '&:hover': {
                              bgcolor: 'primary.main',
                              color: 'white',
                            },
                            '&.Mui-disabled': {
                              bgcolor: 'transparent',
                              color: 'action.disabled',
                              borderColor: 'divider',
                            },
                          }}
                        >
                          <Iconify icon={ICONS.ARROW_IOS_FORWARD} width={20} />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Box>
                </Stack>
              </StepContent>
            </Step>
          );
        })}
      </Stepper>

      <Button
        variant="contained"
        component="label"
        startIcon={<Iconify icon={ICONS.UPLOAD} />}
        sx={{ alignSelf: 'flex-start', display: 'none' }}
        onClick={handleUploadAll}
        disabled={queuedFiles.length === 0}
      >
        Upload All Files ({queuedFiles.length})
      </Button>

      <Dialog
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Upload All Documents</DialogTitle>
        <DialogContent>
          <QuantumFileUpload
            storageAdapter={{
              upload: async (file, onProgress) => {
                for (let i = 0; i <= 100; i += 10) {
                  await new Promise((resolve) => setTimeout(resolve, 500));
                  onProgress(i);
                }
                return URL.createObjectURL(file);
              },
              validateFile: (file, config) => {
                console.log('Validating file:', file.name);
                return { isValid: true };
              },
            }}
            config={{
              maxFileSize: 10 * 1024 * 1024,
              allowedTypes: ['application/pdf'],
              maxFiles: 10,
            }}
            title="Upload Documents"
            queueMode
            onQueueChange={(queuedFilesList) => {
              console.log('Queue changed:', queuedFilesList.length);
              setQueuedFiles(queuedFilesList);
            }}
            onProcessQueue={(fn) => {
              processQueueRef.current = fn;
            }}
            showButton
            showZone
          />
          <Typography variant="body2" sx={{ mt: 2 }}>
            Queued files: {queuedFiles.length}
          </Typography>
        </DialogContent>
      </Dialog>
    </Stack>
  );
}
