import { METADATA_STREAM_EVENT_PUBLISHER } from '../constants';
import { StreamEventPublisherDescriptor } from '../types';
import { StreamEventPublisher } from './stream-event-publisher.decorator';

const TEST_SERVICE_A_DESCRIPTOR: StreamEventPublisherDescriptor = {
  stream: 'test',
};

@StreamEventPublisher(TEST_SERVICE_A_DESCRIPTOR)
class TestServiceA {}

const TEST_SERVICE_B_NAME = 'my_stream';
@StreamEventPublisher(TEST_SERVICE_B_NAME)
class TestServiceB {}

describe('decorators::CategoryEventPublisher()', () => {
  it('Parameter 1 is *CategoryEventPublisherDescriptor*', () => {
    const metadata = Reflect.getMetadata(METADATA_STREAM_EVENT_PUBLISHER, TestServiceA);
    expect(metadata).toEqual(TEST_SERVICE_A_DESCRIPTOR);
  });

  it('Parameter 1 is *string*', () => {
    const metadata = Reflect.getMetadata(METADATA_STREAM_EVENT_PUBLISHER, TestServiceB);
    expect(metadata).toEqual({ stream: TEST_SERVICE_B_NAME });
  });
});
