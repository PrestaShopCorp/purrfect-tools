import { AcknowledgeableEvent } from '../../src/types';

export function buildAcknowledgeableEventFixture(
  streamId = '',
  id = '',
  data = {},
  metadata = {},
): AcknowledgeableEvent {
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

    ack: jest.fn(),
    nack: jest.fn(),
  };
}
