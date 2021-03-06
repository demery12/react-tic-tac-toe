import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" style={{backgroundColor: props.color}} onClick={props.onClick}>
      {props.value}
    </button>
  );
 }

class Board extends React.Component {
  renderSquare(i) {
    let color = null;
    if(this.props.colorThese && this.props.colorThese.includes(i)){
        color = 'yellow';
    }
    return (
      <Square
          value={this.props.squares[i]}
          key={i}
          onClick={() => this.props.onClick(i)}
          color={color}
      />
     );
  }
   renderRow(i) {
    return (
        <div className="board-row" key={i}>
            {[0,1,2].map(x => this.renderSquare(x+(i*3)))}
        </div>
    );
  }

  render() {
    return (
      <div>
        {[0,1,2].map(x=>this.renderRow(x))}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        move: null,
      }],
      moveHistory: [],
      stepNumber: 0,
      xIsNext: true,
      ascendingOrder: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{squares: squares, move: indexToColRow(i)}]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });
  }

   jumpTo(step) {
        this.setState({
          stepNumber: step,
          xIsNext: (step % 2) === 0,
        });
   }

    reverseList() {
        this.setState((state, props) => ({
         ascendingOrder: !state.ascendingOrder
        }));
    }

  render() {
    const history = this.state.history
    const reverseHistory = this.state.history.slice().reverse();
    const current = history[this.state.stepNumber];
    const winningSquares = calculateWinner(current.squares);
    const winner = winningSquares ? current.squares[winningSquares[0]] : null;
    const draw = checkIfBoardFull(current.squares);
    const orderedHistory = this.state.ascendingOrder ? history : reverseHistory;
    const numMoves = history.length - 1
    const moves = orderedHistory.map((step, moveNumber) => {
      moveNumber = this.state.ascendingOrder ? moveNumber : numMoves - moveNumber
      const desc = moveNumber ?
        'Go to move #' + moveNumber + ': ' + step.move:
        'Go to game start';
      return (
        <li key={step.move} style={{'fontWeight': this.state.stepNumber === moveNumber ? 'bold' : 'normal'}}>
          <button style={{'fontWeight': 'inherit'}} onClick={() => this.jumpTo(moveNumber)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else if (draw){
        status = 'It is a draw!';
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            colorThese = {winningSquares}
           />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div><button onClick={() => this.reverseList()}>Reverse List</button></div>
          <ol reversed={!this.state.ascendingOrder}>{moves}</ol>
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
      return lines[i];
    }
  }
  return null;
}

function checkIfBoardFull(squares){
    for(let i of squares){
        if(i === null){
            return false;
        }
    }
    return true;
}

function indexToColRow(i) {
    const indexLookUp = {0:'(0,0)', 1:'(1,0)', 2:'(2,0)',
                         3:'(0,1)', 4:'(1,1)', 5:'(2,1)',
                         6:'(0,2)', 7:'(1,2)', 8:'(2,2)'
                        };
    return indexLookUp[i];
}