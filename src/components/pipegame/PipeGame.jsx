import React, { useState } from "react";
import { Container } from "react-bootstrap";
import Pipe from "./Pipe";

import Horizontal from "../tiles/horizontal.png";
import Vertical from "../tiles/vertical.png";
import TopRight from "../tiles/top-right.png";
import TopLeft from "../tiles/top-left.png";
import DownLeft from "../tiles/left-down.png";
import Cross from "../tiles/cross.png";
import Empty from "../tiles/empty.png";
import Start from "../tiles/start.png";
import End from "../tiles/end.png";

const pipe_Types = [
  { type: "horizontal", connections: ["left", "right"], image: Horizontal },
  { type: "vertical", connections: ["top", "bottom"], image: Vertical },
  { type: "topRight", connections: ["top", "right"], image: TopRight },
  { type: "downLeft", connections: ["bottom", "left"], image: DownLeft },
  { type: "topLeft", connections: ["left", "top"], image: TopLeft },
  {
    type: "cross",
    connections: ["top", "right", "bottom", "left"],
    image: Cross,
  },
  { type: "empty", connections: [], image: Empty },
  {
    type: "start",
    connections: ["top", "right", "bottom", "left"],
    image: Start,
  },
  { type: "end", connections: ["top", "right", "bottom", "left"], image: End },
];

const initialAvailablePieces = [
  { type: "horizontal", count: 3 },
  { type: "vertical", count: 3 },
  { type: "topRight", count: 3 },
  { type: "downLeft", count: 3 },
  { type: "topLeft", count: 3 },
  { type: "cross", count: 3 },
  { type: "start", count: 1 },
  { type: "end", count: 1 },
];

const createEmptyGrid = () =>
  Array.from({ length: 5 }, () =>
    Array.from({ length: 5 }, () => pipe_Types.find((p) => p.type === "empty"))
  );

