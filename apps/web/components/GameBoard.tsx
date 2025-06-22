import React from "react";
import { Color, Position } from "../lib/types";
import { POSITIONS } from "../lib/constants";

interface GameBoardProps {
  board: Record<string, Color>;
  selected: string | null;
  validMoves: string[];
  millHighlight: string[];
  removalMode: boolean;
  removalValid: string[];
  onIntersectionClick: (id: string) => void;
}

export function GameBoard({
  board,
  selected,
  validMoves,
  millHighlight,
  removalMode,
  removalValid,
  onIntersectionClick,
}: GameBoardProps) {
  return (
    <div className="w-full h-full">
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        style={{
          background: "#e0c080",
          borderRadius: 6,
          boxShadow: "0 0 6px #0008",
        }}
      >
        {/* Board lines */}
        <rect
          x="10"
          y="10"
          width="80"
          height="80"
          stroke="#222"
          strokeWidth="1"
          fill="none"
        />
        <rect
          x="20"
          y="20"
          width="60"
          height="60"
          stroke="#222"
          strokeWidth="1"
          fill="none"
        />
        <rect
          x="30"
          y="30"
          width="40"
          height="40"
          stroke="#222"
          strokeWidth="1"
          fill="none"
        />
        <line x1="50" y1="10" x2="50" y2="30" stroke="#222" strokeWidth="1" />
        <line x1="50" y1="70" x2="50" y2="90" stroke="#222" strokeWidth="1" />
        <line x1="10" y1="50" x2="30" y2="50" stroke="#222" strokeWidth="1" />
        <line x1="70" y1="50" x2="90" y2="50" stroke="#222" strokeWidth="1" />

        {/* Intersections */}
        {POSITIONS.map((pos: Position) => {
          const isInMill = millHighlight.includes(pos.id);
          const isValidRemoval = removalMode && removalValid.includes(pos.id);
          const isOpponentPiece =
            board[pos.id] === (board[pos.id] === "white" ? "black" : "white");

          return (
            <g key={pos.id}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r={2}
                fill={
                  isValidRemoval
                    ? "#f00"
                    : isInMill
                      ? "#0ff"
                      : board[pos.id] === "white"
                        ? "#fff"
                        : board[pos.id] === "black"
                          ? "#222"
                          : "#b3e5fc"
                }
                stroke={
                  isValidRemoval
                    ? "#f00"
                    : isInMill
                      ? "#0ff"
                      : selected === pos.id
                        ? "#ff0"
                        : validMoves.includes(pos.id)
                          ? "#0f0"
                          : "#333"
                }
                strokeWidth={
                  isValidRemoval
                    ? 1.5
                    : isInMill
                      ? 1.5
                      : selected === pos.id
                        ? 0.8
                        : 0.5
                }
                style={{
                  filter: isValidRemoval
                    ? "drop-shadow(0 0 2px #f00)"
                    : isInMill
                      ? "drop-shadow(0 0 2px #0ff)"
                      : selected === pos.id || validMoves.includes(pos.id)
                        ? "drop-shadow(0 0 1px #0f0)"
                        : undefined,
                  cursor: isValidRemoval ? "pointer" : "default",
                  transition: "all 0.2s",
                  opacity:
                    removalMode && isOpponentPiece && !isValidRemoval ? 0.3 : 1,
                }}
                onClick={() => onIntersectionClick(pos.id)}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
