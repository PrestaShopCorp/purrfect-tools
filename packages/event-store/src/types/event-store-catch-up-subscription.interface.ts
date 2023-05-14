import { ResolvedEvent } from '@eventstore/db-client';
import { EventType } from '@eventstore/db-client/dist/types/events';

export interface EventStoreCatchUpSubscription<Event extends EventType = EventType> {
  handleEvent(resolvedEvent: ResolvedEvent<Event>);
}
