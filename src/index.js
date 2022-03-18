import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// change Square to function component
function Square(props) {
  return (
    <button
      className="square"
      onClick={props.onClick}>
      {props.value}
    </button>
  );
}

// Parent component for squares
// The parent component can pass the state back down to the children via props
// This keeps the child components in sync with each other and the parent
class Board extends React.Component {
  // passing down value and onClick to the Square component
  renderSquare(i) {
    return <Square
      value={this.props.squares[i]}
      onClick={() => { this.props.onClick(i) }}
    />;
  }

  render() {
    // Create squares with two for loops
    const boardSize = 3;
    let squares = [];
    for (let i = 0; i < boardSize; ++i) {
      let row = [];
      for (let j = 0; j < boardSize; ++j) {
        row.push(this.renderSquare(i * boardSize + j));
      }
      squares.push(<div key={i} className="board-row">{row}</div>);
    }
    return (
      <div> {squares}</div >
    );
  }
}

class Game extends React.Component {
  // placing history state into Game component
  // add a constructor to the Board class to initialize the state
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null), // the state contains an array of 9 nulls corresponding to the 9 squares
      }],
      stepNumber: 0,
      xIsNext: true,  // xIsNext will be flipped to determine which player's turn it is
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    // create a copy of the squares array
    const squares = current.squares.slice();
    // if the square is already filled or someone has won, return
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{  // don't mutate the original array
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext, // flip the value of xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    // map over history to create a list of moves
    const moves = history.map((step, move) => { // step is the value of history array, move is the index of history array
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        // key is used to identify each element in an array, since the moves are never reordered, we can use the move as the key
        <li key={move}>
          <button onClick={() => { this.jumpTo(move) }}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => { this.handleClick(i) }}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// Check for a winner and return 'X, 'O or null as appropriate
function calculateWinner(squares) {
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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

