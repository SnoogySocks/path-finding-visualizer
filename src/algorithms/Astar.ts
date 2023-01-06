import { NODE_STATE, DELTA } from "../constants";
// import { Node } from "../PathFindingVisualizer/Node";
// import Algorithm from "./Algorithm";
// import { NodeType } from "../PathFindingVisualizer/Node";
// import { inBounds, findShortestPath } from "./util";
// import Grid from "../PathFindingVisualizer/Grid";

// export default class Astar extends Algorithm {
//     constructor() {
//         super("A*", "placeholder");
//     }
//     heuristic(a: NodeType, b: NodeType): number {
//         return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
//     }
//     run(grid: NodeType[][], startNode: NodeType): { steps: NodeType[]; shortestPath: NodeType[] } {
//         // initialize an open list
//         // initialize a closed list
//         // put the starting node on the open list (you can leave its f at zero)
//         // while the open list is not empty
//         // find the node with the least f on the open list, call it "q"
//         // pop q off the open list
//         // generate q's 8 successors and set their parents to q
//         // for each successor
//         // if successor is the goal, stop the search
//         // successor.g = q.g + distance between successor and q
//         // successor.h = distance from goal to successor
//         // successor.f = successor.g + successor.h
//         // if a node with the same position as successor is in the OPEN list \
//         // which has a lower f than successor, skip this successor
//         // if a node with the same position as successor is in the CLOSED list \
//         // which has a lower f than successor, skip this successor
//         // otherwise, add the node to the open list
//         // push q on the closed list
//         // if you exit the while loop because the open list is empty,
//         // then you did not find the goal and the path does not exist
//         let openList: NodeType[] = [];
//         let closedList: NodeType[] = [];
//         let steps: NodeType[] = [];
//         let shortestPath: NodeType[] = [];
//         openList.push(startNode);
//         while (openList.length > 0) {
//             let q = openList[0];
//             let qIndex = 0;
//             for (let i = 0; i < openList.length; i++) {
//                 if (openList[i].f < q.f) {
//                     q = openList[i];
//                     qIndex = i;
//                 }
//             }
//         }
//     }
// }
