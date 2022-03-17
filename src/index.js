import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// // Controled component which receive values from the Board component and inform the Board component when they're clicked
// class Square extends React.Component {
//   // add a constructor to the Square class to initialize the state
//   // constructor(props) {
//   //   super(props);
//   //   this.state = {
//   //     value: null,
//   //   };
//   // }
//   render() {
//     return (
//       <button
//         className="square"
//         onClick={() => { this.props.onClick() }}>
//         {this.props.value}
//       </button>
//     );
//   }
// }

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
  // add a constructor to the Board class to initialize the state
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null), // the state contains an array of 9 nulls corresponding to the 9 squares
      xIsNext: true,  // xIsNext will be flipped to determine which player's turn it is
    }
  }
  // passing down value and onClick to the Square component
  renderSquare(i) {
    return <Square
      value={this.state.squares[i]}
      onClick={() => { this.handleClick(i) }}
    />;
  }

  handleClick(i) {
    // create a copy of the squares array
    const squares = this.state.squares.slice();
    // if the square is already filled or someone has won, return
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext, // flip the value of xIsNext
    });
  }

  render() {
    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }


    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div >
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
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

