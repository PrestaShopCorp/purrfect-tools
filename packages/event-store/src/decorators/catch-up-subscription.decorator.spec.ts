import { METADATA_CATCH_UP_SUBSCRIPTION } from '../constants';
import { EventStoreCatchUpSubscriptionDescriptor } from '../types';
import { CatchUpSubscription } from './catch-up-subscription.decorator';

@CatchUpSubscription()
class TestServiceA {}

const TEST_SERVICE_B_DESCRIPTOR: EventStoreCatchUpSubscriptionDescriptor = {
  stream: 'test',
};

@CatchUpSubscription(TEST_SERVICE_B_DESCRIPTOR)
class TestServiceB {}

const TEST_SERVICE_C_STREAM = 'my-stream';
@CatchUpSubscription(TEST_SERVICE_C_STREAM)
class TestServiceC {}

describe('decorators::CatchUpSubscription()', () => {
  it('Parameter 1 is *undefined*', () => {
    const metadata = Reflect.getMetadata(METADATA_CATCH_UP_SUBSCRIPTION, TestServiceA);
    expect(metadata).toMatchObject({});
  });

  it('Parameter 1 is *EventStoreCatchUpSubscriptionDescriptor*', () => {
    const metadata = Reflect.getMetadata(METADATA_CATCH_UP_SUBSCRIPTION, TestServiceB);
    expect(metadata).toEqual(TEST_SERVICE_B_DESCRIPTOR);
  });

  it('Parameter 1 is *string*', () => {
    const metadata = Reflect.getMetadata(METADATA_CATCH_UP_SUBSCRIPTION, TestServiceC);
    expect(metadata).toEqual({ stream: TEST_SERVICE_C_STREAM });
  });
});
