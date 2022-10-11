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
  algorithm: DropDown<Algorithm>;
  setAnimationSpeed: (speed: number) => void;
}

const ToolBar: React.FC<ToolBarProps> = ({
  runButton,
  isBrushing,
  isErasing,
  algorithm,
  setAnimationSpeed,
}) => {
  const playButtonText = runButton.selected ? "ABORT" : "PLAY";
  const isBrushingText = isBrushing.selected ? "BIG isBrushing" : "SMALL isBrushing";
  const isErasingText = isErasing.selected ? "BIG isErasing" : "SMALL isErasing";

  // Deselect all tools and only select the one that was clicked
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
    </div>
  );
};

export default ToolBar;
