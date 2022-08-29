/* eslint-disable no-mixed-operators */
import React, {useState, useEffect, useRef, useCallback} from "react";

// local imports
import {START_END_COORDS, GRID_SIZE, NODE_STATE, ANIMATION_SPEED} from "../../constants"   
import Node from "../Node"
import "./Grid.css";

const Grid = ({isRunning, setIsRunning, algorithm, animationSpeed}) => {
  const [grid, setGrid] = useState([]);
  const [hasExecutedOnce, setHasExecutedOnce] = useState(false);
  const [pendingTimeouts, setPendingTimeouts] = useState([]);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [startCoords, setStartCoords] = useState({
    row: START_END_COORDS.START_NODE_ROW, 
    col: START_END_COORDS.START_NODE_COL
  });
  const [endCoords, setEndCoords] = useState({
    row: START_END_COORDS.END_NODE_ROW, 
    col: START_END_COORDS.END_NODE_COL
  });


  const initNode = useCallback((row, col) => {
    let state = NODE_STATE.NONE;
    if (row===startCoords.row && col===startCoords.col) {
      state = NODE_STATE.START;
    } else if (row===endCoords.row && col===endCoords.col) {
      state = NODE_STATE.FINISH;
    }

    return {
      row, col, state,
    };
  }, [startCoords, endCoords]);

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
  const setNewGridCell = (row, col, value) => {
    let newGrid = new Array(grid.length);
    for (let r = 0; r<grid.length; ++r) {
      newGrid[r] = [...grid[r]];
    }
    newGrid[row][col] = value;
    return newGrid;
  }

  // Create a new grid with grid[row][col] toggled between a wall or none
  const toggleNewGridWall = (row, col) => {
    let value = {
      ...grid[row][col],
      state: grid[row][col].state===NODE_STATE.WALL ? NODE_STATE.NONE : NODE_STATE.WALL,
    };
    setGrid(setNewGridCell(row, col, value));
  }

  const clearGrid = useCallback(() => {
    for (let r = 0; r<grid.length; ++r) {
      for (let c = 0; c<grid[r].length; ++c) {
        const {row, col, state}= initNode(r, c);
        document.getElementById(`node-${row}-${col}`)
          .className = `node ${state}`;
      }
    }
  }, [grid, initNode]);

  const clearState = useCallback(statesToClear => {
    for (let r = 0; r<grid.length; ++r) {
      for (let c = 0; c < grid[r].length; ++c) {
        const {row, col, state}= initNode(r, c);
        const node = document.getElementById(`node-${row}-${col}`);
        statesToClear.forEach(stateToClear => {
          if (`node ${stateToClear}`===node.className) {
            node.className = `node ${state}`;
          }
        });
      }
    }
  }, [grid, initNode])

  // Start toggling cells between wall and none
  const handleMouseDown = (row, col) => {
    if (isRunning 
      || row===startCoords.row && col===startCoords.col
      || row===endCoords.row && col===endCoords.col) return;
    setMouseIsPressed(true);
    toggleNewGridWall(row, col);
  }

  // Stop toggling cells between wall and none
  const handleMouseUp = () => {
    setMouseIsPressed(false);
  }

  // Toggle the entered cell between a wall or none
  const handleMouseEnter = (row, col) => {
    if (!mouseIsPressed || isRunning
        || row===startCoords.row && col===startCoords.col
        || row===endCoords.row && col===endCoords.col
        || grid[row][col].state!==NODE_STATE.WALL
        && grid[row][col].state!==NODE_STATE.NONE) return;
    toggleNewGridWall(row, col);
  }

  useEffect(() => {
    setGrid(initGrid());
  }, [initGrid]);

  // Run the algorithm
  // ! grid, startCoords, algorithm, and animationSpeed cannot be changed while running
  useEffect(() => {
    // Clear the grid if animating but the user chose to stop
    if (!isRunning && hasExecutedOnce) {
      clearState([NODE_STATE.VISITED, NODE_STATE.SHORTEST_PATH]);
      for (let i = 0; i<pendingTimeouts.length; ++i) {
        clearTimeout(pendingTimeouts[i]);
      }
      return;
    }
    // Make the algorithm run only once at a time
    else if (!isRunning || hasExecutedOnce) return;
    
    // Clear the grid and stop any previous animation
    clearState([NODE_STATE.VISITED, NODE_STATE.SHORTEST_PATH]);
    for (let i = 0; i<pendingTimeouts.length; ++i) {
      clearTimeout(pendingTimeouts[i]);
    }

    const {steps, shortestPath} = algorithm.run(grid, grid[startCoords.row][startCoords.col]);
    const timeouts = [];

    // Animate the steps to the algorithm
    for (let i = 0; i<steps.length; ++i) {
      timeouts.push(setTimeout(() => {
        const {row, col} = steps[i];
        document.getElementById(`node-${row}-${col}`)
          .className = `node ${NODE_STATE.VISITED}`;
      }, ANIMATION_SPEED*i*animationSpeed));
    }

    // Animate the shortest path to finish
    for (let i = 0; i<shortestPath.length; ++i) {
      timeouts.push(setTimeout(() => {
        const {row, col} = shortestPath[i];
        document.getElementById(`node-${row}-${col}`)
          .className = `node ${NODE_STATE.SHORTEST_PATH}`;
      }, ANIMATION_SPEED*(i+steps.length)*animationSpeed));
    }

    timeouts.push(setTimeout(() => {
      setIsRunning(false);
      setHasExecutedOnce(false);
    }, (steps.length+shortestPath.length)*ANIMATION_SPEED*animationSpeed));

    setPendingTimeouts(timeouts);
    setHasExecutedOnce(true);
  }, [
    isRunning, setIsRunning, grid, startCoords, algorithm, 
    animationSpeed, clearState, pendingTimeouts, hasExecutedOnce
  ]);

  // hasRun must be the same as isRunning
  useEffect(() => setHasExecutedOnce(isRunning), [isRunning]);

  return (
    <div className="grid-container">
      <div className="grid-table-container" onMouseUp={handleMouseUp}>
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
                    onMouseUp={handleMouseUp}
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
