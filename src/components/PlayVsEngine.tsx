import { Chess, Square } from "chess.js";
import { useEffect, useMemo, useState } from "react";
import { Chessboard } from "react-chessboard";
import Engine from "../engine";
import { Piece } from "react-chessboard/dist/chessboard/types";

const boardWrapper = {
  width: `70vw`,
  maxWidth: "70vh",
  margin: "3rem auto",
};

const buttonStyle = {
  cursor: "pointer",
  padding: "10px 20px",
  margin: "10px 10px 0px 0px",
  borderRadius: "6px",
  backgroundColor: "#f0d9b5",
  border: "none",
  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.5)",
};

const PlayWithEngine = () => {
  useEffect(() => {
    const stockfish = new Worker("./stockfish.wasm.js");
    const DEPTH = 8; // number of halfmoves the engine looks ahead
    const FEN_POSITION =
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

    stockfish.postMessage("uci");
    stockfish.postMessage(`position fen ${FEN_POSITION}`);
    stockfish.postMessage(`go depth ${DEPTH}`);

    stockfish.onmessage = (e) => {
      console.log(e.data); // in the console output you will see `bestmove e2e4` message
    };
  }, []);

  const engine = useMemo(() => new Engine(), []);
  const game = useMemo(() => new Chess(), []);

  const [gamePosition, setGamePosition] = useState(game.fen());
  const [stockfishLevel, setStockfishLevel] = useState(18);

  function findBestMove() {
    engine.evaluatePosition(game.fen(), stockfishLevel);

    engine.onMessage(({ bestMove }) => {
      if (bestMove) {
        // In latest chess.js versions you can just write ```game.move(bestMove)```
        game.move(bestMove);

        setGamePosition(game.fen());
      }
    });
  }

  function onDrop(sourceSquare: Square, targetSquare: Square, piece: Piece) {
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: piece[1].toLowerCase() ?? "q",
    });
    setGamePosition(game.fen());

    // illegal move
    if (move === null) return false;

    // exit if the game is over
    if (game.isGameOver() || game.isDraw()) return false;

    findBestMove();

    return true;
  }

  return (
    <div style={boardWrapper}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "1rem",
        }}
      ></div>

      <Chessboard position={gamePosition} onPieceDrop={onDrop} />

      <button
        style={buttonStyle}
        onClick={() => {
          game.reset();
          setGamePosition(game.fen());
        }}
      >
        New game
      </button>
      <button
        style={buttonStyle}
        onClick={() => {
          game.undo();
          game.undo();
          setGamePosition(game.fen());
        }}
      >
        Undo
      </button>
    </div>
  );
};

export default PlayWithEngine;