const PipeGame = () => {
  const [grid, setGrid] = useState(createEmptyGrid());
  const [availablePieces, setAvailablePieces] = useState(
    initialAvailablePieces
  );
  const [showOverlay, setShowOverlay] = useState(false);
  const [message, setMessage] = useState("");
  // Holds the coordinates ([row, col]) where water is flowing.
  const [flowingPath, setFlowingPath] = useState([]);

  const mainPieces = availablePieces.filter(
    (piece) => piece.type !== "start" && piece.type !== "end"
  );
  const specialPieces = availablePieces.filter(
    (piece) => piece.type === "start" || piece.type === "end"
  );

  const mainRows = [];
  for (let i = 0; i < mainPieces.length; i += 3) {
    mainRows.push(mainPieces.slice(i, i + 3));
  }

  const handleDragStart = (e, type) => {
    e.dataTransfer.setData("pipeType", type);
  };

  // Modified to optionally accept sourceRow and sourceCol parameters
  const handleDrop = (rowIndex, colIndex, pipeType) => {
    const currentPipe = grid[rowIndex][colIndex];
    if (currentPipe.type !== "empty") {
      setAvailablePieces((prevPieces) =>
        prevPieces.map((piece) =>
          piece.type === currentPipe.type
            ? { ...piece, count: piece.count + 1 }
            : piece
        )
      );
    }

    setGrid((prevGrid) =>
      prevGrid.map((row, rIdx) =>
        row.map((cell, cIdx) =>
          rIdx === rowIndex && cIdx === colIndex
            ? pipe_Types.find((p) => p.type === pipeType)
            : cell
        )
      )
    );

    setAvailablePieces((prevPieces) =>
      prevPieces.map((piece) =>
        piece.type === pipeType && piece.count > 0
          ? { ...piece, count: piece.count - 1 }
          : piece
      )
    );
  };

  const handleRemove = (rowIndex, colIndex) => {
    const removedPipe = grid[rowIndex][colIndex];
    if (removedPipe.type !== "empty") {
      setGrid((prevGrid) =>
        prevGrid.map((row, rIdx) =>
          row.map((cell, cIdx) =>
            rIdx === rowIndex && cIdx === colIndex
              ? pipe_Types.find((p) => p.type === "empty")
              : cell
          )
        )
      );
      setAvailablePieces((prevPieces) =>
        prevPieces.map((piece) =>
          piece.type === removedPipe.type
            ? { ...piece, count: piece.count + 1 }
            : piece
        )
      );
    }
  };

  // Utility function to reverse a direction.
  const reverseDirection = (dir) => {
    const reversed = {
      top: "bottom",
      right: "left",
      bottom: "top",
      left: "right",
    };
    return reversed[dir];
  };

  // Find the "start" tile.
  const findStartPosition = () => {
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        if (grid[row][col].type === "start") {
          return [row, col];
        }
      }
    }
    return null;
  };

  // Simulate the water flow and determine win/lose.
  const flowWater = () => {
    const startPos = findStartPosition();
    if (!startPos) return;
    const visited = Array.from({ length: 5 }, () => Array(5).fill(false));
    const fullPath = [];
    let reachedEnd = false;

    const directions = {
      top: [-1, 0],
      right: [0, 1],
      bottom: [1, 0],
      left: [0, -1],
    };

    const queue = [startPos];

    while (queue.length > 0) {
      const [row, col] = queue.shift();
      if (visited[row][col]) continue;
      visited[row][col] = true;
      const currentPipe = grid[row][col];

      if (currentPipe.type === "empty") continue;

      fullPath.push([row, col]);

      if (currentPipe.type === "end") {
        reachedEnd = true;
      }

      currentPipe.connections.forEach((dir) => {
        const [dr, dc] = directions[dir];
        const nextRow = row + dr;
        const nextCol = col + dc;
        if (nextRow >= 0 && nextRow < 5 && nextCol >= 0 && nextCol < 5) {
          const neighbor = grid[nextRow][nextCol];
          if (
            neighbor.type !== "empty" &&
            neighbor.connections.includes(reverseDirection(dir)) &&
            !visited[nextRow][nextCol]
          ) {
            queue.push([nextRow, nextCol]);
          }
        }
      });
    }

    // Animate the water flow along the fullPath.
    setFlowingPath([]); // reset path first
    fullPath.forEach((cell, index) => {
      setTimeout(() => {
        setFlowingPath((prevPath) => [...prevPath, cell]);
        if (index === fullPath.length - 1) {
          setMessage(reachedEnd ? "Winner!" : "Try Again!");
          setShowOverlay(true);
        }
      }, index * 500); // Adjust delay as needed
    });
  };

  // Restart game: reset grid, available pieces, water flow, and overlay.
  const restartGame = () => {
    setGrid(createEmptyGrid());
    setAvailablePieces(initialAvailablePieces);
    setFlowingPath([]);
    setMessage("");
    setShowOverlay(false);
  };

  return (
    <Container className="pipegame-container">
      <div className="game-container">
        {showOverlay && (
          <div className="overlay">
            <div className="overlay-content">
              <h1>{message}</h1>
              <button onClick={restartGame}>Play Again</button>
            </div>
          </div>
        )}
      </div>
      <h2 className="pipegame-title">Pipe Game</h2>
      <div className="pipegame-content">
        <div className="pipegame-available">
          <h3 className="pipegame-subtitle">Pieces</h3>
          {mainRows.map((row, rowIndex) => (
            <div key={rowIndex} className="pipegame-row">
              {row.map(
                (piece, index) =>
                  piece.count > 0 && (
                    <div
                      key={index}
                      className="pipegame-piece"
                      draggable
                      onDragStart={(e) => handleDragStart(e, piece.type)}
                    >
                      <img
                        src={
                          pipe_Types.find((p) => p.type === piece.type).image
                        }
                        alt={piece.type}
                        className="pipegame-image"
                      />
                      <span className="pipegame-count">x {piece.count}</span>
                    </div>
                  )
              )}
            </div>
          ))}
          <div className="pipegame-row">
            {specialPieces.map(
              (piece, index) =>
                piece.count > 0 && (
                  <div
                    key={index}
                    className="pipegame-piece"
                    draggable
                    onDragStart={(e) => handleDragStart(e, piece.type)}
                  >
                    <img
                      src={pipe_Types.find((p) => p.type === piece.type).image}
                      alt={piece.type}
                      className="pipegame-image"
                    />
                    <span className="pipegame-count">x {piece.count}</span>
                  </div>
                )
            )}
          </div>
        </div>
        <div className="pipegame-grid">
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="pipegame-row">
              {row.map((pipe, colIndex) => (
                <Pipe
                  key={`${rowIndex}-${colIndex}`}
                  pipe={pipe}
                  rowIndex={rowIndex}
                  colIndex={colIndex}
                  onDrop={handleDrop}
                  onRemove={handleRemove}
                  isFlowing={flowingPath.some(
                    ([r, c]) => r === rowIndex && c === colIndex
                  )}
                />
              ))}
            </div>
          ))}
        </div>
        <button onClick={flowWater}>Start Water Flow</button>
      </div>
    </Container>
  );
};

export default PipeGame;
