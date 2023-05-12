import { Type } from '@nestjs/common';

import { AnonymousProvider } from '../anonymous-provider.type';

export function isTypeProvider<T>(provider: AnonymousProvider<T>): provider is Type<T> {
  return typeof provider === 'function';
}
