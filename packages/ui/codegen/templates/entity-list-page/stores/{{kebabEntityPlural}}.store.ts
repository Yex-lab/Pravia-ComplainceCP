import { createAppQueryStore, defaultQueryConfig } from '@asyml8/ui';
import { {{name}}Service } from 'src/services/{{kebabName}}.service';

export const {{entityPlural}}Store = createAppQueryStore(['{{entityPlural}}']);

export const {{entityPlural}}QueryConfig = {
  queryFn: () => {{name}}Service.list{{entityPlural}}(),
  ...defaultQueryConfig,
};
