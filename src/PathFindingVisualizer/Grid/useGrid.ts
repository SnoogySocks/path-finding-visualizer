import React, {useState, useEffect, useCallback} from "react";
import {NodeType} from "../Node";

// import local files
import {START_END_COORDS, GRID_SIZE, NODE_STATE, ANIMATION_SPEED} from "../../constants"
import Grid from ".";

interface useGridType {
  grid: NodeType[][];
  setGrid: React.Dispatch<React.SetStateAction<NodeType[][]>>;
  setNewGridCell: (node: NodeType) => NodeType[][];
  setCellDOM: (node: NodeType) => void;
  toggleNewGridWall: (row: number, col: number) => void;
  clearState: (statesToClear: string[], draggedNode: NodeType) => boolean;
}

const useGrid = (): useGridType => {
  const [grid, setGrid] = useState<NodeType[][]>([]);

  const toggleReverseState = (state: string): string => {
    const newState = state.split(" ")[1];
    if ([NODE_STATE.VISITED, NODE_STATE.SHORTEST_PATH, NODE_STATE.WALL].includes(newState)) {
      return `${NODE_STATE.DEFAULT} ${newState}-reverse`;
    } else if ([NODE_STATE.VISITED_REVERSE, NODE_STATE.SHORTEST_PATH_REVERSE,
        NODE_STATE.WALL_REVERSE].includes(newState)) {
      return `${NODE_STATE.DEFAULT} ${newState.substring(0, newState.length-"-reverse".length)}`;
    }
    return NODE_STATE.DEFAULT;
  }

  const initNode = useCallback((row: number, col: number): NodeType => {
    let state = "";
    if (row===START_END_COORDS.START_NODE_ROW && col===START_END_COORDS.START_NODE_COL) {
      state = NODE_STATE.START;
    } else if (row===START_END_COORDS.END_NODE_ROW && col===START_END_COORDS.END_NODE_COL) {
      state = NODE_STATE.END;
    }

    return {
      row, col, state,
    };
  }, []);

  const initNodeFromDOM = (row: number, col: number): NodeType => {
    let state = "";
    const node = document.getElementById(`node-${row}-${col}`)?.
        className.substring(NODE_STATE.DEFAULT.length+1);
    if (node===NODE_STATE.START) {
      state = NODE_STATE.START;
    } else if (node===NODE_STATE.END) {
      state = NODE_STATE.END;
    }
    return {
      row, col, state,
    };
  }

  const initGrid = useCallback(() => {
      let grid = new Array(GRID_SIZE.ROW_SIZE);
      for (let r = 0; r<grid.length; ++r) {
        grid[r] = new Array(GRID_SIZE.COL_SIZE);
        for (let c = 0; c<grid[r].length; ++c) {
          grid[r][c] = initNode(r, c);
        }
      }
      return grid;
  }, []);

  // Create a new grid with grid[row][col] modified to value
  const setNewGridCell = useCallback((node: NodeType): NodeType[][] => {
    let newGrid = new Array(grid.length);
    for (let r = 0; r<grid.length; ++r) {
      newGrid[r] = [...grid[r]];
    }
    newGrid[node.row][node.col] = node;
    return newGrid;
  }, [grid]);

  const setCellDOM = (node: NodeType) => {
    document.getElementById(`node-${node.row}-${node.col}`)!
      .className = `${NODE_STATE.DEFAULT} ${node.state}`;
  }

  // Create a new grid with grid[row][col] toggled between a wall or none
  const toggleNewGridWall = (row: number, col: number) => {
    let toggledWall = grid[row][col].state===NODE_STATE.WALL
      ? NODE_STATE.WALL : NODE_STATE.WALL_REVERSE;
    let value = {
      ...grid[row][col],
      state: toggleReverseState(`${NODE_STATE.DEFAULT} ${toggledWall}`)
        .substring(NODE_STATE.DEFAULT.length+1),
    };
    setGrid(setNewGridCell(value));
  }

  // Takes a list of states to clear from the grid
  const clearState = useCallback((statesToClear: string[], draggedNode: NodeType): boolean => {
    let hasToggled = false;

    for (let r = 0; r<grid.length; ++r) {
      for (let c = 0; c < grid[r].length; ++c) {
        const {row, col} = initNodeFromDOM(r, c);
        const node = document.getElementById(`node-${row}-${col}`)!;

        for (let stateToClear of statesToClear) {
          // Toggle the current node's state to its reverse animation unless
          // it is the dragged node then don't.
          if (`${NODE_STATE.DEFAULT} ${stateToClear}`===node.className
              && (!draggedNode || draggedNode.row!==row || draggedNode.col!==col)) {
            node.className = toggleReverseState(node.className);
            hasToggled = true;
          }
        }
      }
    }

    return hasToggled;
  }, [grid]);

  useEffect(() => {
    setGrid(initGrid());
  }, [initGrid]);

  return {grid, setGrid, setNewGridCell, setCellDOM, toggleNewGridWall, clearState};
}

export default useGrid;