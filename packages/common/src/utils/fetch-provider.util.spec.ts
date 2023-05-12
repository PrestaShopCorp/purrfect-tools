import { Provider } from '@nestjs/common';

import { fetchProvider } from './fetch-provider.util';

describe('utils::fetchProvider', () => {
  it('Parameter 1 is *Type* provider', () => {
    const provider = class {};

    expect(fetchProvider(provider)).toStrictEqual({
      useClass: provider,
    });
  });

  it('Parameter 1 is not *Type* provider', () => {
    const provider: Provider = {
      provide: 'TEST',
      useValue: 'test',
    };

    expect(fetchProvider(provider)).toStrictEqual(provider);
  });
});
