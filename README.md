# @lume/element

Easily create Custom Elements with simple templates and reactivity. This is an alternative to Lit, Stencil, and Fast.

<h4><code><strong>npm install @lume/element</strong></code></h4>

> :bulb:**Tip:**
>
> If you are new to Custom Elements, first [learn about the basics of Custom
> Element
> APIs](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements)
> available natively in browsers. Lume Element simplifies the creation of Custom
> Elements compared to writing them with vanilla APIs, but sometimes vanilla
> APIs are all that is needed.

## Live demos

- [CodePen, html template tag, no decorators](https://codepen.io/trusktr/pen/zYeRqaR)
- [Stackblitz with Babel, JSX, decorators](https://stackblitz.com/edit/webpack-webpack-js-org-wdzlbb?file=src%2Findex.js)
- [Stackblitz with Vite, JSX, TypeScript, decorators](https://stackblitz.com/edit/solidjs-templates-wyjc1i?file=src%2Findex.tsx)
- [Solid Playground, TypeScript, no decorators](https://playground.solidjs.com/anonymous/0cc05f53-b665-44d2-a73c-1db9eb992a4f)

## Cliché Usage Example

Define a `<click-counter>` element:

```js
import {Element, element, numberAttribute} from '@lume/element'
import html from 'solid-js/html'
import {createEffect} from 'solid-js'

@element('click-counter')
class ClickCounter extends Element {
	@numberAttribute count = 0

	template = () => html`<button onclick=${() => this.count++}>Click! (count is: ${() => this.count})</button>`

	css = `
		button {
			border: 2px solid deeppink;
			margin: 5px;
		}
	`

	connectedCallback() {
		super.connectedCallback()

		// Log the `count` any time it changes:
		createEffect(() => {
			console.log('count is:', this.count)
		})
	}
}
```

Use the `<click-counter>` in a plain HTML file:

```html
<body>
	<click-counter></click-counter>

	<!-- Manually set the `count` value in HTML: -->
	<click-counter count="100"></click-counter>

	<script type="module">
		import './click-counter.js'

		// Manually set the `count` value in JS:
		document.querySelector('click-counter').count = 200
	</script>
</body>
```

[Example on CodePen](https://codepen.io/trusktr/pen/zYeRqaR) (without decorators)

> [!Note]
> Once decorators land in browsers, the above example will work out of the box
> as-is without compiling, but for now a compile step is needed for using decorators.
>
> JSX can be used for the `template` of an element, but that will always require
> compiling:
>
> ```jsx
> template = () => <button> Click! (count is: {this.count}) </button>
> ```
>
> Further examples below show how to define elements without decorators or JSX, which
> works today without a compiler.

Use the `<click-counter>` in another element's `template`,

```js
import {Element, element} from '@lume/element'
import html from 'solid-js/html'
import {signal} from 'classy-solid'

@element('counter-example')
class CounterExample extends Element {
	@signal count = 50 // Not an attribute, only a signal.

	template = () => html`<click-counter count=${() => this.count}></click-counter>`
}

document.body.append(new CounterExample())
```

Use `<click-counter>` in a plain function component (i.e. a Solid.js component):

```js
// At this point this, this boils down to plain Solid.js code (`@lume/element` comes
// with `solid-js`)

import {createSignal} from 'solid-js'
import html from 'solid-js/html'

function CounterExample() {
	const [count, setCount] = createSignal(50)

	return html`<click-counter count=${count()}></click-counter>`
}

document.body.append(CounterExample())
```

## Intro

[Custom](https://developers.google.com/web/fundamentals/web-components/customelements)
[Elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements)
(also known as [Web
Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) are a
feature of browsers that allow us to define new HTML elements that the browser
understands in the same way as built-in elements like `<div>` or `<button>`.
They are very useful for organizaing web apps into separately and sometimes
re-usable pieces (elements).

If that flew over your head then you might first want to try a [beginner HTML
tutorial](https://htmldog.com/guides/html/beginner/). You will also need to
some basic knowledge of
[JavaScript](https://www.google.com/search?q=JavaScript%20for%20absolute%20beginners).

`@lume/element` provides a set of features that make it easier to manipulate
elements and to define new custom elements and easily compose them together
into an application.

With `@lume/element` we can create custom elements that have the following
features:

- Reactive instance properties that receive values from element attributes of the same name (but dash-cased).
- Declarative templates, written with JSX or `html` template tag, that automatically update when reactive instance properties are used in the templates.
- Scoped styling with or without a ShadowRoot.
- Decorators for concise element definitions.

<details><summary>A more detailed feature description:</summary>

- Element attributes are defined with `@attribute` decorators on class fields.
  - Class fields decorated with `@attribute` receive values from HTML attributes
    (with the same name but dash-cased) when the HTML attribute values change.
  - Deorators are powered by
    [`classy-solid`](https://github.com/lume/classy-solid): utilities for using
    [Solid.js](https://solidjs.com) patterns on `class`es, such as the `@signal`
    decorator for making class fields reactive (backed by Solid signals).
    Decorators from `@lume/element` compose the `@signal` decorator to make
    properties be reactive.
  - As decoraators are not out in browser yet, an alternative non-decorator API
    can be used, which does not require a build.
- Each custom element can have an HTML template that automatically updates the DOM when any
  reactive variable used in the template changes.
  - Templates can be written in the form of HTML-like markup inside JavaScript
    called [JSX](https://facebook.github.io/jsx), specifically the JSX flavor from
    Solid.js. This requires a build step.
  - Templates can also be written using Solid's `html` template string tag,
    which does not require a build.
  - When a template updates, the whole template does not re-run, only the part
    of the template where a variable changed is updated, and only that particular
    piece of
    [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)
    gets modified. There is no virtual DOM diffing.
  - Because changes to HTML attributes on an element map to properties backed by
    signals on the element instance, this will cause the custom element's template
    to update if its template uses those properties.
- `@lume/element` can be used to create and manipulate trees of DOM elements
  without necessarily creating new custom elements, using function-style
  components. This can be especially useful for breaking pieces of a custom
  element into a few smaller parts without necessarily making new custom elements
  for each part if they don't need to be new elements.
- Custom element styles are automatically scoped, similar to Vue, Svelte, and other systems with style scoping.
  - If you're familiar with custom elements, you know that the browser gives
    this to us for free when using ShadowDOM.
  - If you opt an element out of having a ShadowRoot, `@lume/element` applies
    its own style scoping for the element at the nearest root node.

</details>

<details><summary><h2>Install and Setup</h2></summary>

> **STUB:** This section needs expansion, but should be enough for anyone
> familiar with common build tooling in the webdev/JS ecosystem. Contributions
> very welcome!

<details><summary><h3>CDN method (easiest, no compiler or command line needed)</h3></summary>

Follow the guide on [installing `lume` from
CDN](https://docs.lume.io/guide/install/?id=cdn-easiest), but simply replace
`lume` with `@lume/element`. The process is otherwise the same.

The examples here in the README follow the CDN approach to keep things simple,
[for example](https://codepen.io/trusktr/pen/zYeRqaR).

> [!Note]
> Decorator syntax and JSX syntax are both not supported with this install
> method as it does not use a build step. In the near future, decorators will be
> out natively in browsers and JS engines (but not JSX).

</details>

<details><summary><h3>Local install with build</h3></summary>

This assumes some familiarity with command lines and JavScript build tools.

First make sure Node.js is installed so that we have the `npm` package manager avaiable.

Install the `@lume/element` package using the following in a terminal:

```sh
npm install @lume/element
```

In order to use decorators today (recommended), we need to compile
them with TypeScript 5 or higher (recommended, even if writing JS and not TS, as
decorator syntax works out of the box with TypeScript), or use the [Babel
compiler](http://babeljs.io) with
[`@babel/plugin-proposal-decorators`](https://babeljs.io/docs/babel-plugin-proposal-decorators).

```sh
npm install --save-dev typescript
# or
npm install --save-dev @babel/cli @babel/core @babel/plugin-proposal-decorators
```

If using TypeScript, set `allowJs` in `tsconfig.json` to allow compiling JS files, f.e.:

```js
{
	"compilerOptions": {
		"allowJs": true,
		"outDir": "dist"
	},
	"include": ["./src/**/*"]
}
```

and running `npx tsc`. See the [TypeScript](#typescript) section below for configuring JSX
types for various frameworks (Solid, React, Preact, etc).

If using Babel, add the decorators plugin to `.babelrc`, f.e.

```json
{
	"plugins": ["@babel/plugin-proposal-decorators"]
}
```

and running `npx babel src --out-dir dist`.

If you'd like to use the HTML-like markup inside JavaScript known as "JSX",
instead of [Solid's `html` template
tag](https://github.com/solidjs/solid/tree/main/packages/solid/html) which
requires no build, the
[`babel-preset-solid`](https://npmjs.com/babel-preset-solid) package will also
be needed:

```sh
npm install --save-dev babel-preset-solid
```

Configure Babel to use the preset inside your project's `.babelrc` file or in
your Webpack `babel-loader` config:

```json
{
	"plugins": ["@babel/plugin-proposal-decorators"],
	"presets": ["solid"]
}
```

> [!Note]
> If compiling decorators with TypeScript, Babel is still needed for Solid JSX
> because TypeScript does not compile JSX into Solid.js format, only into React
> format. Either compile decorators with TypeScript and have Babel compile
> JSX in a second step, or compile both decorators and JSX with Babel in a
> single step.

</details>

</details>

## Basic Usage

### Create custom elements

A great way to create re-usable components is to create Custom Elements. The
advantage of custom elements is that they follow web standards, and therefore
they can be used in any web application and manipulated by any DOM
manipulation libraries like [jQuery](https://jquery.com/),
[React](https://reactjs.org), [Vue](https://vuejs.org), [Svelte](https://svelte.dev/), or
[Angular](https://angular.io), [Solid.js](https://solidjs.com), and all the rest.

The following is a custom element definition with a reactive property
`firstName` that also accepts values from an attribute named `first-name` (the
property name is converted to dash-case for the attribute name).

> [!Note]
> Deorators and JSX are not required. The non-decorator and non-JSX forms are
> shown further below. The [Decorators](#decorators) section has details on each
> decorator available.

```jsx
import {
	Element, // A base class for LUME custom elements
	element, // A decorator for defining elements, required for reactive JS properties.
	attribute, // A property decorator to map attributes to properties, and that makes properties reactive
	css, // A no-op identity template tag function (useful to enable CSS syntax highlighting in various text editors)
	event, // A property decorator that does two things: documents the type of an event an element emits, and accepts a listener function that is executed when that event is emitted.
} from '@lume/element'

@element('greeting-card') // defines the element tag name
class GreetingCard extends Element {
	// The firstName property will be a reactive variable, and any value
	// from an attribute named 'first-name' will be mapped back to this property (the attribute
	// name is the dash-case version of the property name).
	@attribute firstName = 'Roger'

	// Define a DOM tree that we want rendered on screen by providing a
	// `template`. The `template` should be a function that returns a DOM
	// element or array of DOM elements (which we can create with JSX, or with
	// an `html` template tag, or with plain JS). The DOM content will be, by
	// default, appended into the ShadowRoot of our custom element.
	//
	// To take advantage of reactivity in our template, simply interpolate
	// properties that were decoratored with an attribute decorator or defined
	// with `static observedAttributeHandlers` into the template.
	//
	// Here, any time the `.firstName` property's value changes, the DOM will be
	// automatically updated.
	template = () => (
		<div>
			<span>
				Hello <i>{this.firstName}</i>
			</span>
			{/* Children of a <greeting-card> element get rendered here. */}
			<slot></slot>
		</div>
	)

	// Apply styling to this element and its content with the static `css` property.
	// Because the property is static, this style is re-used across all instances of the element.
	// Styles are by default scoped to the element's content due to ShadowRoot style encapsulation.
	static css = css`
		:host {
			background: skyblue;
		}
		div {
			color: pink;
		}
	`

	// For instance-specific styling, use the non-static `css` property.  This
	// style has higher precedence over styles in the `static css` property.  In
	// this example, the divs in each instance of this element will have borders
	// of random sizes.  Note, `css` is currently not reactive, it runs once
	// initially, so using a reactive property in the css will currently not
	// update the style.
	css = css`
		div {
			border: ${Math.random() * 5}px solid teal;
		}
	`

	// connectedCallback is a method that fires any time this custom element is
	// connected into a web site's live DOM tree.
	connectedCallback() {
		super.connectedCallback() // Don't forget to call the super method!

		// Once the element is connected, let's update the `.firstName` prop after a
		// couple of seconds, and we'll see the change on screen.
		setTimeout(() => (this.firstName = 'Zaya'), 2000)

		// And show that it works by setting HTML attributes too, two seconds later.
		setTimeout(() => this.setAttribute('first-name', 'Raquel'), 4000)

		// The element may dispatch events.
		setTimeout(() => this.dispatchEvent(new Event('hello')), 3000)
	}

	// Use the disconnectedCallback to clean anything up when the element is removed from the DOM.
	disconnectedCallback() {
		super.disconnectedCallback()
		// ... clean up ...
	}

	// Define event properties to specify which events the element dispatches.
	// Besides being useful for type definitions in JSX, these properties work
	// like the builtin event properties.
	// For example, a user can write `el.onhello = event => {...}` just like
	// they can do with builtin event properties like `el.onclick = event =>
	// {...}`.  When the user writes `el.onhello = event => {...}`, the property
	// will automatically use `this.addEventListener('hello', event => {...})`
	// to register the listener. If the value of the property is changed, the
	// previous listener will be removed and the new listener added (or no new
	// listener added if the value is not a function, for example null).
	@event onhello = null
}
```

Now we can use it in the HTML of a web site, or in the template of another
component:

```jsx
<greeting-card first-name="Raynor" onhello={() => console.log(event.target.firstName, 'says hello')}></greeting-card>
```

[Example on CodePen](https://codepen.io/trusktr/pen/WNqVWaL?editors=1011) (without decorators, with Solid's `html` template tag instead of JSX)

Inside an element's `template()` method we can assign bits and pieces of DOM to
variables, and we can also use other custom elements and functional components.
Similary, the `css` property can also be a method:

```jsx
@element('greeting-card')
class GreetingCard extends Element {
	// ... same as before ...

	// This time 'template' is a method that has some logic, and refers to pieces of DOM using variables.
	template() {
		const greeting = (
			<span>
				Hello <i>{this.firstName}</i>
			</span>
		)

		console.log(greeting instanceof HTMLSpanElement) // true

		// One piece of DOM can be composed into another:
		const result = <div>{greeting}</div>

		console.log(result instanceof HTMLDivElement) // true

		return result
	}

	// ... same as before ...

	css() {
		const thickness = Math.random() * 5

		return css`
			div {
				border: ${thickness}px solid teal;
			}
		`
	}

	// ... same as before ...
}
```

### Easily create and manipulate DOM

The following is just plain Solid.js at the top level of a module. This sort of
code can be useful in the `template` of a custom element, or the body of a
functional component.

```jsx
import {createSignal} from 'solid-js'

// Make a signal with an initial value of 0.
const [count, setCount] = createSignal(0)

// Increment the value of count every second.
setInterval(() => setCount(count() + 1), 1000)

// Create a <div> element with a child <h1> element. The data-count attribute
// and the text content of the <h1> element will automatically be updated whenever
// the count variable changes.
const el = (
	<div>
		<h1 data-count={count()}>The count is: {count()}</h1>
	</div>
)

// The result stored in the `el` variable is a `<div>` element! For example,
// we can call regular DOM APIs like `setAttribute` on it.
el.setAttribute('foo', 'bar')

// Append the element to the body of the page, and now we'll see a
// continually-updating message on the screen.
document.body.append(el)
```

[Example on CodePen](https://codepen.io/trusktr/pen/bGPXmEJ) (with Solid's `html` template tag instead of JSX)

### Create functional components

Continuing with the same `count` variable from the previous example, here's how
to compose DOM trees using "functional components". This is also just plain
Solid.js, but can be useful in a custom element's `template`.

A functional component is a function that simply returns one or more DOM
elements. JSX expressions and the `html` template string tag both return the top
level elements defined in the markup.

```jsx
// This is just plain Solid.js code. See https://solidjs.com for more on writing
// functional components.

// This Label functional component uses the empty <></> tag to contain more than
// one root-level child, and the return value will be an array of DOM nodes.
const Label = props => (
	<>
		<div>{props.greeting}</div>
		{props.children}
	</>
)

// This Greeting functional component nests the content of the Label component
// in its template, and the <div> inside the <Label> gets distributed to the
// part of the Label component where we see `{props.children}`.
const Greeting = () => (
	<section>
		<Label greeting={'hello (' + count() + ')'}>
			<div>John</div>
		</Label>
	</section>
)

// The `Greeting` function only needs to be called once, and it will return a
// reference to an element or multiple elements. The `Greeting` function does
// NOT need to be called over and over to re-render like in some other libraries
// (for example React). That's what makes all of this simple and clean. The
// reactivity inside the component templates takes care of updating content of
// the created DOM tree.
// Here `elem` will be a reference to an actual `<section>` element that the
// `Greeting` function returned.
const elem = Greeting()

// It's just DOM! Use regular DOM APIs to append the element to the body.
document.body.append(elem)
```

[Example on CodePen](https://codepen.io/trusktr/pen/eYwqPzz) (with Solid's `html` template tag instead of JSX)

Writing function components can sometimes be simpler, but functional components
do not have features that custom elements have like style scoping (style scoping
with function components requires an additional Solid.js library or compiler
plugin).

In contrast to custom elements, functional components only work within the
context of other functional components made with Solid.js or custom elements
made with `@lume/element`. Functional components will no longer be compatible
with React, Vue, Angular, Svelte, or all the other web libraries and frameworks.
For portability across applications and frameworks, this is where custom
elements accel.

Custom elements are also debuggable in a browser's element inspector _out of the
box_, while functional components are not (functional components require
devtools plugins for each browser, if they even exist). See Lume's [Debugging
guide](https://docs.lume.io/guide/debugging) for an example.

### Using functional components inside custom elements

Continuing from above, here's a custom element that re-uses the `Greeting`
component. This shows that any regular Solid.js component can be
used in the `template` of a custom element made with `@lume/element`:

```jsx
@element('cool-element')
class CoolElement extends Element {
	template = () => (
		<>
			<h2>Here's a greeting:</h2>
			<Greeting />
		</>
	)
}

document.body.insertAdjacentHTML('beforeend', `<cool-element></cool-element>`)
```

[Example on CodePen](https://codepen.io/trusktr/pen/bGPXmRX) (without decorators, with Solid's `html` template tag instead of JSX)

## API

### `Element`

A base class for custom elements made with `@lume/element`.

> [!Note]
> The `Element` class from `@lume/element` extends from `HTMLElement`.
>
> Safari does not support customized built-ins, and neither does
> `@lume/element`, so at the moment we do not support extending from other classes
> such as `HTMLButtonElement`, etc.

The `Element` class provides:

#### `template`

A subclass can define a `.template` that returns a DOM node, and this DOM node
will be appened into the element's `ShadowRoot` by default, or to the element
itself if `.hasShadow` is `false`.

One way to write a `template` is using [Solid
JSX](https://www.solidjs.com/tutorial/introduction_jsx) syntax (this will always
require a build step).

```js
import {Element} from '@lume/element'
import {createSignalFunction} from 'classy-solid' // a small wrapper around Solid's createSignal that allows reading and writing from the same function.

class CoolElement extends Element {
	count = createSignalFunction(100)

	template = () => (
		<div>
			<span>The count is: {this.count()}!</span>
		</div>
	)
	// ...
}

customElements.define('cool-element', CoolElement)
```

Another way to write a `template` is using Solid's `html` template string tag
(which does not require a build step). Using the following `template`, the
example can run in a browser without a compile step (note, we're not using
decorators yet):

```js
// ...
template = () => html`
	<div>
		<span>The count is: ${this.count}!</span>
	</div>
`
// ...
```

[Example on CodePen](https://codepen.io/trusktr/pen/xxovyQW) (with `html` template tag instead of JSX)

> [!Note]
> When `count` changes, the template updates automatically.

We can also manually create DOM any other way, for example here we make and
return a DOM tree using DOM APIs, and using a Solid effect to update the element
when `count` changes (but we could have used React or jQuery, or anything
else!):

```js
// ...same...

import {createEffect} from 'solid-js'

// ...same...

// Replace the previous `template` with this one:
template = () => {
	const div = document.createElement('div')
	const span = document.createElement('span')
	div.append(span)

	createEffect(() => {
		// Automatically set the textContent whenever `count` changes (this is a
		// conceptually-simplified example of what Solid JSX compiles to).
		span.textContent = `The count is: ${this.count()}!`
	})

	return div
}

// ...same...
```

[Example on CodePen](https://codepen.io/trusktr/pen/ExBqdMQ)

#### `static css`

Use the _static_ `css` field to define a CSS string for styling all instances of
the given class. A static property allows `@lume/element` to optimize by sharing
a single `CSSStyleSheet` across all instances of the element, which could be
beneficial for performance if there are _many thousands_ of instances.

```js
import {Element} from '@lume/element'

class CoolElement extends Element {
	template = () => <span>This is some DOM!</span>

	// Style is scoped to our element, this will only style the <span> inside our element.
	static css = `
    span { color: violet; }
  `
}

customElements.define('cool-element', CoolElement)
```

[Example on CodePen](https://codepen.io/trusktr/pen/OJeKBKP) (with `html` template tag instead of JSX)

The `static css` property can also be a function:

```js
// ...

class CoolElement extends Element {
	// ...
	static css = () => {
		const color = 'limegreen'

		return `
      span { color: ${color}; }
    `
	}
	// ...
}
```

[Example on CodePen](https://codepen.io/trusktr/pen/GRbVwzj) (with `html` template tag instead of JSX)

> :bulb:**Tip:**
>
> Use the `css` identity template tag to enable syntax highlighting and code formatting in some IDEs:

```js
import {css} from '@lume/element'
// ...

class CoolElement extends Element {
	// ...
	static css = css`
		span {
			color: cornflowerblue;
		}
	`
	// ...
}
```

#### `css`

Use the _non-static_ `css` property to define styles that are applied _per
instance_ of the given element. This is useful for style that should differ
across instances. This will not be as optimized as `static css` will be because
it will create one stylesheet per element instance, but the performance
difference will not matter for most use cases.

```js
import {Element, css} from '@lume/element'

class CoolElement extends Element {
	template = () => <span>This is some DOM!</span>

	// A random color per instance.
	#color = `hsl(calc(${Math.random()} * 360) 50% 50%)`

	// Style is scoped to our element, this will only style the <span> inside our element.
	css = css`
		span {
			color: ${this.#color};
		}
	`
}
```

[Example on CodePen](https://codepen.io/trusktr/pen/NWZQEJa) (with `html` template tag instead of JSX)

#### `connectedCallback`

Nothing new here, this is simply a part of the browser's [native Custom Elements
`connectedCallback` API](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#custom_element_lifecycle_callbacks).
It is triggered when the element is connected into the document. Use it to
create things.

```js
import {Element} from '@lume/element'

class CoolElement extends Element {
	connectedCallback() {
		// Don't forget to call the super method from the Element class!
		super.connectedCallback()

		// ...Create things...
	}
	// ...
}
```

#### `disconnectedCallback`

Nothing new here, this is simply a part of the browser's [native Custom Elements
`disconnectedCallback` API](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#custom_element_lifecycle_callbacks).
It is triggered when the element is disconnected from the document. Use it to
clean things up.

```js
import {Element} from '@lume/element'

class CoolElement extends Element {
	disconnectedCallback() {
		// Don't forget to call the super method from the Element class!
		super.disconnectedCallback()

		// ...Clean things up...
	}
	// ...
}
```

#### `adoptedCallback`

Nothing new here, this is simply a part of the browser's [native Custom Elements
`adoptedCallback` API](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#custom_element_lifecycle_callbacks).
It is triggered when the element is adopted into a new document (f.e. in an iframe).

```js
import {Element} from '@lume/element'

class CoolElement extends Element {
	adoptedCallback() {
		// Don't forget to call the super method from the Element class!
		super.adoptedCallback()

		// ...Do something when the element was transferred into another window's or iframe's document...
	}
	// ...
}
```

#### `attributeChangedCallback`

Nothing new here, this is simply a part of the browser's [native Custom Elements
`attributeChangedCallback` API](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#custom_element_lifecycle_callbacks).
It is triggered when an _observed attribute_ of the element is added, modified,
or removed.

```js
import {Element} from '@lume/element'

class CoolElement extends Element {
	static observedAttributes = ['foo', 'bar']

	attributeChangedCallback(attributeName, oldValue, newValue) {
		// Don't forget to call the super method from the Element class!
		super.attributeChangedCallback(attributeName, oldValue, newValue)

		// Attribute name is the name of the attribute change changed.
		// If `oldValue` is `null` and `newValue` is a string, it means the attribute was added.
		// If `oldValue` and `newValue` are both strings, it means the value changed.
		// If `oldValue` is a string and `newValue` is `null`, it means the attribute was removed.
	}
	// ...
}
```

> [!Warning]
> The `static observedAttributes` property is required for observing attributes, and specifies which
> attributes will trigger `attributeChangedCallback`. `attributeChangedCallback`
> will not be triggered for any attributes that are not listed in `static observedAttributes`!

#### `static observedAttributes`

Nothing new here, this is simply a part of the browser's [native Custom Elements
`static observedAttributes` API](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#responding_to_attribute_changes).
It defines which attributes will be observed. From the previous example:

```js
class CoolElement extends Element {
	static observedAttributes = ['foo', 'bar']
	// ...
}
```

Note! Although `static observedAttributes` works, it is recommended to use the
`static observedAttributeHandlers` property instead:

#### `static observedAttributeHandlers`

This is an alternative to attribute decorators (recommended, see the
[Decorators](#decorators) docs below), and will be removed once decorators
are supported natively in JS engines.

As an alternative to `static observedAttributes`, and mainly for non-decorator
users (because not all JS engines support them yet at time of writing this),
observed attributes can be defined with `static observedAttributeHandlers`, a
map of attribute names to attribute handlers. This requires using the `@element`
decorator (calling it as a plain function for non-decorator usage). This will
map attributes to JS properties and make the JS properties reactive.

`static observedAttributeHandlers` is an object where each key is a property
name to be associated with an attribute, and each value is an object with the
following shape:

```ts
/**
 * Defines how values are mapped from an attribute to a JS property on a custom
 * element class.
 */
export type AttributeHandler<T = any> = {
	// TODO `to` handler currently does nothing. If it is present, then prop
	// changes should reflect back to the attribute. This will add a performance
	// hit.
	to?: (propValue: T) => string | null

	/**
	 * Define how to deserialize an attribute string value on its way to the
	 * respective JS property.
	 *
	 * If not defined, the attribute string value is passed to the JS property
	 * untouched.
	 */
	from?: (AttributeValue: string) => T

	/**
	 * @deprecated - Define a field with the initial value instead of providing
	 * the initial value here. When decorators land in browsers, this will be
	 * removed.
	 *
	 * The default value that the respective JS property should have when the
	 * attribute is removed.
	 *
	 * If not initially defined, this will be defined to whatever the initial JS
	 * property value is (recommended, especially for type checking and
	 * intellisense).
	 *
	 * When explicitly defined, an attribute's respective JS property will be set to this
	 * value when the attribute is removed, even if that is different than the JS property's initial value.
	 *
	 * If this is not explicitly defined, and the JS property has no initial
	 * value, then the JS property will receive `undefined` when the attribute
	 * is removed which matches the initial value of the JS property (this is
	 * not ideal, especially in TypeScript, and we should provide initial JS
	 * property values so that shapes of our elements are well defined when
	 * attributes are removed).
	 */
	default?: T
}
```

Here's an example of an element definition with no decorators, with
HTML attributes mapped to same-name JS properties:

```js
import {Element, element} from '@lume/element'

element('cool-element')(
	class CoolElement extends Element {
		static observedAttributeHandlers = {
			foo: {from: Number},
			bar: {from: Boolean},
		}

		// Due to the `observedAttributeHandlers` definition, any time the `"foo"` attribute
		// on the element changes, the attribute string value will be converted into a
		// `Number` and assigned to the JS `.foo` property.
		// Not only does `.foo` have an initial value of `123`, but when the element's
		// `"foo"` attribute is removed, `.foo` will be set back to the initial value
		// of `123`.
		foo = 123

		// Due to the `observedAttributeHandlers` definition, any time the `"bar"` attribute
		// on the element changes, the attribute string value will be converted into a
		// `Boolean` and assigned to the JS `.bar` property.
		// Not only does `.bar` have an initial value of `123`, but when the element's
		// `"bar"` attribute is removed, `.bar` will be set back to the initial value
		// of `false`.
		bar = false

		// ...
	},
)
```

[Example on CodePen](https://codepen.io/trusktr/pen/rNEXoOb?editors=1111)

`@lume/element` comes with a set of basic handlers available out of the box, each of
which are alternatives to a respective set of included [decorators](#decorators):

```js
import {Element, element, attribute} from '@lume/element'

element('cool-element')(
	class CoolElement extends Element {
		static observedAttributeHandlers = {
			lorem: {}, // Effectively the same as attribute.string()
			foo: attribute.string(), // Effectively the same as the @stringAttribute decorator. Values get passed to the JS property as strings.
			bar: attribute.number(), // Effectively the same as the @numberAttribute decorator. Values get passed to the JS property as numbers.
			baz: attribute.boolean(), // Effectively the same as the @booleanAttribute decorator. Values get passed to the JS property as booleans.

			// Here we define an attribute with custom handling of the string value, in this case making it accept a JSON string that maps it to a parsed object on the JS property.
			bespoke: {from: value => JSON.parse(value)}, // f.e. besoke='{"b": true}' results in the JS property having the value `{b: true}`
		}

		// The initial values of the JS properties define the values that the JS properties get reset back to when the corresponding attributes are removed.
		lorem = 'hello'
		foo = 'world'
		bar = 123
		baz = false
		bespoke = {n: 123}

		// ...
	},
)
```

[Example on CodePen](https://codepen.io/trusktr/pen/rNEXbOR?editors=1011)

If decorator support is present (either with a build, or natively in near-future
JS engines), defining attributes with [decorators](#decorators) is simpler and more concise:

```js
import {Element, element, numberAttribute, booleanAttribute} from '@lume/element'

@element('cool-element')
class CoolElement extends Element {
	// Due to the `@numberAttribute` decorator, any time the `"foo"` attribute
	// on the element changes, the attribute string value will be converted into a
	// `Number` and assigned to the JS `.foo` property.
	// Not only does `.foo` have an initial value of `123`, but when the element's
	// `"foo"` attribute is removed, `.foo` will be set back to the initial value
	// of `123`.
	@numberAttribute foo = 123

	// Due to the `@booleanAttribute` decorator, any time the `"bar"` attribute
	// on the element changes, the attribute string value will be converted into a
	// `Boolean` and assigned to the JS `.bar` property.
	// Not only does `.bar` have an initial value of `true`, but when the element's
	// `"bar"` attribute is removed, `.bar` will be set back to the initial value
	// of `true`.
	@booleanAttribute bar = true

	// ...
}
```

> [!Note]
> Not only do decorators make the definition more concise, but they avoid surface
> area for human error: the non-decorator form requires defining the same-name
> property in both the `static observedAttributeHandlers` object and in the class fields, and if
> we miss one or the other then things might not work as expected.

Each of the available decorators are detailed further [below](#decorators).

Decorators, and the `static observedAttributeHandlers` object format, both work with
getter/setter properties as well:

```js
import {Element, element, numberAttribute, booleanAttribute} from '@lume/element'

@element('cool-element')
class CoolElement extends Element {
	#foo = 123

	// Like with class fields, the initial value is 123, so when the "foo"
	// attribute is removed the setter will receive 123.
	@numberAttribute
	get foo() {
		return this.#foo
	}
	set foo(v) {
		this.#foo = v
	}
	// ...
}
```

They also work with "auto accessors", which creates a _prototype_ getter/setter:

```js
@element('cool-element')
class CoolElement extends Element {
	// The same rules with initial values and attribute removal apply.
	@numberAttribute accessor foo = 123
	@booleanAttribute accessor bar = false

	// ...
}
```

It may be redundant to write `accessor` repeatedly for each property when the
alternative non-accessor format works too. The `accessor` format can be a
fallback in very rare cases where a performance boost is needed (for example
thousands of objects with many non-accessor properties being instantiated all at
once). Most likely there will be _other_ performance issues at the point in
which we have thousands of elements being instantiated at once causing an any
issues.

#### `static events`

This is an alternative for the `@event` decorator (recommended, see the
[Decorators](#decorators) docs below), and will be removed when native support for
decorators lands in JS engines.

When not using decorators, use the `static events` property to define which
events an element will dispatch. Any events defined this way will automatically
set up `on`-prefixed properties that accept event listener functions.

For example if an `"jump"` is listed as an event in `static events`, then a
respective `onjump` property will be available on the element as a shortcut for
adding an event listener, similar to native event properties like `onclick`,
`onload`, etc:

```js
import {Element, element} from '@lume/element'

const SomeEl = element('some-el')(
	class extends Element {
		static events = ['jump']

		// For type checking, also define the property explicitly.
		/** @type {EventListener | null} */
		onjump = null

		connectedCallback() {
			super.connectedCallback()

			// This element dispatches "jump" events at some point:
			setInterval(() => this.dispatchEvent(new Event('jump')), 1000)
		}
	},
)

const el = new SomeEl()

el.onjump = () => console.log('jump!')

document.body.append(el)

// "jump!" will be logged every second.
```

Note that for TypeScript JSX types (TSX), we want to also define event
properties on the class, for example `onjump` in the last example. Any
properties that start with `on` will be mapped to `on`-prefixed JSX props for
type checking. See the [TypeScript](#typescript) section for more info.

#### `static elementName`

The default tag name of the elements this class instantiates. When using
the `@element` decorator, this property will be set to the value defined
by the decorator.

```js
@element
class SomeEl extends LumeElement {
	static elementName = 'some-el'
}

SomeEl.defineElement() // defines <some-el> with the SomeEl class
```

[Example on CodePen](https://codepen.io/trusktr/pen/ZEdgMZY)

#### `static defineElement`

Define this class for the given element `name`, or using its default name
(`TheClass.elementName`) if no was `name` given and the element was not already
defined using the `@element` decorator. Defaults to using the global
`customElements` registry unless another registry is provided (for example a
ShadowRoot-scoped registry) as a second argument.

```js
@element('some-el') // defines <some-el> with the decorated class
class SomeEl extends LumeElement {}

const OtherEl = SomeEl.defineElement('other-el') // defines <other-el> with an empty subclass of SomeEl
console.log(OtherEl === SomeEl) // false

@element // without a name, the decorator does not perform the element definition
class AnotherEl extends LumeElement {}

const El = AnotherEl.defineElement('another-el') // defines <another-el>
console.log(El === AnotherEl) // true
const El2 = AnotherEl.defineElement('yet-another-el') // defines <yet-another-el>
console.log(El2 === AnotherEl) // false
```

If the class is already registered with another name, then the class will be
extended with an empty subclass so that a new class is used for the new name,
because a CustomElementRegistry does not allow the same class reference to be
used more than once regardless of the name.

Returns the defined element class, which may be a different subclass of the
class this is called on if the class this is called on is already associated
with another name, otherwise returns the same class this is called on.

[Example on CodePen](https://codepen.io/trusktr/pen/JjQgaxb)

#### `hasShadow`

When `true`, the custom element will have a `ShadowRoot`. Set to `false`
to not use a `ShadowRoot`. When `false`, styles will not be scoped via
the built-in `ShadowRoot` scoping mechanism, but by a much more simple
shared style sheet placed at the nearest root node, with `:host`
selectors converted to tag names.

```js
@element('some-el')
class SomeEl extends Element {
	hasShadow = false

	template = () => html`<div>hello</div>`
}
```

The `template` content will be appended to the SomeEl instance directly, with no `ShadowRoot`:

```html
<some-el id="el"></some-el>
<script>
	const el = document.getElementById('el')
	console.log(el.shadowRoot) // null
	console.log(el.children[0]) // <div>hello</div>
</script>
```

[Example on CodePen](https://codepen.io/trusktr/pen/eYwqLPY)

> [!Note]
> Note that without a ShadowRoot, `<slot>` no longer works because it must be
> inside a ShadowRoot, therefore going without a ShadowRoot is useful moreso for
> elements that are leafs at the end of DOM tree branches and elements that
> will not accept any slotted children and will only have `template` content as their
> children.

#### `templateRoot`

Subclasses can override the `templateRoot` property to provide an alternate Node for
`template` content to be placed into (f.e. a subclass can set it to `this` to have
`template` content appended to itself regardless of the value of `hasShadow`).

A primary use case for this is customizing the ShadowRoot:

```js
@element('some-el')
class SomeEl extends Element {
	// Create the element's ShadowRoot with custom options for example:
	templateRoot = this.attachShadow({
		mode: 'closed',
	})

	template = () => html`<div>hello</div>`
}
```

[Example on CodePen](https://codepen.io/trusktr/pen/MWMNpbR)

#### `shadowOptions`

Define a `shadowOptions` property to specify any options for the element's
ShadowRoot. These options are passed to `attachShadow()`. This is a simpler
alternative to overriding `templateRoot` in the previous example.

```js
@element('some-el')
class SomeEl extends Element {
	shadowOptions = {mode: 'closed'}

	template = () => html`<div>hello</div>`
}
```

#### `styleRoot`

Similar to the previous `templateRoot`, this defines which `Node` to append style
sheets to when `hasShadow` is `true`. This is ignored if `hasShadow` is
`false`. It defaults to `this.templateRoot`, which in turn defaults to the element's
`ShadowRoot`.

When `hasShadow` is `true`, an alternate `styleRoot` is sometimes desired so
that styles will be appended elsewhere than the `templateRoot`. To customize
this, override it:

```js
@element('some-el')
class SomeEl extends Element {
	styleRoot = document.createElement('div')

	template = () => html`
		<div>
			<div>${this.styleRoot}</div>

			<span>hello</span>
		</div>
	`
}
```

[Example on CodePen](https://codepen.io/trusktr/pen/yLdmxEW)

This can be useful for fixing issues where the default append location of an
element's style sheet into the `ShadowRoot` conflicts with how DOM is created in
`template` (f.e. if the user's DOM creation in `template` clears the
`ShadowRoot` content, or etc, then the user may want to place the stylesheet
somewhere else).

#### `createEffect`

The `createEffect` method is a wrapper around Solid's `createEffect` with some differences for convenience:

- `createRoot` is not required in order to dispose of effects created with `this.createEffect()`
- Effects created with `this.createEffect()` will automatically be cleaned up when the element is disconnected.
- Besides being useful for re-running logic on signals changes,
  `this.createEffect()` is useful as an alternative to `disconnectedCallback` when
  paired with Solid's `onCleanup`.

```js
import {Element} from '@lume/element'
import {createSignal, onCleanup} from 'solid-js'

const [count, setCount] = createSignal(0)

setInterval(() => setCount(n => ++n), 1000)

class CoolElement extends Element {
	connectedCallback() {
		super.connectedCallback()

		// Log `count()` any time it changes.
		this.createEffect(() => console.log(count()))

		this.createEffect(() => {
			const interval1 = setInterval(() => console.log('interval 1'), 1000)
			onCleanup(() => clearInterval(interval1))

			const interval2 = setInterval(() => console.log('interval 2'), 1000)
			onCleanup(() => clearInterval(interval2))
		})
	}
}

customElements.define('cool-element', CoolElement)

// After removing the element, onCleanup fires and cleans up the intervals created in connectedCallback (not the count interval outside the element)
setTimeout(() => {
	const el = document.querySelector('cool-element')
	el.remove()
}, 2000)
```

[Example on CodePen](https://codepen.io/trusktr/pen/MWNgaGQ?editors=1011)

Compare that to using `disconnectedCallback`:

```js
import {Element} from '@lume/element'
import {createSignal, onCleanup} from 'solid-js'

const [count, setCount] = createSignal(0)

setInterval(() => setCount(n => ++n), 1000)

class CoolElement extends Element {
	#interval1 = 0
	#interval2 = 0

	connectedCallback() {
		super.connectedCallback()

		// Log `count()` any time it changes.
		this.createEffect(() => console.log(count()))

		this.#interval1 = setInterval(() => console.log('interval 1'), 1000)
		this.#interval2 = setInterval(() => console.log('interval 2'), 1000)
	}

	disconnectedCallback() {
		super.disconnectedCallback()

		clearInterval(this.#interval1)
		clearInterval(this.#interval2)
	}
}

customElements.define('cool-element', CoolElement)
```

> :bulb:**Tip:**
>
> Prefer `onCleanup` instead of `disconnectedCallback` because composition of
> logic will be easier while also keeping it co-located and easier to read. That
> example is simple, but when logic grows, having to clean things up in
> `disconnectedCallback` can get more complicated, especially when each piece of
> creation logic and cleanup logic is multiple lines long and interleaving
> them would be harder to read. Plus, putting them in effects makes them
> creatable+cleanable if signals in the effects change, not just if the element is
> connected or disconnected. For example, the following element cleans up the
> interval any time the signal changes, not only on disconnect:

```js
import {Element} from '@lume/element'
import {createSignal, onCleanup} from 'solid-js'

const [count, setCount] = createSignal(0)

setInterval(() => setCount(n => ++n), 1000)

class CoolElement extends Element {
	connectedCallback() {
		super.connectedCallback()

		// Log `count()` any time it changes.
		this.createEffect(() => console.log(count()))

		this.createEffect(() => {
			// Run the interval only during moments that count() is an even number.
			// Whenever count() is odd, the running interval will be cleaned up and a new interval will not be created.
			// Also, when the element is disconnected (while count() is even), the interval will be cleaned up.
			if (count() % 2 !== 0) return
			const interval = setInterval(() => console.log('interval'), 100)
			onCleanup(() => clearInterval(interval))
		})
	}
}

customElements.define('cool-element', CoolElement)

// After removing the element, onCleanup fires and cleans up any interval currently created in connectedCallback (not the count interval outside the element)
setTimeout(() => {
	const el = document.querySelector('cool-element')
	el.remove()
}, 2500)
```

[Example on CodePen](https://codepen.io/trusktr/pen/qBeWOLz?editors=1011)

The beauty of this is we can write logic based on signals, without worrying
about `disconnectedCallback`, and we'll rest assured things clean up properly.
Cleanup logic is co-located with the pieces they are relevant to, which opens
the door to powerful compositional patterns...

### Decorators

Using decorators (if available in your build, or natively in your JS engine)
instead of `static observedAttributeHandlers` or `static events` is more concise
and less error prone.

Here's the list of included attribute decorators and the attribute handler
equivalents:

- Use `@stringAttribute foo` in place of `foo: {}`
- Use `@stringAttribute foo` in place of `foo: attribute.string()`
- Use `@numberAttribute foo` in place of `foo: attribute.number()`
- Use `@booleanAttribute foo` in place of `foo: attribute.boolean()`

> [!Warning]
> When using attribute decorators, the `@element` decorator is also required on
> the class, or the attribute decorators won't work.

Below are more details on each decorator:

#### `@element`

The star of the show, a decorator for defining a custom element.

When passed a string, it will be the element's tag name:

```js
import {Element, element} from '@lume/element'

@element('cool-element')
class CoolElement extends Element {
	// ...
}
```

> [!Note]
> Make sure you extend from the `Element` base class from `@lume/element` when
> using the `@element` decorator.

When not passed a string, the element will not be defined (while reactivity
features will still be applied), and `customElements.define` should be used
manually, which can be useful for upcoming scoped registries:

```js
import {Element, element} from '@lume/element'

@element
class CoolElement extends Element {
	// ...
}

customElements.define('cool-element', CoolElement)
// or
const myRegistry = new CustomElementRegistry()
myRegistry.define('cool-element', CoolElement)
```

Finally, even if passed a string for the element name, a second boolean option
can disable automatic definition as well. The constructor's `.defineElement()`
method can be used to trigger the definition using the given name:

```js
import {Element, element} from '@lume/element'

const autoDefine = false

@element('cool-element', autoDefine)
class CoolElement extends Element {
	// ...
}

CoolElement.defineElement() // defines <cool-element>
```

A custom name can be passed to `.defineElement()` too:

```js
CoolElement.defineElement('other-element') // defines <other-element> (even if `<cool-element>` is already defined)
```

#### `@attribute`

A decorator for defining a generic element attribute. The name of the property
is mapped from camelCase to dash-case.

The `@attribute` decorator is effectively the same as the `@stringAttribute` decorator.

```ts
import {Element, element, attribute} from '@lume/element'

@element('cool-element')
class CoolElement extends Element {
	@attribute firstName = null // the attribute name is first-name
	// ...
}
```

When an attribute is removed, the JS property will receive the default value
determined by the initial value of the JS property.

Sample usage of the attribute from the outside:

```js
const el = document.querySelector('cool-element')

el.setAttribute('first-name', 'Superman')
console.log(el.firstName) // logs "Superman"

el.removeAttribute('first-name')
console.log(el.firstName) // logs null
```

Had we defined a different initial value,

```js
	@attribute firstName = 'Batman'
```

then removing the attribute would have set the JS property back to that non-null value:

```js
const el = document.querySelector('cool-element')

el.setAttribute('first-name', 'Superman')
console.log(el.firstName) // logs "Superman"

el.removeAttribute('first-name')
console.log(el.firstName) // logs "Batman"
```

This is great because the intial values that we see in the class definition are
always the expected values when the element has no attributes, or when all
attributes are removed, making the outcome more _predictable and consistent_.

For TypeScript, if the initial value is a string and we're using `@attribute` (or
`@stringAttribute`), then no type annotation is needed because it will always
receive a string (f.e. even when the attribute is removed) and the type will be
inferred from the initial value:

```ts
@element('cool-element')
class CoolElement extends Element {
	@attribute firstName = 'Batman' // always a `string`
	// ...
}
```

You could of course make the string type more specific,

```ts
@element('cool-element')
class CoolElement extends Element {
	@attribute firstName: 'Batman' | 'Robin' = 'Batman'
	// ...
}
```

but note that this does not prevent any string value being set via the
attribute.

You can of course make a broader type that accepts a string from the element
attribute, but also other types via the JS property directly, but you'd
generally want to avoid this, unless you're using a getter/setter to coerce
setter values into a single consistent type that the getter always returns (like
how the builtin `el.style=` can accept a string but the return value of
`el.style` is always an object), or the user's input is always unchanged and
mapped separately to internal structures:

```ts
import {Element, element, attribute} from '@lume/element'

@element('cool-element')
class CoolElement extends Element {
	@attribute firstName: string | number = 'Batman'
	// ...
}
```

```js
const el = document.querySelector('cool-element')

el.firstName = 123 // ok
```

The `@attribute` decorator is also useful for defining new types of attribute
decorators. For example, here's how we would define an attribute that can accept
JSON string values, using the `from` option to define how string values _from_
the attribute are coerced when they are assigned to the JS property:

```js
// Here, `attribute` is not called as a decorator. When `attribute` is given an
// argument that defines how to handle an attribute, it will return a new
// decorator function.
const jsonAttribute = attribute({from: str => JSON.parse(str)})
```

Now we can use the new `jsonAttribute` decorator in an element class:

```js
@element('cool-element')
class CoolElement extends Element {
	@jsonAttribute someValue = {foo: 123}
	// ...
}
```

Now in HTML it can accept a JSON string:

```html
<cool-element id="el" some-value='{"foo": 456}'></cool-element>
<script>
	console.log(el.someValue) // logs the object {foo: 456}
	el.setAttribute('foo', '{"foo": 789}')
	console.log(el.someValue) // logs the object {foo: 789}
</script>
```

Note that we could have used `attribute` result as a decorator directly,

```js
@element('cool-element')
class CoolElement extends Element {
	@attribute({from: str => JSON.parse(str)}) someValue = {foo: 123}
	// ...
}
```

but then the result would not have been saved into a re-usable `jsonAttribute`
variable, and the class field definition would have been a little messier to
read.

What new attribute decorators will you make? A `@stringEnumAttribute` that
accepts only certain string values otherwise throws an error? A
`@cssColorAttribute` that accepts only CSS-format color strings otherwise throws
an error? A `@threeColorAttribute` that coerces CSS color values into Three.js
`Color` objects? The sky is not the limit!

#### `@stringAttribute`

The `@stringAttribute` decorator is effectively the same as the `@attribute`
decorator, but without the ability to accept arguments to define new attribute
decorators. See the previous section.

#### `@numberAttribute`

A decorator that defines an attribute that accepts a number. Any value the
attribute receives will be passed to the JS property, which is then coerced into
a number with `parseFloat`. The JS property will convert a `null` value
(attribute removed) to the default value defined by the initial property value,
and will convert any string into a number (if the string is invalid the property
value will result in `NaN`).

```ts
import {Element, element, numberAttribute} from '@lume/element'

@element('cool-element')
class CoolElement extends Element {
	@numberAttribute age = 10
	// ...
}
```

```js
const el = document.querySelector('cool-element')

el.setAttribute('age', '20')
console.log(el.age) // logs 20
console.log(typeof el.age) // logs "number"

el.removeAttribute('age')
console.log(el.age) // logs 10
console.log(typeof el.age) // logs "number"

el.age = '30' // assign a string (type error in TypeScript)
console.log(el.age) // logs 30
console.log(typeof el.age) // logs "number"
```

For TypeScript, you don't need a type annotation if the initial value is a
number. Add a type annotation only if you use a non-number initial value, f.e.
`number | SomeOtherType`, but that is not recommended:

```ts
import {Element, element, numberAttribute} from '@lume/element'

@element('cool-element')
class CoolElement extends Element {
	@numberAttribute age: 'ten' | number = 'ten'
	// ...
}
```

```js
const el = document.querySelector('cool-element')

el.setAttribute('age', '20')
console.log(el.age) // logs 20
console.log(typeof el.age) // logs "number"

el.removeAttribute('age')
console.log(el.age) // logs "ten"
console.log(typeof el.age) // logs "string"

el.age = 'ten'
console.log(el.age) // logs "NaN", which is confusing (hence, avoid doing this).
console.log(typeof el.age) // logs "number"
```

#### `@booleanAttribute`

A decorator that defines a boolean attribute. Any value the attribute receives
will be passed to the JS property, which is then coerced into a `boolean`. The
JS property will convert a `null` value (attribute removed) to the default value
defined by the initial property value, and will convert any string into boolean.
All string values except `"false"` result in the boolean `true`, and the string
`"false"` results in the boolean `false`.

To mimick the same behavior as boolean attributes on built-in elements where the
presence of the attribute is `true`, and absence of the attribute is `false`, start
with an initial value of `false`:

```ts
import {Element, element, booleanAttribute} from '@lume/element'

@element('cool-element')
class CoolElement extends Element {
	@booleanAttribute hasPizza = false
	// ...
}
```

If the attribute value exists, the JS property will receive `true`, except if
the value of the attribute is explicitly `"false"`:

```js
const el = document.querySelector('cool-element')

el.setAttribute('has-pizza', '')
console.log(el.age) // logs true
console.log(typeof el.age) // logs "boolean"

el.setAttribute('has-pizza', 'blah blah')
console.log(el.age) // logs true
console.log(typeof el.age) // logs "boolean"

el.removeAttribute('has-pizza')
console.log(el.age) // logs false
console.log(typeof el.age) // logs "boolean"

// A literal "false" value is special and is treated as false.
el.setAttribute('has-pizza', 'false')
console.log(el.age) // logs false
console.log(typeof el.age) // logs "boolean"
```

Here is the equivalent example in HTML describing the values of `has-pizza`:

```html
<!-- hasPizza == true -->
<cool-element has-pizza></cool-element>

<!-- hasPizza == true -->
<cool-element has-pizza="true"></cool-element>

<!-- hasPizza == true -->
<cool-element has-pizza="blah blah"></cool-element>

<!-- hasPizza == false -->
<cool-element></cool-element>

<!-- hasPizza == false -->
<cool-element has-pizza="false"></cool-element>
```

The purpose of treating `"false"` as explicitly `false` is that this makes it
possible to have the attribute be present while still being able to express both
values,

```html
<cool-element has-pizza="true"></cool-element> <cool-element has-pizza="false"></cool-element>
```

while also having the option to express the same thing using only attribute
presence:

```html
<cool-element has-pizza></cool-element> <cool-element></cool-element>
```

If you start with an initial value of `true`, then when the attribute is removed
or never existed, the JS property will be `true`, which again is useful for
predictability of default state.

```ts
import {Element, element, booleanAttribute} from '@lume/element'

@element('cool-element')
class CoolElement extends Element {
	@booleanAttribute hasPizza = true
	// ...
}
```

In this case, only an attribute value of `"false"` can set the JS property to `false`:

```js
const el = document.querySelector('cool-element')

el.setAttribute('has-pizza', '')
console.log(el.age) // logs true
console.log(typeof el.age) // logs "boolean"

el.setAttribute('has-pizza', 'blah blah')
console.log(el.age) // logs true
console.log(typeof el.age) // logs "boolean"

el.removeAttribute('has-pizza')
console.log(el.age) // logs true
console.log(typeof el.age) // logs "boolean"

// Only a literal value of "false" will cause the JS property to be false in this case.
el.setAttribute('has-pizza', 'false')
console.log(el.age) // logs false
console.log(typeof el.age) // logs "boolean"
```

Equivalent HTML:

```html
<!-- hasPizza == true -->
<cool-element has-pizza></cool-element>

<!-- hasPizza == true -->
<cool-element has-pizza="foo"></cool-element>

<!-- hasPizza == true -->
<cool-element has-pizza="blah blah"></cool-element>

<!-- hasPizza == true -->
<cool-element></cool-element>

<!-- hasPizza == false -->
<cool-element has-pizza="false"></cool-element>
```

In this form, with the property initial value as `true`, then the following two
are identical (the JS property is `true` in either case),

```html
<cool-element has-pizza></cool-element> <cool-element></cool-element>
```

and expressing both true and false side by side would require
explicit values:

```html
<cool-element has-pizza="true"></cool-element> <cool-element has-pizza="false"></cool-element>
```

> :bulb:**Tip:**
>
> Avoid attribute values like `has-pizza="blah blah"`, because they are not semantic.
> When the default JS property value is `false`, always use the form
> `has-pizza="false"` or no attribute for `false`, and `has-pizza` or
> `has-pizza="true"` for `true`.
> When the default JS property value is `true`, always use the form
> `has-pizza="false"` for `false`, and `has-pizza`, `has-pizza="true"`, or no
> attribute, for `true`.

#### `@signal`

This is from [`classy-solid`](https://github.com/lume/classy-solid) for creating
signal properties, but because `@element` is composed with classy-solid's
`@reactive` class decorator, a non-attribute signal property can be defined
without also having to use classy-solid's `@reactive` decorator on the class:

```ts
import {Element, element, booleanAttribute} from '@lume/element'
import {reactive, signal} from 'classy-solid'

// Non element class, requires `@reactive` for fields decorated with `@signal`:
@reactive
class Something {
	@signal foo = 123 // This will be reactive
}

// An element class decoratorated with `@element` (or passed to `element()` when
// not using decorators) does not also need to be decorated with `@reactive`:
@element('cool-element')
class CoolElement extends Element {
	// hasPizza will be reactive but an attribute will not be observed for this
	// property, and the property can only be set via JS.
	@signal hasPizza = false

	// This property *does* get updated when a `has-drink` attribute is updated, and is also reactive.
	@booleanAttribute hasDrink = false

	// ...
}
```

#### `@noSignal`

Once in a blue moon you might need to define an attribute property that is not
reactive, for some reason. Avoid it if you can, but you can do it with
`@noSignal`:

```ts
import {Element, element, booleanAttribute, noSignal} from '@lume/element'

@element('cool-element')
class CoolElement extends Element {
	// This property gets updated when a `has-drink` attribute is updated, but it is not reactive.
	@booleanAttribute @noSignal hasDrink = false
}
```

This is more useful on a getter/setter where you may implement your own
reactivity for the property:

```ts
import {Element, element, booleanAttribute, noSignal} from '@lume/element'

@element('cool-element')
class CoolElement extends Element {
	#hasDrink = false

	// This property gets updated when a `has-drink` attribute is updated, and
	// it is not reactive due to the `@booleanAttribute` decorator but due to a
	// custom implementation in the getter/setter (for example, maybe the
	// getter/setter reads from and writes to a Solid signal.
	@booleanAttribute @noSignal get hasDrink() {
		// ...
		return this.#hasDrink
	}
	@booleanAttribute @noSignal set hasDrink(value) {
		// ...
		this.#hasDrink = value
	}
}
```

> [!Note]
> Make sure the `@noSignal` decorator is listed _after_ the attribute decorator. This will not work:

```js
class CoolElement extends Element {
	// This won't work because the attribute decorator will run before the
	// noSignal decorator so the attribute decorator will miss the signal that
	// it should skip the signal (pun intended!).
	@noSignal @booleanAttribute hasDrink = false
}
```

## Runtime Type Checking

The `from` handler of a newly-defined attribute decorator (defining new
attribute decorators is described in the `@attribute` doc above) can throw an
error when an invalid string is encountered. Expanding the previous `jsonAttribute` example:

```js
const jsonAttribute = attribute({
  from(str){
    const result = JSON.parse(str)
    if (/* some condition not met with result */) throw new Error('...describe the error...')
    return result
  }
})
```

This error handling will work regardless if setting an attribute, or setting a
string via the JS property.

An alternative approach is to throw an error in the `set`ter of an
`@attribute`-decorated property, which can be useful for existing code that
might already exist where the `@attribute` decorator is being added:

```js
@element('cool-element')
class CoolElement extends Element {
  #foo = 123

  @attribute get someValue() {
    return this.#foo
  }
  @attribute set someValue(value) {
    if (/* some condition not met with value */) throw new Error('...error description...')
    this.#foo = value
  }
}
```

## TypeScript

### Attribute property types

Here are the recommended types for properties depending on the type of attribute
being defined, with non-null initial values:

```ts
import {Element, element, attribute, stringAttribute, numberAttribute, booleanAttribute} from '@lume/element'

@element('cool-element')
class CoolElement extends Element {
	@attribute firstName: string = 'John'
	@stringAttribute lastName: string = 'Doe'
	@numberAttribute age: number = 75
	@booleanAttribute likesPizza: boolean = true
	// ...
}
```

If properties are initialized with `null` values, add `| null` to each type:

```ts
@element('cool-element')
class CoolElement extends Element {
	@attribute firstName: string | null = null
	@stringAttribute lastName: string | null = null
	@numberAttribute age: number | null = null
	@booleanAttribute likesPizza: boolean | null = null
	// ...
}
```

All attribute properties can technically accept strings too, as this is how
attribute string values get coerced in case of non-string attributes.
Although it is not recommended, this aspect of the properties can be exposed if
needed:

```ts
@element('cool-element')
class CoolElement extends Element {
	@attribute firstName: string = 'John'
	@stringAttribute lastName: string = 'Doe'
	@numberAttribute age: `${number}` | number = 75
	@booleanAttribute likesPizza: `${boolean}` | boolean = true
	// ...
}

const el = new CoolElement()

el.age = '80' // no type error here

console.log(el.age, typeof el.age) // logs "80 number"

el.age = 'blah' // type error, 'blah' is not assignable to a string with number format defined by `${number}`.
```

It is nice to _not_ include the string types, especially because the string
values are always coerced by the attribute `from` handler, and JS/TS users can
set the actual values directly (f.e. numbers or booleans). You will always
receive a `number` when _reading_ a JS property decorated with
`@numberAttribute`, for example, so including the string type could make things
confusing and less ideal. For example, when _reading_ the value of a
`@numberAttribute` property, the following may be redundant and annoying when
reading the value, especially in TypeScript:

```js
if (typeof el.age === 'number') { // this check is unnecessary/annoying, required for types to check out
  const n: number = el.age
}
// or
const n: number = el.age as number // unnecessary/annoying cast in this case

if (typeof el.age === 'string') console.log('this will never be logged')
```

### Solid.js JSX expressions

(Note this section is only for Solid.js, as other frameworks like React or Preact do not have DOM-returning JSX expressions.)

Load the required JSX types in one of two ways:

1.  Import the types locally within particular files where JSX is used (this is
    useful for preventing type conflicts if you have other files that use React
    JSX types or other JSX types):

    ```ts
    /* jsxImportSource solid-js */
    ```

2.  Place the `jsxImportSource` in your tsconfig.json to have it apply to all
    files (this works great if you use only one form of JSX types in your
    project, but if you have files with different types of JSX, you'll want to
    use option 1 instead).

    ```js
    {
    	"compilerOptions": {
    		/* Solid.js Config */
    		// Note, you need to use an additional tool such as Babel, Vite, etc, to
    		// compile Solid JSX. `npm create solid` will scaffold things for you.
    		"jsx": "preserve",
    		"jsxImportSource": "solid-js"
    	}
    }
    ```

In TypeScript, all JSX expressions have the type `JSX.Element`. But Solid's JSX
expressions return actual DOM nodes, and we want the JSX expression types to
reflect that fact. For this we have a set of convenience helpers to cast JSX
expressions to DOM element types in the `@lume/element/dist/type-helpers.js`
module.

Modifying the example from [Easily create and manipulate DOM](#easily-create-and-manipulate-dom)
for TypeScript, it would look like the following.

```tsx
import {createSignal} from 'solid-js'
import {div} from '@lume/element/dist/type-helpers.js'

const [count, setCount] = createSignal(0)

setInterval(() => setCount(count() + 1), 1000)

const el = div(
	<div>
		<h1 data-count={count()}>The count is: {count()}</h1>
	</div>,
)

el.setAttribute('foo', 'bar')

document.body.appendChild(el)
```

The main differences from plain JS are

- Use of the `@jsxImportSource` comment to place JSX types into scope. This is
  required, or TypeScript will not know what the types of elements in JSX
  markup are. Alternative to comments, configure it in tsconfig.json's
  `compilerOptions`.
- The `div()` helper function explicitly returns the type `HTMLDivElement` so
  that the `el` variable will be typed as `HTMLDivElement` instead of
  `JSX.Element`. Under the hood, the `div()` function is an identity function
  at runtime, it simply returns whatever you pass into it, and serves only as a
  convenient type cast helper.

> [!Warning]
> Keep in mind to use the correct type helper depending on what the root element
> of the JSX expression is. For for example, if the root of a JSX expression is a
> `<menu>` element then we need to use the `menu()` helper like follows.

```tsx
import {createSignal} from 'solid-js'
import {menu} from '@lume/element/dist/type-helpers.js'

// ...

// The type of `el` will be `HTMLMenuElement`.
const el = menu(
	<menu>
		<h1 data-count={count()}>The count is: {count()}</h1>
	</menu>,
)
```

If the wrong helper is used, then it will effectively cast the expression to
the wrong type. For example, in the next snippet the `el` variable will be of
type `HTMLDivElement` despite the fact that at runtime we will be have an
`HTMLMenuElement` instance.

```tsx
import {div, button} from '@lume/element/dist/type-helpers.js'

// GOOD.
const el = button(<button>...</button>)

// BAD! Don't do this! Remember to double check, because the helpers are not
// type safe, you will not get an error here, and el2 will incorrectly be type
// HTMLDivElement.
const el2 = div(<menu>...</menu>)
```

Without the type helpers, we would need to write more verbose code like the
following to have the proper types, but note that the following is also not type
safe:

```tsx
// GOOD.
const el = (<menu>...</menu>) as any as HTMLMenuElement

// BAD! Don't do this! Remember to double check, because the helpers are not
// type safe, you will not get an error here.
const el2 = (<menu>...</menu>) as any as HTMLDivElement
```

### Type definitions for custom elements

(For type definitions for function components, see [Solid.js](https://solidjs.com) docs).

#### With Solid JSX

Set up `jsxImportSource` as mentioned above.

To give our Custom Elements type checking for use with DOM APIs, and type
checking in Solid JSX, we can add the element type definition to
`HTMLElementTagNameMap` and `JSX.IntrinsicElements`. Use the `ElementAttributes`
helper to specify which attributes/properties should be exposed in the JSX type
(we do not want to expose methods for example, or we may want to skip exposing
some properties that are implementation details such as those prefixed with
underscores to represent that they are internal, etc):

```tsx
import type {ElementAttributes} from '@lume/element'
import {Element, element, stringAttribute, numberAttribute, event} from '@lume/element'

// List the properties that should be picked from the class type for JSX props.
// Note! Make sure that the properties listed are either decorated with
// attribute decorators, or that they are on* event properties.
export type CoolElementAttributes = 'coolType' | 'coolFactor' | 'oncoolness'

@element('cool-element')
export class CoolElement extends Element {
	@stringAttribute coolType: 'beans' | 'hair' = 'beans'
	@numberAttribute coolFactor = 100
	// ^ NOTE: These are the camelCase equivalents of the attributes defined above.

  // For any given event our element will dispatch, define an event prop with
  // the event name prefixed with 'on', and that accepts an event listener
  // function or null.
  @event oncoolness: ((event: CoolnessEvent) => void) | null = null

  // This property will not appear in the JSX types because it is not listed in
  // the `CoolElementAttributes` that are passed to `ElementAttributes` below.
  notJsxProp = 123

	// ... Define the class as described above. ...
}

/** This an event that our element dispatches, for example. */
class CoolnessEvent extends Event {
  constructor() {
    super('coolness', {...})
  }
}

// Add our element to the list of known HTML elements. This makes it possible
// for browser APIs to have the expected return types. For example, the return
// type of `document.createElement('cool-element')` will be `CoolElement`.
declare global {
	interface HTMLElementTagNameMap {
		'cool-element': CoolElement
	}
}

// The same as before:
declare module 'solid-js' {
	namespace JSX {
		interface IntrinsicElements {
      // This automatically maps the property names from camelCase to dash-case,
      // automatically picks up the property types from the class, defines
      // additional types for attr:, prop:, and bool: prefixed props, and maps
      // `on*` event properties to JSX prop types.
			'cool-element': ElementAttributes<CoolElement, CoolElementAttributes>
		}
	}
}
```

Now when we use `<cool-element>` in Solid JSX, it will be type checked:

```jsx
return (
	<cool-element
		// cool-type={123} // Type error: number is not assignable to 'beans' | 'hair'
		// cool-factor={'foo'} // Type error: string is not assignable to number
    cool-type="hair" // ok
    cool-factor="200" // ok
    oncoolness={() = console.log('coolness happened')} // ok
	></cool-element>
)
```

#### With React JSX

Defining the types of custom elements for React JSX is similar as for Solid JSX
above, but with some small differences for React JSX:

```js
// tsconfig.json
{
  "compilerOptions": {
		/* React Config */
    "jsx": "react-jsx",
    "jsxImportSource": "react" // React >=19 (Omit for React <=18)
  }
}
```

```ts
import type {ReactElementAttributes} from '@lume/element/dist/react.js'

// ... the same class definition as before ...

// Add our element to the list of known HTML elements, like before.
declare global {
	interface HTMLElementTagNameMap {
		'cool-element': CoolElement
	}
}

// Also register the element name in the React JSX types, which are global in
// the case of React 18 and below.
declare global {
	namespace JSX {
		interface IntrinsicElements {
			// Similar as before, with ReactElementAttributes instead of
			// ElementAttributes, and props will remain camelCase, not mapped to
			// dash-case:
			'cool-element': ReactElementAttributes<CoolElement, CoolElementAttributes>
		}
	}
}

// For React 19 and up, register the element type in the non-global JSX namespace of the `react` package:
// TODO
```

Now when we use `<cool-element>` in React JSX, it will be type checked:

```jsx
return (
	<cool-element
		// coolType={123} // Type error: number is not assignable to 'beans' | 'hair'
		// coolFactor={'foo'} // Type error: string is not assignable to number
    coolType="hair" // ok
    coolFactor="200" // ok
    oncoolness={() = console.log('coolness happened')} // ok
	></cool-element>
)
```

> [!Note]
> You may want to define React JSX types for your elements in separate files than the Solid JSX types, and
> have React users import those separate files if they need the types, and similar if you make
> JSX types for Vue, Svelte, etc (we don't have helpers for those other fameworks
> yet, but you can manually augment JSX in that case, contributions welcome!).

#### With Preact JSX

It works the same as the previous section for React JSX. Define the element
types with the same `ReactElementAttributes` helper as described above. In our
TypeScript `compilerOptions` we should make sure to link to the React
compatibility layer:

```json
{
	"compilerOptions": {
		/* Preact Config */
		"jsx": "react-jsx",
		"jsxImportSource": "preact",
		"paths": {
			"react": ["./node_modules/preact/compat/"],
			"react-dom": ["./node_modules/preact/compat/"]
		}
	}
}
```

The rest is the same.

## Resources

See https://solid.js.com, https://primitives.solidjs.community, and
https://github.com/lume/classy-solid for APIs that are useful with
`@lume/element`.

Also see Custom Element (i.e. Web Component) systems that are alternative to
`@lume/element`:

- [`solid-element`](https://github.com/solidjs/solid/tree/main/packages/solid-element)
- [Lit](https://lit.dev/)
- [ReadyMade](https://readymade-ui.github.io/readymade)
- [Stencil](https://stenciljs.com)
- [Enhance](https://enhance.dev/)
- [Fast Elements](https://www.fast.design/docs/fast-element/getting-started)
- [Lightning](https://lwc.dev)
- [GitHub Elements](https://github.com/github/github-elements)
- [Atomico](https://atomicojs.dev)
- [and more](https://webcomponents.dev/new)

## Status

![](https://github.com/lume/element/workflows/Build%20and%20Test/badge.svg)
