const RenderCell = () => {
  return (
    <div className='cell'></div>
  )
}

const RenderRow = ({ size }) => {
  return (
    <div className='row'>{[...Array(size)].map((item, i) => <RenderCell key={i}/>)}</div>
  )
}

const RenderTile = ({ tile }) => {
  const { id, row, column, value, show } = tile
  const tileStyle = {
    top: `${20 * row + 2 * (row + 1)}vmin`,
    left: `${20 * column + 2 * (column + 1)}vmin`,
    zIndex: show ? 0 : -1,
    backgroundColor: `hsl(25, 100%, ${80 * (1 - Math.log2(value) / 18)}%)`,
  }
  if (value)
  return (
    <div id={id} className='tile' style={tileStyle}>{value}</div>
  )
}

const RenderGrid = ({ size, board }) => {
  return (
    <div className='grid'>
      {[...Array(size)].map((item, i) => <RenderRow key={i} size={size} />)}
      {board.tileArray.map((tile) => <RenderTile key={tile.id} tile={tile} />)}
    </div>
  )
}

export default RenderGrid