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
  const [pendingAnimations, setPendingAnimations] = useState([]);
  const [startNode, setStartNode] = useState({
    row: START_END_COORDS.START_NODE_ROW,
    col: START_END_COORDS.START_NODE_COL,
  });

  const toggleReverseState = state => {
    const newState = state.split(" ")[1];
    if ([NODE_STATE.VISITED, NODE_STATE.SHORTEST_PATH, NODE_STATE.WALL].includes(newState)) {
      return `${NODE_STATE.DEFAULT} ${newState}-reverse`;
    } else if ([NODE_STATE.VISITED_REVERSE, NODE_STATE.SHORTEST_PATH_REVERSE,
        NODE_STATE.WALL_REVERSE].includes(newState)) {
      return `${NODE_STATE.DEFAULT} ${newState.substring(0, newState.length-"-reverse".length)}`;
    }
    return NODE_STATE.DEFAULT;
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
  const setNewGridCell = useCallback(node => {
    let newGrid = new Array(grid.length);
    for (let r = 0; r<grid.length; ++r) {
      newGrid[r] = [...grid[r]];
    }
    newGrid[node.row][node.col] = node;
    return newGrid;
  }, [grid]);

  const setCellDOM = node => {
    document.getElementById(`node-${node.row}-${node.col}`)
      .className = `${NODE_STATE.DEFAULT} ${node.state}`;
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
          // console.log(`${NODE_STATE.DEFAULT} ${stateToClear}`+"###"+node.className.trimEnd());
          if (`${NODE_STATE.DEFAULT} ${stateToClear}`===node.className) {
            node.className = toggleReverseState(node.className);
            hasToggled = true;
          }
        }
      }
    }

    return hasToggled;
  }, [grid, initNodeFromDOM]);

  // Clear state and states that prevent grid interaction after visualization
  const clearCache = useCallback(statesToClear => {
    clearState(statesToClear);
    for (let i = 0; i<pendingAnimations.length; ++i) {
      clearTimeout(pendingAnimations[i]);
    }

    setHasDisplayedAlgorithm(false);
    setHasProcessedSteps(false);
    setPendingAnimations([]);
  }, [clearState, pendingAnimations]);

  // visualize the algorithm on the grid
  // ! grid, startCoords, algorithm, and animationSpeed cannot be changed while running
  const visualizeAlgorithm = useCallback(async () => {
    // Clear the grid and stop any previous animation
    const hasDisplayedAlgo = clearState([NODE_STATE.VISITED, NODE_STATE.SHORTEST_PATH]);

    // Sleep for the animation time (1.5s)
    // Only sleep when there are toggled nodes
    if (hasDisplayedAlgo) {
      await new Promise(r => setTimeout(r, 1500));
    }

    const {steps, shortestPath} = algorithm.run(grid, startNode);
    const animations = [];

    // Animate the steps to the algorithm
    for (let i = 0; i<steps.length; ++i) {
      animations.push(setTimeout(() => {
        setCellDOM({...steps[i], state: `${NODE_STATE.VISITED}`});
      }, ANIMATION_SPEED.STEPS*i*animationSpeed));
    }

    // Animate the shortest path to end
    for (let i = 0; i<shortestPath.length; ++i) {
      animations.push(setTimeout(() => {
        setCellDOM({...shortestPath[i], state: `${NODE_STATE.SHORTEST_PATH}`});
      }, (ANIMATION_SPEED.SHORTEST_PATH*i
        +ANIMATION_SPEED.STEPS*steps.length)
        *animationSpeed
      ));
    }

    animations.push(setTimeout(() => {
      setIsRunning(false);
      setHasProcessedSteps(false);
    }, (ANIMATION_SPEED.STEPS*steps.length
      +ANIMATION_SPEED.SHORTEST_PATH*shortestPath.length)
      *animationSpeed
    ));

    setPendingAnimations(animations);
    setHasDisplayedAlgorithm(true);
    setHasProcessedSteps(true);
  }, [
    setIsRunning, grid, algorithm, animationSpeed,
    clearState, startNode
  ]);

  const handleMouseDown = (row, col) => {
    if (isRunning) return;
    setMouseIsPressed(true);

    // Set the dragged item
    if ([NODE_STATE.START, NODE_STATE.END].includes(grid[row][col].state)) {
      setDraggedNode(grid[row][col]);

      if (hasDisplayedAlgorithm) {
        clearCache([NODE_STATE.VISITED, NODE_STATE.SHORTEST_PATH]);
      }
      // Will remove the og start/end node
      setPreviousNode({...grid[row][col], state: ""});

    // Start toggling cells between wall and none
    } else if (!hasDisplayedAlgorithm) {
      toggleNewGridWall(row, col);
      setPreviousNode(grid[row][col]);
    }
  }

  // Stop toggling cells between wall and none
  const handleMouseUp = () => {
    // Set the new start/end node position
    if (draggedNode) {
      // Sometimes there's a start/end node duplicate so delete it
      clearState([draggedNode.state]);

      setGrid(setNewGridCell(draggedNode));
      // setCellDOM(draggedNode);

      if (draggedNode.state===NODE_STATE.START) {
        setStartNode({row: draggedNode.row, col: draggedNode.col});
      }
    }

    setDraggedNode(null);
    setMouseIsPressed(false);

  }

  // * executed after handleMouseLeave
  const handleMouseEnter = (row, col) => {
    // Move the start node around with the mouse
    if (!mouseIsPressed) return;
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
      setGrid(setNewGridCell(newDraggedNode));
      setCellDOM(newDraggedNode);

      // Remove the previous node and update it to the current node
      // * case it went over a start/end node previously, this removes the copy
      setGrid(setNewGridCell(previousNode));
      setCellDOM(previousNode);

      // If there is a reverse at the end, remove it
      if (grid[row][col].state.includes("reverse")) {
        setPreviousNode({...grid[row][col], state: ""});
      } else {
        setPreviousNode(grid[row][col]);
      }

    // Toggle the entered cell between a wall or none
    } else if (!isRunning && !hasDisplayedAlgorithm
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
  // * executed before handleMouseEnter
  const handleMouseLeave = (row, col) => {
    if (!draggedNode || !mouseIsPressed) return;
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
      clearCache([NODE_STATE.VISITED, NODE_STATE.SHORTEST_PATH]);
      return;

    // run the algorithm if user pressed play
    // and it has not been run before
    } else if (isRunning && !hasProcessedSteps) {
      visualizeAlgorithm();
    }

  }, [isRunning, hasProcessedSteps, clearCache,
     visualizeAlgorithm]);

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
