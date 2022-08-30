import React from 'react';

// local imports
import "./Toolbar.css";

const ToolBar = ({isRunning, onVisualize, setAlgorithm}) => {
  const playButtonText = isRunning ? "ABORT" : "PLAY";

  return (<div className="tool-bar">
    <button onClick={onVisualize}>{playButtonText}</button>
  </div>);
}

export default ToolBar;