import React from 'react';
import './Game.css';
import Cell from './Cell';

const BOARD_WIDTH = 800;
const BOARD_HEIGHT = 600;
const CELL_WIDTH = 20;

class Game extends React.Component {
  constructor() {
    super();
    this.rows = BOARD_HEIGHT / CELL_WIDTH;
    this.cols = BOARD_WIDTH / CELL_WIDTH;
    this.board = this.makeEmptyBoard();
  }

  state = {
    cells: [],
    interval: 100,
    isRunning: false
  };

  getElementOffset() {
    const rect = this.boardRef.getBoundingClientRect();
    const doc = document.documentElement;
    return {
      x: rect.left + window.pageXOffset - doc.clientLeft,
      y: rect.top + window.pageYOffset - doc.clientTop
    };
  }

  handleIntervalChange = event => {
    this.setState({ interval: event.target.value });
  };

  handleClick = event => {
    const elemOffset = this.getElementOffset();
    const offsetX = event.clientX - elemOffset.x;
    const offsetY = event.clientY - elemOffset.y;

    const x = Math.floor(offsetX / CELL_WIDTH);
    const y = Math.floor(offsetY / CELL_WIDTH);
    if (x >= 0 && x <= this.cols && y >= 0 && y <= this.rows) {
      this.board[y][x] = !this.board[y][x];
    }
    this.setState({ cells: this.makeCells() });
  };

  runGame = () => {
    this.setState({ isRunning: true });
    this.runIteration();
  };

  stopGame = () => {
    this.setState({ isRunning: false });
    if (this.timeoutHandler) {
      window.clearTimeout(this.timeoutHandler);
      this.timeoutHandler = null;
    }
  };

  runIteration() {
    const newBoard = this.makeEmptyBoard();

    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        const neighbors = this.calculateNeighbors(this.board, x, y);
        if (this.board[y][x]) {
          if (neighbors === 2 || neighbors === 3) {
            newBoard[y][x] = true;
          } else {
            newBoard[y][x] = false;
          }
        } else if (!this.board[y][x] && neighbors === 3) {
          newBoard[y][x] = true;
        }
      }
    }

    const { interval } = this.state;

    this.board = newBoard;
    this.setState({ cells: this.makeCells() });
    this.timeoutHandler = window.setTimeout(() => {
      this.runIteration();
    }, interval);
  }

  makeCells() {
    const cells = [];
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        if (this.board[y][x]) {
          cells.push({ x, y });
        }
      }
    }
    return cells;
  }

  makeEmptyBoard() {
    const board = [];
    for (let y = 0; y < this.rows; y++) {
      board[y] = [];
      for (let x = 0; x < this.cols; x++) { 
        board[y][x] = false;
      }
    }
    return board;
  }

  calculateNeighbors(board, x, y) {
    let neighbors = 0;
    const dirs = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, 1],
      [1, 1],
      [1, 0],
      [1, -1],
      [0, -1]
    ];
    for (let i = 0; i < dirs.length; i++) {
      const dir = dirs[i];
      const y1 = y + dir[0];
      const x1 = x + dir[1];

      if (
        x1 >= 0 &&
        x1 < this.cols &&
        y1 >= 0 &&
        y1 < this.rows &&
        board[y1][x1]
      ) {
        neighbors++;
      }
    }

    return neighbors;
  }

  render() {
    const { cells, isRunning, interval } = this.state;

    return (
      <div>
        <div
          className="board"
          style={{
            width: BOARD_WIDTH,
            height: BOARD_HEIGHT,
            backgroundSize: `${CELL_WIDTH}px ${CELL_WIDTH}px`
          }}
          onClick={this.handleClick}
          onKeyDown=""
          ref={n => {
            this.boardRef = n;
          }}
          role="button"
          tabIndex="0"
        >
          {cells.map(cell => (
            <Cell
              x={cell.x}
              y={cell.y}
              key={`${cell.x},${cell.y}`}
              width={CELL_WIDTH}
            />
          ))}
        </div>
        <br />
        <div className="controls">
          Update every
          <input value={interval} onChange={this.handleIntervalChange} />
          msec
          {isRunning ? (
            <button type="button" className="button" onClick={this.stopGame}>
              Stop
            </button>
          ) : (
            <button type="button" className="button" onClick={this.runGame}>
              Run
            </button>
          )}
        </div>
      </div>
    );
  }
}

export default Game;
