import { CreateProjectionOptions, UpdateProjectionOptions } from '@eventstore/db-client';

export interface EventStoreProjectionDescriptor {
  name?: string;
  configuration?: CreateProjectionOptions | UpdateProjectionOptions;
}
