import React from 'react';

// local imports
import "./Toolbar.css";

const ToolBar = ({isRunning, onVisualize}) => {
  const playButtonText = isRunning ? "STOP" : "PLAY";

  return (<div className="tool-bar">
    <button onClick={onVisualize}>{playButtonText}</button>
  </div>);
}

export default ToolBar;