import { ResolvedEvent } from '@eventstore/db-client';
import { DiscoveryModule } from '@nestjs/core';
import { Injectable } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { MetadataAccessor } from '@purrfect-tools/common';

import { CatchUpSubscription } from '../../decorators';
import { EventStoreCatchUpSubscriptionSubsystemExplorer } from './event-store-catch-up-subscription-subsystem.explorer';
import { EventStoreCatchUpSubscription } from '../../types';

@Injectable()
@CatchUpSubscription()
class TestServiceA implements EventStoreCatchUpSubscription {
  handleEvent(resolvedEvent: ResolvedEvent) {}
}

@Injectable()
@CatchUpSubscription()
class TestServiceB implements EventStoreCatchUpSubscription {
  handleEvent(resolvedEvent: ResolvedEvent) {}
}

@Injectable()
@CatchUpSubscription()
class TestServiceC {}

describe('services::explorers::EventStoreCatchUpSubscriptionSubsystemExplorer', () => {
  let subsystemExplorer: EventStoreCatchUpSubscriptionSubsystemExplorer;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [DiscoveryModule],
      providers: [
        MetadataAccessor,
        EventStoreCatchUpSubscriptionSubsystemExplorer,
        TestServiceA,
        TestServiceB,
        TestServiceC,
      ],
    }).compile();

    await moduleRef.init();

    subsystemExplorer = moduleRef.get(EventStoreCatchUpSubscriptionSubsystemExplorer);
  });

  it('EventStoreCatchUpSubscriptionSubsystemExplorer::catchUpSubscriptions includes all the catch up subscriptions services', () => {
    const catchUpSubscriptions = subsystemExplorer.catchUpSubscriptions;

    const { instance: testCatchUpSubscriptionA, metadata: testMetadataA } = catchUpSubscriptions.find(
      ({ instance }) => instance instanceof TestServiceA,
    );
    const { instance: testCatchUpSubscriptionB, metadata: testMetadataB } = catchUpSubscriptions.find(
      ({ instance }) => instance instanceof TestServiceB,
    );

    expect(catchUpSubscriptions).toHaveLength(2);

    expect(testCatchUpSubscriptionA).toBeInstanceOf(TestServiceA);
    expect(testMetadataA).toMatchObject({});
    expect(testCatchUpSubscriptionB).toBeInstanceOf(TestServiceB);
    expect(testMetadataB).toMatchObject({});
  });

  it('EventStoreProjectionSubsystemExplorer::catchUpSubscriptions filters wrongly implemented services', () => {
    const projections = subsystemExplorer.catchUpSubscriptions;

    const metadataWrapper = projections.find(({ instance }) => instance instanceof TestServiceC);
    expect(metadataWrapper).toBeUndefined();
  });
});
