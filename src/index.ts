import { cloneElement, createElement, Fragment, isValidElement, ReactNode, useMemo } from 'react'

import parse from './parse'
import { Options, TagNode } from './types'

type ElementMap = Record<string, ReactNode | ((children?: ReactNode) => ReactNode)>

export function useInterpolate (str: string, { strict, prefix, suffix }: Options = {}) {
    return useMemo(() => {
        const nodes = parse(str, { strict, prefix, suffix })
        return (map: ElementMap) => ensureOneNode(nodesToReactNodes(nodes, map))
    }, [str, strict, prefix, suffix])
}

function ensureOneNode (nodes: ReactNode[]) {
    return nodes.length === 1 ? nodes[0] : createElement(Fragment, undefined, ...nodes)
}

function nodesToReactNodes (nodes: TagNode[], map: ElementMap): ReactNode[] {
    return nodes.map(node => nodeToReactNode(node, map))
}

function nodeToReactNode (node: TagNode, map: ElementMap): ReactNode {
    if (typeof node === 'string') return node

    const el = map[node.name]
    if (node.self) {
        if (typeof el === 'function') {
            return el()
        } else {
            return isValidElement(el) ? el : null
        }
    }

    const children = nodesToReactNodes(node.children, map)
    if (typeof el === 'function') {
        return el(ensureOneNode(children))
    } else if (isValidElement(el)) {
        return cloneElement(el, undefined, ...children)
    } else {
        return createElement(Fragment, undefined, ...children)
    }
}
