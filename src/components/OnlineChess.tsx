import { Chess, Square } from "chess.js";
import { useState, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Piece } from "react-chessboard/dist/chessboard/types";
import io, { Socket } from "socket.io-client";
import { HStack, Spinner } from "@chakra-ui/react";

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

const OnlineChess = () => {
  const [game, setGame] = useState(() => new Chess());
  const [gamePosition, setGamePosition] = useState(game.fen());
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [boardOrientation, setBoardOrientation] = useState<"white" | "black">(
    "white"
  );
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(
      "https://arcane-plains-21943-d89c6c112e53.herokuapp.com/",
      {
        transports: ["websocket", "polling"],
      }
    );
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log(`Connected with id: ${newSocket.id}`);
    });

    newSocket.on(
      "startGame",
      ({
        room,
        boardOrientation,
      }: {
        room: string;
        boardOrientation: "white" | "black";
      }) => {
        setIsGameStarted(true);
        setBoardOrientation(boardOrientation);
        console.log(`Game started in room: ${room}`);
      }
    );

    newSocket.on("move", (data) => {
      game.move(data.move);
      setGamePosition(game.fen());
      console.log(`Move received: ${JSON.stringify(data.move)}`);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [game]);

  const onDrop = (sourceSquare: Square, targetSquare: Square, piece: Piece) => {
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: piece[1].toLowerCase() ?? "q",
    });

    // illegal move
    if (move === null) return false;

    setGamePosition(game.fen());

    if (socket) {
      socket.emit("move", { move });
      console.log(`Move sent: ${JSON.stringify(move)}`);
    }

    // exit if the game is over
    if (game.isGameOver() || game.isDraw()) return false;

    return true;
  };

  return (
    <div style={boardWrapper}>
      {!isGameStarted ? (
        <HStack>
          <h2>Waiting for another player to join...</h2>
          <Spinner />
        </HStack>
      ) : (
        <div>
          <Chessboard
            position={gamePosition}
            onPieceDrop={onDrop}
            boardOrientation={"white"}
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
      )}
    </div>
  );
};

export default OnlineChess;
