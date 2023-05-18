import { METADATA_PERSISTENT_SUBSCRIPTION } from '../constants';
import { EventStorePersistentSubscriptionDescriptor } from '../types';
import { PersistentSubscription } from './persistent-subscription.decorator';

@PersistentSubscription()
class TestServiceA {}

const TEST_SERVICE_B_DESCRIPTOR: EventStorePersistentSubscriptionDescriptor = {
  group: 'test-group',
  stream: 'test',
};

@PersistentSubscription(TEST_SERVICE_B_DESCRIPTOR)
class TestServiceB {}

const TEST_SERVICE_C_STREAM = 'my-stream-c';
@PersistentSubscription(TEST_SERVICE_C_STREAM)
class TestServiceC {}

const TEST_SERVICE_D_STREAM = 'my-stream-d';
const TEST_SERVICE_D_GROUP = 'my-group-d';
@PersistentSubscription(TEST_SERVICE_D_STREAM, TEST_SERVICE_D_GROUP)
class TestServiceD {}

describe('decorators::PersistentSubscription()', () => {
  it('Parameter 1 is *undefined*', () => {
    const metadata = Reflect.getMetadata(METADATA_PERSISTENT_SUBSCRIPTION, TestServiceA);
    expect(metadata).toMatchObject({});
  });

  it('Parameter 1 is *EventStorePersistentSubscriptionDescriptor*', () => {
    const metadata = Reflect.getMetadata(METADATA_PERSISTENT_SUBSCRIPTION, TestServiceB);
    expect(metadata).toEqual(TEST_SERVICE_B_DESCRIPTOR);
  });

  it('Parameter 1 is *string*', () => {
    const metadata = Reflect.getMetadata(METADATA_PERSISTENT_SUBSCRIPTION, TestServiceC);
    expect(metadata).toEqual({ stream: TEST_SERVICE_C_STREAM });
  });

  it('Parameter 1 is *string*, Parameter 2 is *string', () => {
    const metadata = Reflect.getMetadata(METADATA_PERSISTENT_SUBSCRIPTION, TestServiceD);
    expect(metadata).toEqual({ stream: TEST_SERVICE_D_STREAM, group: TEST_SERVICE_D_GROUP });
  });
});
