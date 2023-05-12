import { Provider } from '@nestjs/common';

import { isTypeProvider } from './is-type-provider.guard';

describe('guards::isTypeProvider', () => {
  it('Parameter 1 is *Type* provider', () => {
    const provider = class {};

    expect(isTypeProvider(provider)).toBeTruthy();
  });

  it('Parameter 1 is not *Type* provider', () => {
    const provider: Provider = {
      provide: 'TEST',
      useValue: 'test',
    };

    expect(isTypeProvider(provider)).toBeFalsy();
  });
});
