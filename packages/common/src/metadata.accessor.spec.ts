import { DiscoveryModule, DiscoveryService } from '@nestjs/core';
import { Injectable, SetMetadata } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { MetadataAccessor } from './metadata.accessor';

const TEST_KEY = 'TEST_KEY';
const TEST_VALUE = 'value';

const TEST_OBJECT_KEY = 'TEST_OBJECT_KEY';
const TEST_OBJECT_VALUE = { test: 'value' };

@Injectable()
@SetMetadata(TEST_KEY, TEST_VALUE)
@SetMetadata(TEST_OBJECT_KEY, TEST_OBJECT_VALUE)
class TestService {}

describe('::MetadataAccessor', () => {
  let discoveryService: DiscoveryService;
  let metadataAccessor: MetadataAccessor;

  let testService: TestService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [DiscoveryModule],
      providers: [MetadataAccessor, TestService],
    }).compile();

    discoveryService = moduleRef.get(DiscoveryService);
    metadataAccessor = moduleRef.get(MetadataAccessor);

    testService = moduleRef.get(TestService);
  });

  it('MetadataAccessor::getClassMetadata() | Parameter 2 is TEST_KEY', () => {
    const providers = discoveryService.getProviders();

    const typeProviders = providers
      .map((instanceWrapper) => metadataAccessor.getClassMetadata<string>(instanceWrapper, TEST_KEY))
      .filter((item) => !!item);

    expect(typeProviders).toHaveLength(1);
    expect(typeProviders[0]).toBe(TEST_VALUE);
  });

  it('MetadataAccessor::getClassMetadata() | Parameter 2 is TEST_OBJECT_KEY', () => {
    const providers = discoveryService.getProviders();

    const typeProviders = providers
      .map((instanceWrapper) => metadataAccessor.getClassMetadata<object>(instanceWrapper, TEST_OBJECT_KEY))
      .filter((item) => !!item);

    expect(typeProviders).toHaveLength(1);
    expect(typeProviders[0]).toEqual(TEST_OBJECT_VALUE);
  });

  it('MetadataAccessor::filterByClassMetadata() | Parameter 2 is TEST_KEY', () => {
    const providers = metadataAccessor.filterByClassMetadata(discoveryService.getProviders(), TEST_KEY);
    expect(providers).toHaveLength(1);
  });

  it('MetadataAccessor::filterByClassMetadata() | Parameter 2 is TEST_OBJECT_KEY', () => {
    const providers = metadataAccessor.filterByClassMetadata(discoveryService.getProviders(), TEST_OBJECT_KEY);
    expect(providers).toHaveLength(1);
  });

  it('MetadataAccessor::mapToMetadataWrapper() | Parameter 2 is TEST_KEY', () => {
    const metadataWrapper = metadataAccessor.mapToMetadataWrapper<unknown, string>(
      discoveryService.getProviders(),
      TEST_KEY,
    );
    expect(metadataWrapper).toHaveLength(1);
    expect(metadataWrapper[0].metadata).toBe(TEST_VALUE);
  });

  it('MetadataAccessor::filterByClassMetadata() | Parameter 2 is TEST_OBJECT_KEY', () => {
    const metadataWrapper = metadataAccessor.mapToMetadataWrapper<unknown, object>(
      discoveryService.getProviders(),
      TEST_OBJECT_KEY,
    );
    expect(metadataWrapper).toHaveLength(1);
    expect(metadataWrapper[0].metadata).toBe(TEST_OBJECT_VALUE);
  });
});
