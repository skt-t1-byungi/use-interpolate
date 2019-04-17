import * as React from 'react'
import test from 'ava'
import { renderHook, act } from 'react-hooks-testing-library'
import useInterpolate from '../src/index'

import './_browserEnv'

const dom = (desc: string, text: string, components: any, expected: any) => {
    test('dom :' + desc, t => {
        const { result } = renderHook(() => useInterpolate(text, components))
        t.deepEqual(result.current, expected)
    })
}

dom('string',
    'test', {},
    <>test</>
)

dom('wrapped',
    'a <0>b</0>', { 0: <span /> },
    <>a <span>b</span></>
)

dom('self closed',
    'a <0/>b', { 0: <br/> },
    <>a <br/>b</>
)

dom('nested',
    'ab<0>de<1>ef</1>gh</0>', { 0: <div />, 1: <p /> },
    <>ab<div>de<p>ef</p>gh</div></>
)

dom('function value',
    'a <0>b</0>', { 0: (children: any) => <span>{children}</span> },
    <>a <span>b</span></>
)

dom('using function value with nesting',
    'a <0>b<1>c</1></0>', { 0: (children: any) => <span>{children}</span>, 1: <div/> },
    <>a <span><>b<div>c</div></></span></>
)

dom('using function value with nesting in nesting',
    'a <0>b<1>c</1>d</0>', { 0: (children: any) => <span>{children}</span>, 1: (children: any) => <p>{children}</p> },
    <>a <span><>b<p>c</p>d</></span></>
)

dom('If you can not interpolate, use the node name.',
    'a <0>b<b>c</b></0>', { 0: (children: any) => <span>{children}</span> },
    <>a <span><>b<b>c</b></></span></>
)

dom('If you can not interpolate, use the node name. #2 - self closed',
    'a <0>b<br /></0>', { 0: (children: any) => <span>{children}</span> },
    <>a <span><>b<br /></></span></>
)

dom('If you can not interpolate and the node name is abnormal, replace it with a fragment',
    'a <0>b<aa /></0>', { 0: (children: any) => <span>{children}</span> },
    <>a <span><>b<></></></span></>
)
