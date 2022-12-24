import React, { useState, useLayoutEffect, createRef } from "react";

// local imports
import "./PathFindingVisualizer.css";
import ToolBar from "./ToolBar";
import Grid from "./Grid";
import Algorithm from "../algorithms/Algorithm";
import Dijkstra from "../algorithms/Dijkstra";
import BFS from "../algorithms/BFS";
import { GRID_SIZE, NODE_SIZE } from "../constants";

const useRefDimensions = (ref: React.RefObject<HTMLDivElement>) => {
  const [dimensions, setDimensions] = useState({ width: 23, height: 23 });
  useLayoutEffect(() => {
    if (!ref.current) {
      console.error("ref.current is null");
      return;
    }
    const boundingRect = ref.current.getBoundingClientRect();
    const { width, height } = boundingRect;
    setDimensions({ width: Math.round(width), height: Math.round(height) });
  }, []);

  return dimensions;
};

const PathFindingVisualizer: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);

  // Tools
  const [droppedObstruction, setDroppedObstruction] = useState(0);
  const [isBrushing, setIsBrushing] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const [isErasingAlgorithm, setIsErasingAlgorithm] = useState(false);

  const [algorithm, setAlgorithm] = useState(new Dijkstra());
  const [animationSpeed, setAnimationSpeed] = useState(1);

  const ref = createRef<HTMLDivElement>();
  const { width: contentWidth, height: contentHeight } = useRefDimensions(ref);

  return (
    <div className="screen-container">
      <header className="header">
        <ToolBar
          runButton={{ val: isRunning, set: setIsRunning }}
          droppedObstruction={{
            val: droppedObstruction,
            set: setDroppedObstruction,
          }}
          isBrushing={{ val: isBrushing, set: setIsBrushing }}
          isErasing={{ val: isErasing, set: setIsErasing }}
          isErasingAlgorithm={{
            val: isErasingAlgorithm,
            set: setIsErasingAlgorithm,
          }}
          algorithm={{ val: algorithm, set: setAlgorithm }}
          setAnimationSpeed={setAnimationSpeed}
        />
      </header>
      <div className="content" ref={ref}>
        <Grid
          isRunning={isRunning}
          setIsRunning={setIsRunning}
          droppedObstruction={droppedObstruction}
          isBrushing={isBrushing}
          isErasing={isErasing}
          isErasingAlgorithm={isErasingAlgorithm}
          setIsErasingAlgorithm={setIsErasingAlgorithm}
          // rows={Math.floor(contentHeight / NODE_SIZE)}
          // cols={Math.floor(contentWidth / NODE_SIZE)}
          rows={GRID_SIZE.ROW_SIZE}
          cols={GRID_SIZE.COL_SIZE}
          algorithm={algorithm}
          animationSpeed={animationSpeed}
        />
      </div>
      <div className="footer">I hate css</div>
    </div>
  );
};

export default PathFindingVisualizer;
