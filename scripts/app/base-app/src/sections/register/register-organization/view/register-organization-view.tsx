import type { FluxTypes } from '@asyml8/api-types';

import { useMutation } from '@tanstack/react-query';
import { useMemo, useState, useEffect, useCallback } from 'react';
import {
  ICONS,
  useRouter,
  showError,
  showSuccess,
  showNotification,
  dismissNotification,
} from '@asyml8/ui';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';

import { useTranslation } from 'src/hooks/use-translation';
import { useAddressValidation } from 'src/hooks/use-address-validation';

import { fluxServices } from 'src/api';
import { useAccountsPublicData } from 'src/store';
import { NAME_REGEX, EMAIL_REGEX } from 'src/constants';

import { FormActions } from '../form-actions';
import { CustomAddressForm } from '../custom-address.form';
import { DocumentsForm } from '../../common/documents.form';
import { AdditionalOrgInfoForm } from '../additional-info.form';
import { OrganizationInfoForm } from '../organization-info.form';
import { OrganizationType, OrganizationTypeForm } from '../organization-type.form';
import { ContactInfoForm, CustomStepperForm, TermsAndConditionsForm } from '../../common';


type RegisterOrganizationViewProps = {
  showLogo?: boolean;
};

export function RegisterOrganizationView({ showLogo = false }: RegisterOrganizationViewProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [organizationType, setOrganizationType] = useState<OrganizationType | null>(null);
  const [showContent, setShowContent] = useState(true);

  // Load all accounts from store
  const allAccounts = useAccountsPublicData() as FluxTypes.AccountDto[];

  // Search state entity form state
  const [selectedEntity, setSelectedEntity] = useState<FluxTypes.AccountDto | null>(null);
  const [notListed, setNotListed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Core org info state
  const [coreOrgInfo, setCoreOrgInfo] = useState({
    organizationName: '',
    acronym: '',
    orgCode: '',
    govCode: '',
    parentOrganizationId: '',
  });

  const [similarEntities, setSimilarEntitiesState] = useState<FluxTypes.AccountDto[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const setSimilarEntities = useCallback((entities: FluxTypes.AccountDto[]) => {
    setSimilarEntitiesState(entities);
  }, []);

  const handleSearchingChange = useCallback((searching: boolean) => {
    setIsSearching(searching);
  }, []);

  const hasMatchingEntity = useMemo(() => {
    if (
      !coreOrgInfo.organizationName ||
      !Array.isArray(similarEntities) ||
      similarEntities.length === 0
    )
      return false;
    return similarEntities.some(
      (entity) => entity.name.toLowerCase() === coreOrgInfo.organizationName.toLowerCase()
    );
  }, [coreOrgInfo.organizationName, similarEntities]);

  const handleCoreOrgInfoChange = (field: string, value: string) => {
    setCoreOrgInfo((prev) => ({ ...prev, [field]: value }));
  };

  // Additional org info state
  const [additionalOrgInfo, setAdditionalOrgInfo] = useState({
    organizationPhone: '',
    website: '',
    fax: '',
  });

  const handleAdditionalOrgInfoChange = (field: string, value: string) => {
    setAdditionalOrgInfo((prev) => ({ ...prev, [field]: value }));
  };

  // Primary address state
  const [primaryAddress, setPrimaryAddress] = useState({
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: 'CA',
    zip: '',
    county: '',
  });
  const [addressValidationError, setAddressValidationError] = useState<string | undefined>();
  const { validate: validateAddress, validating: isValidatingAddress } = useAddressValidation();

  const handlePrimaryAddressChange = (field: string, value: string) => {
    setPrimaryAddress((prev) => ({ ...prev, [field]: value }));
    // Clear validation error when user changes address
    if (addressValidationError) {
      setAddressValidationError(undefined);
    }
  };

  // Mailing address state
  const [mailingAddress, setMailingAddress] = useState({
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: 'CA',
    zip: '',
    county: '',
  });
  const [sameAsPrimary, setSameAsPrimary] = useState(false);

  const handleMailingAddressChange = (field: string, value: string) => {
    setMailingAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleSameAsPrimaryChange = (checked: boolean) => {
    setSameAsPrimary(checked);
    if (checked) {
      setMailingAddress(primaryAddress);
    } else {
      setMailingAddress({
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: 'CA',
        zip: '',
        county: '',
      });
    }
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
  const [contactErrors, setContactErrors] = useState<Record<string, string>>({});

  // Documents state
  const [documents, setDocuments] = useState<File[]>([]);

  // Terms acceptance state
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Registration mutation
  const { mutate: submitRegistration, isPending: isSubmitting } = useMutation({
    mutationFn: async (params: { data: FluxTypes.RegisterOrganizationDto; documents: File[] }) => {
      const { data, documents: docs } = params;
      const loadingId = showNotification({
        type: 'info',
        message: 'Submitting registration...',
        icon: <CircularProgress size={20} color="info" />,
        duration: null,
      });

      try {
        // 1. Create registration
        const result = await fluxServices.public.createPublicAccountsRegisterCreate(data);

        // 2. Upload documents if any
        if (docs.length > 0 && result.id) {
          const formData = new FormData();
          formData.append('registrationId', result.id);

          docs.forEach((file) => {
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
            console.error('Failed to upload documents:', await uploadResponse.text());
          }
        }

        dismissNotification(loadingId);
        return result;
      } catch (error) {
        dismissNotification(loadingId);
        throw error;
      }
    },
    onSuccess: () => {
      showSuccess('Organization registration submitted successfully');
      router.push(paths.register.accessRequestConfirmation);
    },
    onError: (error: Error) => {
      showError(`Registration failed: ${error.message}`);
    },
  });

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
    // Clear error when user changes field
    if (contactErrors[field]) {
      setContactErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateContactInfo = (): boolean => {
    const errors: Record<string, string> = {};

    if (!contactInfo.firstName.trim()) {
      errors.firstName = 'First name is required';
    } else if (!NAME_REGEX.test(contactInfo.firstName)) {
      errors.firstName = 'Invalid first name format';
    }

    if (!contactInfo.lastName.trim()) {
      errors.lastName = 'Last name is required';
    } else if (!NAME_REGEX.test(contactInfo.lastName)) {
      errors.lastName = 'Invalid last name format';
    }

    if (!contactInfo.email.trim()) {
      errors.email = 'Email is required';
    } else if (!EMAIL_REGEX.test(contactInfo.email)) {
      errors.email = 'Invalid email format';
    }

    if (!contactInfo.phone.trim()) {
      errors.phone = 'Phone number is required';
    }

    // Validación simplificada para businessPhone (opcional, pero si existe debe tener formato)
    if (contactInfo.businessPhone && contactInfo.businessPhone.replace(/\D/g, '').length < 10) {
      errors.businessPhone = 'Business phone must have at least 10 digits';
    }

    if (!contactInfo.captcha.trim()) {
      errors.captcha = 'Captcha is required';
    } else if (contactInfo.captcha !== captchaCode) {
      errors.captcha = 'Captcha does not match';
    }

    setContactErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Populate core org info when entity is selected
  useEffect(() => {
    if (selectedEntity) {
      const newInfo = {
        organizationName: selectedEntity.name,
        acronym: selectedEntity.acronym || '',
        orgCode: selectedEntity.orgCode || '',
        govCode: selectedEntity.govCode || '',
        parentOrganizationId: '',
      };
      setCoreOrgInfo(newInfo);
    }
  }, [selectedEntity]);

  // Filter accounts in memory
  const searchResults = useMemo(() => {
    if (searchTerm.length < 2) return [];

    const term = searchTerm.toLowerCase();
    return allAccounts.filter(
      (account) =>
        (account.name.toLowerCase().includes(term) ||
          account.acronym?.toLowerCase().includes(term) ||
          account.govCode?.toLowerCase().includes(term)) &&
        account.categoryCode === 1
    );
  }, [searchTerm, allAccounts]);

  // Generate steps based on organization type
  const steps = useMemo(() => {
    if (!organizationType) return [];

    const baseSteps = [];

    if (organizationType === OrganizationType.STATE) {
      baseSteps.push(
        { label: t('register.coreOrgInfo.stepLabel'), icon: 'solar:buildings-bold' },
        { label: t('register.additionalOrgInfo.stepLabel'), icon: 'solar:document-text-bold' }
      );
    } else {
      baseSteps.push({ label: t('register.basicOrgInfo.stepLabel'), icon: 'solar:buildings-bold' });
    }

    baseSteps.push(
      { label: t('register.primaryAddress.stepLabel'), icon: 'solar:map-point-bold' },
      { label: t('register.mailingAddress.stepLabel'), icon: 'solar:letter-bold' },
      { label: t('register.contactPerson.stepLabel'), icon: 'solar:user-bold' },
      { label: t('register.documents.stepLabel'), icon: ICONS.DOCUMENT_TEXT },
      { label: t('register.review.stepLabel'), icon: 'solar:check-circle-bold' }
    );

    return baseSteps;
  }, [organizationType, t]);

  const getStepDescription = () => {
    if (activeStep === 0) return null;

    const stepIndex = activeStep - 1;
    let description = '';

    if (organizationType === OrganizationType.STATE) {
      const descriptions = [
        t('register.coreOrgInfo.description'),
        t('register.additionalOrgInfo.description'),
        t('register.primaryAddress.description'),
        t('register.mailingAddress.description'),
        t('register.contactPerson.description'),
        t('register.documents.description'),
        t('register.review.description'),
      ];
      description = descriptions[stepIndex];
    } else {
      const descriptions = [
        t('register.basicOrgInfo.description'),
        t('register.primaryAddress.description'),
        t('register.mailingAddress.description'),
        t('register.contactPerson.description'),
        t('register.documents.description'),
        t('register.review.description'),
      ];
      description = descriptions[stepIndex];
    }

    return (
      <>
        <Chip
          label={`STEP ${stepIndex + 1}`}
          color="primary"
          variant="outlined"
          size="small"
          sx={{ fontWeight: 900, mr: 1, '& .MuiChip-label': { color: 'primary.main' } }}
        />
        {description}
      </>
    );
  };

  const handleNext = async () => {
    // Validate address on address steps (step 2 for non-STATE, step 3 for STATE)
    const isAddressStep =
      (organizationType !== OrganizationType.STATE && activeStep === 2) ||
      (organizationType === OrganizationType.STATE && activeStep === 3);

    if (isAddressStep) {
      const result = await validateAddress({
        addressLine1: primaryAddress.addressLine1,
        city: primaryAddress.city,
        state: primaryAddress.state,
        zip: primaryAddress.zip,
      });

      if (!result.isValid) {
        setAddressValidationError(result.message);
        return; // Don't proceed to next step
      }
    }

    // Validate contact info on contact step (step 4 for non-STATE, step 5 for STATE)
    const isContactStep =
      (organizationType !== OrganizationType.STATE && activeStep === 4) ||
      (organizationType === OrganizationType.STATE && activeStep === 5);

    if (isContactStep) {
      if (!validateContactInfo()) {
        return; // Don't proceed if validation fails
      }
    }

    // Submit on review step (step 6 for non-STATE, step 7 for STATE)
    const isReviewStep =
      (organizationType !== OrganizationType.STATE && activeStep === 6) ||
      (organizationType === OrganizationType.STATE && activeStep === 7);

    if (isReviewStep) {
      const registrationData = {
        organizationType: organizationType! as any,
        organizationName: coreOrgInfo.organizationName,
        acronym: coreOrgInfo.acronym,
        orgCode: coreOrgInfo.orgCode,
        govCode: coreOrgInfo.govCode,
        parentOrganizationId: coreOrgInfo.parentOrganizationId,
        organizationPhone: additionalOrgInfo.organizationPhone,
        website: additionalOrgInfo.website,
        fax: additionalOrgInfo.fax,
        addressLine1: primaryAddress.addressLine1,
        addressLine2: primaryAddress.addressLine2,
        city: primaryAddress.city,
        state: primaryAddress.state,
        zipCode: primaryAddress.zip,
        county: primaryAddress.county,
        mailingAddressLine1: sameAsPrimary
          ? primaryAddress.addressLine1
          : mailingAddress.addressLine1,
        mailingAddressLine2: sameAsPrimary
          ? primaryAddress.addressLine2
          : mailingAddress.addressLine2,
        mailingCity: sameAsPrimary ? primaryAddress.city : mailingAddress.city,
        mailingState: sameAsPrimary ? primaryAddress.state : mailingAddress.state,
        mailingZipCode: sameAsPrimary ? primaryAddress.zip : mailingAddress.zip,
        mailingCounty: sameAsPrimary ? primaryAddress.county : mailingAddress.county,
        firstName: contactInfo.firstName,
        lastName: contactInfo.lastName,
        email: contactInfo.email,
        phone: contactInfo.phone,
        businessPhone: contactInfo.businessPhone,
        acceptedTerms: termsAccepted,
      };

      submitRegistration({
        data: registrationData,
        documents,
      });
      return;
    }

    setShowContent(false);
    setTimeout(() => {
      setActiveStep((prev) => prev + 1);
      setTimeout(() => setShowContent(true), 50);
    }, 300);
  };

  const handleBack = () => {
    setShowContent(false);
    setTimeout(() => {
      const prevStep = activeStep - 1;
      setActiveStep(prevStep);
      // Clear organization name when going back to step 0
      if (prevStep === 0) {
        setCoreOrgInfo((prev) => ({ ...prev, organizationName: '' }));
        setSimilarEntities([]);
      }
      setTimeout(() => setShowContent(true), 50);
    }, 300);
  };

  const handleCancel = () => {
    router.push(paths.root);
  };

  const renderStepContent = () => {
    // Step 0: Select organization type
    if (activeStep === 0) {
      return (
        <>
          <Box sx={{ px: 3 }}>
            <OrganizationTypeForm value={organizationType} onChange={setOrganizationType} />
          </Box>
          <FormActions
            onCancel={handleCancel}
            onNext={handleNext}
            nextDisabled={!organizationType}
          />
        </>
      );
    }

    // Step 1: Core org info
    if (activeStep === 1) {
      return (
        <>
          <Box sx={{ px: 3 }}>
            <OrganizationInfoForm
              organizationName={coreOrgInfo.organizationName}
              acronym={coreOrgInfo.acronym}
              orgCode={coreOrgInfo.orgCode}
              govCode={coreOrgInfo.govCode}
              parentOrganizationId={coreOrgInfo.parentOrganizationId}
              organizationType={organizationType!}
              isExisting={!!selectedEntity}
              allOrganizations={allAccounts}
              currentOrgId={selectedEntity?.id}
              onChange={handleCoreOrgInfoChange}
              onNext={handleNext}
              onSimilarEntitiesChange={setSimilarEntities}
              onSearchingChange={handleSearchingChange}
              labels={{
                entityName: t('register.coreOrgInfo.entityName'),
                entityNameHelper: t('register.coreOrgInfo.entityNameHelper'),
                parentOrganizationId: t('register.coreOrgInfo.parentOrganization'),
                acronym: t('register.coreOrgInfo.acronym'),
                acronymHelper: t('register.coreOrgInfo.acronymHelper'),
                organizationCode: t('register.coreOrgInfo.organizationCode'),
                organizationCodeHelper: t('register.coreOrgInfo.organizationCodeHelper'),
                governmentCode: t('register.coreOrgInfo.governmentCode'),
                governmentCodeHelper: t('register.coreOrgInfo.governmentCodeHelper'),
                searchingMessage: t('register.coreOrgInfo.searchingMessage'),
                searchingShort: t('register.coreOrgInfo.searchingShort'),
                typeToSearch: t('register.coreOrgInfo.typeToSearch'),
                noResults: t('register.coreOrgInfo.noResults'),
                noOrganizations: t('register.coreOrgInfo.noOrganizations'),
                similarWarning: t('register.coreOrgInfo.similarWarning'),
                closeButton: t('register.coreOrgInfo.closeButton'),
              }}
            />
          </Box>
          <FormActions
            onBack={handleBack}
            onNext={handleNext}
            nextDisabled={
              !coreOrgInfo.organizationName ||
              isSearching ||
              hasMatchingEntity ||
              (organizationType === OrganizationType.STATE &&
                (!coreOrgInfo.acronym || !coreOrgInfo.orgCode || !coreOrgInfo.govCode))
            }
          />
        </>
      );
    }

    // Step 2: Additional org info (STATE only) OR Primary Address (non-STATE)
    if (activeStep === 2) {
      if (organizationType === OrganizationType.STATE) {
        return (
          <>
            <Box sx={{ px: 3 }}>
              <AdditionalOrgInfoForm
                organizationPhone={additionalOrgInfo.organizationPhone}
                website={additionalOrgInfo.website}
                fax={additionalOrgInfo.fax}
                onChange={handleAdditionalOrgInfoChange}
              />
            </Box>
            <FormActions
              onBack={handleBack}
              onNext={handleNext}
              nextDisabled={!additionalOrgInfo.organizationPhone}
            />
          </>
        );
      }
      // Non-STATE: Primary Address
      return (
        <>
          <Box sx={{ px: 3, mt: 2 }}>
            <CustomAddressForm
              type="primary"
              addressLine1={primaryAddress.addressLine1}
              addressLine2={primaryAddress.addressLine2}
              city={primaryAddress.city}
              state={primaryAddress.state}
              zip={primaryAddress.zip}
              county={primaryAddress.county}
              onChange={handlePrimaryAddressChange}
              validationError={addressValidationError}
              labels={{
                addressLine1: t('organizations.fields.addressLine1'),
                addressLine2: t('organizations.fields.addressLine2'),
                city: t('organizations.fields.city'),
                state: t('organizations.fields.state'),
                zip: t('organizations.fields.zipCode'),
                county: t('organizations.fields.county'),
              }}
            />
          </Box>
          <FormActions
            onBack={handleBack}
            onNext={handleNext}
            nextDisabled={
              !primaryAddress.addressLine1 ||
              !primaryAddress.city ||
              !primaryAddress.state ||
              !primaryAddress.zip ||
              isValidatingAddress
            }
          />
        </>
      );
    }

    // Step 3: Primary Address (STATE only)
    if (activeStep === 3 && organizationType === OrganizationType.STATE) {
      return (
        <>
          <Box sx={{ px: 3, mt: 2 }}>
            <CustomAddressForm
              type="primary"
              addressLine1={primaryAddress.addressLine1}
              addressLine2={primaryAddress.addressLine2}
              city={primaryAddress.city}
              state={primaryAddress.state}
              zip={primaryAddress.zip}
              county={primaryAddress.county}
              onChange={handlePrimaryAddressChange}
              validationError={addressValidationError}
              labels={{
                addressLine1: t('organizations.fields.addressLine1'),
                addressLine2: t('organizations.fields.addressLine2'),
                city: t('organizations.fields.city'),
                state: t('organizations.fields.state'),
                zip: t('organizations.fields.zipCode'),
                county: t('organizations.fields.county'),
              }}
            />
          </Box>
          <FormActions
            onBack={handleBack}
            onNext={handleNext}
            nextDisabled={
              !primaryAddress.addressLine1 ||
              !primaryAddress.city ||
              !primaryAddress.state ||
              !primaryAddress.zip ||
              isValidatingAddress
            }
          />
        </>
      );
    }

    // Step 3 (non-STATE) or Step 4 (STATE): Mailing Address
    const mailingStep = organizationType === OrganizationType.STATE ? 4 : 3;
    if (activeStep === mailingStep) {
      const displayAddress = sameAsPrimary ? primaryAddress : mailingAddress;

      return (
        <>
          <Box sx={{ px: 3, mt: 2 }}>
            <CustomAddressForm
              type="mailing"
              addressLine1={displayAddress.addressLine1}
              addressLine2={displayAddress.addressLine2}
              city={displayAddress.city}
              state={displayAddress.state}
              zip={displayAddress.zip}
              county={displayAddress.county}
              onChange={handleMailingAddressChange}
              sameAsPrimary={sameAsPrimary}
              onSameAsPrimaryChange={handleSameAsPrimaryChange}
              labels={{
                sameAsPrimary: t('organizations.fields.sameAsPrimary'),
                addressLine1: t('organizations.fields.mailingAddressLine1'),
                addressLine2: t('organizations.fields.mailingAddressLine2'),
                city: t('organizations.fields.mailingCity'),
                state: t('organizations.fields.state'),
                zip: t('organizations.fields.zipCode'),
                county: t('organizations.fields.county'),
              }}
            />
          </Box>
          <FormActions
            onBack={handleBack}
            onNext={handleNext}
            nextDisabled={
              !sameAsPrimary &&
              (!mailingAddress.addressLine1 ||
                !mailingAddress.city ||
                !mailingAddress.state ||
                !mailingAddress.zip)
            }
          />
        </>
      );
    }

    // Step 4 (non-STATE) or Step 5 (STATE): Contact Information
    const contactStep = organizationType === OrganizationType.STATE ? 5 : 4;
    if (activeStep === contactStep) {
      return (
        <>
          <Box sx={{ px: 3, mt: 2 }}>
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
              errors={contactErrors}
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
              contactInfo.captcha !== captchaCode ||
              Object.keys(contactErrors).length > 0
            }
          />
        </>
      );
    }

    // Step 5 (non-STATE) or Step 6 (STATE): Documents
    const documentsStep = organizationType === OrganizationType.STATE ? 6 : 5;
    if (activeStep === documentsStep) {
      return (
        <>
          <Box sx={{ px: 3, mt: 2 }}>
            <DocumentsForm files={documents} onFilesChange={setDocuments} />
          </Box>
          <FormActions onBack={handleBack} onNext={handleNext} />
        </>
      );
    }

    // Step 6 (non-STATE) or Step 7 (STATE): Review
    const reviewStep = organizationType === OrganizationType.STATE ? 7 : 6;
    if (activeStep === reviewStep) {
      return (
        <>
          <Box sx={{ px: 3, mt: 2 }}>
            <TermsAndConditionsForm
              termsAccepted={termsAccepted}
              onTermsChange={setTermsAccepted}
              termsText="By submitting this registration, you acknowledge that all information provided is accurate and complete. You agree to comply with all applicable policies and regulations governing the use of this system."
              checkboxLabel={t('register.review.termsPrefix')}
              termsLinkText={t('register.review.termsLink')}
              termsLinkHref="#"
            />
          </Box>
          <FormActions
            onBack={handleBack}
            onNext={handleNext}
            nextDisabled={!termsAccepted || isSubmitting}
            nextLabel={
              isSubmitting ? t('register.actions.submitting') : t('register.actions.submit')
            }
            isSubmitting={isSubmitting}
          />
        </>
      );
    }

    // Subsequent steps
    return (
      <>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Step {activeStep} - Coming soon...
          </Typography>
        </Box>
        <FormActions onBack={handleBack} onNext={handleNext} />
      </>
    );
  };

  return activeStep === 0 ? (
    <CustomStepperForm
      title={t('register.title')}
      subtitle={t('register.selectType.subtitle')}
      steps={[]}
      activeStep={0}
      showContent={showContent}
      showStepper={false}
      cardMaxWidth={500}
    >
      {renderStepContent()}
    </CustomStepperForm>
  ) : (
    <CustomStepperForm
      title={t('register.title')}
      subtitle={t('register.subtitle')}
      steps={steps}
      activeStep={activeStep - 1}
      showContent={showContent}
      stepDescription={getStepDescription()}
      showStepper
      cardMaxWidth={800}
    >
      {renderStepContent()}
    </CustomStepperForm>
  );
}
