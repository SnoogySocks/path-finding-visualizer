import React, {useState} from "react";

// local imports
import "./PathFindingVisualizer.css";
import ToolBar from "./ToolBar";
import Grid from "./Grid"
import Algorithm from "../algorithms/Algorithm";
import BFS from "../algorithms/BFS";

const PathFindingVisualizer: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [algorithm, setAlgorithm] = useState<Algorithm>(new BFS());
  const [animationSpeed, setAnimationSpeed] = useState(1);

  const toggleIsRunning = () => {
    setIsRunning(!isRunning);
  }

  return (
    <div className="screen-container">
      <header className="header">
        <ToolBar
          isRunning={isRunning}
          onVisualize={toggleIsRunning}
          algorithm={algorithm}
          setAlgorithm={setAlgorithm}
          setAnimationSpeed={setAnimationSpeed}
        />
      </header>
      <div className="content">
        <Grid
          isRunning={isRunning}
          setIsRunning={setIsRunning}
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
