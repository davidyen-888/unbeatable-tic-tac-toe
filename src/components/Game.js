import React from "react";
import Board from "./Board";

export default class Game extends React.Component {
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

    // makeMove() returns a promise that resolves only when setState() completes
    makeMove(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        // create a copy of the squares array
        const squares = current.squares.slice();
        // if the square is already filled or someone has won, return
        if (calculateWinner(squares) || squares[i]) {
            return Promise.resolve();
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        const nextState = {
            history: history.concat([{  // don't mutate the original array
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext, // flip the value of xIsNext
        };

        // Return a Promise that resolves when setState is complete
        return new Promise((resolve, reject) => {
            this.setState(nextState, resolve);
        });
    }

    async handleClick(i) {
        // Apply human player move to square i
        await this.makeMove(i);
        // Apply AI move after the human player makes a move
        const squares = this.state.history[this.state.stepNumber].squares.slice();
        const bestSquare = findBestSquare(squares, this.state.xIsNext ? 'X' : 'O');
        if (bestSquare !== -1) {
            await this.makeMove(bestSquare);
        }
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
        const full = isFull(current.squares);

        // map over history to create a list of moves
        const moves = history.map((step, move) => { // step is the value of history array, move is the index of history array
            const desc = move ?
                'Go to move #' + (move + 1) :
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
        } else if (full) {
            status = `It's a Draw!`;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="app-header">
                <h1>Tic Tac Toe</h1>
                <h3> Try to beat your AI opponent!</h3>
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
            </div>
        );
    }
}

// helper function to determine if the sqaure is full(draw situation)
function isFull(squares) {
    for (let i = 0; i < squares.length; i++) {
        if (squares[i] === null) {
            return false;
        }
    }
    return true;
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

// AI minimax algorithm
function findBestSquare(squares, player) {
    // 'player' is the maximizing player
    // 'opponent' is the minimizing player
    const opponent = player === 'X' ? 'O' : 'X';

    const minimax = (squares, isMax) => {
        const winner = calculateWinner(squares);

        // If player wins, score is +1
        if (winner === player) return { square: -1, score: 1 };

        // If opponent wins, score is -1
        if (winner === opponent) return { square: -1, score: -1 };
        // If no winner, and board is full, score is 0
        if (isFull(squares)) return { square: -1, score: 0 };
        // Initialize best score, if isMax is true, initialize to -Infinity, else +Infinity
        const bestScore = { square: -1, score: isMax ? -Infinity : Infinity };

        // Loop through all squares
        for (let i = 0; i < squares.length; i++) {
            // If square is full, skip it
            if (squares[i]) continue;

            // if square is unfull, then it's a valid move, play the square
            squares[i] = isMax ? player : opponent;
            // Recursively call minimax with the opponent
            const score = minimax(squares, !isMax).score;
            // Undo the move
            squares[i] = null;

            if (isMax) {
                // Maximizing player, track the highest score and move
                if (score > bestScore.score) {
                    bestScore.score = score;
                    bestScore.square = i;
                }
            } else {
                // Minimizing player, track the lowest score and move
                if (score < bestScore.score) {
                    bestScore.score = score;
                    bestScore.square = i;
                }
            }
        }

        // Return the best score and move
        return bestScore;
    };
    // The best move for the player given current board state
    return minimax(squares, true).square;
}
