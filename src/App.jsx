import React, { useState, useEffect } from "react";

export default function App() {
  const emptyBoard = Array(9).fill(null);
  const [board, setBoard] = useState(emptyBoard);
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([]);
  const [winner, setWinner] = useState(null);
  const [isDraw, setIsDraw] = useState(false);
  const [mode, setMode] = useState("pvp");
  const [score, setScore] = useState({ X: 0, O: 0 });

  useEffect(() => {
    const w = calculateWinner(board);
    if (w) {
      setWinner(w);
      setIsDraw(false);
      setScore((s) => ({ ...s, [w]: s[w] + 1 }));
      return;
    }
    if (board.every((c) => c !== null)) {
      setIsDraw(true);
      setWinner(null);
      return;
    }
    setIsDraw(false);
    setWinner(null);

    if (mode === "ai" && !xIsNext && !winner) {
      const timeout = setTimeout(() => {
        makeAIMove();
      }, 350);
      return () => clearTimeout(timeout);
    }
  }, [board, xIsNext, mode, winner]);

  function handleClick(index) {
    if (board[index] || winner || (mode === "ai" && !xIsNext)) return;
    const newBoard = [...board];
    newBoard[index] = xIsNext ? "X" : "O";
    setBoard(newBoard);
    setHistory((h) => [...h, { board: newBoard, player: xIsNext ? "X" : "O" }]);
    setXIsNext((p) => !p);
  }

  function makeAIMove() {
    const empties = board
      .map((v, i) => (v === null ? i : -1))
      .filter((i) => i !== -1);
    if (empties.length === 0) return;
    const aiMove =
      findWinningMove(board, "O") ??
      findWinningMove(board, "X") ??
      empties[Math.floor(Math.random() * empties.length)];
    const newBoard = [...board];
    newBoard[aiMove] = "O";
    setBoard(newBoard);
    setHistory((h) => [...h, { board: newBoard, player: "O" }]);
    setXIsNext(true);
  }

  function findWinningMove(bd, player) {
    for (let i = 0; i < 9; i++) {
      if (bd[i] === null) {
        const copy = [...bd];
        copy[i] = player;
        if (calculateWinner(copy) === player) return i;
      }
    }
    return null;
  }

  function calculateWinner(bd) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let [a, b, c] of lines) {
      if (bd[a] && bd[a] === bd[b] && bd[a] === bd[c]) return bd[a];
    }
    return null;
  }

  function resetBoard() {
    setBoard(emptyBoard);
    setXIsNext(true);
    setHistory([]);
    setWinner(null);
    setIsDraw(false);
  }

  function resetAll() {
    resetBoard();
    setScore({ X: 0, O: 0 });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0c10] p-4 sm:p-6">
      <div className="w-full max-w-md bg-[#1f2833] rounded-2xl shadow-lg p-4 sm:p-6 text-[#66fcf1]">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center text-[#c5c6c7]">
          XOX — Tic Tac Toe
        </h1>

        {/* Mode Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          <button
            onClick={() => {
              setMode("pvp");
              resetBoard();
            }}
            className={`px-3 py-2 text-sm sm:text-base rounded-lg border ${
              mode === "pvp"
                ? "bg-[#45a29e] text-[#0b0c10]"
                : "bg-[#c5c6c7] text-[#0b0c10]"
            }`}
          >
            2-Player
          </button>
          <button
            onClick={() => {
              setMode("ai");
              resetBoard();
            }}
            className={`px-3 py-2 text-sm sm:text-base rounded-lg border ${
              mode === "ai"
                ? "bg-[#45a29e] text-[#0b0c10]"
                : "bg-[#c5c6c7] text-[#0b0c10]"
            }`}
          >
            VS Computer
          </button>
        </div>

        <div className="text-xs sm:text-sm text-center text-gray-400 mb-3">
          Mode: {mode === "pvp" ? "2 Player" : "Single Player"}
        </div>

        {/* Game Grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {board.map((cell, i) => (
            <button
              key={i}
              onClick={() => handleClick(i)}
              className={`h-16 sm:h-20 rounded-lg text-2xl font-semibold flex items-center justify-center border border-[#45a29e] focus:outline-none transition-all ${
                cell
                  ? "cursor-default text-[#66fcf1]"
                  : "hover:bg-[#45a29e] hover:text-[#0b0c10]"
              }`}
            >
              {cell}
            </button>
          ))}
        </div>

        {/* Status */}
        <div className="mb-4 text-center">
          {winner && (
            <div className="text-green-500 font-semibold text-base">
              Winner: {winner}
            </div>
          )}
          {!winner && isDraw && (
            <div className="text-[#d83f87] font-medium text-base">
              It's a draw!
            </div>
          )}
          {!winner && !isDraw && (
            <div className="text-[#c5c6c7] font-medium text-base">
              Turn: {xIsNext ? "X" : "O"}
            </div>
          )}
        </div>

        {/* Score + Reset */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mb-4">
          <div className="text-sm sm:text-base text-center sm:text-left">
            Score — X: {score.X} | O: {score.O}
          </div>
          <div className="flex gap-2">
            <button
              onClick={resetBoard}
              className="px-3 py-2 border rounded-lg text-sm sm:text-base hover:bg-[#45a29e] hover:text-[#0b0c10]"
            >
              Reset Round
            </button>
            <button
              onClick={resetAll}
              className="px-3 py-2 border rounded-lg text-sm sm:text-base hover:bg-[#45a29e] hover:text-[#0b0c10]"
            >
              Reset All
            </button>
          </div>
        </div>

        {/* History */}
        <details className="text-sm text-gray-400">
          <summary className="cursor-pointer mb-2">
            History ({history.length})
          </summary>
          <ol className="list-decimal list-inside max-h-40 overflow-auto pl-2">
            {history.map((h, idx) => (
              <li key={idx} className="py-1">
                Move {idx + 1}: {h.player}
              </li>
            ))}
          </ol>
        </details>

        {/* Footer */}
        <footer className="mt-4 text-center text-xs text-gray-500">
          Tip: switch mode to play vs computer. Want a stronger AI? Ask me for a
          Minimax version!
        </footer>
      </div>
    </div>
  );
}
