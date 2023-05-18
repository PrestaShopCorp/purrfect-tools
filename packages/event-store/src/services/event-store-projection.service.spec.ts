import { DiscoveryModule } from '@nestjs/core';
import { Injectable } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MetadataAccessor, sanitizeClassName } from '@purrfect-tools/common';
import { EVENT_STORE_CLIENT } from '@purrfect-tools/event-store-client';

import { EventStoreClientMock } from '../../test/mock/event-store-client.mock';
import { Projection } from '../decorators';
import { EventStoreProjection, EventStoreProjectionDescriptor } from '../types';
import { EventStoreProjectionSubsystemExplorer } from './explorers/event-store-projection-subsystem.explorer';
import { EventStoreProjectionService } from './event-store-projection.service';

@Injectable()
@Projection()
class TestServiceA implements EventStoreProjection {
  getQuery(): string {
    return 'TEST_PROJECTION_A';
  }
}

const TEST_SERVICE_B_DESCRIPTOR: EventStoreProjectionDescriptor = {
  name: 'MY_NAME',
  configuration: {
    emitEnabled: true,
  },
};

@Injectable()
@Projection(TEST_SERVICE_B_DESCRIPTOR)
class TestServiceB implements EventStoreProjection {
  getQuery(): string {
    return 'TEST_PROJECTION_B';
  }
}

describe('services::EventStoreProjectionService', () => {
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
        EventStoreProjectionSubsystemExplorer,
        EventStoreProjectionService,
        TestServiceA,
        TestServiceB,
      ],
    }).compile();

    testServiceA = moduleRef.get(TestServiceA);
    testServiceB = moduleRef.get(TestServiceB);
  });

  it('EventStoreProjectionService::onApplicationBootstrap() loads all projection services', async () => {
    const aName = sanitizeClassName(TestServiceA);
    const { name: bName, configuration: bConfiguration } = TEST_SERVICE_B_DESCRIPTOR;
    const aQuery = testServiceA.getQuery();
    const bQuery = testServiceB.getQuery();

    await moduleRef.init();

    expect(eventStoreClientMock.getProjectionStatus).toHaveBeenCalledTimes(2);
    expect(eventStoreClientMock.getProjectionStatus).toHaveBeenNthCalledWith(1, aName);
    expect(eventStoreClientMock.getProjectionStatus).toHaveBeenNthCalledWith(2, bName);

    expect(eventStoreClientMock.createProjection).toHaveBeenCalledTimes(2);
    expect(eventStoreClientMock.createProjection).toHaveBeenNthCalledWith(1, aName, '', undefined);
    expect(eventStoreClientMock.createProjection).toHaveBeenNthCalledWith(2, bName, '', bConfiguration);

    expect(eventStoreClientMock.updateProjection).toHaveBeenCalledTimes(2);
    expect(eventStoreClientMock.updateProjection).toHaveBeenNthCalledWith(1, aName, aQuery, undefined);
    expect(eventStoreClientMock.updateProjection).toHaveBeenNthCalledWith(2, bName, bQuery, bConfiguration);
  });

  it('EventStoreProjectionService::onApplicationBootstrap() updates existing projection', async () => {
    const aName = sanitizeClassName(TestServiceA);
    const { name: bName, configuration: bConfiguration } = TEST_SERVICE_B_DESCRIPTOR;
    const aQuery = testServiceA.getQuery();
    const bQuery = testServiceB.getQuery();

    eventStoreClientMock.getProjectionStatus.mockImplementation((name) =>
      name === bName ? Promise.resolve(true) : Promise.reject(false),
    );

    await moduleRef.init();

    expect(eventStoreClientMock.getProjectionStatus).toHaveBeenCalledTimes(2);
    expect(eventStoreClientMock.getProjectionStatus).toHaveBeenNthCalledWith(1, aName);
    expect(eventStoreClientMock.getProjectionStatus).toHaveBeenNthCalledWith(2, bName);

    expect(eventStoreClientMock.createProjection).toHaveBeenCalledTimes(1);
    expect(eventStoreClientMock.createProjection).toHaveBeenNthCalledWith(1, aName, '', undefined);

    expect(eventStoreClientMock.updateProjection).toHaveBeenCalledTimes(2);
    expect(eventStoreClientMock.updateProjection).toHaveBeenNthCalledWith(1, aName, aQuery, undefined);
    expect(eventStoreClientMock.updateProjection).toHaveBeenNthCalledWith(2, bName, bQuery, bConfiguration);
  });
});
