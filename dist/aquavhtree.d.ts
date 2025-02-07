import { AquaObject, RevisionTree } from "./types";
export declare function findHashWithLongestPath(tree: RevisionTree): {
    paths: {
        [key: string]: string[];
    };
    latestHash: string;
};
export declare function createAquaObjectTree(aquaObject: any): RevisionTree;
export declare function createAquaTree(aquaObject: any): AquaObject;
export declare function logAquaTree(node: RevisionTree, prefix?: string, isLast?: boolean): void;
