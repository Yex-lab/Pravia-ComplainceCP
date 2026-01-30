'use client';

import React from 'react';
import { Box, Button } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { CustomBreadcrumbs } from '../../data-display/custom-breadcrumbs';
import type { BreadcrumbsLinkProps } from '../../data-display/custom-breadcrumbs/breadcrumb-link';
import type { IconifyName } from '../../data-display/iconify';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  backHref?: string;
  backIcon?: IconifyName;
  hideBreadcrumbsOnBack?: boolean;
  activeLast?: boolean;
  moreLinks?: string[];
  separator?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    variant?: 'contained' | 'outlined' | 'text';
    color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  };
  sx?: SxProps<Theme>;
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  backHref,
  backIcon = 'eva:chevron-left-outline',
  hideBreadcrumbsOnBack = true,
  activeLast = false,
  moreLinks,
  separator = '/',
  action,
  sx
}: PageHeaderProps) {
  // Transform BreadcrumbItem[] to BreadcrumbsLinkProps[]
  const breadcrumbLinks: BreadcrumbsLinkProps[] = breadcrumbs?.map(item => ({
    name: item.label,
    href: item.href,
    icon: item.icon,
  })) || [];

  return (
    <Box
      sx={[
        {
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          mb: { xs: 3, md: 5 }
        },
        ...(Array.isArray(sx) ? sx : [sx])
      ]}
    >
      <CustomBreadcrumbs
        heading={title}
        subHeader={description}
        links={breadcrumbLinks}
        backHref={backHref}
        backIcon={backIcon}
        hideBreadcrumbsOnBack={hideBreadcrumbsOnBack}
        activeLast={activeLast}
        moreLinks={moreLinks}
        separator={separator}
      />

      {action && (
        <Button
          variant={action.variant || 'contained'}
          color={action.color || 'inherit'}
          startIcon={action.icon}
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </Box>
  );
}
