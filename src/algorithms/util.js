export const findShortestPath = (parents, end) => {
    let current = end;
    let shortestPath = [];
    
    // While current has a parent, go to its previousNode
    while (current) {
        shortestPath.push(current);
        current = parents[current.row][current.col];
    }

    shortestPath.pop();
    shortestPath.reverse();
    shortestPath.pop();
    return shortestPath;
}
