import { AnimatedLayout } from 'src/layouts/animated-layout';

import { RequestOrganizationAccessView } from 'src/sections/register';

export default function RequestOrganizationAccessPage() {
  return (
    <AnimatedLayout headerBgOpacity={0.1}>
      <RequestOrganizationAccessView />
    </AnimatedLayout>
  );
}
