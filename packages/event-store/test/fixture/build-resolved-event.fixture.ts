import { ResolvedEvent } from '@eventstore/db-client';

export function buildResolvedEventFixture(streamId = '', id = '', data = {}, metadata = {}): ResolvedEvent {
  return {
    event: {
      streamId,
      id,

      isJson: true,

      revision: BigInt(1),
      type: '',
      created: new Date(),

      metadata,
      data,
    },
    commitPosition: BigInt(1),
  };
}
