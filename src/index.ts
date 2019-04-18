import { ReactNode, useMemo, isValidElement, createElement, cloneElement, Fragment } from 'react'
import parser = require('tag-name-parser')

type TagNode = ReturnType<typeof parser>[number]
type ReactElements = Record<string,ReactNode | ((children?: ReactNode) => ReactNode)>
interface ParserOptions {strict?: boolean, tag?: [string, string]}

export const interpolate = createInterpolate()

export function createInterpolate (opts: ParserOptions = {}) {
    const parse = (text: string) => parser(text, opts)
    return (text: string, elements: ReactElements) => ensureOneNode(nodesToReactNodes(parse(text), elements))
}

export const useInterpolate = createHook()

export default useInterpolate

export function createHook (opts: ParserOptions = {}) {
    const parse = (text: string) => parser(text, opts)
    return (text: string, elements: ReactElements) => {
        const parsed = useMemo(() => parse(text), [text])
        return ensureOneNode(nodesToReactNodes(parsed, elements))
    }
}

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
