import { Chess, Square } from "chess.js";
import { useMemo, useState } from "react";
import { Chessboard } from "react-chessboard";
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

const Offline = () => {
  const game = useMemo(() => new Chess(), []);
  const [gamePosition, setGamePosition] = useState(game.fen());

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

      <Chessboard
        position={gamePosition}
        onPieceDrop={onDrop}
        showPromotionDialog={true}
      />

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
          setGamePosition(game.fen());
        }}
      >
        Undo
      </button>
    </div>
  );
};

export default Offline;
