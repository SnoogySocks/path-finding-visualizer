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
  bigWallBuilder: Tool;
  bigEraser: Tool;
  algorithm: DropDown<Algorithm>;
  setAnimationSpeed: (speed: number) => void;
}

const ToolBar: React.FC<ToolBarProps> = ({
  runButton,
  bigWallBuilder,
  bigEraser,
  algorithm,
  setAnimationSpeed,
}) => {
  const playButtonText = runButton.selected ? "ABORT" : "PLAY";
  const bigWallBuilderText = bigWallBuilder.selected ? "BIG WALLS" : "SMALL WALLS";
  const bigEraserText = bigEraser.selected ? "BIG ERASER" : "SMALL ERASER";

  // Deselect all tools and only select the one that was clicked
  const selectTool = (tool: Tool) => {
    for (const t of [bigWallBuilder, bigEraser]) {
      if (t !== tool) {
        t.set(false);
      }
    }
    if (!tool.selected) {
      tool.set(true);
    }
  }

  return (
    <div className="tool-bar">
      <button onClick={() => runButton.set(!runButton.selected)}>{playButtonText}</button>
      <button onClick={() => selectTool(bigWallBuilder)}>{bigWallBuilderText}</button>
      <button onClick={() => selectTool(bigEraser)}>{bigEraserText}</button>
    </div>
  );
};

export default ToolBar;
