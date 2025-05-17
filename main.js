import * as prim from './prim.js';
import * as recdiv from './recdiv.js';
import * as dfs from './dfs.js';
import * as eller from './eller.js';
import * as kruskal from './kruskal.js';
import { universalBFS } from './universalBFS.js';

let p5Instance;
let currentAlgo = null;

const algoSelect = document.getElementById('algoSelect');

document.getElementById("generateBtn").addEventListener("click", () => {
  if (p5Instance) p5Instance.remove();

  const algo = algoSelect.value;
  switch (algo) {
    case 'prim': currentAlgo = prim; break;
    case 'recdiv': currentAlgo = recdiv; break;
    case 'eller': currentAlgo = eller; break;
    case 'kruskal': currentAlgo = kruskal; break;
    case 'dfs': default: currentAlgo = dfs; break;
  }

  p5Instance = new p5((p) => {
    p.setup = () => currentAlgo.generateMaze(p);
    p.draw = () => {
      currentAlgo.mazeDraw(p);
      const isComplete = currentAlgo.isComplete ? currentAlgo.isComplete() : 
        currentAlgo.grid.length > 0 && (!currentAlgo.current) && 
        currentAlgo.grid.every(cell => cell.visited);
      if (isComplete) {
        p.noLoop();
        document.getElementById("solveBtn").disabled = false;
      }
    };
  });
  document.getElementById("solveBtn").disabled = true;
});

document.getElementById("solveBtn").addEventListener("click", async () => {
  const start = currentAlgo.grid[0];
  const end = currentAlgo.grid[currentAlgo.grid.length - 1];
  await universalBFS(start, end, currentAlgo);
});