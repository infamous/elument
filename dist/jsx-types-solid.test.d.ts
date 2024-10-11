import type { ElementAttributes } from './LumeElement.js';
type SomeElementAttributes = 'someProp' | 'booleanProp' | 'otherProp' | 'onsomeevent' | 'onnotanevent' | 'someNumber';
declare class SomeElement extends HTMLElement {
    someProp: 'true' | 'false' | boolean;
    ignoredBoolean: boolean;
    booleanProp: boolean;
    get otherProp(): number;
    set otherProp(_: this['__set__otherProp']);
    /** do not use this property, its only for JSX types */
    __set__otherProp: number | 'foo';
    onsomeevent: ((event: SomeEvent) => void) | null;
    onnotanevent: number;
    ignoredNumber: number;
    someNumber: number;
}
declare class SomeEvent extends Event {
    foo: number;
}
declare module 'solid-js' {
    namespace JSX {
        interface IntrinsicElements {
            'some-element': ElementAttributes<SomeElement, SomeElementAttributes>;
        }
    }
    type test = {
        [K in keyof ElementAttributes<SomeElement, SomeElementAttributes>]: ElementAttributes<SomeElement, SomeElementAttributes>[K];
    };
}
export {};
//# sourceMappingURL=jsx-types-solid.test.d.ts.map