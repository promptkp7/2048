import { useEffect, useState } from 'react'
import NewBoard from './newboard'
import './index.css'

import RenderGrid from './RenderGrid'
import GameOver from './GameOver'
import RenderGameHeader from './RenderGameHeader'

const BOARD_SIZE = 4

const App = () => {
  const [board, setBoard] = useState(null)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [key, setKey] = useState(null)
  const [isOver, setIsOver] = useState(false)

  const keyHandler = (event) => {
    event.preventDefault()
    setKey(event.key)
  }

  const resetBoard = () => {
    setIsOver(false)
    setScore(0)
    setBoard(new NewBoard(BOARD_SIZE))
    setKey(null)
  }

  useEffect(() => {
    // initialize board
    resetBoard()

    document.addEventListener('keydown', keyHandler)
  }, [])

  useEffect(() => {
    if (!key || !key.includes('Arrow')) return
    if (isOver) {
      // ignore input
      return
    }

    const copiedBoard = new NewBoard(BOARD_SIZE, {
      tileArray: board.tileArray,
      unusedId: board.unusedId,
      usedId: board.usedId,
    })
    const addedScore = copiedBoard.move(key)

    setScore(score + addedScore)
    setBoard(copiedBoard)
    setKey(null)

    if (copiedBoard.isOver()) {
      setIsOver(true)
    }
  }, [board, key, isOver, score])

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score)
    }
  }, [score, highScore])
  if (!board) return <div>waiting</div>

  return (
    <>
      <RenderGameHeader score={score} highScore={highScore} resetBoard={resetBoard}/>
      <div className='game-container'>
        <RenderGrid size={BOARD_SIZE} board={board}/>
        <GameOver buttonHandler={resetBoard} isOver={isOver}/>
      </div>
    </>
  )
}

export default App;
