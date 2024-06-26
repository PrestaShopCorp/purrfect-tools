import { PARK } from '@eventstore/db-client';
import { DiscoveryModule } from '@nestjs/core';
import { Injectable } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MetadataAccessor, sanitizeClassName } from '@purrfect-tools/common';
import { EVENT_STORE_CLIENT } from '@purrfect-tools/event-store-client';

import {
  DEFAULT_PERSISTENT_SUBSCRIPTION_TO_ALL_CONFIG,
  DEFAULT_PERSISTENT_SUBSCRIPTION_TO_STREAM_CONFIG,
} from '../config/default-persistent-subscription.config';
import { EventStoreClientMock } from '../../test/mock/event-store-client.mock';
import { EventStoreSubscriberMock } from '../../test/mock/event-store-subscriber.mock';
import { buildAcknowledgeableEventFixture } from '../../test/fixture/build-acknowledgeable-event.fixture';
import { PersistentSubscription } from '../decorators';
import {
  EventStorePersistentSubscriptionDescriptor,
  EventStorePersistentSubscription,
  AcknowledgeableEvent,
} from '../types';
import { EventStorePersistentSubscriptionSubsystemExplorer } from './explorers/event-store-persistent-subscription-subsystem.explorer';
import { EventStorePersistentSubscriptionService } from './event-store-persistent-subscription.service';

@Injectable()
@PersistentSubscription()
class TestServiceA implements EventStorePersistentSubscription {
  handleEvent = jest.fn().mockImplementation((evt: AcknowledgeableEvent) => evt.ack());
}

const TEST_SERVICE_B_DESCRIPTOR: EventStorePersistentSubscriptionDescriptor = {
  group: 'my-group',
  stream: '$ce-test',
  configuration: {
    resolveLinkTos: true,
  },
  options: {},
};
const TEST_SERVICE_B_NACK_REASON = 'reason';

@Injectable()
@PersistentSubscription(TEST_SERVICE_B_DESCRIPTOR)
class TestServiceB implements EventStorePersistentSubscription {
  handleEvent = jest.fn().mockImplementation((evt: AcknowledgeableEvent) => evt.nack(PARK, TEST_SERVICE_B_NACK_REASON));
}

