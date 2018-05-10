declare module 'postcss-value-parser' {
    export type Node = FunctionNode | SpaceNode | WordNode | DivNode;

    export type FunctionNode = {
        type: 'function';
        after: string;
        before: string;
        nodes: [WordNode] | [WordNode, DivNode, WordNode];
        sourceIndex: number;
    };

    export type SpaceNode = {
        type: 'space';
        value: string;
        sourceIndex: number;
    };

    export type WordNode = {
        type: 'word';
        value: string;
        sourceIndex: number;
    };

    export type DivNode = {
        type: 'div';
        value: string;
        after: string;
        before: string;
        sourceIndex: number;
    };

    export interface ValueParser {
        nodes: Node[];
    }

    export default function(...params: any[]): ValueParser;

    export function stringify(nodes: Node[] | Node): string;
}
