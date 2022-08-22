import React, {useState} from "react";

// local imports
import "./PathFindingVisualizer.css";
import ToolBar from "./ToolBar";
import Grid from "./Grid"

const PathFindingVisualizer = () => {
  const [isRunning, setIsRunning] = useState(false);
  // const [algorithm, setAlgorithm] = useState()

  const toggleVisualizeAlgorithm = () => {
    setIsRunning(!isRunning);
  }

  return (
    <div className="screen-container">
      <div className="header">
        <ToolBar 
          isRunning={isRunning} 
          onVisualize={toggleVisualizeAlgorithm} 
        />
      </div>
      <div className="content">
        <Grid isRunning={isRunning} />
      </div>
      <div className="footer">
        I hate css
      </div>
    </div>
  );
};

export default PathFindingVisualizer;