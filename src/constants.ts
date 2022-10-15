export const START_END_COORDS = {
    START_NODE_ROW: 3,
    START_NODE_COL: 10,
    END_NODE_ROW: 10,
    END_NODE_COL: 30,
}

export const GRID_SIZE = {
    ROW_SIZE: 20,
    COL_SIZE: 50,
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
    OBSTRUCTION: [
        "node-wall",
        "node-weighted-1",
        "node-weighted-2",
        "node-weighted-3",
    ],
    OBSTRUCTION_REVERSE: [
        "node-wall-reverse",
        "node-weighted-1-reverse",
        "node-weighted-2-reverse",
        "node-weighted-3-reverse",
    ],
}

export const SPECIAL_STATES = [NODE_STATE.START, NODE_STATE.END];

export const DELTA = [
            [-1, 0],
    [0, -1],        [0, 1],
            [1, 0],
]

export const ANIMATION_SPEED = {
    STEPS: 8,
    SHORTEST_PATH: 30,
}

export const BIG_RADIUS = 1;

