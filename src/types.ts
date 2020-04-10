export type TagNode = string | {name: string; self: true} | {name: string; self: false; children: TagNode[]}
export type Options = {strict?: boolean; prefix?: string; suffix?: string}
