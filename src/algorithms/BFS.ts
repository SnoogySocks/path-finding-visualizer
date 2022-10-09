import { NODE_STATE, DELTA } from "../constants";

// Local files
import Algorithm from "./Algorithm";
import {findShortestPath} from "./util"
import {NodeType} from "../PathFindingVisualizer/Node";

export default class BFS extends Algorithm {
    constructor () {
        super("BFS", "placeholder");
    }

    // Run the algorithm and return the steps and shortest path
    run (grid: NodeType[][], start: NodeType): {steps: NodeType[], shortestPath: NodeType[]} {
        let steps = [];
        let parents = new Array(grid.length);

        let visited = new Array(grid.length);
        let distance = new Array(grid.length);

        for (let i = 0; i < grid.length; ++i) {
            let parentsRow = new Array(grid[i].length);
            let visitedRow = new Array(grid[i].length);
            let distanceRow = new Array(grid[i].length);
            for (let j = 0; j<grid[i].length; ++j) {
                parentsRow[j] = null;
                visitedRow[j] = false;
                distanceRow[j] = Infinity;
            }
            parents[i] = parentsRow;
            visited[i] = visitedRow;
            distance[i] = distanceRow;
        }

        // Start fro the start node
        let queue = [start];
        visited[start.row][start.col] = true;
        distance[start.row][start.col] = 0;

        while (queue.length>0) {
            const previousNode = queue.shift()!;
            for (const [dr, dc] of DELTA) {
                let [r, c] = [previousNode.row+dr, previousNode.col+dc];

                // Invalid if out of bounds or a wall or is already visited
                if (r<0 || grid.length<=r || c<0 || grid[r].length<=c
                    || grid[r][c].state===NODE_STATE.WALL
                    || visited[r][c]) continue;

                // Record all the visited nodes in the algorithm
                steps.push(grid[r][c]);
                visited[r][c] = true;
                // Add the previous distance with the distance now
                distance[r][c] = distance[previousNode.row][previousNode.col]+1;
                // previousNode is a parent node to grid[r][c]
                parents[r][c] = previousNode;

                if (grid[r][c].state!==NODE_STATE.END) {
                    queue.push(grid[r][c]);
                } else {
                    steps.pop();
                    return {steps, shortestPath: findShortestPath(parents, grid[r][c])};
                }
            }
        }

        // In this case there was no path to the finish node
        return {steps, shortestPath: []};
    }
}