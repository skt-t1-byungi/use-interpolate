// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as React from 'react'
import { renderHook } from '@testing-library/react-hooks'

import useInterpolate from '.'

test.each([
    ['txt', {},
        'txt'],
    ['<0>txt</0>', { 0: <span /> },
        <span>txt</span>],
    ['a <0>b</0>', { 0: <span /> },
        <>a <span>b</span></>],
    ['a <0/>b', { 0: <br /> },
        <>a <br/>b</>],
    ['ab<0>de<1>ef</1>gh</0>', { 0: <div />, 1: <p /> },
        <>ab<div>de<p>ef</p>gh</div></>],
    ['a <0>b</0>', { 0: (children: any) => <span>{children}</span> },
        <>a <span>b</span></>],
    ['a <0>b<1>c</1></0>', { 0: (children: any) => <span>{children}</span>, 1: <div/> },
        <>a <span><>b<div>c</div></></span></>],
    ['a <0>b<1>c</1>d</0>', { 0: (children: any) => <span>{children}</span>, 1: (children: any) => <p>{children}</p> },
        <>a <span><>b<p>c</p>d</></span></>],
    ['a <0>b<1>c</1></0>', { 0: (children: any) => <span>{children}</span> },
        <>a <span><>b<>c</></></span></>],
    ['a <0>b<1 /></0>', { 0: (children: any) => <span>{children}</span> },
        <>a <span><>b{null}</></span></>]
])('render#%# - (%s)', (str: string, map: any, expected: any) => {
    const { result } = renderHook(() => useInterpolate(str))
    expect(result.current(map)).toEqual(expected)
})
