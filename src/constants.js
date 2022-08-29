export const START_END_COORDS = { 
    START_NODE_ROW: 3,
    START_NODE_COL: 10,
    END_NODE_ROW: 10,
    END_NODE_COL: 40,
}

export const GRID_SIZE = {
    ROW_SIZE: 22,
    COL_SIZE: 50,
}

export const NODE_STATE = {
    NONE: "",
    START: "node-start",
    FINISH: "node-finish",
    VISITED: "node-visited",
    SHORTEST_PATH: "node-shortest-path",
    WALL: "node-wall",
}

export const DELTA = [
            [-1, 0],
    [0, -1],        [0, 1],
            [1, 0],
]

export const ANIMATION_SPEED = 10;