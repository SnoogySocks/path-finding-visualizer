/* eslint-disable no-mixed-operators */
import React, {useState, useEffect, useCallback} from "react";

// files
import {START_END_COORDS, GRID_SIZE, NODE_STATE} from "../../constants.js"   

// local imports
import Node from "../Node"
import "./Grid.css";

const Grid = ({isRunning}) => {
  const [grid, setGrid] = useState([]);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);

  const initNode = useCallback((row, col) => {
    let state = NODE_STATE.NONE;
    if (row===START_END_COORDS.START_NODE_ROW && col===START_END_COORDS.START_NODE_COL) {
      state = NODE_STATE.START;
    } else if (row===START_END_COORDS.END_NODE_ROW && col===START_END_COORDS.END_NODE_COL) {
      state = NODE_STATE.FINISH;
    }

    return {
      row, col, state,
    };
  }, []);

  const initGrid = useCallback(() => {
      let grid = new Array(GRID_SIZE.ROW_SIZE);
      for (let r = 0; r<grid.length; ++r) {
        let row = new Array(GRID_SIZE.COL_SIZE);
        for (let c = 0; c<row.length; ++c) {
          row[c] = initNode(r, c);
        }
        grid[r] = row;
      }
      return grid;
  }, [initNode]);
  
  // Create a new grid with grid[row][col] modified to value
  let setNewGridCell = (row, col, value) => {
    let newGrid = new Array(grid.length);
    for (let r = 0; r<grid.length; ++r) {
      newGrid[r] = [...grid[r]];
    }
    newGrid[row][col] = value;
    return newGrid;
  }

  // Create a new grid with grid[row][col] toggled between a wall or none
  let toggleNewGridWall = (row, col) => {
    let value = {
      ...grid[row][col],
      state: grid[row][col].state===NODE_STATE.WALL ? NODE_STATE.NONE : NODE_STATE.WALL,
    };
    setGrid(setNewGridCell(row, col, value));
  }

  // Start toggling cells between wall and none
  const handleMouseDown = (row, col) => {
    setMouseIsPressed(true);
    toggleNewGridWall(row, col);
  }

  // Stop toggling cells between wall and none
  const handleMouseUp = (row, col) => {
    setMouseIsPressed(false);
  }

  // Toggle the entered cell between a wall or none
  const handleMouseEnter = (row, col) => {
    if (!mouseIsPressed
        || grid[row][col].state!==NODE_STATE.WALL
        && grid[row][col].state!==NODE_STATE.NONE) return;
    toggleNewGridWall(row, col);
  }

  useEffect(() => {
    setGrid(initGrid());
  }, [initGrid, initNode])

  // Run the algorithm
  useEffect(() => {
    // Stops the animation
    if (!isRunning) {
      
    // Starts the animation
    } else {
      
    }
  }, [isRunning]);

  return (
    <div className="grid-container">
      <div className="grid-table-container">
        <table>
          <tbody className="grid">
            {grid.map((row, rowIdx) => {

              return (<tr key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const {row, col, state} = node;

                  return (<Node 
                    key={nodeIdx}
                    row={row}
                    col={col}
                    state={state}
                    onMouseDown={(row, col) => handleMouseDown(row, col)}
                    onMouseUp={(row, col) => handleMouseUp(row, col)}
                    onMouseEnter={(row, col) => handleMouseEnter(row, col)}
                  />);

                })}
              </tr>)

            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Grid;
