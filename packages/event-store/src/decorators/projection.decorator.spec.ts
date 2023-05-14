import { METADATA_PROJECTION } from '../constants';
import { EventStoreProjectionDescriptor } from '../types';
import { Projection } from './projection.decorator';

@Projection()
class TestServiceA {}

const descriptor: EventStoreProjectionDescriptor = {
  name: 'test',
};

@Projection(descriptor)
class TestServiceB {}

describe('decorators::Projection()', () => {
  it('Parameter 1 is *undefined*', () => {
    const hasMetadata = Reflect.hasMetadata(METADATA_PROJECTION, TestServiceA);
    expect(hasMetadata).toBeTruthy();
  });

  it('Parameter 1 is *EventStoreProjectionDescriptor*', () => {
    const metadata = Reflect.getMetadata(METADATA_PROJECTION, TestServiceB);
    expect(metadata).toEqual(descriptor);
  });
});
