# use-interpolate 📃
> A react hook that interpolates tag to a component.

[![npm](https://flat.badgen.net/npm/v/use-interpolate)](https://www.npmjs.com/package/use-interpolate)
[![typescript](https://flat.badgen.net/badge/typescript/3.4.3/blue)](https://www.typescriptlang.org)
[![license](https://flat.badgen.net/github/license/skt-t1-byungi/use-interpolate)](https://github.com/skt-t1-byungi/use-interpolate/blob/master/LICENSE)

## Install
```sh
npm i use-interpolate
```

## Example
```jsx
import useInterpolate from 'use-interpolate'

function App(){
    const element = useInterpolate(
        '<0>name</0><1><2/></1>',
        {
            0: <span/>,
            1: (children) => <p> - {children}</p>,
            2: <Input theme='blue'/>,
        }
    )
    return <div>{element}</div>
}
```
output:
```html
<div>
    <span>name</span><p> - <Input theme='blue'/></p>
</div>
```
## API
### useInterpolate(text, components)
A react hook that interpolates tag to a component.

### createHook([options])
Create a interpolate hook.

#### options
##### tag
change tag bracket.

```jsx
import { createHook } from 'use-interpolate'

const useInterpolate = createHook({ tag: ['{', '}'] })

function App(){
    const element = useInterpolate(
        'hello {0}world{/0}',
        {
            0: <span/>
        }
    )
    return <div>{element}</div>
}
```
output:
```html
<div>
    hello <span>world</span>
</div>
```
##### strict
Default is `true`. If false, no error occurs.

```jsx
const useInterpolate = createHook({ strict: false })

function App(){
    const element = useInterpolate('<a>Invalid<b>', {a: <p/>, b: <br/>}) // no error.
    /* ... */
}
```
output:
```html
<p>Invalid<br/></p>
```

### interpolate(text, components)
In a class component, an `interpolate` function is used instead of a hook.
However, this does not support caching for parsed text.

```jsx
import { interpolate } from 'use-interpolate'

class App extends React.Component{
    render(){
        const vnode = interpolate(`hello <0/> john!`, {0: <br/>})
        /* ... */
    }
}
```

### createInterpolate([options])
Create a interpolate function.

```js
import { createInterpolate } from 'use-interpolate'

const interpolate = createInterpolate({ strict:false, tag: ['{', '}'] })
```

#### options
Same as [`createHook` options](#options).

## License
MIT
