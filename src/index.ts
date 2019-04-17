import { ReactNode, useMemo, isValidElement, createElement, cloneElement, Fragment } from 'react'
import tagNameParser = require('tag-name-parser')
import htmlTags = require('html-tags')
import includes = require('@skt-t1-byungi/array-includes')

type TagNode = ReturnType<typeof tagNameParser>[number]
type ReactElements = Record<string, ReactNode | ((children?: ReactNode) => ReactNode)>

export const useInterpolate = createHook()
export default useInterpolate

export function createHook ({ tag }: {tag?: [string, string]} = {}) {
    const parse = tag ? (text: string) => tagNameParser(text, { tag }) : tagNameParser
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
            return isValidElement(element) ? element : createElement(nodeNameOrFragment(node.name))
        }
    }

    const children = nodesToReactNodes(node.children, elements)
    if (typeof element === 'function') {
        return element(children.length === 1 ? children[0] : createElement(Fragment, undefined, ...children))
    } else if (isValidElement(element)) {
        return cloneElement(element, undefined, ...children)
    } else {
        return createElement(nodeNameOrFragment(node.name), undefined, ...children)
    }
}

function nodeNameOrFragment (nodeName: string) {
    return includes(htmlTags as string[], nodeName) ? nodeName : Fragment
}
