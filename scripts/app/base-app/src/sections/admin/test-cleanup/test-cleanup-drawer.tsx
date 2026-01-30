import type { FluxTypes } from '@asyml8/api-types';

import ReactJson from 'react-json-view';
import { useMemo, useState, useEffect } from 'react';
import {
  ICONS,
  Iconify,
  showInfo,
  showError,
  showSuccess,
  FeatureDrawer,
  useConfirmationDialog,
} from '@asyml8/ui';

import {
  Box,
  Stack,
  Button,
  Checkbox,
  TextField,
  Typography,
  Autocomplete,
  FormControlLabel,
} from '@mui/material';

import { useTranslation } from 'src/hooks/use-translation';

import { fluxServices } from 'src/api/flux.api';
import { useAppConfig, useAccountsPublicData } from 'src/store/app.store';

const getOrgTypeIcon = (categoryCode?: number): string => {
  switch (categoryCode) {
    case 1: // STATE
    case 448150000: // STATE
      return ICONS.BUILDINGS_3;
    case 2: // COUNTY
    case 448150001: // COUNTY
      return ICONS.CITY;
    case 895080001: // LOCAL
    case 448150002: // LOCAL
      return ICONS.HOME_ANGLE;
    case 895080002: // TRIBAL
    case 448150003: // TRIBAL
      return ICONS.FLAG;
    default:
      return ICONS.BUILDINGS;
  }
};

interface TestCleanupDrawerProps {
  open: boolean;
  onClose: () => void;
}

interface CleanupItem {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  endpoint: keyof typeof cleanupEndpoints;
}

const cleanupEndpoints = {
  registerRecords: 'createTestOnlyCleanupRegisterRecords',
  accountsMissingCodes: 'createTestOnlyCleanupAccountsMissingCodes',
  submissions: 'createTestOnlyCleanupSubmissions',
  contacts: 'createTestOnlyCleanupContacts',
  designees: 'createTestOnlyCleanupDesignees',
  supabaseUsers: 'createTestOnlyCleanupSupabaseUsers',
  organizationComplete: 'createTestOnlyCleanupOrganizationComplete',
} as const;

