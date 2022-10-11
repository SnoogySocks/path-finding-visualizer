import React from "react";
import Algorithm from "../../algorithms/Algorithm";

// local imports
import "./Toolbar.css";

interface Button {
  on: boolean;
  toggle: () => void;
}

interface ToolBarProps {
  runButton: Button;
  algorithm: Algorithm;
  setAlgorithm: (algorithm: any) => void;
  setAnimationSpeed: (speed: number) => void;
}

const ToolBar: React.FC<ToolBarProps> = ({
  runButton,
  algorithm,
  setAlgorithm,
  setAnimationSpeed,
}) => {
  const playButtonText = runButton.on ? "ABORT" : "PLAY";

  return (
    <div className="tool-bar">
      <button onClick={runButton.toggle}>{playButtonText}</button>
    </div>
  );
};

export default ToolBar;
