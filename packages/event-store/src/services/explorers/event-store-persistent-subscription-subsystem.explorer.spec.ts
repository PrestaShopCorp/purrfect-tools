import { DiscoveryModule } from '@nestjs/core';
import { Injectable } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { MetadataAccessor } from '@purrfect-tools/common';

import { PersistentSubscription } from '../../decorators';
import { AcknowledgeableEvent, EventStorePersistentSubscription } from '../../types';
import { EventStorePersistentSubscriptionSubsystemExplorer } from './event-store-persistent-subscription-subsystem.explorer';

@Injectable()
@PersistentSubscription()
class TestServiceA implements EventStorePersistentSubscription {
  handleEvent(event: AcknowledgeableEvent) {}
}

@Injectable()
@PersistentSubscription()
class TestServiceB implements EventStorePersistentSubscription {
  handleEvent(event: AcknowledgeableEvent) {}
}

@Injectable()
@PersistentSubscription()
class TestServiceC {}

describe('services::explorers::EventStorePersistentSubscriptionSubsystemExplorer', () => {
  let subsystemExplorer: EventStorePersistentSubscriptionSubsystemExplorer;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [DiscoveryModule],
      providers: [
        MetadataAccessor,
        EventStorePersistentSubscriptionSubsystemExplorer,
        TestServiceA,
        TestServiceB,
        TestServiceC,
      ],
    }).compile();

    await moduleRef.init();

    subsystemExplorer = moduleRef.get(EventStorePersistentSubscriptionSubsystemExplorer);
  });

  it('EventStorePersistentSubscriptionSubsystemExplorer::persistentSubscriptions includes all the persistent subscriptions services', () => {
    const persistentSubscriptions = subsystemExplorer.persistentSubscriptions;

    const { instance: testPersistentSubscriptionA, metadata: testMetadataA } = persistentSubscriptions.find(
      ({ instance }) => instance instanceof TestServiceA,
    );
    const { instance: testPersistentSubscriptionB, metadata: testMetadataB } = persistentSubscriptions.find(
      ({ instance }) => instance instanceof TestServiceB,
    );

    expect(persistentSubscriptions).toHaveLength(2);

    expect(testPersistentSubscriptionA).toBeInstanceOf(TestServiceA);
    expect(testMetadataA).toMatchObject({});
    expect(testPersistentSubscriptionB).toBeInstanceOf(TestServiceB);
    expect(testMetadataB).toMatchObject({});
  });

  it('EventStoreProjectionSubsystemExplorer::persistentSubscriptions filters wrongly implemented services', () => {
    const projections = subsystemExplorer.persistentSubscriptions;

    const metadataWrapper = projections.find(({ instance }) => instance instanceof TestServiceC);
    expect(metadataWrapper).toBeUndefined();
  });
});
