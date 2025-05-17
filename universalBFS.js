function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function updateCellClass(cell, isPath = false) {
  const ctx = document.getElementById("defaultCanvas0").getContext("2d");
  ctx.fillStyle = isPath ? "rgba(114, 36, 132, 0.8)" : "rgba(114, 36, 132, 0.4)";
  ctx.fillRect(cell.i * cell.cellSize, cell.j * cell.cellSize, cell.cellSize, cell.cellSize);
}

function getNeighbors(cell, grid, algorithm) {
  const neighbors = [];
  const { i, j } = cell;

  // Check all four directions
  const directions = [
    { dx: 0, dy: -1, wallIndex: 0 }, // Top
    { dx: 1, dy: 0, wallIndex: 1 },  // Right
    { dx: 0, dy: 1, wallIndex: 2 },  // Bottom
    { dx: -1, dy: 0, wallIndex: 3 }  // Left
  ];

  directions.forEach(({ dx, dy, wallIndex }) => {
    if (!cell.walls[wallIndex]) { // Only proceed if wall is open
      const ni = i + dx;
      const nj = j + dy;
      const idx = algorithm.index(ni, nj);
      if (idx !== -1) {
        const neighbor = grid[idx];
        neighbors.push(neighbor);
      }
    }
  });

  return neighbors;
}

function reconstructPath(end) {
  const path = [];
  let current = end;
  while (current) {
    path.push(current);
    current = current.parent;
  }
  return path.reverse();
}

export async function universalBFS(start, end, algorithm) {
  algorithm.grid.forEach(cell => cell.parent = null);
  const queue = [start];
  const visited = new Set();

  while (queue.length > 0) {
    const current = queue.shift();
    if (visited.has(current)) continue;
    visited.add(current);
    updateCellClass(current);
    await sleep(20);

    if (current === end) {
      const path = reconstructPath(end);
      for (const cell of path) {
        updateCellClass(cell, true);
        await sleep(30);
      }
      return;
    }

    const neighbors = getNeighbors(current, algorithm.grid, algorithm);
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        neighbor.parent = current;
        queue.push(neighbor);
      }
    }
  }
  console.log("No path found!");
}