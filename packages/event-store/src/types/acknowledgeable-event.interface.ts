import { PersistentAction, ResolvedEvent } from '@eventstore/db-client';
import { EventType } from '@eventstore/db-client/dist/types/events';

export interface AcknowledgeableEvent<Event extends EventType = EventType> extends ResolvedEvent<Event> {
  ack(): Promise<void>;

  nack(action: PersistentAction, reason: string): Promise<void>;
}
