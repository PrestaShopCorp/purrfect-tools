import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';
import { EventStoreModule } from '@purrfect-tools/event-store';

import * as CommandHandlers from './commands/handlers';
import * as EventPublishers from './events/publishers';
import * as QueryHandlers from './queries/handlers';
import { AppController } from './controllers/app.controller';
import { MemoryDbService } from './services/memory-db.service';
import { InitMemoryDbCatchUpSubscription } from './events/subscriptions/init-memory-db.catch-up-subscription';

@Module({
  imports: [
    CqrsModule,
    EventStoreModule.register({
      connectionString: 'esdb+discover://localhost:22113?tls=false',
    }),
  ],
  controllers: [AppController],
  providers: [
    MemoryDbService,
    InitMemoryDbCatchUpSubscription,
    ...Object.values(CommandHandlers),
    ...Object.values(QueryHandlers),
    ...Object.values(EventPublishers),
  ],
})
export class AppModule {}
