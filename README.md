# @purrfect-tools

Collection of curated libraries for NestJS projects.

## Structure

This repository is structured in multiple packages that will be used in
`./examples` projects that will demonstrate their functionality and some
posible use cases.

You will be able to get more information about the packages or examples in
their respective folder.

### Packages

| Package                                                                     | Purpose                                                     |
|-----------------------------------------------------------------------------|-------------------------------------------------------------|
| [@purrfect-tools/common](packages/common/README.md)                         | Shared elements that will be used across the other packages |
| [@purrfect-tools/event-store](packages/event-store/README.md)               | Enhaces the development experience on the NestJS framework  |
| [@purrfect-tools/event-store-client](packages/event-store-client/README.md) | NestJS wrapper for the `@eventstore/db-client` library      |

### Examples

| Package   | Purpose                                                           |
|-----------|-------------------------------------------------------------------|
| cqrs-todo | Demonstrates the usage of the @purrfect-tools/event-store package |
