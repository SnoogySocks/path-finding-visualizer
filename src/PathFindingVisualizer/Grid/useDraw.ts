import React, { useState, useEffect, useCallback } from "react";

// import local files
import { NodeType } from "../Node";
import { NODE_STATE, SPECIAL_STATES, BIG_RADIUS } from "../../constants";

interface useDrawType {
  toggleCellWall: (grid: NodeType[][], row: number, col: number) => void;
  brush: (grid: NodeType[][], row: number, col: number) => void;
  erase: (grid: NodeType[][], row: number, col: number) => void;
}

const useDraw = (
  setGrid: (grid: NodeType[][]) => void,
  setCell: (node: NodeType) => void
) => {
  const toggleReverseState = (state: string): string => {
    // const newState = state.split(" ")[1];
    // if ([NODE_STATE.VISITED, NODE_STATE.SHORTEST_PATH, NODE_STATE.WALL].includes(newState)) {
    //   return `${NODE_STATE.DEFAULT} ${newState}-reverse`;
    // } else if ([NODE_STATE.VISITED_REVERSE, NODE_STATE.SHORTEST_PATH_REVERSE,
    //     NODE_STATE.WALL_REVERSE].includes(newState)) {
    //   return `${NODE_STATE.DEFAULT} ${newState.substring(0, newState.length-"-reverse".length)}`;
    // }
    if (state.includes("-reverse")) {
      return state.substring(0, state.length - "-reverse".length);
    }
    return state + "-reverse";
  };

  // Create a new grid with grid[row][col] toggled between a wall or none
  const toggleCellWall = (grid: NodeType[][], row: number, col: number) => {
    let wall =
      grid[row][col].state === NODE_STATE.WALL
        ? NODE_STATE.WALL
        : NODE_STATE.WALL_REVERSE;
    setCell({
      ...grid[row][col],
      state: toggleReverseState(wall),
    });
  };

  // Write a state around the given coords
  const writeState = (
    grid: NodeType[][],
    row: number,
    col: number,
    state: string
  ) => {
    let newGrid = new Array(grid.length);
    for (let r = 0; r < grid.length; ++r) {
      let newGridRow = [...grid[r]];

      for (let c = 0; c < grid[r].length; ++c) {
        // Write a wall if the node is within the brush radius
        // and it's not a start or end node
        if (
          !SPECIAL_STATES.includes(grid[r][c].state) &&
          (row - r) ** 2 + (col - c) ** 2 <= BIG_RADIUS ** 2
        ) {
          newGridRow[c] = {
            ...grid[r][c],
            state:
              state.includes("-reverse") && grid[r][c].state === ""
                ? ""
                : state,
          };
        }
      }

      newGrid[r] = newGridRow;
    }

    setGrid(newGrid);
  };

  const brush = (grid: NodeType[][], row: number, col: number) =>
    writeState(grid, row, col, NODE_STATE.WALL);

  const erase = (grid: NodeType[][], row: number, col: number) =>
    writeState(grid, row, col, NODE_STATE.WALL_REVERSE);

  return { toggleCellWall, brush, erase };
};

export default useDraw;
