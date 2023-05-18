import { EventStoreSubscriberMock } from './event-store-subscriber.mock';

export class EventStoreClientMock {
  getProjectionStatus = jest.fn().mockRejectedValue(undefined);
  createProjection = jest.fn().mockResolvedValue(undefined);
  updateProjection = jest.fn().mockResolvedValue(undefined);

  subscribeToAll = jest.fn().mockResolvedValue(new EventStoreSubscriberMock());
  subscribeToStream = jest.fn().mockResolvedValue(new EventStoreSubscriberMock());

  getPersistentSubscriptionToAllInfo = jest.fn().mockRejectedValue(undefined);
  createPersistentSubscriptionToAll = jest.fn().mockResolvedValue(new EventStoreSubscriberMock());
  subscribeToPersistentSubscriptionToAll = jest.fn().mockResolvedValue(new EventStoreSubscriberMock());

  getPersistentSubscriptionToStreamInfo = jest.fn().mockRejectedValue(undefined);
  createPersistentSubscriptionToStream = jest.fn().mockResolvedValue(new EventStoreSubscriberMock());
  subscribeToPersistentSubscriptionToStream = jest.fn().mockResolvedValue(new EventStoreSubscriberMock());
}
