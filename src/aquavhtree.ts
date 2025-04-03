import { AquaTree,  RevisionTree } from "./types";

/**
 * Recursively searches for a node in the revision tree by its hash
 * 
 * @param tree - The revision tree to search
 * @param hash - Hash to search for
 * @returns Matching RevisionTree node or null if not found
 * 
 * This function traverses the tree structure to find a specific revision
 * by matching its hash value.
 */
function findNode(tree: RevisionTree, hash: string): RevisionTree | null {
    if (tree.hash === hash) {
        return tree;
    }
    for (let i = 0; i < tree.children.length; i++) {
        const child = tree.children[i];
        const result = findNode(child, hash);
        if (result) {
            return result;
        }
    }
    return null;
}

/**
 * Finds all paths from root to each leaf node in the revision tree
 * 
 * @param tree - The revision tree to analyze
 * @param path - Current path being built (used in recursion)
 * @returns Object mapping each leaf hash to its complete path from root
 * 
 * This function:
 * - Builds paths from root to each leaf
 * - Tracks the complete revision history for each branch
 * - Returns a map of leaf hashes to their full paths
 */
function findPaths(tree: RevisionTree, path: string[]): { [key: string]: string[] } {
    let paths: { [key: string]: string[] } = {};
    path.push(tree.hash);
    if (tree.children.length === 0) {
        paths[tree.hash] = path;
    } else {
        for (let i = 0; i < tree.children.length; i++) {
            const child = tree.children[i];
            const childPaths = findPaths(child, [...path]);
            paths = { ...paths, ...childPaths };
        }
    }
    return paths;
}

/**
 * Finds the leaf hash with the longest path from root
 * 
 * @param tree - The revision tree to analyze
 * @returns Object containing all paths and the hash with longest path
 * 
 * This function:
 * - Identifies the longest revision chain
 * - Returns both the complete path mapping and the latest hash
 * - Used to find the most current revision in the tree
 */
export function findHashWithLongestPath(tree: RevisionTree) {
    let paths = findPaths(tree, []);
    let hash = "";
    let longestPathLength = 0;
    for (let key in paths) {
        if (paths[key].length > longestPathLength) {
            hash = key;
            longestPathLength = paths[key].length;
        }
    }
    return {
        paths,
        latestHash: hash,
    };
}

/**
 * Creates a tree structure from Aqua Tree revision data
 * 
 * @param aquaTree - The Aqua Tree data containing revisions
 * @returns RevisionTree structure representing the revision hierarchy
 * 
 * This function:
 * - Converts flat revision data into a tree structure
 * - Links revisions based on previous_verification_hash
 * - Creates parent-child relationships between revisions
 */
export function createAquaTreeTree(aquaTree: any) {
    let obj = aquaTree;
    // Create a tree given such revision data
    let revisionTree: RevisionTree = {} as RevisionTree;

    for (let revisionHash in obj.revisions) {
        const revision = obj.revisions[revisionHash];
        const parentHash = revision.previous_verification_hash;
        if (parentHash === "") {
            // This is the root node
            revisionTree.hash = revisionHash;
            revisionTree.children = [];
        } else {
            // Find the parent node
            const parentNode = findNode(revisionTree, parentHash);
            if (parentNode) {
                // Add the current node as a child of the parent node
                parentNode.children.push({
                    hash: revisionHash,
                    children: []
                });
            }
        }
    }

    return revisionTree;

}

/**
 * Creates a complete Aqua Tree with tree structure and mappings
 * 
 * @param aquaTree - The raw Aqua Tree data
 * @returns Enhanced AquaTree with tree structure and path mappings, or null if invalid
 * 
 * This function:
 * - Validates the input Aqua Tree
 * - Creates the revision tree structure
 * - Generates path mappings for revisions
 * - Combines original data with tree structure
 */
export function createAquaTree(aquaTree: any): AquaTree | null {
    if (!aquaTree.revisions || aquaTree.revisions === null || Object.keys(aquaTree.revisions).length === 0) {
        return null
    }
    let tree = createAquaTreeTree(aquaTree)
    let pathResult = findHashWithLongestPath(tree)

    return {
        ...aquaTree,
        tree,
        treeMapping: pathResult
    }
}

/**
 * Prints a visual representation of the Aqua Tree structure
 * 
 * @param node - The revision tree node to display
 * @param prefix - String prefix for current line (used in recursion)
 * @param isLast - Whether the current node is the last child
 * 
 * This function:
 * - Creates a tree-like visual output
 * - Shows parent-child relationships between revisions
 * - Uses ASCII characters to draw tree structure
 */
export function logAquaTree(node: RevisionTree, prefix: string = "", isLast: boolean = true): void {
    // Log the current node's hash
    console.log(prefix + (isLast ? "└── " : "├── ") + node.hash);

    // Update the prefix for children
    const newPrefix = prefix + (isLast ? "    " : "│   ");

    // Recursively log each child
    node.children.forEach((child, index) => {
        const isChildLast = index === node.children.length - 1;
        logAquaTree(child, newPrefix, isChildLast);
    });
}
