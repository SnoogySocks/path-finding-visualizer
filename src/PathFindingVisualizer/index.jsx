import React from "react";

// local imports
import "./PathFindingVisualizer.css";
import ToolBar from "./ToolBar";
import Grid from "./Grid"

const PathFindingVisualizer = () => {

  return (
    <div className="screen-container">
      <div className="header">
        <ToolBar />
      </div>
      <div className="content">
        <Grid />
      </div>
      <div className="footer">
        I hate css
      </div>
    </div>
  );
};

export default PathFindingVisualizer;