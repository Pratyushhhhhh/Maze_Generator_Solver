// universalAStar.js
import { sleep, updateCellClass, getNeighbors, reconstructPath, startSolveTimer, getSolveTime } from './pathUtils.js';
import { startTimer, stopTimer, updateInfo } from './mazeInfo.js';

function heuristic(a, b) {
  return Math.abs(a.i - b.i) + Math.abs(a.j - b.j);
}
// universalAStar.js - A* Algorithm implementation

export async function universalAStar(start, end, algorithm, abortController) {
  if (abortController.abort) {
    console.log("Solver aborted!");
    return;
  }
  startTimer('solving');
  const openSet = [start];
  const gScore = new Map();
  const fScore = new Map();

  algorithm.grid.forEach(cell => {
    gScore.set(cell, Infinity);
    fScore.set(cell, Infinity);
    cell.parent = null;
  });

  gScore.set(start, 0);
  fScore.set(start, heuristic(start, end));

  while (openSet.length > 0) {
    if (abortController.abort) {
      console.log("Solver aborted during run!");
      return;
    }
    openSet.sort((a, b) => fScore.get(a) - fScore.get(b));
    const current = openSet.shift();

    current.visited = true;
    updateCellClass(current);
    await sleep(20);

    if (current === end) {
      const path = reconstructPath(end);
      for (const cell of path) {
        updateCellClass(cell, true);
        await sleep(30);
      }
      console.log(`Solve time: ${getSolveTime()}s`);
      return;
    }

    const neighbors = getNeighbors(current, algorithm.grid, algorithm);
    for (const neighbor of neighbors) {
      const tentativeGScore = gScore.get(current) + 1;
      if (tentativeGScore < gScore.get(neighbor)) {
        neighbor.parent = current;
        gScore.set(neighbor, tentativeGScore);
        fScore.set(neighbor, tentativeGScore + heuristic(neighbor, end));
        
        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        }
      }
    }
  }
  console.log("No path found!");
}