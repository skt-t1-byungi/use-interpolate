import { cloneElement, createElement, Fragment, isValidElement, ReactNode, useMemo } from 'react'

type TagNode = string | {name: string; single: true} | {name: string; single: false; children: TagNode[]}
type ReactElements = Record<string, ReactNode | ((children?: ReactNode) => ReactNode)>
type Parser = (text: string, opts?: ParserOptions) => TagNode[]
interface ParserOptions {strict?: boolean; tag?: [string, string]}

const parserWithMemoHook = (text: string, opts: ParserOptions = {}) => useMemo(() => parse(text, opts), [text])

const createInterpolateCreator = (parser: Parser) => (opts: ParserOptions = {}) => (text: string, elements: ReactElements) => {
    return ensureOneNode(nodesToReactNodes(parser(text, opts), elements))
}

export const createInterpolate = createInterpolateCreator(parse)

export const createHook = createInterpolateCreator(parserWithMemoHook)

export const interpolate = createInterpolate()

export const useInterpolate = createHook()

export default useInterpolate

function parse (str: string, opts: ParserOptions = {}) {
    const strict = opts.strict ?? true
    const tag = [opts.tag?.[0] ?? '<', opts.tag?.[1] ?? '>'] as const
    const openTag = esc(tag[0])
    const closeTag = esc(tag[1])

    const re = new RegExp(openTag + '(\\/)?(\\w+)\\s?[^' + closeTag + '/]*(\\/)?' + closeTag, 'g')

    let pos = 0
    const root: {children: TagNode[]} = { children: [] }
    let current: {children: TagNode[]; name?: string; single?: boolean} = root
    const stacks = [root]
    let matched

    while (matched = re.exec(str)) {
        const isClose = matched[1]
        const tagName = matched[2]
        const isSingle = matched[3]
        const len = matched[0].length
        const idx = matched.index

        if (pos !== idx) current.children.push(str.slice(pos, idx))
        pos = idx + len

        if (isClose) {
            if (current.name === tagName) {
                current = stacks.pop()!
            } else if (strict) {
                throw new TypeError('[tag-name-parser] Invalid close tag. ("' + tag[0] + '/' + tagName + tag[1] + '":' + idx + ')')
            }
        } else {
            if (isSingle) {
                current.children.push({ name: tagName, single: true })
            } else {
                stacks.push(current)
                current.children.push(current = { name: tagName, single: false, children: [] })
            }
        }
    }

    if (pos < str.length) current.children.push(str.slice(pos))

    if (current !== root && strict) {
        throw new TypeError('[tag-name-parser] Close tag ("' + tag[0] + current.name + tag[1] + '") is missing.')
    }

    return root.children
}

function esc (str: string) {
    return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
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
