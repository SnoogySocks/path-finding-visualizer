import React, { useState } from "react";

// local imports
import "./PathFindingVisualizer.css";
import ToolBar from "./ToolBar";
import Grid from "./Grid";
import Algorithm from "../algorithms/Algorithm";
import Dijkstra from "../algorithms/Dijkstra";
import BFS from "../algorithms/BFS";
import AStar from "../algorithms/Astar";

const PathFindingVisualizer: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);

  // Tools
  const [droppedObstruction, setDroppedObstruction] = useState(0);
  const [isBrushing, setIsBrushing] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const [isErasingAlgorithm, setIsErasingAlgorithm] = useState(false);

  const [algorithm, setAlgorithm] = useState<Algorithm>(new AStar());
  const [animationSpeed, setAnimationSpeed] = useState(1);

  return (
    <div className="screen-container">
      <header className="header">
        <ToolBar
          runButton={{ val: isRunning, set: setIsRunning }}
          droppedObstruction={{ val: droppedObstruction, set: setDroppedObstruction}}
          isBrushing={{ val: isBrushing, set: setIsBrushing }}
          isErasing={{ val: isErasing, set: setIsErasing }}
          isErasingAlgorithm={{ val: isErasingAlgorithm, set: setIsErasingAlgorithm }}
          algorithm={{ val: algorithm, set: setAlgorithm }}
          setAnimationSpeed={setAnimationSpeed}
        />
      </header>
      <div className="content">
        <Grid
          isRunning={isRunning}
          setIsRunning={setIsRunning}
          droppedObstruction={droppedObstruction}
          isBrushing={isBrushing}
          isErasing={isErasing}
          isErasingAlgorithm={isErasingAlgorithm}
          setIsErasingAlgorithm={setIsErasingAlgorithm}
          algorithm={algorithm}
          animationSpeed={animationSpeed}
        />
      </div>
      <div className="footer">
        I hate css
      </div>
    </div>
  );
};

export default PathFindingVisualizer;
