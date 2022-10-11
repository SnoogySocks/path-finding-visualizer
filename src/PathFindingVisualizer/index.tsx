import React, {useState} from "react";

// local imports
import "./PathFindingVisualizer.css";
import ToolBar from "./ToolBar";
import Grid from "./Grid"
import Algorithm from "../algorithms/Algorithm";
import Dijkstra from "../algorithms/Dijkstra";

const PathFindingVisualizer: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);

  // Tools
  const [bigBrush, setBigBrush] = useState(false);
  const [bigEraser, setBigEraser] = useState(false);

  const [algorithm, setAlgorithm] = useState<Algorithm>(new Dijkstra());
  const [animationSpeed, setAnimationSpeed] = useState(1);

  return (
    <div className="screen-container">
      <header className="header">
        <ToolBar
          runButton={{selected: isRunning, set: setIsRunning}}
          bigBrush={{selected: bigBrush, set: setBigBrush}}
          bigEraser={{selected: bigEraser, set: setBigEraser}}
          algorithm={{val: algorithm, set: setAlgorithm}}
          setAnimationSpeed={setAnimationSpeed}
        />
      </header>
      <div className="content">
        <Grid
          isRunning={isRunning}
          setIsRunning={setIsRunning}
          bigBrush={bigBrush}
          bigEraser={bigEraser}
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
