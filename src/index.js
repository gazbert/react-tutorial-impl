import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// class Square extends React.Component {
//   render() {
//     return ( // parantheses needed to stop JS automatically adding ; after return statement.
//       <button
//         className="square"
//         onClick={() => this.props.onClick()}
//       >
//         {this.props.value}
//       </button>
//     );
//   }
// }

// --> changed to a function component as it has not state...

// props is passed in by React
function Square(props) {
  return (
    // why does onClick={() => this.props.onClick()} no longer work?
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
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
      </div>
    );
  }
}

class Game extends React.Component {
  // props is passed in by React
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    }
  }

  handleClick(i) {
    // This ensures that if we “go back in time” and then make a new move from that point, 
    // we throw away all the “future” history that would now become incorrect.
    const history = this.state.history.slice(0, this.state.stepNumber + 1);

    const current = history[history.length - 1]; // get current board state
    const squares = current.squares.slice(); // get copy of current board state

    if (calculateWinner(squares) || squares[i]) { // 2nd part stops clicks on square already clicked
      return;
    }
    if (calculateDraw(squares)) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{ // concat does not mutate c.f. push() method
        squares: squares, // append current board state to previous states
      }]),    
      // After we make a new move, we need to update stepNumber by 
      // adding stepNumber: history.length as part of the this.setState argument.
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext, // flip player turn      
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  render() {
    const history = this.state.history;

    // Modified the Game component’s render method from always rendering the last move to
    // rendering the currently selected move according to stepNumber.
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    // The map() method creates a new array with the results of calling a provided function 
    // on every element in the calling array. Like a GoF adapter function.
    const moves = history.map((step, move) => { // maps each history squares entry to a text description
      const desc = move ?
        'Go to move #' + move :
        'Go to Game Start';

      // Keys tell React about the identity of each component which allows React to maintain state between re-renders.
      // If a component’s key changes, the component will be destroyed and re-created with a new state.
      // key is a special and reserved property in React.
      // Even though key may look like it belongs in props, key cannot be referenced using this.props.key
      // It’s strongly recommended that you assign proper keys whenever you build dynamic lists.
      //
      // If no key is specified, React will present a warning and use the array index as a key by default.
      // Using the array index as a key is problematic when trying to re-order a list’s items or inserting/removing list items.
      // Explicitly passing key={i} silences the warning but has the same problems as array indices and is not recommended in most cases.
      // Keys do not need to be globally unique; they only need to be unique between components and their siblings.
      return ( // each new history squares entry will have a link button created for it.      
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      )
    });
  
    let status;
    if (winner) {
      status = 'Winner is: ' + winner + ' !';
    } else {
      const isDraw = calculateDraw(current.squares);
      if (isDraw) {
        status = 'Game is a draw!';      
      } else {
        status = 'Next player is: ' + (this.state.xIsNext ? 'X' : 'O');
      }
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
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

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

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


// Crude check for a draw - refactor!!! ;-)
function calculateDraw(squares) {
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

  let isDraw = true;
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[b] && squares[c]) {    
    } else {
      isDraw = false;
    }
  }
  if (isDraw) {
    return 'draw';
  }

  return null;
}