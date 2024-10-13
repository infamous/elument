/* @jsxImportSource solid-js */

import {element} from './element.js'
import type {ElementAttributes} from './LumeElement.js'

type SomeElementAttributes = 'someProp' | 'booleanProp' | 'otherProp' | 'onsomeevent' | 'onnotanevent' | 'someNumber'

@element('some-element-solid-jsx')
class SomeElement extends HTMLElement {
	someProp: 'true' | 'false' | boolean = true

	ignoredBoolean = false

	booleanProp = true

	get otherProp(): number {
		return 0
	}
	set otherProp(_: this['__set__otherProp']) {}

	/** do not use this property, its only for JSX types */
	__set__otherProp!: number | 'foo'

	onsomeevent: ((event: SomeEvent) => void) | null = null

	onnotanevent = 123

	ignoredNumber = 0

	someNumber = 123
}

SomeElement

class SomeEvent extends Event {
	foo = 0
}

declare module 'solid-js' {
	namespace JSX {
		interface IntrinsicElements {
			'some-element': ElementAttributes<SomeElement, SomeElementAttributes>
		}
	}

	type test = {
		[K in keyof ElementAttributes<SomeElement, SomeElementAttributes>]: ElementAttributes<
			SomeElement,
			SomeElementAttributes
		>[K]
	}
}

