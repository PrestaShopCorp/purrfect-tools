export class EventStoreSubscriberMock {
  on = jest.fn();

  ack = jest.fn();
  nack = jest.fn();
}