describe('services::EventStorePersistentSubscriptionService', () => {
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
        EventStorePersistentSubscriptionSubsystemExplorer,
        EventStorePersistentSubscriptionService,
        TestServiceA,
        TestServiceB,
      ],
    }).compile();

    testServiceA = moduleRef.get(TestServiceA);
    testServiceB = moduleRef.get(TestServiceB);
  });

  it('EventStorePersistentSubscriptionService::onApplicationBootstrap() loads all persistent subscription services', async () => {
    const aGroup = sanitizeClassName(TestServiceA);
    const {
      group: bGroup,
      stream: bStream,
      configuration: bConfiguration,
      options: bOptions,
    } = TEST_SERVICE_B_DESCRIPTOR;

    const {
      createPersistentSubscriptionToAll,
      createPersistentSubscriptionToStream,
      getPersistentSubscriptionToAllInfo,
      getPersistentSubscriptionToStreamInfo,
      subscribeToPersistentSubscriptionToAll,
      subscribeToPersistentSubscriptionToStream,
    } = eventStoreClientMock;

    await moduleRef.init();

    const subscriberA: EventStoreSubscriberMock = subscribeToPersistentSubscriptionToAll.mock.results[0].value;
    const subscriberB: EventStoreSubscriberMock = subscribeToPersistentSubscriptionToStream.mock.results[0].value;

    expect(getPersistentSubscriptionToAllInfo).toHaveBeenCalledTimes(1);
    expect(getPersistentSubscriptionToAllInfo).toHaveBeenCalledWith(aGroup);

    expect(createPersistentSubscriptionToAll).toHaveBeenCalledTimes(1);
    expect(createPersistentSubscriptionToAll).toHaveBeenCalledWith(
      aGroup,
      { ...DEFAULT_PERSISTENT_SUBSCRIPTION_TO_ALL_CONFIG },
      undefined,
    );

    expect(subscribeToPersistentSubscriptionToAll).toHaveBeenCalledTimes(1);
    expect(subscriberA.on).toHaveBeenCalledTimes(1);

    expect(getPersistentSubscriptionToStreamInfo).toHaveBeenCalledTimes(1);
    expect(getPersistentSubscriptionToStreamInfo).toHaveBeenCalledWith(bStream, bGroup);

    expect(createPersistentSubscriptionToStream).toHaveBeenCalledTimes(1);
    expect(createPersistentSubscriptionToStream).toHaveBeenCalledWith(
      bStream,
      bGroup,
      {
        ...DEFAULT_PERSISTENT_SUBSCRIPTION_TO_STREAM_CONFIG,
        ...bConfiguration,
      },
      bOptions,
    );

    expect(subscribeToPersistentSubscriptionToStream).toHaveBeenCalledTimes(1);
    expect(subscriberB.on).toHaveBeenCalledTimes(1);
  });

  it('EventStorePersistentSubscriptionService::onApplicationBootstrap() modifies existing persistent subscription services', async () => {
    const aGroup = sanitizeClassName(TestServiceA);
    const { group: bGroup, stream: bStream } = TEST_SERVICE_B_DESCRIPTOR;

    eventStoreClientMock.getPersistentSubscriptionToAllInfo.mockResolvedValue(true);
    eventStoreClientMock.getPersistentSubscriptionToStreamInfo.mockResolvedValue(true);

    await moduleRef.init();

    const {
      createPersistentSubscriptionToAll,
      createPersistentSubscriptionToStream,
      getPersistentSubscriptionToAllInfo,
      getPersistentSubscriptionToStreamInfo,
      subscribeToPersistentSubscriptionToAll,
      subscribeToPersistentSubscriptionToStream,
    } = eventStoreClientMock;

    const subscriberA: EventStoreSubscriberMock = subscribeToPersistentSubscriptionToAll.mock.results[0].value;
    const subscriberB: EventStoreSubscriberMock = subscribeToPersistentSubscriptionToStream.mock.results[0].value;

    expect(getPersistentSubscriptionToAllInfo).toHaveBeenCalledTimes(1);
    expect(getPersistentSubscriptionToAllInfo).toHaveBeenCalledWith(aGroup);

    expect(getPersistentSubscriptionToStreamInfo).toHaveBeenCalledTimes(1);
    expect(getPersistentSubscriptionToStreamInfo).toHaveBeenCalledWith(bStream, bGroup);

    expect(createPersistentSubscriptionToAll).toHaveBeenCalledTimes(0);
    expect(createPersistentSubscriptionToStream).toHaveBeenCalledTimes(0);

    expect(subscribeToPersistentSubscriptionToAll).toHaveBeenCalledTimes(1);
    expect(subscribeToPersistentSubscriptionToStream).toHaveBeenCalledTimes(1);

    expect(subscriberA.on).toHaveBeenCalledTimes(1);
    expect(subscriberB.on).toHaveBeenCalledTimes(1);
  });

  it('EventStorePersistentSubscriptionService::onApplicationBootstrap() handlers are called', async () => {
    const {
      subscribeToPersistentSubscriptionToAll: subscribeToPSToAll,
      subscribeToPersistentSubscriptionToStream: subscribeToPSToStream,
    } = eventStoreClientMock;

    await moduleRef.init();

    const pSubscriberA: EventStoreSubscriberMock = subscribeToPSToAll.mock.results[0].value;
    const pHandlerA = pSubscriberA.on.mock.calls[0][1];

    const pSubscriberB: EventStoreSubscriberMock = subscribeToPSToStream.mock.results[0].value;
    const pHandlerB = pSubscriberB.on.mock.calls[0][1];

    const aInput: AcknowledgeableEvent = buildAcknowledgeableEventFixture('test_stream', 'testA');
    const bInput: AcknowledgeableEvent = buildAcknowledgeableEventFixture('test_stream', 'testB');

    pHandlerA(aInput);
    pHandlerB(bInput);

    const { ack: _aArgAck, nack: _aArgNack, ...aArgEvent } = testServiceA.handleEvent.mock.calls[0][0];
    const { ack: _aAck, nack: _aNack, ...aEvent } = aInput;

    const { ack: _bArgAck, nack: _bArgNack, ...bArgEvent } = testServiceB.handleEvent.mock.calls[0][0];
    const { ack: _bAck, nack: _bNack, ...bEvent } = bInput;

    expect(testServiceA.handleEvent).toHaveBeenCalledTimes(1);
    expect(aArgEvent).toEqual(aEvent);
    expect(pSubscriberA.ack).toHaveBeenCalledTimes(1);
    expect(pSubscriberA.nack).toHaveBeenCalledTimes(0);

    expect(testServiceB.handleEvent).toHaveBeenCalledTimes(1);
    expect(bArgEvent).toEqual(bEvent);
    expect(pSubscriberB.nack).toHaveBeenCalledTimes(1);
    expect(pSubscriberB.nack).toHaveBeenCalledWith(PARK, TEST_SERVICE_B_NACK_REASON, bInput);
    expect(pSubscriberB.ack).toHaveBeenCalledTimes(0);
  });

  // TODO: On subscription handler error
});
