import { cloneElement, createElement, Fragment, isValidElement, ReactNode, useMemo } from 'react'

type Options = {strict?: boolean; prefix?: string; suffix?: string}
type TagNode = string | {name: string; self: true} | {name: string; self: false; children: TagNode[]}
type ElementMap = Record<string, ReactNode | ((children?: ReactNode) => ReactNode)>

export default useInterpolate

export function useInterpolate (str: string, { strict, prefix, suffix }: Options = {}) {
    return useMemo(() => {
        const nodes = parse(str, { strict, prefix, suffix })
        return (map: ElementMap) => ensureOneNode(nodesToReactNodes(nodes, map))
    }, [str, strict, prefix, suffix])
}

function parse (str: string, { strict = true, prefix = '<', suffix = '>' }: Options = {}) {
    const ePrefix = esc(prefix)
    const eSuffix = esc(suffix)
    const re = new RegExp(ePrefix + '(\\/)?(\\w+)\\s?[^' + eSuffix + '/]*(\\/)?' + eSuffix, 'g')

    let pos = 0
    const root: {children: TagNode[]} = { children: [] }
    let current: {children: TagNode[]; name?: string; self?: boolean} = root
    const stacks = [root]
    let matched

    while (matched = re.exec(str)) {
        const [{ length: len }, isClose, tagName, isSelf] = matched
        const idx = matched.index

        if (pos !== idx) current.children.push(str.slice(pos, idx))
        pos = idx + len

        if (isClose) {
            if (current.name === tagName) {
                current = stacks.pop()!
            } else if (strict) {
                throw new TypeError('Invalid close tag. ("' + prefix + '/' + tagName + suffix + '":' + idx + ')')
            }
        } else {
            if (isSelf) {
                current.children.push({ name: tagName, self: true })
            } else {
                stacks.push(current)
                current.children.push(current = { name: tagName, self: false, children: [] })
            }
        }
    }

    if (pos < str.length) current.children.push(str.slice(pos))

    if (current !== root && strict) {
        throw new TypeError('Close tag ("' + prefix + current.name + suffix + '") is missing.')
    }

    return root.children
}

function esc (str: string) {
    return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
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
