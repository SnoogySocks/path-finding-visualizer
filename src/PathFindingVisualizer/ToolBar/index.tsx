import React from "react";
import Algorithm from "../../algorithms/Algorithm";

// local imports
import "./Toolbar.css";

interface State<T> {
  val: T;
  set: (val: T) => void;
}

interface ToolBarProps {
  runButton: State<boolean>;
  isDroppingObstruction: State<number>;
  isBrushing: State<boolean>;
  isErasing: State<boolean>;
  isErasingAlgorithm: State<boolean>;
  algorithm: State<Algorithm>;
  setAnimationSpeed: (speed: number) => void;
}

const ToolBar: React.FC<ToolBarProps> = ({
  runButton,
  isDroppingObstruction,
  isBrushing,
  isErasing,
  isErasingAlgorithm,
  algorithm,
  setAnimationSpeed,
}) => {
  const playButtonText = runButton.val ? "ABORT" : "PLAY";
  const isBrushingText = isBrushing.val ? "BIG BRUSH" : "SMALL BRUSH";
  const isDroppingObstructionText =
    isDroppingObstruction.val == 0 ? "WALLS"
      : isDroppingObstruction.val == 1 ? "WEIGHTED 1"
        : isDroppingObstruction.val == 2 ? "WEIGHTED 2"
          : "WEIGHTED 3";
  const isErasingText = isErasing.val ? "BIG ERASER" : "SMALL ERASER";
  const isErasingAlgorithmText = "ERASE ALGORITHM";

  // When selecting eraser, deslect everything else
  // When selecting something else, deselect eraser
  const selectTool = (tool: State<any>) => {
    if (tool == isErasing) {
      isErasing.set(!isErasing.val);
      isBrushing.set(false);
    } else if (tool == isBrushing) {
      isErasing.set(false);
      isBrushing.set(!isBrushing.val);
    } else if (tool == isDroppingObstruction) {
      isErasing.set(false);
      isDroppingObstruction.set((isDroppingObstruction.val+1)%4);

    }
  }

  return (
    <div className="tool-bar">
      <button onClick={() => runButton.set(!runButton.val)}>{playButtonText}</button>
      <button onClick={() => selectTool(isBrushing)}>{isBrushingText}</button>
      {/* make a button to add weighted nodes */}
      <button onClick={() => selectTool(isDroppingObstruction)}>{isDroppingObstructionText}</button>
      <button onClick={() => selectTool(isErasing)}>{isErasingText}</button>
      <button onClick={() => isErasingAlgorithm.set(true)}>{isErasingAlgorithmText}</button>
    </div>
  );
};

export default ToolBar;
