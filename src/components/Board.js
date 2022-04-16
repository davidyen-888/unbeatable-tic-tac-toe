import React from "react";
import Square from "./Square";

// Parent component for squares
// The parent component can pass the state back down to the children via props
// This keeps the child components in sync with each other and the parent
export default class Board extends React.Component {
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
