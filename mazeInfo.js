// mazeInfo.js

let startTime = null;
let endTime = null;
let generationTime = 0;

const algorithmDetails = {
  "DFS": {
    speed: "Fast",
    timeComplexity: "O(N)",
    spaceComplexity: "O(N)",
    remarks: "Simple, depth-first carving, stack-based."
  },
  "Eller's": {
    speed: "Very Fast",
    timeComplexity: "O(N)",
    spaceComplexity: "O(width)",
    remarks: "Efficient for row-by-row generation."
  },
  "Prim's": {
    speed: "Moderate",
    timeComplexity: "O(N log N)",
    spaceComplexity: "O(N)",
    remarks: "Randomized version is slower than DFS."
  },
  "Kruskal's": {
    speed: "Slower",
    timeComplexity: "O(E log E)",
    spaceComplexity: "O(N)",
    remarks: "Good for sparse mazes, uses Union-Find."
  },
  "Recursive Division": {
    speed: "Very Fast",
    timeComplexity: "O(N log N)",
    spaceComplexity: "O(log N)",
    remarks: "Creates clear, structured mazes."
  }
};

export function startTimer() {
  startTime = performance.now();
}

export function stopTimer() {
  endTime = performance.now();
  generationTime = ((endTime - startTime) / 1000).toFixed(2);
}

export function updateInfo({ cols, rows, algorithm, complete }) {
  const infoDiv = document.getElementById("maze-info");
  if (!infoDiv) return;

  let details = algorithmDetails[algorithm] || {
    speed: "Unknown",
    timeComplexity: "Unknown",
    spaceComplexity: "Unknown",
    remarks: "No details available."
  };

  if (complete) {
    infoDiv.innerHTML = `
      <strong>Maze Size:</strong> ${cols} x ${rows}<br>
      <strong>Algorithm:</strong> ${algorithm}<br>
      <strong>Time Taken:</strong> ${generationTime}s<br><br>
      <strong>Speed:</strong> ${details.speed}<br>
      <strong>Time Complexity:</strong> ${details.timeComplexity}<br>
      <strong>Space Complexity:</strong> ${details.spaceComplexity}<br>
      <strong>Remarks:</strong> ${details.remarks}
    `;
  } else {
    infoDiv.innerHTML = `
      <strong>Maze Size:</strong> ${cols} x ${rows}<br>
      <strong>Algorithm:</strong> ${algorithm}<br>
      <strong>Status:</strong> Generating...
    `;
  }
}
