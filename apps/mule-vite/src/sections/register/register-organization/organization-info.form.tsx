import type { FluxTypes } from '@asyml8/api-types';

import { ICONS, Iconify } from '@asyml8/ui';
import { useMemo, useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { fluxApi } from 'src/api';
import { ACRONYM_REGEX, ORG_CODE_REGEX, GOV_CODE_REGEX, ENTITY_NAME_REGEX } from 'src/constants';

import { OrganizationType } from './organization-type.form';
import { handleCodeChange, SearchableAutocomplete } from '../common';

const getOrgTypeIcon = (categoryCode?: number): string => {
  switch (categoryCode) {
    case 448150000: // STATE
      return ICONS.BUILDINGS_3;
    case 448150001: // COUNTY
      return ICONS.CITY;
    case 448150002: // LOCAL
      return ICONS.HOME_ANGLE;
    case 448150003: // TRIBAL
      return ICONS.FLAG;
    default:
      return ICONS.BUILDINGS;
  }
};

type OrganizationInfoFormProps = {
  organizationName: string;
  acronym: string;
  orgCode: string;
  govCode: string;
  parentOrganizationId: string;
  organizationType: OrganizationType;
  isExisting: boolean;
  allOrganizations: FluxTypes.AccountDto[];
  currentOrgId?: string;
  onChange: (field: string, value: string) => void;
  onNext?: () => void;
  onSimilarEntitiesChange?: (entities: FluxTypes.AccountDto[]) => void;
  onSearchingChange?: (isSearching: boolean) => void;
  labels: {
    entityName: string;
    entityNameHelper: string;
    parentOrganizationId: string;
    acronym: string;
    acronymHelper: string;
    organizationCode: string;
    organizationCodeHelper: string;
    governmentCode: string;
    governmentCodeHelper: string;
    searchingMessage: string;
    searchingShort: string;
    typeToSearch: string;
    noResults: string;
    noOrganizations: string;
    similarWarning: string;
    closeButton: string;
  };
};

export function OrganizationInfoForm({
  organizationName,
  acronym,
  orgCode,
  govCode,
  parentOrganizationId,
  organizationType,
  isExisting,
  allOrganizations,
  currentOrgId,
  onChange,
  onNext,
  onSimilarEntitiesChange,
  onSearchingChange,
  labels,
}: OrganizationInfoFormProps) {
  const filteredOrgs = allOrganizations.filter((org) => org.id !== currentOrgId);
  const selectedParent = filteredOrgs.find((org) => org.id === parentOrganizationId);

  const [parentSearchTerm, setParentSearchTerm] = useState('');
  const [entityNameInput, setEntityNameInput] = useState(organizationName);
  const [similarEntities, setSimilarEntities] = useState<FluxTypes.AccountDto[]>([]);
  const [isSearchingSimilar, setIsSearchingSimilar] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const MAX_RESULTS = 5;
  const totalResults = similarEntities.length;
  const displayedEntities = similarEntities.slice(0, MAX_RESULTS);
  const hasMoreResults = totalResults > MAX_RESULTS;

  // Debounced search for similar entities
  useEffect(() => {
    if (entityNameInput.length < 2) {
      setSimilarEntities([]);
      setIsTyping(false);
      setIsOpen(false);
      onSearchingChange?.(false);
      return undefined;
    }

    setIsOpen(true);
    setIsTyping(true);
    setSimilarEntities([]);
    onSearchingChange?.(true);

    const timer = setTimeout(async () => {
      setIsSearchingSimilar(true);
      try {
        const response = await fluxApi.get(
          `/api/public/accounts/similar?name=${encodeURIComponent(entityNameInput)}`
        );

        // Handle different response structures
        let results: FluxTypes.AccountDto[] = [];
        if (Array.isArray(response.data)) {
          results = response.data;
        } else if (response.data?.value && Array.isArray(response.data.value)) {
          results = response.data.value;
        } else if (response.data?.body && Array.isArray(response.data.body)) {
          results = response.data.body;
        }

        setSimilarEntities(results);
        onSimilarEntitiesChange?.(results);
        if (results.length === 0) {
          setIsOpen(false);
        }
      } catch (error) {
        setSimilarEntities([]);
      } finally {
        setIsSearchingSimilar(false);
        setIsTyping(false);
        onSearchingChange?.(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [entityNameInput, onSearchingChange, onSimilarEntitiesChange]);

  const parentSearchResults = useMemo(() => {
    if (parentSearchTerm.length < 2) return [];

    const term = parentSearchTerm.toLowerCase();
    return filteredOrgs.filter(
      (org) =>
        org.name.toLowerCase().includes(term) ||
        org.acronym?.toLowerCase().includes(term) ||
        org.govCode?.toLowerCase().includes(term)
    );
  }, [parentSearchTerm, filteredOrgs]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && onNext) {
      const isValid =
        organizationType === OrganizationType.STATE
          ? organizationName && acronym && orgCode && govCode
          : organizationName;

      if (isValid) {
        e.preventDefault();
        onNext();
      }
    }
  };

  return (
    <Stack spacing={3} onKeyDown={handleKeyDown} sx={{ pt: 2 }}>
      <SearchableAutocomplete
        value={null}
        inputValue={entityNameInput}
        onInputChange={(newValue) => {
          setEntityNameInput(newValue);
          if (newValue === '' || ENTITY_NAME_REGEX.test(newValue)) {
            onChange('organizationName', newValue);
          }
        }}
        onChange={(newValue) => {
          if (newValue) {
            setEntityNameInput(newValue.name);
            onChange('organizationName', newValue.name);
          }
        }}
        options={displayedEntities}
        getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
        renderOption={(option) => (
          <Stack direction="row" spacing={2} alignItems="center" sx={{ width: 1 }}>
            <Iconify
              icon={getOrgTypeIcon(option.categoryCode) as any}
              width={20}
              sx={{ color: 'primary.main', flexShrink: 0 }}
            />
            <Typography variant="body2">{option.name}</Typography>
          </Stack>
        )}
        loading={isSearchingSimilar}
        isTyping={isTyping}
        loadingMessage={labels.searchingMessage}
        searchingMessage={labels.searchingShort}
        label={labels.entityName}
        helperText={labels.entityNameHelper}
        required
        typeToSearchMessage={labels.typeToSearch}
        noResultsMessage={labels.noResults}
        icon={getOrgTypeIcon(organizationType)}
        freeSolo
        open={isOpen}
        onOpen={() => setIsOpen(true)}
        onCloseDropdown={(event, reason) => {
          if (reason === 'blur' || reason === 'escape') {
            return;
          }
          if (entityNameInput.length < 2) {
            setIsOpen(false);
          }
        }}
        showFooter
        footerWarning={
          hasMoreResults
            ? labels.similarWarning.replace('{count}', String(totalResults))
            : undefined
        }
        closeButtonLabel={labels.closeButton}
        onClose={() => setIsOpen(false)}
      />

      {organizationType !== OrganizationType.STATE && (
        <TextField
          sx={{ maxWidth: '33.33%' }}
          label={labels.acronym}
          value={acronym}
          onChange={(e) => handleCodeChange('acronym', e.target.value, ACRONYM_REGEX, onChange)}
          required
          helperText={labels.acronymHelper}
        />
      )}

      {organizationType === OrganizationType.STATE && (
        <>
          <SearchableAutocomplete
            value={selectedParent || null}
            inputValue={parentSearchTerm}
            onInputChange={setParentSearchTerm}
            onChange={(newValue) => onChange('parentOrganizationId', newValue?.id || '')}
            options={parentSearchResults}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            renderOption={(option) => (
              <Stack direction="row" spacing={2} alignItems="center" sx={{ width: 1 }}>
                <Iconify
                  icon={ICONS.BUILDINGS}
                  width={20}
                  sx={{ color: 'primary.main', flexShrink: 0 }}
                />
                <Typography variant="body2">{option.name}</Typography>
              </Stack>
            )}
            label={labels.parentOrganizationId}
            typeToSearchMessage={labels.typeToSearch}
            noResultsMessage={labels.noOrganizations}
            icon={ICONS.SEARCH}
            activeIcon={ICONS.BUILDINGS}
            isActive={!!selectedParent}
          />

          <Stack direction="row" spacing={2}>
            <TextField
              sx={{ flex: 1 }}
              label={labels.acronym}
              value={acronym}
              onChange={(e) => handleCodeChange('acronym', e.target.value, ACRONYM_REGEX, onChange)}
              required
              helperText={labels.acronymHelper}
            />
            <TextField
              sx={{ flex: 1 }}
              label={labels.organizationCode}
              value={orgCode}
              onChange={(e) =>
                handleCodeChange('orgCode', e.target.value, ORG_CODE_REGEX, onChange)
              }
              required
              helperText={labels.organizationCodeHelper}
            />
            <TextField
              sx={{ flex: 1 }}
              label={labels.governmentCode}
              value={govCode}
              onChange={(e) =>
                handleCodeChange('govCode', e.target.value, GOV_CODE_REGEX, onChange)
              }
              required
              helperText={labels.governmentCodeHelper}
            />
          </Stack>
        </>
      )}
    </Stack>
  );
}
