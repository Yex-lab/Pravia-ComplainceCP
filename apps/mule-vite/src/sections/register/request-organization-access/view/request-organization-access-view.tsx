import type { FluxTypes } from '@asyml8/api-types';

import { Link } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import { useMemo, useState, useEffect } from 'react';
import {
  useRouter,
  showError,
  showSuccess,
  showNotification,
  dismissNotification,
} from '@asyml8/ui';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';

import { useTranslation } from 'src/hooks/use-translation';

import { fluxServices } from 'src/api';
import { useAccountsPublicData } from 'src/store';

import { FormActions } from '../form-actions';
import { OrganizationInfoForm } from '../organization-info-form';
import { SearchStateEntityForm } from '../search-state-entity-form';
import {
  DocumentsForm,
  ContactInfoForm,
  CustomStepperForm,
  TermsAndConditionsForm,
} from '../../common';

type RequestOrganizationAccessViewProps = {
  showLogo?: boolean;
};

export function RequestOrganizationAccessView({
  showLogo = false,
}: RequestOrganizationAccessViewProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const allAccounts = useAccountsPublicData() as FluxTypes.AccountDto[];
  const [activeStep, setActiveStep] = useState(0);
  const [showContent, setShowContent] = useState(true);

  // Redirect to startup if accounts data not loaded
  useEffect(() => {
    if (!allAccounts || allAccounts.length === 0) {
      router.push(paths.startup.publicStartup);
    }
  }, [allAccounts, router]);

  // Access request mutation
  const { mutate: submitAccessRequest, isPending: isSubmitting } = useMutation({
    mutationFn: async (params: { data: FluxTypes.AccessRequestDto; documents: File[] }) => {
      const { data, documents: docs } = params;
      console.log('Mutation received documents:', docs);
      console.log('Mutation documents count:', docs.length);

      const loadingId = showNotification({
        type: 'info',
        message: 'Submitting access request...',
        icon: <CircularProgress size={20} color="info" />,
        duration: null,
      });

      try {
        // 1. Create access request
        const result = await fluxServices.public.createPublicAccountsRegisterRequestAccess(data);
        console.log('Access request created:', result);

        // 2. Upload documents if any
        console.log('Result:', result);
        console.log('Result id:', result.id);
        console.log('Docs length:', docs.length);

        if (docs.length > 0 && result.id) {
          console.log(`Uploading ${docs.length} documents for registration ID: ${result.id}`);

          const formData = new FormData();
          formData.append('registrationId', result.id);

          docs.forEach((file) => {
            console.log('Adding file:', file.name, file.type, file.size);
            formData.append('files', file);
          });

          const baseURL = import.meta.env.VITE_DATA_API_URL ?? 'http://localhost:4001';
          const uploadResponse = await fetch(
            `${baseURL}/api/public/accounts/register/supporting-files`,
            {
              method: 'POST',
              body: formData,
            }
          );

          if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text();
            console.error('Failed to upload documents:', errorText);
            showError(`Failed to upload documents: ${errorText}`);
          } else {
            const uploadResult = await uploadResponse.json();
            console.log('Documents uploaded successfully:', uploadResult);
          }
        } else {
          console.log('No documents to upload');
        }

        dismissNotification(loadingId);
        return result;
      } catch (error) {
        dismissNotification(loadingId);
        throw error;
      }
    },
    onSuccess: () => {
      showSuccess('Access request submitted successfully');
      router.push(paths.register.accessRequestConfirmation);
    },
    onError: (error: Error) => {
      showError(`Failed to submit access request: ${error.message}`);
    },
  });

  // Error state
  const [error, setError] = useState<string | null>(null);

  // Search state
  const [selectedEntity, setSelectedEntity] = useState<FluxTypes.AccountDto | null>(null);
  const [notListed, setNotListed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Org info state
  const [orgInfo, setOrgInfo] = useState({
    organizationName: '',
    acronym: '',
    orgCode: '',
    govCode: '',
    parentOrganization: '',
  });

  const handleOrgInfoChange = (field: string, value: string) => {
    setOrgInfo((prev) => ({ ...prev, [field]: value }));
  };

  // Contact info state
  const [contactInfo, setContactInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    businessPhone: '',
    captcha: '',
  });
  const [captchaCode, setCaptchaCode] = useState('');

  // Generate captcha code
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 7; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
  };

  // Generate captcha on mount
  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleContactInfoChange = (field: string, value: string) => {
    setContactInfo((prev) => ({ ...prev, [field]: value }));
  };

  // Terms acceptance
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Documents state
  const [documents, setDocuments] = useState<File[]>([]);

  // Populate org info when entity is selected
  useEffect(() => {
    if (selectedEntity) {
      setOrgInfo({
        organizationName: selectedEntity.name,
        acronym: selectedEntity.acronym || '',
        orgCode: selectedEntity.orgCode || '',
        govCode: selectedEntity.govCode || '',
        parentOrganization: '',
      });
    }
  }, [selectedEntity]);

  const handleSubmit = async () => {
    if (!selectedEntity) return;

    setError(null);

    console.log('Current documents state:', documents);
    console.log('Documents count:', documents.length);

    // Pass both data and documents to mutation
    submitAccessRequest({
      data: {
        id: selectedEntity.id,
        orgCode: selectedEntity.orgCode || '',
        govCode: selectedEntity.govCode || '',
        firstName: contactInfo.firstName,
        lastName: contactInfo.lastName,
        email: contactInfo.email,
        phone: contactInfo.phone,
        businessPhone: contactInfo.businessPhone,
        acceptedTerms: termsAccepted,
      },
      documents,
    });
  };

  // Handle Enter key on step 1 (org info) - with validation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && activeStep === 1 && orgInfo.organizationName) {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeStep, orgInfo.organizationName]);
  // Filter accounts in memory
  const searchResults = useMemo(() => {
    if (searchTerm.length < 2) return [];

    const term = searchTerm.toLowerCase();
    const results = allAccounts.filter(
      (account) =>
        (account.name.toLowerCase().includes(term) ||
          account.acronym?.toLowerCase().includes(term) ||
          account.govCode?.toLowerCase().includes(term)) &&
        account.categoryCode === 1
    );

    return results;
  }, [searchTerm, allAccounts]);

  const steps = [
    { label: t('register.requestAccess.steps.search'), icon: 'solar:magnifer-bold' },
    { label: t('register.requestAccess.steps.orgInfo'), icon: 'solar:buildings-bold' },
    { label: t('register.requestAccess.steps.contact'), icon: 'solar:user-bold' },
    { label: t('register.requestAccess.steps.documents'), icon: 'solar:document-bold' },
    { label: t('register.requestAccess.steps.review'), icon: 'solar:check-circle-bold' },
  ];

  const handleNext = () => {
    setShowContent(false);
    setTimeout(() => {
      setActiveStep((prev) => prev + 1);
      setTimeout(() => setShowContent(true), 50);
    }, 300);
  };

  const handleBack = () => {
    setShowContent(false);
    setTimeout(() => {
      setActiveStep((prev) => prev - 1);
      setTimeout(() => setShowContent(true), 50);
    }, 300);
  };

  const handleCancel = () => {
    router.push(paths.root);
  };

  const renderStepContent = () => {
    if (activeStep === 0) {
      return (
        <>
          <Box sx={{ px: 3 }}>
            <SearchStateEntityForm
              selectedEntity={selectedEntity}
              notListed={notListed}
              onEntitySelect={setSelectedEntity}
              onNotListedChange={setNotListed}
              onSearch={setSearchTerm}
              searchResults={searchResults}
              isSearching={false}
              onNext={handleNext}
            />
          </Box>

          <FormActions onCancel={handleCancel} onNext={handleNext} nextDisabled={!selectedEntity} />
        </>
      );
    }

    if (activeStep === 1) {
      return (
        <>
          <Box sx={{ px: 3 }}>
            <OrganizationInfoForm
              organizationName={orgInfo.organizationName}
              acronym={orgInfo.acronym}
              orgCode={orgInfo.orgCode}
              govCode={orgInfo.govCode}
              parentOrganization={orgInfo.parentOrganization}
              isExisting={!!selectedEntity}
              allOrganizations={allAccounts}
              currentOrgId={selectedEntity?.id}
              onChange={handleOrgInfoChange}
              onNext={handleNext}
            />
          </Box>

          <FormActions
            onBack={handleBack}
            onNext={handleNext}
            nextDisabled={!orgInfo.organizationName}
          />
        </>
      );
    }

    if (activeStep === 2) {
      return (
        <>
          <Box sx={{ px: 3 }}>
            <ContactInfoForm
              firstName={contactInfo.firstName}
              lastName={contactInfo.lastName}
              email={contactInfo.email}
              phone={contactInfo.phone}
              businessPhone={contactInfo.businessPhone}
              captcha={contactInfo.captcha}
              captchaCode={captchaCode}
              onChange={handleContactInfoChange}
              onRefreshCaptcha={generateCaptcha}
              onNext={handleNext}
              labels={{
                firstName: t('register.contact.firstName'),
                lastName: t('register.contact.lastName'),
                email: t('register.contact.email'),
                phone: t('register.contact.phone'),
                businessPhone: t('register.contact.businessPhone'),
                captcha: t('register.contact.captcha'),
                captchaPlaceholder: t('register.contact.captchaPlaceholder'),
              }}
            />
          </Box>

          <FormActions
            onBack={handleBack}
            onNext={handleNext}
            nextDisabled={
              !contactInfo.firstName ||
              !contactInfo.lastName ||
              !contactInfo.email ||
              !contactInfo.phone ||
              !contactInfo.captcha ||
              contactInfo.captcha !== captchaCode
            }
          />
        </>
      );
    }

    if (activeStep === 3) {
      // Check if required documents are uploaded
      const requiredDocs = ['articles', 'authorization'];
      const hasRequiredDocs = requiredDocs.every((docType) =>
        documents.some((file: any) => file.documentType === docType)
      );

      return (
        <>
          <Box sx={{ px: 3 }}>
            <DocumentsForm files={documents} onFilesChange={setDocuments} />
          </Box>

          <FormActions onBack={handleBack} onNext={handleNext} nextDisabled={!hasRequiredDocs} />
        </>
      );
    }

    if (activeStep === 4) {
      return (
        <>
          <Box sx={{ px: 3 }}>
            <TermsAndConditionsForm
              termsAccepted={termsAccepted}
              onTermsChange={setTermsAccepted}
              termsText="You are requesting access to an existing organization in Pravia Mule. By continuing, you acknowledge that you will access and use system data only as authorized and in accordance with applicable policies."
              checkboxLabel={t('register.review.termsPrefix')}
              termsLinkText={t('register.review.termsLink')}
              termsLinkHref="#"
            />
          </Box>

          {error && (
            <Alert severity="error" sx={{ mx: 3, mt: 3 }}>
              {error}
            </Alert>
          )}

          <FormActions
            onBack={handleBack}
            onSubmit={handleSubmit}
            submitDisabled={!termsAccepted}
            isSubmitting={isSubmitting}
          />
        </>
      );
    }

    return (
      <>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Step {activeStep + 1} - Coming soon...
          </Typography>
        </Box>
        <FormActions onBack={handleBack} onNext={handleNext} />
      </>
    );
  };

  return (
    <CustomStepperForm
      title={t('register.requestAccess.title')}
      subtitle={
        <>
          {t('register.requestAccess.welcome')} {t('register.requestAccess.selectOrganization')}{' '}
          {t('register.requestAccess.notListed')}{' '}
          <Link
            to={paths.register.organization}
            style={{
              color: 'inherit',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            <Box
              component="span"
              sx={{
                color: 'primary.main',
                fontWeight: 600,
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              {t('register.requestAccess.createNewOrganization')}
            </Box>
          </Link>
          .
        </>
      }
      steps={steps}
      activeStep={activeStep}
      showContent={showContent}
      stepDescription={
        activeStep === 0 ? (
          <>
            <Chip
              label="STEP 1"
              color="primary"
              variant="outlined"
              size="small"
              sx={{ fontWeight: 900, mr: 1, '& .MuiChip-label': { color: 'primary.main' } }}
            />
            {t('register.requestAccess.searchDescription')}
          </>
        ) : activeStep === 1 ? (
          <>
            <Chip
              label="STEP 2"
              color="primary"
              variant="outlined"
              size="small"
              sx={{ fontWeight: 900, mr: 1, '& .MuiChip-label': { color: 'primary.main' } }}
            />
            {t('register.requestAccess.documentsDescription')}
          </>
        ) : activeStep === 2 ? (
          <>
            <Chip
              label="STEP 3"
              color="primary"
              variant="outlined"
              size="small"
              sx={{ fontWeight: 900, mr: 1, '& .MuiChip-label': { color: 'primary.main' } }}
            />
            {t('register.requestAccess.orgInfoDescription')}
          </>
        ) : activeStep === 3 ? (
          <>
            <Chip
              label="STEP 4"
              color="primary"
              variant="outlined"
              size="small"
              sx={{ fontWeight: 900, mr: 1, '& .MuiChip-label': { color: 'primary.main' } }}
            />
            {t('register.requestAccess.contactDescription')}
          </>
        ) : activeStep === 4 ? (
          <>
            <Chip
              label="STEP 5"
              color="primary"
              variant="outlined"
              size="small"
              sx={{ fontWeight: 900, mr: 1, '& .MuiChip-label': { color: 'primary.main' } }}
            />
            {t('register.requestAccess.reviewDescription')}
          </>
        ) : undefined
      }
      cardMaxWidth={650}
    >
      {renderStepContent()}
    </CustomStepperForm>
  );
}
