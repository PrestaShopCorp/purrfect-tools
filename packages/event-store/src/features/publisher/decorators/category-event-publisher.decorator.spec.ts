import { METADATA_CATEGORY_EVENT_PUBLISHER } from '../constants';
import { CategoryEventPublisherDescriptor } from '../types';
import { CategoryEventPublisher } from './category-event-publisher.decorator';

const TEST_SERVICE_A_DESCRIPTOR: CategoryEventPublisherDescriptor = {
  category: 'test',
};

@CategoryEventPublisher(TEST_SERVICE_A_DESCRIPTOR)
class TestServiceA {}

const TEST_SERVICE_B_NAME = 'my_category';
@CategoryEventPublisher(TEST_SERVICE_B_NAME)
class TestServiceB {}

describe('decorators::CategoryEventPublisher()', () => {
  it('Parameter 1 is *CategoryEventPublisherDescriptor*', () => {
    const metadata = Reflect.getMetadata(METADATA_CATEGORY_EVENT_PUBLISHER, TestServiceA);
    expect(metadata).toEqual(TEST_SERVICE_A_DESCRIPTOR);
  });

  it('Parameter 1 is *string*', () => {
    const metadata = Reflect.getMetadata(METADATA_CATEGORY_EVENT_PUBLISHER, TestServiceB);
    expect(metadata).toEqual({ category: TEST_SERVICE_B_NAME });
  });
});
