import { METADATA_CATCH_UP_SUBSCRIPTION } from '../constants';
import { EventStoreCatchUpSubscriptionDescriptor } from '../types';
import { CatchUpSubscription } from './catch-up-subscription.decorator';

@CatchUpSubscription()
class TestServiceA {}

const descriptor: EventStoreCatchUpSubscriptionDescriptor = {
  stream: 'test',
};

@CatchUpSubscription(descriptor)
class TestServiceB {}

describe('decorators::CatchUpSubscription()', () => {
  it('Parameter 1 is *undefined*', () => {
    const metadata = Reflect.getMetadata(METADATA_CATCH_UP_SUBSCRIPTION, TestServiceA);
    expect(metadata).toMatchObject({});
  });

  it('Parameter 1 is *EventStoreCatchUpSubscriptionDescriptor*', () => {
    const metadata = Reflect.getMetadata(METADATA_CATCH_UP_SUBSCRIPTION, TestServiceB);
    expect(metadata).toEqual(descriptor);
  });
});
