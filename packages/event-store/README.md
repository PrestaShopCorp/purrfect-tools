# @purrfect-tools/event-store

## Projections
> Reference: https://developers.eventstore.com/http-api/v24.2/projections

*@purrfect-tools/event-store* allows you to handle your projections on two ways

#### Manual load
`EventStoreModule` exposes the `EventStoreProjectionService` that allows you to use the `loadProjection` method to
manually load your projections. This method will update the projection if it was already created by another means.

#### *OnApplicationBootstrap* load
You can decorate your services with the `@Projection()` decorator and implement the `EventStoreProjection` interface.
`EventStoreModule` will take care of your services and load them as projections.

The `@Projection()` decorator has multiple usages:

```
@Injectable()
@Projection() 
class MyService implements EventStoreProjection {
    getQuery {
        return '<MY_PROJECTION>';
    }
}
```
Being used like this, the `@Projection()` decorator will take the default configuration and will be named with a
sanitized version of your class name: `my_service`

```
@Injectable()
@Projection('my_custom_named_projection')
class MyService implements EventStoreProjection {
    getQuery {
        return '<MY_PROJECTION>';
    }
}
```
Being used like this, the `@Projection()` decorator will take the default configuration and will be named with a custom
name: `my_custom_named_projection`

```
@Injectable()
@Projection({
    name: 'my_name',
    configuration: {
        ...
    }
})
class MyService implements EventStoreProjection {
    getQuery {
        return '<MY_PROJECTION>';
    }
}
```
Being used like this, the `@Projection()` decorator will take a descriptor as parameter that allows you to define the
configuration and the projection name. The `name` key is optional.  

## Subscriptions

### Catch-up Subscriptions
> Reference: https://developers.eventstore.com/clients/grpc/subscriptions

*@purrfect-tools/event-store* allows you to handle your catch-up subscriptions on two ways

#### Manual load
`EventStoreModule` exposes the `EventStoreCatchUpSubscriptionService` that allows you to use the
`loadCatchUpSubscriptionToAll` method to manually load your catch-up subscription when it must subscribe the `$all`
stream or loadCatchUpSubscriptionToStream when you want to use a named stream.

#### *OnApplicationBootstrap* load
You can decorate your services with the `@CatchUpSubscription()` decorator and implement the
`EventStoreCatchUpSubscription` interface. `EventStoreModule` will take care of your services and load them as catch-up
subscriptions.

The `@CatchUpSubscription()` decorator has multiple usages:

```
@Injectable()
@CatchUpSubscription() 
class MyService implements EventStoreCatchUpSubscription {
    handleEvent(resolvedEvent: ResolvedEvent) {
        // ...
    }
}
```
Being used like this, the `@CatchUpSubscription()` decorator will take the default configuration and will be subscribed
to the `$all` stream.

```
@Injectable()
@CatchUpSubscription('my_stream')
class MyService implements EventStoreCatchUpSubscription {
    handleEvent(resolvedEvent: ResolvedEvent) {
        // ...
    }
}
```
Being used like this, the `@CatchUpSubscription()` decorator will take the default configuration and will be subscribed
to the `my_stream` stream.

```
@Injectable()
@CatchUpSubscription({
    configuration: {
        ...
    }
})
class MyService implements EventStoreCatchUpSubscription {
    handleEvent(resolvedEvent: ResolvedEvent) {
        // ...
    }
}
```
Being used like this, the `@CatchUpSubscription()` decorator will take a descriptor as parameter that allows you to
define the configuration and will be subscribed to the `$all` stream.

```
@Injectable()
@CatchUpSubscription({
    stream: 'my_stream',
    configuration: {
        ...
    }
})
class MyService implements EventStoreCatchUpSubscription {
    handleEvent(resolvedEvent: ResolvedEvent) {
        // ...
    }
}
```
Being used like this, the `@CatchUpSubscription()` decorator will take a descriptor as parameter that allows you to
define the configuration and will be subscribed to the `my_stream` stream.

> Any error thrown by the handler will be ignored and won't interrupt the event flow. Remember to handle the errors
> being throw by your subscriber.

### Persistent Subscriptions
> Reference: https://developers.eventstore.com/clients/grpc/persistent-subscriptions

*@purrfect-tools/event-store* allows you to handle your persistent subscriptions on two ways

#### Manual load
`EventStoreModule` exposes the `EventStorePersistentSubscriptionService` that allows you to use the `loadProjection` method to manually
load your projections. This method will update the projection if it was already created by another means.

#### *OnApplicationBootstrap* load

// TODO: Works similar to CatchUp Subscriptions

// TODO: The error logic must be defined. Error logic won't interrupt the stream. Default error logic will be nack + park.
