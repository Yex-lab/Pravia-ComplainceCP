import { AnimatedLayout } from 'src/layouts/animated-layout';

import { RegisterOrganizationView } from 'src/sections/register';

export default function OrganizationPage() {
  return (
    <AnimatedLayout headerBgOpacity={0.1}>
      <RegisterOrganizationView />
    </AnimatedLayout>
  );
}
