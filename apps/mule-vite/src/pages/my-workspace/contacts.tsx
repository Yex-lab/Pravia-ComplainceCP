import { CONFIG } from 'src/global-config';

import { ContactsListView } from 'src/sections/my-workspace';

const metadata = { title: `Contacts | My Workspace - ${CONFIG.appName}` };

export default function ContactsPage() {
  return (
    <>
      <title>{metadata.title}</title>
      <ContactsListView />
    </>
  );
}
