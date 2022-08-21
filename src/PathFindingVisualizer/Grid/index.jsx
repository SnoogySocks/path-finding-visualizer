import React, {useState, useEffect, useCallback} from "react";

// files
import { START_END_COORDS, GRID_SIZE } from "../../constants";
import Node from "../Node";

// local imports
import "./Grid.css";

const Grid = () => {
  const [grid, setGrid] = useState([]);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  
  const initNode = useCallback((row, col) => {
    let state = "";
    if (row===START_END_COORDS.START_NODE_ROW && col===START_END_COORDS.START_NODE_COL) {
      state = "node-start";
    } else if (row===START_END_COORDS.END_NODE_ROW && col===START_END_COORDS.END_NODE_COL) {
      state = "node-end";
    }

    return {
      row, col, state,
      distance: Infinity,
    }
  }, [])

  const initGrid = useCallback(() => {
      let grid = [];
      for (let r = 0; r<GRID_SIZE.ROW_SIZE; ++r) {
        let row = [];
        for (let c = 0; c<GRID_SIZE.COL_SIZE; ++c) {
          row.push(initNode(r, c));
        }
        grid.push(row);
      }
      return grid;
  }, [initNode]);

  // Start placing walls onto the grid
  const handleMouseDown = (row, col) => {

  }

  // Stop placing walls onto the grid
  const handleMouseUp = (row, col) => {

  }

  // Place walls on the grid when mouseIsPressed
  const handleMouseEnter = (row, col) => {

  }

  useEffect(() => {
    setGrid(initGrid());
  }, [initGrid, initNode])

  return (
    <div className="grid-container">
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
  );
};

export default Grid;
