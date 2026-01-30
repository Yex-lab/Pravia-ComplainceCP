import { CONFIG } from 'src/global-config';

import { OrganizationListView } from 'src/sections/my-workspace';

const metadata = { title: `Organization | My Workspace - ${CONFIG.appName}` };

export default function OrganizationPage() {
  return (
    <>
      <title>{metadata.title}</title>
      <OrganizationListView />
    </>
  );
}
