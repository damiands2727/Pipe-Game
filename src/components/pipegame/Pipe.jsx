import React from "react";
import "./pipegame.css";

const Pipe = ({ pipe, rowIndex, colIndex, isFlowing, onDrop, onRemove }) => {
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragStart = (e) => {
    if (pipe.type !== "empty") {
      e.dataTransfer.setData("pipeType", pipe.type);
      e.dataTransfer.setData("sourceRow", rowIndex);
      e.dataTransfer.setData("sourceCol", colIndex);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const pipeType = e.dataTransfer.getData("pipeType");
    const sourceRow = e.dataTransfer.getData("sourceRow");
    const sourceCol = e.dataTransfer.getData("sourceCol");

    if (pipeType) {
      const parsedRow = parseInt(sourceRow, 10);
      const parsedCol = parseInt(sourceCol, 10);

      // Ensure we don't remove if sourceRow/sourceCol is invalid or it's dropped onto itself
      if (
        !isNaN(parsedRow) &&
        !isNaN(parsedCol) &&
        (parsedRow !== rowIndex || parsedCol !== colIndex)
      ) {
        onRemove(parsedRow, parsedCol);
      }

      onDrop(rowIndex, colIndex, pipeType);
    }
  };

  const handleClick = () => {
    onRemove(rowIndex, colIndex);
  };

  return (
    <div
      className={`pipegame-tile ${isFlowing ? "flowing" : ""}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
      draggable={pipe.type !== "empty"}
      onDragStart={handleDragStart}
    >
      {pipe.type !== "empty" && (
        <img src={pipe.image} alt={pipe.type} className="pipegame-image" />
      )}
    </div>
  );
};

export default Pipe;
