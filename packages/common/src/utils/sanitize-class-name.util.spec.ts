import { sanitizeClassName } from './sanitize-class-name.util';

describe('utils::sanitizeClassName', () => {
  it('Parameter 1 is a camel case named class', () => {
    expect(sanitizeClassName(class MyClass {})).toBe('my_class');
    expect(sanitizeClassName(class MyClass123 {})).toBe('my_class_123');
  });

  it('Parameter 1 is a camel case named class instance', () => {
    const myClassInstance = new (class MyClass {})();
    const myClass123Instance = new (class MyClass123 {})();

    expect(sanitizeClassName(myClassInstance)).toBe('my_class');
    expect(sanitizeClassName(myClass123Instance)).toBe('my_class_123');
  });

  it('Parameter 1 is a camel case named class with an underscore', () => {
    expect(sanitizeClassName(class My_Class {})).toBe('my_class');
  });

  it('Parameter 1 is a camel case named class instance with an underscore', () => {
    const my_ClassInstance = new (class My_Class {})();
    expect(sanitizeClassName(my_ClassInstance)).toBe('my_class');
  });
});
