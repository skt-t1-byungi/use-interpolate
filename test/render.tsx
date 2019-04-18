import * as React from 'react'
import test from 'ava'
import { renderHook } from 'react-hooks-testing-library'
import useInterpolate, { interpolate } from '../src/index'

import './_browserEnv'

const render = (desc: string, text: string, elements: any, expected: any) => {
    test('[render] ' + desc, t => {
        const { result } = renderHook(() => useInterpolate(text, elements))
        t.deepEqual(result.current, expected)
        t.deepEqual(interpolate(text, elements), expected)
    })
}

render('string',
    'test', {},
    'test'
)

render('wrapped',
    'a <0>b</0>', { 0: <span /> },
    <>a <span>b</span></>
)

render('self closed',
    'a <0/>b', { 0: <br/> },
    <>a <br/>b</>
)

render('nested',
    'ab<0>de<1>ef</1>gh</0>', { 0: <div />, 1: <p /> },
    <>ab<div>de<p>ef</p>gh</div></>
)

render('function value',
    'a <0>b</0>', { 0: (children: any) => <span>{children}</span> },
    <>a <span>b</span></>
)

render('using function value with nesting',
    'a <0>b<1>c</1></0>', { 0: (children: any) => <span>{children}</span>, 1: <div/> },
    <>a <span><>b<div>c</div></></span></>
)

render('using function value with nesting in nesting',
    'a <0>b<1>c</1>d</0>', { 0: (children: any) => <span>{children}</span>, 1: (children: any) => <p>{children}</p> },
    <>a <span><>b<p>c</p>d</></span></>
)

render('If can not interpolate, replace with fragment.',
    'a <0>b<1>c</1></0>', { 0: (children: any) => <span>{children}</span> },
    <>a <span><>b<>c</></></span></>
)

render('If can not interpolate, replace with null.',
    'a <0>b<1 /></0>', { 0: (children: any) => <span>{children}</span> },
    <>a <span><>b{null}</></span></>
)
