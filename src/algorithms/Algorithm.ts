import { NodeType } from "../PathFindingVisualizer/Node";

export default abstract class Algorithm {
  name: string;
  info: string;

  constructor(name: string, info: string) {
    this.name = name;
    this.info = info;
  }

  inBounds (grid: NodeType[][], r: number, c: number) {
    return 0<=r && r<grid.length && 0<=c && c<grid[r].length;
  }

  abstract run(
    grid: NodeType[][],
    startNode: NodeType
  ): { steps: NodeType[]; shortestPath: NodeType[] };
}