describe('JSX types with ElementAttributes', () => {
	it('derives JSX types from classes', () => {
		;<>
			{/* Ensure common element attributes still work. */}
			<some-element onclick={event => event.button} aria-hidden="true" class="foo" style="color: red" />

			<some-element some-prop="false" other-prop="foo" />
			<some-element some-prop="false" other-prop="foo" />
			<some-element some-prop={false} other-prop={123} />
			{/* @ts-expect-error good, number is invalid */}
			<some-element some-prop={123} />
			{/* @ts-expect-error good, 'blah' is invalid */}
			<some-element other-prop="blah" />

			<some-element prop:someProp="false" prop:otherProp="foo" />
			<some-element prop:someProp="false" prop:otherProp="foo" />
			<some-element prop:someProp={false} prop:otherProp={123} />
			{/* @ts-expect-error good, number is invalid */}
			<some-element prop:someProp={123} />
			{/* @ts-expect-error good, someProp JSX is not valid, has to be dash-cased version of the JS prop, or use the prop: prefix */}
			<some-element someProp={123} />
			{/* @ts-expect-error good, 'blah' is invalid */}
			<some-element prop:otherProp="blah" />

			{/* Additionally TypeScript will allow unknown dash-case props (the attr: can be used here to tell Solid to set the element attributes instead of the JS properties) */}
			<some-element attr:some-prop="false" attr:other-prop="foo" />
			{/* @ts-expect-error string types can be checked, here an invalid string type */}
			<some-element attr:some-prop="blah" />

			<some-element some-prop={true} />
			<some-element some-prop={false} />
			<some-element some-prop={'true'} />
			<some-element some-prop={'false'} />
			{/* @ts-expect-error good, "blah" is not valid */}
			<some-element some-prop={'blah'} />
			{/* @ts-expect-error good, "blah" is not valid */}
			<some-element some-prop="blah" />

			<some-element prop:someProp={true} />
			<some-element prop:someProp={false} />
			<some-element prop:someProp={'true'} />
			<some-element prop:someProp={'false'} />
			{/* @ts-expect-error good, "blah" is not valid */}
			<some-element prop:someProp={'blah'} />
			{/* @ts-expect-error good, "blah" is not valid */}
			<some-element prop:someProp="blah" />

			<some-element bool:some-prop={true} />
			<some-element bool:some-prop={false} />
			{/* @ts-expect-error good, only booleans are allowed when using `bool:` */}
			<some-element bool:some-prop={'true'} />
			{/* @ts-expect-error good, only booleans are allowed when using `bool:` */}
			<some-element bool:some-prop={'false'} />
			{/* @ts-expect-error good, "blah" is not valid */}
			<some-element bool:some-prop={'blah'} />
			{/* @ts-expect-error good, "blah" is not valid */}
			<some-element bool:some-prop="blah" />

			<some-element attr:some-prop={'true'} />
			<some-element attr:some-prop={'false'} />
			{/* @ts-expect-error good, only the strings "false" and "false" are allowed in attribute form */}
			<some-element attr:some-prop={true} />
			{/* @ts-expect-error good, only the strings "false" and "false" are allowed in attribute form */}
			<some-element attr:some-prop={false} />
			{/* @ts-expect-error good, "blah" is not valid */}
			<some-element attr:some-prop={'blah'} />
			{/* @ts-expect-error good, "blah" is not valid */}
			<some-element attr:some-prop="blah" />

			{/* @ts-expect-error `ignoredBoolean` was not selected, not available in JSX */}
			<some-element ignoredBoolean={true} />

			<some-element boolean-prop={true} />
			<some-element boolean-prop={false} />
			<some-element boolean-prop={'true'} />
			<some-element boolean-prop={'false'} />
			{/* @ts-expect-error good, "blah" is not valid */}
			<some-element boolean-prop={'blah'} />
			{/* @ts-expect-error good, "blah" is not valid */}
			<some-element boolean-prop="blah" />

			<some-element prop:booleanProp={true} />
			<some-element prop:booleanProp={false} />
			<some-element prop:booleanProp={'true'} />
			<some-element prop:booleanProp={'false'} />
			{/* @ts-expect-error good, "blah" is not valid */}
			<some-element prop:booleanProp={'blah'} />
			{/* @ts-expect-error good, "blah" is not valid */}
			<some-element prop:booleanProp="blah" />

			<some-element bool:boolean-prop={true} />
			<some-element bool:boolean-prop={false} />
			{/* @ts-expect-error good, only booleans are allowed when using `bool:` */}
			<some-element bool:boolean-prop={'true'} />
			{/* @ts-expect-error good, only booleans are allowed when using `bool:` */}
			<some-element bool:boolean-prop={'false'} />
			{/* @ts-expect-error good, "blah" is not valid */}
			<some-element bool:boolean-prop={'blah'} />
			{/* @ts-expect-error good, "blah" is not valid */}
			<some-element bool:boolean-prop="blah" />

			<some-element attr:boolean-prop={'true'} />
			<some-element attr:boolean-prop={'false'} />
			{/* @ts-expect-error good, only the strings "false" and "false" are allowed in attribute form */}
			<some-element attr:boolean-prop={true} />
			{/* @ts-expect-error good, only the strings "false" and "false" are allowed in attribute form */}
			<some-element attr:boolean-prop={false} />
			{/* @ts-expect-error good, "blah" is not valid */}
			<some-element attr:boolean-prop={'blah'} />
			{/* @ts-expect-error good, "blah" is not valid */}
			<some-element attr:boolean-prop="blah" />

			{/* @ts-expect-error foo doesn't exist. TypeScript will only check existence of properties without dashes */}
			<some-element foo="false" />

			<some-element onsomeevent={(event: SomeEvent) => event.foo} />
			<some-element on:someevent={(event: SomeEvent) => event.foo} />
			{/* @ts-expect-error wrong event type */}
			<some-element onsomeevent={(event: ErrorEvent) => event} />
			{/* @ts-expect-error wrong event type */}
			<some-element on:someevent={(event: ErrorEvent) => event} />

			{/* @ts-expect-error the property cannot be used like this, as Solid will try to pass the number to addEventListener, so we make it error with `never`. Use prop: or attr: instead. */}
			<some-element onnotanevent={Math.random()} />
			{/* @ts-expect-error only strings can be assigned to attributes */}
			<some-element attr:onnotanevent={123} />
			<some-element attr:onnotanevent="123" />
			<some-element prop:onnotanevent={123} />

			{/* @ts-expect-error `ignoredNumber` was not selected, not available in JSX */}
			<some-element ignoredNumber={123} />

			<some-element some-number={123} />
			{/* @ts-expect-error good, `false` is not a number */}
			<some-element some-number={false} />
			<some-element some-number="123" />
			<some-element some-number="123." />
			<some-element some-number=".123" />
			<some-element some-number="1.23" />
			<some-element some-number="1.2e1" />
			<some-element some-number="0xefef" />
			<some-element some-number="0b1010" />
			{/* @ts-expect-error good, "0z1010" is not a number string */}
			<some-element some-number="0z1010" />
			{/* @ts-expect-error good, "blah" is not a number string */}
			<some-element some-number="blah" />
			{/* @ts-expect-error good, "1.blah" is not a number string */}
			<some-element some-number="1.blah" />

			<some-element prop:someNumber={123} />
			{/* @ts-expect-error good, `false` is not a number */}
			<some-element prop:someNumber={false} />
			<some-element prop:someNumber="123" />
			<some-element prop:someNumber="123." />
			<some-element prop:someNumber=".123" />
			<some-element prop:someNumber="1.23" />
			<some-element prop:someNumber="1.2e1" />
			<some-element prop:someNumber="0xefef" />
			<some-element prop:someNumber="0b1010" />
			{/* @ts-expect-error good, "0z1010" is not a number string */}
			<some-element prop:someNumber="0z1010" />
			{/* @ts-expect-error good, "blah" is not a number string */}
			<some-element prop:someNumber="blah" />
			{/* @ts-expect-error good, "1.blah" is not a number string */}
			<some-element prop:someNumber="1.blah" />

			{/* @ts-expect-error good, attribute accepts only strings */}
			<some-element attr:some-number={123} />
			{/* @ts-expect-error good, `false` is not a number string */}
			<some-element attr:some-number={false} />
			<some-element attr:some-number="123" />
			<some-element attr:some-number="123." />
			<some-element attr:some-number=".123" />
			<some-element attr:some-number="1.23" />
			<some-element attr:some-number="1.2e1" />
			<some-element attr:some-number="0xefef" />
			<some-element attr:some-number="0b1010" />
			{/* @ts-expect-error good, "0z1010" is not a number string */}
			<some-element attr:some-number="0z1010" />
			{/* @ts-expect-error good, "blah" is not a number string */}
			<some-element attr:some-number="blah" />
			{/* @ts-expect-error good, "1.blah" is not a number string */}
			<some-element attr:some-number="1.blah" />
		</>
	})
})
