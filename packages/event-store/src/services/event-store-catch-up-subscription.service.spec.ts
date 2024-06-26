import { ResolvedEvent } from '@eventstore/db-client';
import { DiscoveryModule } from '@nestjs/core';
import { Injectable } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MetadataAccessor } from '@purrfect-tools/common';
import { EVENT_STORE_CLIENT } from '@purrfect-tools/event-store-client';

import { EventStoreClientMock } from '../../test/mock/event-store-client.mock';
import { EventStoreSubscriberMock } from '../../test/mock/event-store-subscriber.mock';
import { buildResolvedEventFixture } from '../../test/fixture/build-resolved-event.fixture';
import { CatchUpSubscription } from '../decorators';
import { EventStoreCatchUpSubscriptionDescriptor, EventStoreCatchUpSubscription } from '../types';
import { EventStoreCatchUpSubscriptionSubsystemExplorer } from './explorers/event-store-catch-up-subscription-subsystem.explorer';
import { EventStoreCatchUpSubscriptionService } from './event-store-catch-up-subscription.service';

@Injectable()
@CatchUpSubscription()
class TestServiceA implements EventStoreCatchUpSubscription {
  handleEvent = jest.fn();
}

const TEST_SERVICE_B_DESCRIPTOR: EventStoreCatchUpSubscriptionDescriptor = {
  stream: '$ce-test',
  configuration: {
    resolveLinkTos: true,
  },
  readableOptions: {
    emitClose: true,
  },
};

@Injectable()
@CatchUpSubscription(TEST_SERVICE_B_DESCRIPTOR)
class TestServiceB implements EventStoreCatchUpSubscription {
  handleEvent = jest.fn();
}

describe('services::EventStoreCatchUpSubscriptionService', () => {
  let eventStoreClientMock: EventStoreClientMock;

  let testServiceA: TestServiceA;
  let testServiceB: TestServiceB;

  let moduleRef: TestingModule;

  beforeEach(async () => {
    eventStoreClientMock = new EventStoreClientMock();

    moduleRef = await Test.createTestingModule({
      imports: [DiscoveryModule],
      providers: [
        { provide: EVENT_STORE_CLIENT, useValue: eventStoreClientMock },
        MetadataAccessor,
        EventStoreCatchUpSubscriptionSubsystemExplorer,
        EventStoreCatchUpSubscriptionService,
        TestServiceA,
        TestServiceB,
      ],
    }).compile();

    testServiceA = moduleRef.get(TestServiceA);
    testServiceB = moduleRef.get(TestServiceB);
  });

  it('EventStoreCatchUpSubscriptionService::onApplicationBootstrap() loads all catch-up subscription services', async () => {
    const {
      stream: bStream,
      configuration: bConfiguration,
      readableOptions: bReadableOptions,
    } = TEST_SERVICE_B_DESCRIPTOR;

    await moduleRef.init();

    const subscriberA: EventStoreSubscriberMock = eventStoreClientMock.subscribeToAll.mock.results[0].value;
    const subscriberB: EventStoreSubscriberMock = eventStoreClientMock.subscribeToStream.mock.results[0].value;

    expect(eventStoreClientMock.subscribeToAll).toHaveBeenCalledTimes(1);
    expect(eventStoreClientMock.subscribeToAll).toHaveBeenCalledWith(undefined, undefined);

    expect(eventStoreClientMock.subscribeToStream).toHaveBeenCalledTimes(1);
    expect(eventStoreClientMock.subscribeToStream).toHaveBeenCalledWith(bStream, bConfiguration, bReadableOptions);

    expect(subscriberA.on).toHaveBeenCalledTimes(1);
    expect(subscriberB.on).toHaveBeenCalledTimes(1);
  });

  it('EventStoreCatchUpSubscriptionService::subscriptions handlers are called', async () => {
    await moduleRef.init();

    const subscriberA: EventStoreSubscriberMock = eventStoreClientMock.subscribeToAll.mock.results[0].value;
    const handlerA = subscriberA.on.mock.calls[0][1];

    const subscriberB: EventStoreSubscriberMock = eventStoreClientMock.subscribeToStream.mock.results[0].value;
    const handlerB = subscriberB.on.mock.calls[0][1];

    const aInput: ResolvedEvent = buildResolvedEventFixture('test_stream', 'testA');
    const bInput: ResolvedEvent = buildResolvedEventFixture('test_stream', 'testB');
    handlerA(aInput);
    handlerB(bInput);

    expect(testServiceA.handleEvent).toHaveBeenCalledTimes(1);
    expect(testServiceA.handleEvent).toHaveBeenCalledWith(aInput);

    expect(testServiceB.handleEvent).toHaveBeenCalledTimes(1);
    expect(testServiceB.handleEvent).toHaveBeenCalledWith(bInput);
  });

  // TODO: On subscription handler error
});
