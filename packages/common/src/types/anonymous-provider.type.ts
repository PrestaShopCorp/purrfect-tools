import { Provider, Type } from '@nestjs/common';

import { DistributiveOmit } from './helpers/distributive-omit.type';

export type AnonymousProvider<T> = Type<T> | DistributiveOmit<Exclude<Provider<T>, Type<T>>, 'provide'>;
