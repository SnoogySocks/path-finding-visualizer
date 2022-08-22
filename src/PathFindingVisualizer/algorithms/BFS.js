import { dblClick } from "@testing-library/user-event/dist/click";
import { NODE_STATE, DELTA } from "../../constants";

export default class BFS {
    constructor () {
        this.name = "BFS";
        this.info = "placeholder";
    }

    findShortestPath (grid, distance, end, start) {
        let shortestPath = [];
        let current = end;
        let hasDecreased = false;
        while (current!==start) {
            if (!hasDecreased) {
                console.error("Error with the shortest path algorithm");
            }

            for (const [dr, dc] of DELTA) {
                const [r, c] = [current.row+dr, current.col+dc];

                // the next distance must decrease from the current
                if (distance[r][c]<distance[current.row][current.col]) {
                    shortestPath.push(grid[r][c])
                    current = grid[r][c];
                    hasDecreased = true;
                    break;
                }
            }
        }

        return shortestPath;
    }

    // Run the algorithm and return the steps and shortest path
    run (grid, start) {
        let steps = [];
        
        let visited = new Array(grid.length);
        let distance = new Array(grid.length);

        for (let i = 0; i < grid.length; ++i) {
            for (let j = 0; j<grid[i].length; ++j) {
                visited[i][j] = false;
                distance[i][j] = Infinity;
            }
        }

        // Start fro the start node
        let queue = [start];
        visited[start.row][start.col] = true;
        distance[start.row][start.col] = 0;

        while (queue.length>0) {
            const u = queue.shift();
            for (const [dr, dc] of DELTA) {
                let [r, c] = [u.row+dr, u.col+dc];

                // Invalid if out of bounds or a wall or is already visited
                if (r<0 || grid.length<=r || c<0 || grid[r].length<=c
                    || grid[r][c].state===NODE_STATE.WALL
                    || visited[r][c]) continue;
                
                distance[r][c] = distance[u.row][u.col]+1;
                visited[r][c] = true;
                steps.push(grid[r][c]);
                
                if (grid[r][c].state!==NODE_STATE.FINISH) {
                    queue.push(grid[r][c]);
                } else {
                    return {steps, shortestPath: this.findShortestPath(grid, distance, grid[r][c], start)};
                }
            }
        }
    }
}