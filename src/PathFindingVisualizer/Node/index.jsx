import React from "react"

import "./Node.css"

const Node = ({ row, col, state, onMouseDown, onMouseUp, onMouseEnter }) => {
    return (<td
        id={`node-${row}-${col}`}
        className={`node ${state}`}
        onMouseDown={() => onMouseDown(row, col)}
        onMouseUp={onMouseUp}
        onMouseEnter={() => onMouseEnter(row, col)}
    />);
}

export default Node;
