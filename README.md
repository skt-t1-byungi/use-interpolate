# use-interpolate
A react hook that interpolates html(text) into a component.

## Install
```sh
npm i use-interpolate
```

## Example
```jsx
import useInterpolate from 'use-interpolate'

function App(){
    const result = useInterpolate(
        `<0>phone</0>:<1/> <2/> - <3/>`,
        {
            0: children => <span>*{children}</span>,
            1: <br/>,
            2: <Input theme='red'/>,
            3: <Input theme='blue'/>
        }
    )

    => <><span>*phone</span>:<br/> <Input theme='red'/> - <Input theme='blue'/></>
}
```

## License
MIT
