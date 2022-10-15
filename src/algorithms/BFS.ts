import { NODE_STATE, DELTA } from "../constants";
import Algorithm from "./Algorithm";
import { NodeType } from "../PathFindingVisualizer/Node";
import { Queue } from "./util";

export default class BFS extends Algorithm {
  constructor() {
    super("Breadth First Search", "placeholder");
  }

  run(grid: NodeType[][], startNode: NodeType): { steps: NodeType[]; shortestPath: NodeType[] } {
    
  }
