'use client';

import type { Theme, SxProps } from '@mui/material/styles';
import type { BreadcrumbsProps } from '@mui/material/Breadcrumbs';
import type { MoreLinksProps } from './more-links';
import type { BreadcrumbsLinkProps } from './breadcrumb-link';
import type { IconifyName } from '../iconify';

import Breadcrumbs from '@mui/material/Breadcrumbs';

import { BackLink } from './back-link';
import { MoreLinks } from './more-links';
import { BreadcrumbsLink } from './breadcrumb-link';
import {
  BreadcrumbsRoot,
  BreadcrumbsHeading,
  BreadcrumbsContent,
  BreadcrumbsContainer,
  BreadcrumbsSubHeader,
} from './styles';

// ----------------------------------------------------------------------

export type CustomBreadcrumbsSlotProps = {
  breadcrumbs: BreadcrumbsProps;
  moreLinks: Omit<MoreLinksProps, 'links'>;
  heading: React.ComponentProps<typeof BreadcrumbsHeading>;
  subHeader: React.ComponentProps<typeof BreadcrumbsSubHeader>;
  content: React.ComponentProps<typeof BreadcrumbsContent>;
  container: React.ComponentProps<typeof BreadcrumbsContainer>;
};

export type CustomBreadcrumbsSlots = {
  breadcrumbs?: React.ReactNode;
};

export type CustomBreadcrumbsProps = React.ComponentProps<'div'> & {
  sx?: SxProps<Theme>;
  heading?: string;
  subHeading?: string;
  subHeader?: string;
  activeLast?: boolean;
  backHref?: string;
  backIcon?: IconifyName;
  hideBreadcrumbsOnBack?: boolean;
  action?: React.ReactNode;
  links?: BreadcrumbsLinkProps[];
  moreLinks?: MoreLinksProps['links'];
  separator?: string;
  slots?: CustomBreadcrumbsSlots;
  slotProps?: Partial<CustomBreadcrumbsSlotProps>;
};

export function CustomBreadcrumbs({
  sx,
  action,
  backHref,
  backIcon = 'eva:chevron-left-outline',
  heading,
  subHeading,
  subHeader,
  hideBreadcrumbsOnBack = true,
  slots = {},
  links = [],
  moreLinks = [],
  slotProps = {},
  activeLast = false,
  separator = '/',
  ...other
}: CustomBreadcrumbsProps) {
  const lastLink = links[links.length - 1]?.name;

  const renderHeading = () => (
    <BreadcrumbsHeading {...slotProps?.heading}>
      {backHref ? <BackLink href={backHref} label={heading} icon={backIcon} /> : heading}
    </BreadcrumbsHeading>
  );

  const renderSubHeader = () => (
    <BreadcrumbsSubHeader {...slotProps?.subHeader}>
      {subHeader}
    </BreadcrumbsSubHeader>
  ); 

  const renderLinks = () =>
    slots?.breadcrumbs ?? (
      <Breadcrumbs
        separator={separator}
        sx={{ mt: 1 }}
        {...slotProps?.breadcrumbs}
      >
        {links.map((link, index) => (
          <BreadcrumbsLink
            key={link.name ?? index}
            icon={link.icon}
            href={link.href}
            name={link.name}
            disabled={link.name === lastLink && !activeLast}
          />
        ))}
      </Breadcrumbs>
    );

  const renderMoreLinks = () => <MoreLinks links={moreLinks} {...slotProps?.moreLinks} />;

  // Determine if breadcrumbs should be shown
  const shouldShowBreadcrumbs = () => {
    // If backHref exists and hideBreadcrumbsOnBack is true, hide breadcrumbs
    if (backHref && hideBreadcrumbsOnBack) {
      return false;
    }
    // Otherwise, show breadcrumbs if there are links or slots
    return !!links.length || slots?.breadcrumbs;
  };

  return (
    <BreadcrumbsRoot sx={sx} {...other}>
      <BreadcrumbsContainer {...slotProps?.container}>
        <BreadcrumbsContent {...slotProps?.content}>
          {(heading || backHref) && renderHeading()}
          {subHeader && renderSubHeader()}
          {shouldShowBreadcrumbs() && renderLinks()}
        </BreadcrumbsContent>
        {action}
      </BreadcrumbsContainer>

      {!!moreLinks?.length && renderMoreLinks()}
    </BreadcrumbsRoot>
  );
}
