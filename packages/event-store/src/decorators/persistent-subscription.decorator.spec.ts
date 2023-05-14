import { METADATA_PERSISTENT_SUBSCRIPTION } from '../constants';
import { EventStorePersistentSubscriptionDescriptor } from '../types';
import { PersistentSubscription } from './persistent-subscription.decorator';

@PersistentSubscription()
class TestServiceA {}

const descriptor: EventStorePersistentSubscriptionDescriptor = {
  group: 'test-group',
  stream: 'test',
};

@PersistentSubscription(descriptor)
class TestServiceB {}

describe('decorators::PersistentSubscription()', () => {
  it('Parameter 1 is *undefined*', () => {
    const metadata = Reflect.getMetadata(METADATA_PERSISTENT_SUBSCRIPTION, TestServiceA);
    expect(metadata).toMatchObject({});
  });

  it('Parameter 1 is *EventStorePersistentSubscriptionDescriptor*', () => {
    const metadata = Reflect.getMetadata(METADATA_PERSISTENT_SUBSCRIPTION, TestServiceB);
    expect(metadata).toEqual(descriptor);
  });
});
