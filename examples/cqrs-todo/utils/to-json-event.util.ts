import { jsonEvent } from '@eventstore/db-client';

export function toJsonEvent(obj: object) {
  const className = obj.constructor.name;

  const type = className.endsWith('Event') ? className : `${className}Event`;
  const metadata = obj['metadata'];
  const { ...data } = obj;

  return jsonEvent({
    type,
    data,
    metadata,
  });
}
