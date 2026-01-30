import { createAppQueryStore, defaultQueryConfig } from '@asyml8/ui';
import { {{name}}Service } from 'src/services/{{name}}.service';

export const {{name}}Store = createAppQueryStore(['{{name}}s']);

export const {{name}}QueryConfig = {
  queryFn: () => {{name}}Service.list{{Name}}s(),
  ...defaultQueryConfig,
};
