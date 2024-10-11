import type { ReactElementAttributes } from './react.js';
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
declare module 'react' {
    namespace JSX {
        interface IntrinsicElements {
            'some-element': ReactElementAttributes<SomeElement, SomeElementAttributes>;
        }
    }
}
export {};
//# sourceMappingURL=jsx-types-react.test.d.ts.map