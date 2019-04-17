# use-interpolate
A react hook that interpolates html(text) into a component.

## Install
```sh
npm i use-interpolate
```

## Example
### Basic
```jsx
import useInterpolate from 'use-interpolate'

function App(){
    const reactElement = useInterpolate(
        `<0>phone</0> :<1/> <2/> - <3/>`,
        {
            0: children => <span>*{children}</span>,
            1: <br/>,
            2: <Input theme='red'/>,
            3: <Input theme='blue'/>
        }
    )
    return reactElement
}
```
output:
```jsx
(<>
    <span>*phone</span> :<br/> <Input theme='red'/> - <Input theme='blue'/>
</>)
```

### Change tag brackets.
```jsx
import {createHook} from 'use-interpolate'

const useInterpolate = createHook({tag: ['[', ']']})

function App(){
    return useInterpolate('hello [0]world[/0]', {0: <span/>})
}
```
output:
```jsx
(<>hello <span>world</span></>)
```

## License
MIT
