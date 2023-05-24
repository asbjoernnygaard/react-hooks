// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageState} from "../utils";

const initialSquares = Array(9).fill(null)
function Board() {
  const [squares, setSquares] = useLocalStorageState('squares', initialSquares)
  const nextVal = calculateNextValue(squares)
  const winner = calculateWinner(squares)
  const status = calculateStatus(winner, squares, nextVal)

  const [history, setHistory] = useLocalStorageState('squareHistory', [initialSquares])
  const [currentStep, setCurrentStep] = React.useState(0);

  function selectSquare(square) {
    if (winner) return
    if (squares[square]) return;

    const newSquares = [...squares]
    newSquares[square] = nextVal

    setHistory([...history.slice(0, currentStep + 1), newSquares])
    setCurrentStep((prev)=>prev+1)

    setSquares(newSquares)
  }

  function restart() {
    setSquares(initialSquares)
    setHistory([initialSquares])
  }

  function renderSquare(i) {
    return (
      <button className="square" onClick={() => selectSquare(i)}>
        {squares[i]}
      </button>
    )
  }

  function handleClick(index) {
    setCurrentStep(index)
    setSquares(history[index])
  }

  function Item({index}) {
    let msg = `Go to ${index === 0 ? 'game start' : 'move #' + index}`
    if (currentStep === index) msg += ' (current)'
    return <button onClick={() => handleClick(index)}>{msg}</button>
  }

  function History() {
    return(
        <ol>
          {history.map((turn, index) => (
              <li key={JSON.stringify(turn)}>
                <Item index={index}/>
              </li>
          ))
          }
        </ol>
    )
  }

  return (
    <div>
      {/* 🐨 put the status in the div below */}
      <div className="status">{status}</div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
      <button className="restart" onClick={restart}>
        restart
      </button>
      <History/>
    </div>
  )
}

function Game() {
  return (
    <div className="game">
      <div className="game-board">
        <Board />
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
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
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