export function TestCleanupDrawer({ open, onClose }: TestCleanupDrawerProps) {
  const { t } = useTranslation();
  const confirm = useConfirmationDialog();
  const accountsPublic = useAccountsPublicData();
  const { organizationId: currentOrgId } = useAppConfig();

  const [selectedOrgId, setSelectedOrgId] = useState<string>('');
  const [minutes, setMinutes] = useState(30);
  const [dataCount, setDataCount] = useState<any>(null);
  const [loadingDataCount, setLoadingDataCount] = useState(false);
  const [items, setItems] = useState<CleanupItem[]>([
    {
      id: 'registerRecords',
      label: 'Delete Access Requests',
      description: 'Remove registration and access requests',
      checked: false,
      endpoint: 'registerRecords',
    },
    {
      id: 'accountsMissingCodes',
      label: 'Delete Non-State Organizations',
      description: 'Remove accounts missing UID codes',
      checked: false,
      endpoint: 'accountsMissingCodes',
    },
    {
      id: 'submissions',
      label: 'Delete User Submissions',
      description: 'Remove all user submissions',
      checked: false,
      endpoint: 'submissions',
    },
    {
      id: 'contacts',
      label: 'Delete Contacts',
      description: 'Remove contacts for organization',
      checked: false,
      endpoint: 'contacts',
    },
    {
      id: 'designees',
      label: 'Delete Designees',
      description: 'Remove designees for organization',
      checked: false,
      endpoint: 'designees',
    },
    {
      id: 'supabaseUsers',
      label: 'Delete Supabase Users',
      description: 'Remove Supabase authentication users',
      checked: false,
      endpoint: 'supabaseUsers',
    },
    // {
    //   id: 'organizationComplete',
    //   label: 'Delete All Test Data',
    //   description: 'Complete organization cleanup (all data)',
    //   checked: false,
    //   endpoint: 'organizationComplete',
    // },
  ]);

  // Sort organizations by creation date (most recent first)
  const sortedOrganizations = useMemo(
    () =>
      [...accountsPublic].sort((a, b) => {
        const dateA = a.createdOn ? new Date(a.createdOn).getTime() : 0;
        const dateB = b.createdOn ? new Date(b.createdOn).getTime() : 0;
        return dateB - dateA;
      }),
    [accountsPublic]
  );

  // Get selected organization
  const selectedOrg = useMemo(
    () => sortedOrganizations.find((org) => org.id === selectedOrgId),
    [sortedOrganizations, selectedOrgId]
  );

  // Calculate minutes from organization creation date
  useEffect(() => {
    if (selectedOrg?.createdOn) {
      const createdDate = new Date(selectedOrg.createdOn);
      const now = new Date();
      const diffMs = now.getTime() - createdDate.getTime();
      let diffMinutes = Math.ceil(diffMs / 60000);

      // Add extra minute if "Delete All Test Data" is selected
      const deleteAllSelected = items.find((item) => item.id === 'organizationComplete')?.checked;
      if (deleteAllSelected) {
        diffMinutes += 1;
      }

      setMinutes(diffMinutes > 0 ? diffMinutes : 1);
    }
  }, [selectedOrg, items]);

  // Fetch data count when org is selected
  useEffect(() => {
    const fetchDataCount = async () => {
      if (!selectedOrgId) {
        setDataCount(null);
        return;
      }

      setLoadingDataCount(true);
      try {
        const response =
          await fluxServices.testOnlyCleanup.createTestOnlyCleanupOrganizationDataCount({
            organizationId: selectedOrgId,
          } as any);
        setDataCount(response);
      } catch (error) {
        console.error('Failed to fetch data count:', error);
        setDataCount(null);
      } finally {
        setLoadingDataCount(false);
      }
    };

    fetchDataCount();
  }, [selectedOrgId]);

  // Format creation date
  const formatCreationInfo = () => {
    if (!selectedOrg?.createdOn) return null;

    const createdDate = new Date(selectedOrg.createdOn);
    const now = new Date();
    const diffMs = now.getTime() - createdDate.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);

    const dateStr = createdDate.toLocaleDateString();
    const timeStr = createdDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return `Created: ${dateStr} at ${timeStr} (${diffMinutes} minutes ago)`;
  };

  const handleToggle = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleSelectAll = () => {
    setItems((prev) => prev.map((item) => ({ ...item, checked: true })));
  };

  const handleDeselectAll = () => {
    setItems((prev) => prev.map((item) => ({ ...item, checked: false })));
  };

  const handleMinutesChange = (delta: number) => {
    setMinutes((prev) => Math.max(1, prev + delta));
  };

  const handleDeleteSelected = async () => {
    const selectedItems = items.filter((item) => item.checked);

    if (selectedItems.length === 0) {
      showError('No items selected');
      return;
    }

    if (!selectedOrgId) {
      showError('Please select an organization');
      return;
    }

    const confirmed = await confirm({
      title: 'Delete Test Data',
      message: 'Use these tools to clean up test data. This action cannot be undone.',
      variant: 'danger',
      confirmText: 'Delete',
      cancelText: 'Cancel',
    });

    if (!confirmed) return;

    const loadingId = showInfo('Cleaning up test data...', { duration: null, persist: true });

    try {
      const results = await Promise.all(
        selectedItems.map(async (item) => {
          const service = fluxServices.testOnlyCleanup;
          const endpoint = cleanupEndpoints[item.endpoint];

          // Prepare payload with correct field names per API spec
          let payload: any;

          if (item.endpoint === 'registerRecords') {
            payload = {
              minutes,
              deleteAll: false,
            } as FluxTypes.CleanupRegisterRecordsDto;
          } else if (item.endpoint === 'organizationComplete') {
            payload = {
              minutes,
              organizationId: selectedOrgId,
              includeAllStatuses: true,
            } as FluxTypes.CleanupOrganizationCompleteDto;
          } else {
            // accountsMissingCodes, submissions, contacts, designees, supabaseUsers
            // These endpoints only accept organizationId (no minutes)
            payload = {
              organizationId: selectedOrgId,
            } as FluxTypes.CleanupOrganizationDto;
          }

          const response = await (service[endpoint] as any)(payload);
          return response?.deleted || 0;
        })
      );

      // Dismiss loading notification
      const { dismissNotification } = await import('@asyml8/ui');
      dismissNotification(loadingId);

      // Sum up total deleted records
      const totalDeleted = results.reduce((sum, count) => sum + count, 0);

      showSuccess(
        `Successfully deleted ${totalDeleted} record(s) from ${selectedItems.length} operation(s)`
      );
      setSelectedOrgId('');
      onClose();
    } catch (err) {
      const { dismissNotification } = await import('@asyml8/ui');
      dismissNotification(loadingId);
      showError(err instanceof Error ? err.message : 'Cleanup failed');
    }
  };

  return (
    <FeatureDrawer
      open={open}
      onClose={onClose}
      title={t('tools.cleanup.title')}
      subtitle={t('tools.cleanup.subtitle')}
      icon={ICONS.SETTINGS_DUOTONE as any}
      iconSize={48}
      width={480}
      footer={
        <Stack direction="row" spacing={1} justifyContent="space-between" sx={{ width: '100%' }}>
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="outlined"
              onClick={handleSelectAll}
              disabled={!selectedOrgId}
            >
              Select All
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={handleDeselectAll}
              disabled={!selectedOrgId}
            >
              Deselect All
            </Button>
          </Stack>

          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteSelected}
            startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
            disabled={!selectedOrgId || !items.some((item) => item.checked)}
          >
            Delete
          </Button>
        </Stack>
      }
    >
      <Stack spacing={3}>
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Organization
          </Typography>
          <Autocomplete
            fullWidth
            size="small"
            options={sortedOrganizations}
            value={selectedOrg || null}
            onChange={(_, newValue) => {
              setSelectedOrgId(newValue?.id || '');
            }}
            getOptionLabel={(option) =>
              `${option.name}${option.acronym ? ` (${option.acronym})` : ''}`
            }
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
              },
            }}
            renderOption={(props, option) => {
              const createdDateTime = option.createdOn
                ? `${new Date(option.createdOn).toLocaleDateString()} ${new Date(option.createdOn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                : '';
              return (
                <Box
                  component="li"
                  {...props}
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <Iconify
                    icon={getOrgTypeIcon(option.categoryCode) as any}
                    sx={{ color: 'primary.main', flexShrink: 0 }}
                  />
                  <Box sx={{ width: '100%' }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {option.name}
                      {option.acronym ? ` (${option.acronym})` : ''}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontStyle: 'italic' }}
                    >
                      Created: {createdDateTime}
                    </Typography>
                  </Box>
                </Box>
              );
            }}
            renderInput={(params) => {
              const createdDateTime = selectedOrg?.createdOn
                ? `${new Date(selectedOrg.createdOn).toLocaleDateString()} ${new Date(selectedOrg.createdOn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                : '';

              return (
                <TextField
                  {...params}
                  placeholder="Select an organization"
                  InputProps={{
                    ...params.InputProps,
                    sx: { pl: selectedOrg ? 1.5 : undefined },
                    startAdornment: selectedOrg ? (
                      <>
                        <Iconify
                          icon={getOrgTypeIcon(selectedOrg.categoryCode) as any}
                          sx={{ mr: 1, color: 'primary.main' }}
                        />
                        <Box sx={{ display: 'flex', flexDirection: 'column', mr: 1 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              maxWidth: '300px',
                            }}
                          >
                            {selectedOrg.name}
                            {selectedOrg.acronym ? ` (${selectedOrg.acronym})` : ''}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontStyle: 'italic' }}
                          >
                            Created: {createdDateTime}
                          </Typography>
                        </Box>
                        {params.InputProps.startAdornment}
                      </>
                    ) : (
                      params.InputProps.startAdornment
                    ),
                  }}
                  inputProps={{
                    ...params.inputProps,
                    style: {
                      ...params.inputProps.style,
                      width: selectedOrg ? 0 : undefined,
                      padding: selectedOrg ? 0 : undefined,
                      opacity: selectedOrg ? 0 : undefined,
                    },
                  }}
                />
              );
            }}
            getOptionDisabled={(option) => option.id === currentOrgId}
            ListboxProps={{
              style: { maxHeight: '400px' },
            }}
          />
        </Box>

        {selectedOrgId && (
          <Stack spacing={1.5}>
            {items.map((item) => (
              <Box key={item.id}>
                <FormControlLabel
                  control={
                    <Checkbox checked={item.checked} onChange={() => handleToggle(item.id)} />
                  }
                  label={
                    <Box>
                      <Typography variant="subtitle2">{item.label}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.description}
                      </Typography>
                    </Box>
                  }
                  sx={{ alignItems: 'flex-start', m: 0 }}
                />
              </Box>
            ))}
          </Stack>
        )}

        {selectedOrgId && (
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Organization Data Count
            </Typography>
            <Box
              sx={{
                bgcolor: '#000',
                p: 2,
                borderRadius: 1,
                overflow: 'auto',
                maxHeight: 300,
              }}
            >
              {loadingDataCount ? (
                <Typography sx={{ color: '#fff', fontFamily: 'monospace' }}>Loading...</Typography>
              ) : dataCount ? (
                <ReactJson
                  src={dataCount}
                  theme="monokai"
                  collapsed={false}
                  displayDataTypes={false}
                  displayObjectSize={false}
                  enableClipboard={false}
                  style={{ backgroundColor: 'transparent', fontSize: '0.75rem' }}
                />
              ) : null}
            </Box>
          </Box>
        )}
      </Stack>
    </FeatureDrawer>
  );
}
