import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const totalGridSize = 20;

  const xPosition = Math.floor(Math.random() * totalGridSize);
  const yPosition = Math.floor(Math.random() * totalGridSize);

  const initialSnakePosition = [
    { x: totalGridSize / 2, y: totalGridSize / 2 },
    { x: totalGridSize / 2 + 1, y: totalGridSize / 2 },
  ];

  const [isStart, setIsStart] = useState(false);
  const [food, setFood] = useState({ x: xPosition, y: yPosition });
  const [snake, setSnake] = useState(initialSnakePosition);
  const [direction, setDirection] = useState("LEFT");
  const [score, setScore] = useState(0);

  const gameOver = () => {
    setSnake(initialSnakePosition);
    setScore(0);
    renderFood();
  };

  const renderBoard = () => {
    let cellArray = [];
    for (let row = 0; row < totalGridSize; row++) {
      for (let column = 0; column < totalGridSize; column++) {
        let className = "cell";

        let isFood = food.x === row && food.y === column;
        let isSnake = snake.some((ele) => ele.x === row && ele.y === column);
        let isSnakeHead = snake[0].x === row && snake[0].y === column;

        if (isFood) {
          className += " food";
        }
        if (isSnake) {
          className += " snake";
        }
        if (isSnakeHead) {
          className += " snakeHead";
        }

        let cell = (
          <div className={className} key={`${row}-${column}`}></div>
        );
        cellArray.push(cell);
      }
    }
    return cellArray;
  };

  const updateGame = () => {
    if (
      snake[0].x < 0 ||
      snake[0].x >= totalGridSize ||
      snake[0].y < 0 ||
      snake[0].y >= totalGridSize
    ) {
      gameOver();
      return;
    }

    let newSnake = [...snake];
    let isBit = snake
      .slice(1)
      .some((ele) => ele.x === snake[0].x && ele.y === snake[0].y);
    if (isBit) {
      gameOver();
      return;
    }

    switch (direction) {
      case "LEFT":
        newSnake.unshift({ x: newSnake[0].x, y: newSnake[0].y - 1 });
        break;
      case "RIGHT":
        newSnake.unshift({ x: newSnake[0].x, y: newSnake[0].y + 1 });
        break;
      case "UP":
        newSnake.unshift({ x: newSnake[0].x - 1, y: newSnake[0].y });
        break;
      case "DOWN":
        newSnake.unshift({ x: newSnake[0].x + 1, y: newSnake[0].y });
        break;
    }

    let isAteFood = newSnake[0].x === food.x && newSnake[0].y === food.y;

    if (isAteFood) {
      setScore((prev) => prev + 1);
      renderFood();
    } else {
      newSnake.pop();
    }
    setSnake(newSnake);
  };

  const updateDirection = (e) => {
    let code = e.code;
    switch (code) {
      case "ArrowUp":
        if (direction !== "DOWN") setDirection("UP");
        break;
      case "ArrowDown":
        if (direction !== "UP") setDirection("DOWN");
        break;
      case "ArrowLeft":
        if (direction !== "RIGHT") setDirection("LEFT");
        break;
      case "ArrowRight":
        if (direction !== "LEFT") setDirection("RIGHT");
        break;
    }
  };

  const renderFood = () => {
    let xPosition = Math.floor(Math.random() * totalGridSize);
    let yPosition = Math.floor(Math.random() * totalGridSize);
    setFood({ x: xPosition, y: yPosition });
  };

  useEffect(() => {
    let interval = setInterval(updateGame, 250);
    return () => clearInterval(interval);
  }, [snake, direction]);

  useEffect(() => {
    document.addEventListener("keydown", updateDirection);
    return () => document.removeEventListener("keydown", updateDirection);
  }, [direction]);

  return (
    <>
      <div className="container">
        <div className="score">
          score : <span> {score}</span>
        </div>
        <div className="board">{renderBoard()}</div>
      </div>
    </>
  );
}

export default App;
