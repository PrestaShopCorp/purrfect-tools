# @purrfect-tools/common

Contains all the common logic being used on other packages.


## Utils
### fetchProvider()
// TODO

### sanitizeClassName(cls)
Obtains the sanitized version of a class name. In this library context, a sanitized class name is its name in
**snake_case** and **lowercase**.  

## Services

### MetadataAccessor
Simplifies the access to metadata tags from services. This service is really helpful to write explorers.

Examples of usage can be found on:
* [EventStoreCatchUpSubscriptionSubsystemExplorer](../../packages/event-store/src/services/explorers/event-store-catch-up-subscription-subsystem.explorer.ts)
* [EventStorePersistentSubscriptionSubsystemExplorer](../../packages/event-store/src/services/explorers/event-store-persistent-subscription-subsystem.explorer.ts)
* [EventStoreProjectionSubsystemExplorer](../../packages/event-store/src/services/explorers/event-store-projection-subsystem.explorer.ts)

### getClassMetadata
// TODO

### filterByClassMetadata
// TODO

### mapToMetadataWrapper
// TODO