import * as prim from './generationAlgos/prim.js';
import * as recdiv from './generationAlgos/recdiv.js';
import * as dfs from './generationAlgos/dfs.js';
import * as eller from './generationAlgos/eller.js';
import * as kruskal from './generationAlgos/kruskal.js';
import { universalBFS } from './solvingAlgos/universalBFS.js';
import { universalDijkstra } from './solvingAlgos/universalDijkstra.js';
import { universalAStar } from './solvingAlgos/universalAStar.js';
import { universalGreedyBFS } from './solvingAlgos/universalGreedyBFS.js';
import { universalWallFollower } from './solvingAlgos/universalWallFollower.js';
import { universalDFS } from './solvingAlgos/universalDFS.js';
import { clearSolverState } from './pathUtils.js';

let p5Instance;
let currentAlgo = null;
let solverAbortController = { abort: false };

document.addEventListener('DOMContentLoaded', () => {
  const algoSelect = document.getElementById('algoSelect');
  if (!algoSelect) console.error('Algorithm select not found');

  document.getElementById("generateBtn")?.addEventListener("click", () => {
    try {
      if (p5Instance) p5Instance.remove();

      const algo = algoSelect.value;
      const width = parseInt(document.getElementById("mazeWidth")?.value || "400");
      const height = parseInt(document.getElementById("mazeHeight")?.value || "400");

      console.log(`Generating maze: ${algo} ${width}x${height}`);

      switch (algo) {
        case 'prim': currentAlgo = prim; break;
        case 'recdiv': currentAlgo = recdiv; break;
        case 'eller': currentAlgo = eller; break;
        case 'kruskal': currentAlgo = kruskal; break;
        case 'dfs': default: currentAlgo = dfs; break;
      }

      p5Instance = new p5((p) => {
        p.setup = () => {
          try {
            currentAlgo.generateMaze(p, width, height);
          } catch (error) {
            console.error('Error in maze generation:', error);
          }
        };
        p.draw = () => {
          try {
            currentAlgo.mazeDraw(p);
            const isComplete = currentAlgo.isComplete ? currentAlgo.isComplete() : 
              currentAlgo.grid.length > 0 && (!currentAlgo.current) && 
              currentAlgo.grid.every(cell => cell.visited);
            if (isComplete) {
              p.noLoop();
              document.getElementById("solveBtn").disabled = false;
            }
          } catch (error) {
            console.error('Error in maze drawing:', error);
          }
        };
      }, 'canvas-container');
      document.getElementById("solveBtn").disabled = true;
    } catch (error) {
      console.error('Error in generate button handler:', error);
    }
  });

  document.getElementById("solveBtn")?.addEventListener("click", async () => {
    try {
      // Abort any existing solver
      solverAbortController.abort = true;

      // Create a new controller for this run
      solverAbortController = { abort: false };

      // Clear previous path
      clearSolverState(currentAlgo.grid);

      const start = currentAlgo.grid[0];
      const end = currentAlgo.grid[currentAlgo.grid.length - 1];
      const solver = document.getElementById("solverSelect")?.value;

      console.log(`Solving maze with: ${solver}`);

      switch(solver) {
        case 'bfs':
          await universalBFS(start, end, currentAlgo, solverAbortController);
          break;
        case 'dijkstra':
          await universalDijkstra(start, end, currentAlgo, solverAbortController);
          break;
        case 'astar':
          await universalAStar(start, end, currentAlgo, solverAbortController);
          break;
        case 'greedy':
          await universalGreedyBFS(start, end, currentAlgo, solverAbortController);
          break;
        case 'dfs':
          await universalDFS(start, end, currentAlgo, solverAbortController);
          break;
        case 'wallfollower':
          await universalWallFollower(start, end, currentAlgo, solverAbortController);
          break;
        default:
          await universalBFS(start, end, currentAlgo, solverAbortController);
      }
    } catch (error) {
      console.error('Error in solve button handler:', error);
    }
  });
});

