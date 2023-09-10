const GameOver = ({ buttonHandler, isOver })  => {
  let style = {}
  if (!isOver) style.display = 'none'

  return (
    <div className='game-over' style={style}>
      <div className='message'>Game Over!</div>
      <button className='button' onClick={buttonHandler}>
        Try Again
      </button>
    </div>
  )
}

export default GameOver
