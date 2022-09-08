/* eslint-disable no-mixed-operators */
import React, {useState, useEffect, useCallback} from "react";

// local imports
import {START_END_COORDS, GRID_SIZE, NODE_STATE, ANIMATION_SPEED} from "../../constants"
import Node from "../Node"
import "./Grid.css";

const Grid = ({isRunning, setIsRunning, algorithm, animationSpeed}) => {
  const [grid, setGrid] = useState([]);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [hasProcessedSteps, setHasProcessedSteps] = useState(false);
  const [hasDisplayedAlgorithm, setHasDisplayedAlgorithm] = useState(false);
  const [previousNode, setPreviousNode] = useState(null);
  const [draggedNode, setDraggedNode] = useState(null);
  const [pendingAnimations, setPendingAnimation] = useState([]);
  const [startNode, setStartNode] = useState({
    row: START_END_COORDS.START_NODE_ROW,
    col: START_END_COORDS.START_NODE_COL,
  });

  const toggleReverseState = state => {
    const newState = state.substring(NODE_STATE.DEFAULT.length+1);
    if ([NODE_STATE.VISITED, NODE_STATE.SHORTEST_PATH, NODE_STATE.WALL].includes(newState)) {
      return `${state}-reverse`;
    } else if ([NODE_STATE.VISITED_REVERSE, NODE_STATE.SHORTEST_PATH_REVERSE,
        NODE_STATE.WALL_REVERSE].includes(newState)) {
      return state.substring(0, state.length-"-reverse".length);
    }
    return state;
  }

  const initNode = useCallback((row, col) => {
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

  const initNodeFromDOM = useCallback((row, col) => {
    let state = "";
    const node = document.getElementById(`node-${row}-${col}`)
      .className.substring(NODE_STATE.DEFAULT.length+1);
    if (node===NODE_STATE.START) {
      state = NODE_STATE.START;
    } else if (node===NODE_STATE.END) {
      state = NODE_STATE.END;
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
  const setNewGridCell = node => {
    let newGrid = new Array(grid.length);
    for (let r = 0; r<grid.length; ++r) {
      newGrid[r] = [...grid[r]];
    }
    newGrid[node.row][node.col] = node;
    return newGrid;
  }

  const setCellDOM = node => {
    document.getElementById(`node-${node.row}-${node.col}`)
      .className = `${NODE_STATE.DEFAULT} ${node.state}`;
  }

  const setCell = node => {
    if (!node) return;
    setGrid(setNewGridCell(node));

    if (node.state===NODE_STATE.START) {
      setStartNode({row: node.row, col: node.col});
    }
  }

  // Create a new grid with grid[row][col] toggled between a wall or none
  const toggleNewGridWall = (row, col) => {
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
  const clearState = useCallback(statesToClear => {
    let hasToggled = false;

    for (let r = 0; r<grid.length; ++r) {
      for (let c = 0; c < grid[r].length; ++c) {
        const {row, col} = initNodeFromDOM(r, c);
        const node = document.getElementById(`node-${row}-${col}`);

        for (let stateToClear of statesToClear) {
          console.log(`${NODE_STATE.DEFAULT} ${stateToClear}`+"###"+node.className.trimEnd());
          if (`${NODE_STATE.DEFAULT} ${stateToClear}`===node.className.trimEnd()) {
            node.className = toggleReverseState(node.className.trimEnd());
            hasToggled = true;
          }
        }
      }
    }

    return hasToggled;
  }, [grid, initNodeFromDOM]);

  // visualize the algorithm on the grid
  // ! grid, startCoords, algorithm, and animationSpeed cannot be changed while running
  const visualizeAlgorithm = useCallback(async isInstant => {
    // Clear the grid and stop any previous animation
    const hasDisplayedAlgo = clearState([NODE_STATE.VISITED, NODE_STATE.SHORTEST_PATH]);

    // Sleep for the animation time (1.5s)
    // Only sleep when there are toggled nodes
    if (hasDisplayedAlgo) {
      await new Promise(r => setTimeout(r, 1500));
    }

    const {steps, shortestPath} = algorithm.run(grid, startNode);
    const animations = [];

    const instantFactor = isInstant ? 0 : 1;
    const animation = isInstant ? NODE_STATE.NO_ANIMATION : "";

    // Animate the steps to the algorithm
    for (let i = 0; i<steps.length; ++i) {
      animations.push(setTimeout(() => {
        setCellDOM({...steps[i], state: `${NODE_STATE.VISITED} ${animation}`});
      }, ANIMATION_SPEED.STEPS*i*animationSpeed*instantFactor));
    }

    // Animate the shortest path to end
    for (let i = 0; i<shortestPath.length; ++i) {
      animations.push(setTimeout(() => {
        setCellDOM({...shortestPath[i], state: `${NODE_STATE.SHORTEST_PATH} ${animation}`});
      }, (ANIMATION_SPEED.SHORTEST_PATH*i
        +ANIMATION_SPEED.STEPS*steps.length)
        *animationSpeed*instantFactor
      ));
    }

    animations.push(setTimeout(() => {
      setIsRunning(false);
      setHasProcessedSteps(false);
    }, (ANIMATION_SPEED.STEPS*steps.length
      +ANIMATION_SPEED.SHORTEST_PATH*shortestPath.length)
      *animationSpeed*instantFactor
    ));

    setPendingAnimation(animations);
    setHasDisplayedAlgorithm(true);
    setHasProcessedSteps(true);
  }, [
    setIsRunning, grid, algorithm, animationSpeed,
    clearState, startNode,
  ]);

  const handleMouseDown = (row, col) => {
    if (isRunning) return;
    // Set the dragged item
    if ([NODE_STATE.START, NODE_STATE.END].includes(grid[row][col].state)) {
      setDraggedNode(grid[row][col]);

      // Will remove the og start/end node
      setPreviousNode({...grid[row][col], state: ""});

      setCell(grid[row][col]);

    // Start toggling cells between wall and none
    } else if (!hasDisplayedAlgorithm) {
      setMouseIsPressed(true);
      toggleNewGridWall(row, col);
      setPreviousNode(grid[row][col]);
    }
  }

  // Stop toggling cells between wall and none
  const handleMouseUp = () => {
    // Set the new start/end node position
    setCell(draggedNode);

    setDraggedNode(null);
    setMouseIsPressed(false);
  }

  const handleMouseEnter = (row, col) => {
    // Move the start node around with the mouse
    if (draggedNode) {
      // Case start and end node overlap, don't move the draggedNode
      if ([draggedNode.state, grid[row][col].state].includes(NODE_STATE.START)
          && [draggedNode.state, grid[row][col].state].includes(NODE_STATE.END)) {
        setCellDOM(draggedNode);
        return;
      }

      // Set the current row and col to be start/end
      const newDraggedNode = {row: row, col: col, state: draggedNode.state};
      setDraggedNode(newDraggedNode);
      setCellDOM(newDraggedNode);

      // Remove the previous node and update it to the current node
      // ! case it went over a start/end node previously, this removes the copy
      setGrid(setNewGridCell(previousNode));
      setCellDOM(previousNode);

      // If there is a reverse at the end, remove it
      if (grid[row][col].state.includes("reverse")) {
        setPreviousNode({...grid[row][col], state: ""});
      } else {
        setPreviousNode(grid[row][col]);
      }

      if (hasDisplayedAlgorithm) {
        visualizeAlgorithm(true);
      }

    // Toggle the entered cell between a wall or none
    } else if (mouseIsPressed && !isRunning && !hasDisplayedAlgorithm
        && grid[row][col].state!==NODE_STATE.START
        && grid[row][col].state!==NODE_STATE.END
        // There's a bug that registers 2 enters in a square when you enter
        // only once. So this prevents that.
        && (previousNode.row!==row || previousNode.col!==col)) {
      toggleNewGridWall(row, col);
      setPreviousNode(grid[row][col]);
    }
  }

  // Replace current cell with og state after changed to start/end node
  const handleMouseLeave = (row, col) => {
    if (!draggedNode) return;
    // if start, then end else start
    let oppositeSide = draggedNode.state===NODE_STATE.START ? NODE_STATE.END : NODE_STATE.START;

    // don't remove previous node if it's START or END
    if (grid[row][col].state!==oppositeSide) {
      setCellDOM({...grid[row][col], state: ""});
    }
  }

  useEffect(() => {
    setGrid(initGrid());
  }, [initGrid]);

  useEffect(() => {
    // Clear the animation if visualizing but the user aborted
    if (!isRunning && hasProcessedSteps) {
      clearState([NODE_STATE.VISITED, NODE_STATE.SHORTEST_PATH]);
      for (let i = 0; i<pendingAnimations.length; ++i) {
        clearTimeout(pendingAnimations[i]);
      }

      setHasDisplayedAlgorithm(false);
      setHasProcessedSteps(false);
      return;

    // Do not run the algorithm if it is already running
    } else if (!isRunning || hasProcessedSteps) {
      return;
    }

    visualizeAlgorithm(false);
  }, [isRunning, clearState,hasProcessedSteps, pendingAnimations, visualizeAlgorithm]);

  // hasProcessedSteps must be the same as isRunning
  useEffect(() => setHasProcessedSteps(isRunning), [isRunning]);

  return (
    <div className="grid-container">
      <div className="grid-border" onMouseUp={handleMouseUp}>
        <table cellSpacing="0">
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
                    onMouseLeave={(row, col) => handleMouseLeave(row, col)}
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
