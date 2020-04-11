# use-interpolate 📃
> A react hook that interpolates markup tags into components

[![npm](https://flat.badgen.net/npm/v/use-interpolate)](https://www.npmjs.com/package/use-interpolate)
[![license](https://flat.badgen.net/github/license/skt-t1-byungi/use-interpolate)](https://github.com/skt-t1-byungi/use-interpolate/blob/master/LICENSE)

## Install
```sh
npm i use-interpolate
```

## Example
```jsx
import useInterpolate from 'use-interpolate'

function App () {
    const render = useInterpolate('<wrap>My name is <name /> and I am <age /> years old.</wrap>')

    const components = {
        wrap: children => <Content>{children}</Content>,
        name: <input type="text" />,
        age: <input type="number" />
    }

    return <div>{render(components)}</div>
}
```
```html
<div>
    <Content>
        My name is <input type="text" /> and I am <input type="number" /> years old.
    </Content>
</div>
```
## API
### useInterpolate(string, options?)
This hook parses the given string and returns a [`render`](#rendercomponents) function that interpolates markup tags into components.

#### options
##### prefix
This is a tag prefix option. The default is `<`.

##### suffix
This is a tag suffix option. The default is `>`.

##### strict
This is a strict option to parse. The default is `true`.

### render(components?)
This function interpolates markup tags to the components from the parsed result.

```jsx
const render = useInterpolate('hello <0 /> word')

return <>{render({ 0: <br/> })}</> // => <>hello <br /> word</>
```

There is a way to interpolate using functions.
```jsx
const render = useInterpolate('<0>hello word</0>')

return <>{render({ 0: children => (<p>{children}</p>) })}</> // => <><p>hello word</p></>
```

## License
MIT
