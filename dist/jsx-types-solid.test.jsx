/* @jsxImportSource solid-js */
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
import { element } from './element.js';
let SomeElement = (() => {
    let _classDecorators = [element('some-element-solid-jsx')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = HTMLElement;
    var SomeElement = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            SomeElement = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        someProp = true;
        ignoredBoolean = false;
        booleanProp = true;
        get otherProp() {
            return 0;
        }
        set otherProp(_) { }
        /** do not use this property, its only for JSX types */
        __set__otherProp;
        onsomeevent = null;
        onnotanevent = 123;
        ignoredNumber = 0;
        someNumber = 123;
    };
    return SomeElement = _classThis;
})();
SomeElement;
class SomeEvent extends Event {
    foo = 0;
}
describe('JSX types with ElementAttributes', () => {
    it('derives JSX types from classes', () => {
        ;
        <>
			{/* Ensure common element attributes still work. */}
			<some-element onclick={event => event.button} aria-hidden="true" class="foo" style="color: red"/>

			<some-element some-prop="false" other-prop="foo"/>
			<some-element some-prop="false" other-prop="foo"/>
			<some-element some-prop={false} other-prop={123}/>
			{/* @ts-expect-error good, number is invalid */}
			<some-element some-prop={123}/>
			{/* @ts-expect-error good, 'blah' is invalid */}
			<some-element other-prop="blah"/>

			<some-element prop:someProp="false" prop:otherProp="foo"/>
			<some-element prop:someProp="false" prop:otherProp="foo"/>
			<some-element prop:someProp={false} prop:otherProp={123}/>
			{/* @ts-expect-error good, number is invalid */}
			<some-element prop:someProp={123}/>
			{/* @ts-expect-error good, someProp JSX is not valid, has to be dash-cased version of the JS prop, or use the prop: prefix */}
			<some-element someProp={123}/>
			{/* @ts-expect-error good, 'blah' is invalid */}
			<some-element prop:otherProp="blah"/>

			{/* Additionally TypeScript will allow unknown dash-case props (the attr: can be used here to tell Solid to set the element attributes instead of the JS properties) */}
			<some-element attr:some-prop="false" attr:other-prop="foo"/>
			{/* @ts-expect-error string types can be checked, here an invalid string type */}
			<some-element attr:some-prop="blah"/>

			<some-element some-prop={true}/>
			<some-element some-prop={false}/>
			<some-element some-prop={'true'}/>
			<some-element some-prop={'false'}/>
			{/* @ts-expect-error good, "blah" is not valid */}
			<some-element some-prop={'blah'}/>
			{/* @ts-expect-error good, "blah" is not valid */}
			<some-element some-prop="blah"/>

			<some-element prop:someProp={true}/>
			<some-element prop:someProp={false}/>
			<some-element prop:someProp={'true'}/>
			<some-element prop:someProp={'false'}/>
			{/* @ts-expect-error good, "blah" is not valid */}
			<some-element prop:someProp={'blah'}/>
			{/* @ts-expect-error good, "blah" is not valid */}
			<some-element prop:someProp="blah"/>

			<some-element bool:some-prop={true}/>
			<some-element bool:some-prop={false}/>
			{/* @ts-expect-error good, only booleans are allowed when using `bool:` */}
			<some-element bool:some-prop={'true'}/>
			{/* @ts-expect-error good, only booleans are allowed when using `bool:` */}
			<some-element bool:some-prop={'false'}/>
			{/* @ts-expect-error good, "blah" is not valid */}
			<some-element bool:some-prop={'blah'}/>
			{/* @ts-expect-error good, "blah" is not valid */}
			<some-element bool:some-prop="blah"/>

			<some-element attr:some-prop={'true'}/>
			<some-element attr:some-prop={'false'}/>
			{/* @ts-expect-error good, only the strings "false" and "false" are allowed in attribute form */}
			<some-element attr:some-prop={true}/>
			{/* @ts-expect-error good, only the strings "false" and "false" are allowed in attribute form */}
			<some-element attr:some-prop={false}/>
			{/* @ts-expect-error good, "blah" is not valid */}
			<some-element attr:some-prop={'blah'}/>
			{/* @ts-expect-error good, "blah" is not valid */}
			<some-element attr:some-prop="blah"/>

			{/* @ts-expect-error `ignoredBoolean` was not selected, not available in JSX */}
			<some-element ignoredBoolean={true}/>

			<some-element boolean-prop={true}/>
			<some-element boolean-prop={false}/>
			<some-element boolean-prop={'true'}/>
			<some-element boolean-prop={'false'}/>
			{/* @ts-expect-error good, "blah" is not valid */}
			<some-element boolean-prop={'blah'}/>
			{/* @ts-expect-error good, "blah" is not valid */}
			<some-element boolean-prop="blah"/>

			<some-element prop:booleanProp={true}/>
			<some-element prop:booleanProp={false}/>
			<some-element prop:booleanProp={'true'}/>
			<some-element prop:booleanProp={'false'}/>
			{/* @ts-expect-error good, "blah" is not valid */}
			<some-element prop:booleanProp={'blah'}/>
			{/* @ts-expect-error good, "blah" is not valid */}
			<some-element prop:booleanProp="blah"/>

			<some-element bool:boolean-prop={true}/>
			<some-element bool:boolean-prop={false}/>
			{/* @ts-expect-error good, only booleans are allowed when using `bool:` */}
			<some-element bool:boolean-prop={'true'}/>
			{/* @ts-expect-error good, only booleans are allowed when using `bool:` */}
			<some-element bool:boolean-prop={'false'}/>
			{/* @ts-expect-error good, "blah" is not valid */}
			<some-element bool:boolean-prop={'blah'}/>
			{/* @ts-expect-error good, "blah" is not valid */}
			<some-element bool:boolean-prop="blah"/>

			<some-element attr:boolean-prop={'true'}/>
			<some-element attr:boolean-prop={'false'}/>
			{/* @ts-expect-error good, only the strings "false" and "false" are allowed in attribute form */}
			<some-element attr:boolean-prop={true}/>
			{/* @ts-expect-error good, only the strings "false" and "false" are allowed in attribute form */}
			<some-element attr:boolean-prop={false}/>
			{/* @ts-expect-error good, "blah" is not valid */}
			<some-element attr:boolean-prop={'blah'}/>
			{/* @ts-expect-error good, "blah" is not valid */}
			<some-element attr:boolean-prop="blah"/>

			{/* @ts-expect-error foo doesn't exist. TypeScript will only check existence of properties without dashes */}
			<some-element foo="false"/>

			<some-element onsomeevent={(event) => event.foo}/>
			<some-element on:someevent={(event) => event.foo}/>
			{/* @ts-expect-error wrong event type */}
			<some-element onsomeevent={(event) => event}/>
			{/* @ts-expect-error wrong event type */}
			<some-element on:someevent={(event) => event}/>

			{/* @ts-expect-error the property cannot be used like this, as Solid will try to pass the number to addEventListener, so we make it error with `never`. Use prop: or attr: instead. */}
			<some-element onnotanevent={Math.random()}/>
			{/* @ts-expect-error only strings can be assigned to attributes */}
			<some-element attr:onnotanevent={123}/>
			<some-element attr:onnotanevent="123"/>
			<some-element prop:onnotanevent={123}/>

			{/* @ts-expect-error `ignoredNumber` was not selected, not available in JSX */}
			<some-element ignoredNumber={123}/>

			<some-element some-number={123}/>
			{/* @ts-expect-error good, `false` is not a number */}
			<some-element some-number={false}/>
			<some-element some-number="123"/>
			<some-element some-number="123."/>
			<some-element some-number=".123"/>
			<some-element some-number="1.23"/>
			<some-element some-number="1.2e1"/>
			<some-element some-number="0xefef"/>
			<some-element some-number="0b1010"/>
			{/* @ts-expect-error good, "0z1010" is not a number string */}
			<some-element some-number="0z1010"/>
			{/* @ts-expect-error good, "blah" is not a number string */}
			<some-element some-number="blah"/>
			{/* @ts-expect-error good, "1.blah" is not a number string */}
			<some-element some-number="1.blah"/>

			<some-element prop:someNumber={123}/>
			{/* @ts-expect-error good, `false` is not a number */}
			<some-element prop:someNumber={false}/>
			<some-element prop:someNumber="123"/>
			<some-element prop:someNumber="123."/>
			<some-element prop:someNumber=".123"/>
			<some-element prop:someNumber="1.23"/>
			<some-element prop:someNumber="1.2e1"/>
			<some-element prop:someNumber="0xefef"/>
			<some-element prop:someNumber="0b1010"/>
			{/* @ts-expect-error good, "0z1010" is not a number string */}
			<some-element prop:someNumber="0z1010"/>
			{/* @ts-expect-error good, "blah" is not a number string */}
			<some-element prop:someNumber="blah"/>
			{/* @ts-expect-error good, "1.blah" is not a number string */}
			<some-element prop:someNumber="1.blah"/>

			{/* @ts-expect-error good, attribute accepts only strings */}
			<some-element attr:some-number={123}/>
			{/* @ts-expect-error good, `false` is not a number string */}
			<some-element attr:some-number={false}/>
			<some-element attr:some-number="123"/>
			<some-element attr:some-number="123."/>
			<some-element attr:some-number=".123"/>
			<some-element attr:some-number="1.23"/>
			<some-element attr:some-number="1.2e1"/>
			<some-element attr:some-number="0xefef"/>
			<some-element attr:some-number="0b1010"/>
			{/* @ts-expect-error good, "0z1010" is not a number string */}
			<some-element attr:some-number="0z1010"/>
			{/* @ts-expect-error good, "blah" is not a number string */}
			<some-element attr:some-number="blah"/>
			{/* @ts-expect-error good, "1.blah" is not a number string */}
			<some-element attr:some-number="1.blah"/>
		</>;
    });
});
//# sourceMappingURL=jsx-types-solid.test.jsx.map