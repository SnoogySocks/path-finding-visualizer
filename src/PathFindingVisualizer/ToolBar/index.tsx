import React from "react";
import Algorithm from "../../algorithms/Algorithm";

// local imports
import "./Toolbar.css";

interface Tool {
  selected: boolean;
  set: (val: boolean) => void;
}

interface DropDown<T> {
  val: T;
  set: (val: T) => void;
}

interface ToolBarProps {
  runButton: Tool;
  isBrushing: Tool;
  isErasing: Tool;
  isErasingAlgorithm: Tool;
  algorithm: DropDown<Algorithm>;
  setAnimationSpeed: (speed: number) => void;
}

const ToolBar: React.FC<ToolBarProps> = ({
  runButton,
  isBrushing,
  isErasing,
  isErasingAlgorithm,
  algorithm,
  setAnimationSpeed,
}) => {
  const playButtonText = runButton.selected ? "ABORT" : "PLAY";
  const isBrushingText = isBrushing.selected ? "BIG BRUSH" : "SMALL BRUSH";
  const isErasingText = isErasing.selected ? "BIG ERASER" : "SMALL ERASER";
  const isErasingAlgorithmText = "ERASE ALGORITHM";

  // Deselect all tools and only select the one that was selected
  const selectTool = (tool: Tool) => {
    for (const t of [isBrushing, isErasing]) {
      if (t !== tool) {
        t.set(false);
      }
    }
    tool.set(!tool.selected);
  }

  return (
    <div className="tool-bar">
      <button onClick={() => runButton.set(!runButton.selected)}>{playButtonText}</button>
      <button onClick={() => selectTool(isBrushing)}>{isBrushingText}</button>
      <button onClick={() => selectTool(isErasing)}>{isErasingText}</button>
      <button onClick={() => isErasingAlgorithm.set(true)}>{isErasingAlgorithmText}</button>
    </div>
  );
};

export default ToolBar;
