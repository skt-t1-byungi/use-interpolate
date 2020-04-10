import { Options, TagNode } from './types'

export default function (str: string, { strict = true, prefix = '<', suffix = '>' }: Options = {}) {
    const ePrefix = e(prefix)
    const eSuffix = e(suffix)
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

function e (str: string) {
    return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}
