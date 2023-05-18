import { METADATA_PROJECTION } from '../constants';
import { EventStoreProjectionDescriptor } from '../types';
import { Projection } from './projection.decorator';

@Projection()
class TestServiceA {}

const TEST_SERVICE_B_DESCRIPTOR: EventStoreProjectionDescriptor = {
  name: 'test',
};

@Projection(TEST_SERVICE_B_DESCRIPTOR)
class TestServiceB {}

const TEST_SERVICE_C_NAME = 'my_projection';
@Projection(TEST_SERVICE_C_NAME)
class TestServiceC {}

describe('decorators::Projection()', () => {
  it('Parameter 1 is *undefined*', () => {
    const hasMetadata = Reflect.hasMetadata(METADATA_PROJECTION, TestServiceA);
    expect(hasMetadata).toBeTruthy();
  });

  it('Parameter 1 is *EventStoreProjectionDescriptor*', () => {
    const metadata = Reflect.getMetadata(METADATA_PROJECTION, TestServiceB);
    expect(metadata).toEqual(TEST_SERVICE_B_DESCRIPTOR);
  });

  it('Parameter 1 is *string*', () => {
    const metadata = Reflect.getMetadata(METADATA_PROJECTION, TestServiceC);
    expect(metadata).toEqual({ name: TEST_SERVICE_C_NAME });
  });
});
