import { Injectable } from '@nestjs/common';
import { MetadataScanner, Reflector } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';

import { MetadataWrapper } from './types';

@Injectable()
export class MetadataAccessor {
  constructor(private readonly scanner: MetadataScanner, private readonly reflector: Reflector) {}

  getClassMetadata<M>({ metatype }: InstanceWrapper, metadataKey: string): M {
    return (metatype ? this.reflector.get(metadataKey, metatype) : null) || null;
  }

  filterByClassMetadata<I, M>(providers: InstanceWrapper<I>[], metadataKey: string): InstanceWrapper<I>[] {
    return providers.filter((provider) => !!this.getClassMetadata<M>(provider, metadataKey));
  }

  mapToMetadataWrapper<I, M>(providers: InstanceWrapper<I>[], metadataKey: string): MetadataWrapper<I, M>[] {
    return this.filterByClassMetadata<I, M>(providers, metadataKey).map((provider) => ({
      instance: provider.instance,
      metadata: this.getClassMetadata(provider, metadataKey),
    }));
  }
}
