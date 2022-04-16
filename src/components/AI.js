import Game from "./Game";

// AI minimax algorithm
export default function findBestSquare(squares, player) {
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