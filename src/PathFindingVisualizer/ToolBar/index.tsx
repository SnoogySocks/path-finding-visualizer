import React from 'react';
import BFSType from "../../algorithms/BFS";

// local imports
import "./Toolbar.css";

interface ToolBarProps {
  isRunning: boolean;
  onVisualize: () => void;
  algorithm: BFSType;
  setAlgorithm: (algorithm: any) => void;
  setAnimationSpeed: (speed: number) => void;
}

const ToolBar: React.FC<ToolBarProps> = ({isRunning, onVisualize, algorithm, setAlgorithm, setAnimationSpeed}) => {
  const playButtonText = isRunning ? "ABORT" : "PLAY";

  return (<div className="tool-bar">
    <button onClick={onVisualize}>{playButtonText}</button>
  </div>);
}

export default ToolBar;