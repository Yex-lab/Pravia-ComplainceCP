import { CONFIG } from 'src/global-config';

import { SubmissionListView } from 'src/sections/my-workspace';

const metadata = { title: `Submissions | My Workspace - ${CONFIG.appName}` };

export default function SubmissionsPage() {
  return (
    <>
      <title>{metadata.title}</title>
      <SubmissionListView />
    </>
  );
}
