import { Test, TestingModule } from '@nestjs/testing';
import { EVENT_STORE_CLIENT } from '@purrfect-tools/event-store-client';

import { EventStoreClientMock } from '../test/mock/event-store-client.mock';
import { EventStoreModule } from './event-store.module';

describe('::EventStoreModule', () => {
  it('EventStoreModule::register() resolves all the dependency injection', async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        EventStoreModule.register({
          client: null,
        }),
      ],
    })
      .overrideProvider(EVENT_STORE_CLIENT)
      .useClass(EventStoreClientMock)
      .compile();

    expect(async () => {
      await moduleRef.init();
    }).not.toThrow();
  });

  it('EventStoreModule::registerAsync() resolves all the dependency injection', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        EventStoreModule.registerAsync({
          useValue: {
            client: null,
          },
        }),
      ],
    })
      .overrideProvider(EVENT_STORE_CLIENT)
      .useClass(EventStoreClientMock)
      .compile();

    expect(async () => {
      await moduleRef.init();
    }).not.toThrow();
  });
});
