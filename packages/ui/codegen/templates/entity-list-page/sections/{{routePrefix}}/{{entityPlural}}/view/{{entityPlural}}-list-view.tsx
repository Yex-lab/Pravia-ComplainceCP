'use client';

import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  DataTable,
  Column,
  FilterTab,
  SearchConfig,
  PageHeader,
  ActionsCell,
  AvatarNameCell,
  DateCell,
  type ActionItem,
} from '@asyml8/ui';

import { useMutation } from '@tanstack/react-query';
import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from '@asyml8/ui';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'src/hooks/use-translation';
import { {{entityPlural}}Store, {{entityPlural}}QueryConfig } from 'src/stores/{{entityPlural}}.store';
import { {{name}}Service, type {{Name}}Data } from 'src/services/{{kebabName}}.service';

interface {{Name}} {
  id: string;
  name: string;
  // Add your entity fields here
  createdAt: string;
  updatedAt?: string;
}

const transform{{Name}} = (api{{Name}}: {{Name}}Data): {{Name}} => {
  return {
    id: api{{Name}}.id,
    name: api{{Name}}.name,
    createdAt: api{{Name}}.createdAt,
    updatedAt: api{{Name}}.updatedAt,
  };
};

export function {{Name}}ListView() {
  const { t } = useTranslation();
  const router = useRouter();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [{{name}}ToDelete, set{{Name}}ToDelete] = useState<{{Name}} | null>(null);

  const delete{{Name}}Mutation = useMutation({
    mutationFn: (id: string) => {{name}}Service.delete{{Name}}(id),
    onSuccess: () => {
      {{entityPlural}}Store.invalidate?.();
      setDeleteConfirmOpen(false);
      set{{Name}}ToDelete(null);
    },
  });

  const handleView{{Name}} = ({{name}}: {{Name}}) => {
    router.push(`{{routePrefix}}/{{entityPlural}}/${{{name}}.id}`);
  };

  const handleDelete{{Name}} = ({{name}}: {{Name}}) => {
    set{{Name}}ToDelete({{name}});
    setDeleteConfirmOpen(true);
  };

  const confirmDelete{{Name}} = () => {
    if ({{name}}ToDelete) {
      delete{{Name}}Mutation.mutate({{name}}ToDelete.id);
    }
  };

  const columns: Column<{{Name}}>[] = [
    {
      id: 'name',
      label: t('{{entityPlural}}.name'),
      sortable: true,
      minWidth: 120,
      maxWidth: 250,
      render: (_, {{name}}) => (
        <AvatarNameCell
          name={ {{name}}.name}
          onClick={() => handleView{{Name}}({{name}})}
        />
      ),
    },
    {
      id: 'createdAt',
      label: t('{{entityPlural}}.createdAt'),
      width: 120,
      sortable: true,
      render: (_, {{name}}) => <DateCell value={ {{name}}.createdAt} />,
    },
    {
      id: 'actions' as keyof {{Name}},
      label: '',
      width: 80,
      minWidth: 80,
      maxWidth: 80,
      render: (_, {{name}}) => {
        const actions: ActionItem[] = [
          {
            id: 'view',
            label: t('{{entityPlural}}.view'),
            icon: <Iconify icon="solar:eye-bold" />,
            onClick: () => handleView{{Name}}({{name}}),
          },
          {
            id: 'delete',
            label: t('{{entityPlural}}.delete'),
            icon: <Iconify icon="solar:trash-bin-trash-bold" />,
            onClick: () => handleDelete{{Name}}({{name}}),
            color: 'error',
          },
        ];

        return (
          <ActionsCell actions={actions} moreIcon={<Iconify icon="eva:more-vertical-fill" />} />
        );
      },
    },
  ];

  const filterTabs: FilterTab<{{Name}}>[] = [
    {
      id: 'all',
      label: t('{{entityPlural}}.all'),
      filter: (data) => data,
      color: 'primary',
    },
  ];

  const searchConfig: SearchConfig<{{Name}}> = {
    placeholder: t('dataTable.search'),
    searchFields: ['name'],
  };

  return (
    <DashboardContent>
      <PageHeader
        title={t('{{entityPlural}}.title')}
        description={t('{{entityPlural}}.description')}
        breadcrumbs={[
          { label: t('{{entityPlural}}.breadcrumb.admin') },
          { label: t('{{entityPlural}}.breadcrumb.{{entityPlural}}') },
        ]}
      />

      <DataTable
        store={{
          useQuery: () => {
            const query = {{entityPlural}}Store.useQuery({{entityPlural}}QueryConfig);
            return {
              ...query,
              data: Array.isArray(query.data) ? query.data.map(transform{{Name}}) : [],
            };
          },
        }}
        columns={columns}
        getRowId={({{name}}) => {{name}}.id}
        filterTabs={filterTabs}
        searchConfig={searchConfig}
        onRowClick={handleView{{Name}}}
        labels={{
          search: t('dataTable.search'),
          keyword: t('dataTable.keyword'),
          clear: t('dataTable.clear'),
          resultsFound: t('dataTable.resultsFound'),
          dense: t('dataTable.dense'),
          rowsPerPage: t('dataTable.rowsPerPage'),
        }}
      />

      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Delete {{Name}}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete { {{name}}ToDelete?.name}?
            <br />
            This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={confirmDelete{{Name}}}
            disabled={delete{{Name}}Mutation.isPending}
          >
            {delete{{Name}}Mutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}
