import { ReactNode, useMemo, isValidElement, createElement, cloneElement, Fragment } from 'react'
import parser = require('tag-name-parser')

type TagNode = ReturnType<typeof parser>[number]
type ReactElements = Record<string,ReactNode | ((children?: ReactNode) => ReactNode)>
interface ParserOptions {strict?: boolean, tag?: [string, string]}

const parserWithOpts = (opts: ParserOptions = {}, text: string) => parser(text, opts)
const parserWithOptsAndMemo = (opts: ParserOptions = {}, text: string) => useMemo(() => parserWithOpts(opts, text), [text])
const parse = (parser: Function) => (opts: ParserOptions = {}) => {
    return (text: string, elements: ReactElements) => {
        const parsed = parser(opts, text)
        const nodes = nodesToReactNodes(parsed, elements)
        return ensureOneNode(nodes)
    }
}

export const createInterpolate = parse(parserWithOpts)

export const createHook = parse(parserWithOptsAndMemo)

export const interpolate = createInterpolate()

export const useInterpolate = createHook()

export default useInterpolate

function ensureOneNode (nodes: ReactNode[]) {
    return nodes.length === 1 ? nodes[0] : createElement(Fragment, undefined, ...nodes)
}

function nodesToReactNodes (nodes: TagNode[], elements: ReactElements): ReactNode[] {
    return nodes.map(node => nodeToReactNode(node, elements))
}

function nodeToReactNode (node: TagNode, elements: ReactElements): ReactNode {
    if (typeof node === 'string') return node

    const element = elements[node.name]
    if (node.single) {
        if (typeof element === 'function') {
            return element()
        } else {
            return isValidElement(element) ? element : null
        }
    }

    const children = nodesToReactNodes(node.children, elements)
    if (typeof element === 'function') {
        return element(ensureOneNode(children))
    } else if (isValidElement(element)) {
        return cloneElement(element, undefined, ...children)
    } else {
        return createElement(Fragment, undefined, ...children)
    }
}
