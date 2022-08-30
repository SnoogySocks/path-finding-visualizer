export const START_END_COORDS = { 
    START_NODE_ROW: 3,
    START_NODE_COL: 10,
    END_NODE_ROW: 10,
    END_NODE_COL: 40,
}

export const GRID_SIZE = {
    ROW_SIZE: 22,
    COL_SIZE: 45,
}

export const NODE_STATE = {
    DEFAULT: "node",
    START: "node-start",
    END: "node-end",
    VISITED: "node-visited",
    VISITED_REVERSE: "node-visited-reverse",
    SHORTEST_PATH: "node-shortest-path",
    SHORTEST_PATH_REVERSE: "node-shortest-path-reverse",
    WALL: "node-wall",
    WALL_REVERSE: "node-wall-reverse",
}

export const DELTA = [
            [-1, 0],
    [0, -1],        [0, 1],
            [1, 0],
]

export const ANIMATION_SPEED = 10;