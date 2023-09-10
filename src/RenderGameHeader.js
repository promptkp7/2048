const RenderGameHeader = ({ score, highScore, resetBoard }) => {
  return (
    <div className='game-header'>
      <div className='game-title'>2048</div>
      <div className="right-container">
        <div className="score-container">
          <button className='reset-button' onClick={resetBoard}>
            reset
          </button>
          <div className='score-box'>
            <div className='box-name'>Score</div>
            <div className='score'>{score}</div>
          </div>
          <div className='score-box'>
            <div className='box-name'>Best</div>
            <div className='score'>{highScore}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RenderGameHeader