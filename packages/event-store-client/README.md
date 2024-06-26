# @purrfect-tools/event-store-client

Exposes an `EventStoreDBClient` from `'@eventstore/db-client'` as a service.

The only purpose of this package is to extract the responsability of define a client from the
`@purrfect-tools/event-store` package and make it replaceable by a custom implementation.

