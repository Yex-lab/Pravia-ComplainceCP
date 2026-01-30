'use client';

import { ReactNode } from 'react';
import { PageHeader } from '../../components/surfaces/page-header';
import type { PageHeaderProps } from '../../components/surfaces/page-header';

export interface DefaultPageViewProps extends Omit<PageHeaderProps, 'children'> {
  children: ReactNode;
}

export function DefaultPageView({
  children,
  title,
  description,
  breadcrumbs,
  action,
}: DefaultPageViewProps) {
  return (
    <>
      <PageHeader
        title={title}
        description={description}
        breadcrumbs={breadcrumbs}
        action={action}
      />
      {children}
    </>
  );
}
