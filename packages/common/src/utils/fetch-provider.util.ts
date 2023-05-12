import { AnonymousProvider, isTypeProvider } from '../types';

export function fetchProvider<T>(provider: AnonymousProvider<T>) {
  return isTypeProvider(provider) ? { useClass: provider } : provider;
}
