import { END, ROUND_ROBIN, UNBOUNDED } from '@eventstore/db-client/dist/constants';
import { PersistentSubscriptionToAllSettings, PersistentSubscriptionToStreamSettings } from '@eventstore/db-client';
import { PersistentSubscriptionSettingsGeneric } from '@eventstore/db-client/dist/persistentSubscription/utils/persistentSubscriptionSettings';

export const DEFAULT_PERSISTENT_SUBSCRIPTION_CONFIG: PersistentSubscriptionSettingsGeneric = {
  resolveLinkTos: false,
  extraStatistics: false,
  messageTimeout: 30000,
  maxRetryCount: 10,
  checkPointAfter: 2000,
  checkPointLowerBound: 10,
  checkPointUpperBound: 1000,
  maxSubscriberCount: UNBOUNDED,
  liveBufferSize: 500,
  readBatchSize: 20,
  historyBufferSize: 500,
  consumerStrategyName: ROUND_ROBIN,
};

export const DEFAULT_PERSISTENT_SUBSCRIPTION_TO_ALL_CONFIG: PersistentSubscriptionToAllSettings = {
  ...DEFAULT_PERSISTENT_SUBSCRIPTION_CONFIG,
  startFrom: END,
};
export const DEFAULT_PERSISTENT_SUBSCRIPTION_TO_STREAM_CONFIG: PersistentSubscriptionToStreamSettings = {
  ...DEFAULT_PERSISTENT_SUBSCRIPTION_CONFIG,
  startFrom: END,
};
