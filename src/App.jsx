import { useState } from 'react';

import Player from './components/Player.jsx'
import GameBaord from './components/GameBoard.jsx'
import Log from './components/Log.jsx';
import { WINNING_COMBINATIONS } from './winning-combinations.js';
import GameOver from './components/GameOver.jsx';


const initialGameBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

function derivedActivePlayer(gameTurns) {
  let currentPlayer = 'X'

  if (gameTurns.length > 0 && gameTurns[0].player === 'X') {
    currentPlayer = 'O';
  }

  return currentPlayer;
}

function App() {
  const [players, setPlayers] = useState({
    X: 'Player 1',
    O: 'Player 2'
  })
  const [gameTurns, setGameTurns] = useState([]);
  //const [hasWinner, setHasWinner] = useState(false)
  //const [activePlayer, setActivePlayer] = useState('X')

  const activePlayer = derivedActivePlayer(gameTurns);

  let gameBoard = [...initialGameBoard.map(array => [...array])];

  for (const turn of gameTurns) {
      const { square, player } = turn;
      const { row, col } = square;
  
      gameBoard[row][col] = player;
  }

  let winner;

  for (const combinations of WINNING_COMBINATIONS) {
    const  firstSquareSymbol = gameBoard[combinations[0].row][combinations[0].column]
    const  secondSquareSymbol = gameBoard[combinations[1].row][combinations[1].column]
    const  thirdSquareSymbol = gameBoard[combinations[2].row][combinations[2].column]

    if (firstSquareSymbol && 
      firstSquareSymbol ===  secondSquareSymbol && 
      firstSquareSymbol === thirdSquareSymbol
      ) {
        //winner = firstSquareSymbol;
        winner = players[firstSquareSymbol];
      }
  }

  const hasDraw = gameTurns.length === 9 && !winner;

  function handleSelectSquare(rowIndex, colIndex) {
    //setActivePlayer((curActivePlayer) => curActivePlayer === 'X' ? 'O' : 'X')
    setGameTurns(prevTurns => {
      const currentPlayer = derivedActivePlayer(prevTurns);

      const updatedTurns = [
        { square: { row: rowIndex, col: colIndex }, player: currentPlayer },
         ...prevTurns,
        ];

        return updatedTurns;
    });
  }

  function handleRestart() {
    setGameTurns([]);
  }

  function handlePlayerNameChange(symbol, newName) {
    setPlayers(prevPlayers => {
      return {
        ...prevPlayers,
        [symbol]: newName
      };
    });
  }

  return (
    <>
    <div id='game-container'>
      <ol id='players' className='highlight-player'>
        <Player 
        initialName="Player 1" 
        symbol="X" 
        isActive={activePlayer === 'X'}
        onChangeName={handlePlayerNameChange}
        />
        <Player 
        initialName="Player 2" 
        symbol="O" 
        isActive={activePlayer === 'O'}
        onChangeName={handlePlayerNameChange}
        />
      </ol>
      {(winner || hasDraw) && <GameOver winner={winner} onRestart={handleRestart}/>}
      <GameBaord 
      onSelectSquare={handleSelectSquare} 
      board={gameBoard}
      />
    </div>
    <Log 
    turns={gameTurns}
    />
    </>
  )
}

export default App
