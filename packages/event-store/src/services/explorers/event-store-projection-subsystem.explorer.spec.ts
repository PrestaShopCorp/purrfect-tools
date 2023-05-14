import { DiscoveryModule } from '@nestjs/core';
import { Injectable } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { MetadataAccessor } from '@purrfect-tools/common';

import { Projection } from '../../decorators';
import { EventStoreProjection } from '../../types';
import { EventStoreProjectionSubsystemExplorer } from './event-store-projection-subsystem.explorer';

@Injectable()
@Projection()
class TestServiceA implements EventStoreProjection {
  getQuery(): string {
    return '';
  }
}

@Injectable()
@Projection()
class TestServiceB implements EventStoreProjection {
  getQuery(): string {
    return '';
  }
}

@Injectable()
@Projection()
class TestServiceC {}

describe('services::explorers::EventStoreProjectionSubsystemExplorer', () => {
  let subsystemExplorer: EventStoreProjectionSubsystemExplorer;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [DiscoveryModule],
      providers: [MetadataAccessor, EventStoreProjectionSubsystemExplorer, TestServiceA, TestServiceB, TestServiceC],
    }).compile();

    await moduleRef.init();

    subsystemExplorer = moduleRef.get(EventStoreProjectionSubsystemExplorer);
  });

  it('EventStoreProjectionSubsystemExplorer::projections includes all the projection services that implements EventStoreProjection interface', () => {
    const projections = subsystemExplorer.projections;

    const { instance: testProjectionA, metadata: testMetadataA } = projections.find(
      ({ instance }) => instance instanceof TestServiceA,
    );
    const { instance: testProjectionB, metadata: testMetadataB } = projections.find(
      ({ instance }) => instance instanceof TestServiceB,
    );

    expect(projections).toHaveLength(2);

    expect(testProjectionA).toBeInstanceOf(TestServiceA);
    expect(testMetadataA).toMatchObject({});
    expect(testProjectionB).toBeInstanceOf(TestServiceB);
    expect(testMetadataB).toMatchObject({});
  });

  it('EventStoreProjectionSubsystemExplorer::projections filters wrongly implemented services', () => {
    const projections = subsystemExplorer.projections;

    const metadataWrapper = projections.find(({ instance }) => instance instanceof TestServiceC);
    expect(metadataWrapper).toBeUndefined();
  });
});
