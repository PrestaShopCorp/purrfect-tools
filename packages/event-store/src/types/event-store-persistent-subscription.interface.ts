import { EventType } from '@eventstore/db-client/dist/types/events';

import { AcknowledgeableEvent } from '../types';

export interface EventStorePersistentSubscription<Event extends EventType = EventType> {
  handleEvent(event: AcknowledgeableEvent<Event>);
}
