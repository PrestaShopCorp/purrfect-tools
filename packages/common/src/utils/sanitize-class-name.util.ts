import { Constructor } from '@nestjs/common/utils/merge-with-values.util';

export function sanitizeClassName(constructorOrInstance: Constructor<unknown> | unknown): string {
  const className =
    constructorOrInstance instanceof Function
      ? constructorOrInstance.prototype.constructor.name
      : constructorOrInstance.constructor.name;

  return className.replace(/([a-z])([A-Z0-9])/g, '$1_$2').toLowerCase();
}
