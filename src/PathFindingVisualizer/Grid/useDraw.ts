import React, { useState, useEffect, useCallback } from "react";

// import local files
import { NodeType } from "../Node";
import { NODE_STATE, BIG_RADIUS } from "../../constants";

const useDraw = (
  setCell: (node: NodeType) => void,
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
      return state.substring(0, state.length-"-reverse".length);
    }
    return state+"-reverse";
  }

    // Create a new grid with grid[row][col] toggled between a wall or none
  const toggleGridWall = (grid: NodeType[][], row: number, col: number) => {
    let wall = grid[row][col].state===NODE_STATE.WALL
      ? NODE_STATE.WALL : NODE_STATE.WALL_REVERSE;
    setCell({
      ...grid[row][col],
      state: toggleReverseState(wall)
    });
  }

}
