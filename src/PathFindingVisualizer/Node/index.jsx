import React from "react"

import { NODE_STATE } from "../../constants";
import "./Node.css"

const Node = ({ row, col, state, onMouseDown, onMouseUp, onMouseEnter, onMouseLeave }) => {
    if (row===3 && col===10) {
        // console.log(state);
    }
    return (<td
        id={`node-${row}-${col}`}
        className={`${NODE_STATE.DEFAULT} ${state}`}
        onMouseDown={() => onMouseDown(row, col)}
        onMouseUp={onMouseUp}
        onMouseEnter={() => onMouseEnter(row, col)}
        onMouseLeave={() => onMouseLeave(row, col)}
    />);
}

export default Node;
