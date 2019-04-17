import { ReactNode, useMemo, isValidElement, createElement, cloneElement, Fragment } from 'react'
import parser = require('tag-name-parser')

type TagNode = ReturnType<typeof parser>[number]
type ReactElements = Record<string, ReactNode | ((children?: ReactNode) => ReactNode)>

export const useInterpolate = createHook()

export default useInterpolate

export function createHook (opts: {strict?: boolean, tag?: [string, string]} = {}) {
    const parse = (text: string) => parser(text, opts)
    return (text: string, elements: ReactElements) => {
        const nodes = useMemo(() => parse(text), [text.length, text])
        return createElement(Fragment, undefined, ...nodesToReactNodes(nodes, elements))
    }
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
        return element(children.length === 1 ? children[0] : createElement(Fragment, undefined, ...children))
    } else if (isValidElement(element)) {
        return cloneElement(element, undefined, ...children)
    } else {
        return createElement(Fragment, undefined, ...children)
    }
}
