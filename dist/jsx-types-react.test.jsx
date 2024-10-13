/* @jsxImportSource react */
class SomeElement extends HTMLElement {
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
}
SomeElement;
class SomeEvent extends Event {
    foo = 0;
}
describe('JSX types with ReactElementAttributes', () => {
    it('derives JSX types from classes', () => {
        ;
        <>
			{/* Ensure common element attributes still work. */}
			<some-element onClick={event => event.button} aria-hidden="true" className="foo" style={{ color: 'red' }}/>

			<some-element someProp="false" otherProp="foo"/>
			<some-element someProp="false" otherProp="foo"/>
			<some-element someProp={false} otherProp={123}/>
			{/* @ts-expect-error good, number is invalid */}
			<some-element someProp={123}/>
			{/* @ts-expect-error good, 'blah' is invalid */}
			<some-element otherProp="blah"/>

			{/* Additionally TypeScript will allow unknown dash-case props (as we didn't not define JS properties with these exact dash-cased names, React 19+ will set the element attributes, useful for setting the attributes but React has no way to specify to set attributes for names without dashes) */}
			<some-element some-prop="false" other-prop="foo"/>
			{/* @ts-expect-error foo doesn't exist. TypeScript will only check existence of properties without dashes */}
			<some-element foo="false"/>

			{/* @ts-expect-error `ignoredBoolean` was not selected, not available in JSX */}
			<some-element ignoredBoolean={123}/>

			<some-element booleanProp/>
			<some-element booleanProp={true}/>
			<some-element booleanProp={false}/>
			<some-element booleanProp="true"/>
			<some-element booleanProp="false"/>
			{/* @ts-expect-error good, only booleans and boolean strings allowed, no strings */}
			<some-element booleanProp="blah"/>
			{/* @ts-expect-error good, only booleans allowed */}
			<some-element booleanProp={123}/>

			<some-element onsomeevent={(event) => event.foo}/>
			{/* @ts-expect-error on:-prefixed event props are not for React */}
			<some-element on:someevent={(event) => event}/>
			{/* @ts-expect-error wrong event type */}
			<some-element onsomeevent={(event) => event}/>

			{/* This is fine in React, it will set the JS property to the given value instead of adding an event listener if the value is not a function. */}
			<some-element onnotanevent={123}/>
			{/* @ts-expect-error good, boolean is not valid */}
			<some-element onnotanevent={true}/>
			{/* @ts-expect-error good, event handler is not valid (although at runtime React will listen for "notanevent") */}
			<some-element onnotanevent={(e) => e}/>

			{/* @ts-expect-error `ignoredNumber` was not selected, not available in JSX */}
			<some-element ignoredNumber={123}/>

			<some-element someNumber={123}/>
			{/* @ts-expect-error good, `false` is not a number */}
			<some-element someNumber={false}/>
			<some-element someNumber="123"/>
			<some-element someNumber="123."/>
			<some-element someNumber=".123"/>
			<some-element someNumber="1.23"/>
			<some-element someNumber="1.2e1"/>
			<some-element someNumber="0xefef"/>
			<some-element someNumber="0b1010"/>
			{/* @ts-expect-error good, "0z1010" is not a number string */}
			<some-element someNumber="0z1010"/>
			{/* @ts-expect-error good, "blah" is not a number string */}
			<some-element someNumber="blah"/>
			{/* @ts-expect-error good, "1.blah" is not a number string */}
			<some-element someNumber="1.blah"/>
		</>;
    });
});
export {};
//# sourceMappingURL=jsx-types-react.test.jsx.map