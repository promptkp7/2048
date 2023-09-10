const copy = (object) => JSON.parse(JSON.stringify(object))

class NewBoard {
  #size
  #score
  #tileArray
  #usedId
  #unusedId

  constructor (size, data = null) {
    this.#size = size

    if (data) {
      this.#score = data.score
      this.#tileArray = data.tileArray
      this.#usedId = data.usedId
      this.#unusedId = data.unusedId
      return
    }

    this.#score = 0
    this.#tileArray = []

    const numId = 3 * size * size
    this.#usedId = []
    this.#unusedId = [...Array(numId).keys()]

    let startingCells = 2
    while (startingCells--) {
      this.fillRandom()
    }
  }

  move (key) {
    // remove tiles s.t. tile.show === false, and update used/unused Id
    this.removeInvis()

    let rowWise = ['ArrowLeft', 'ArrowRight'].includes(key)
    let maxFirst = ['ArrowRight', 'ArrowDown'].includes(key)

    // find tile in each row and sort by column
    // keep track of changes
    // keep trach of score change
    let change = false
    let addedScore = 0
    for (let index = 0; index < this.#size; index++) {
      const tiles = this.#tileArray.filter((tile) => {
        return rowWise
          ? tile.row === index
          : tile.column === index
      })

      tiles.sort((tile1, tile2) => {
        const diff = rowWise
          ? tile1.column - tile2.column
          : tile1.row - tile2.row
        return maxFirst
        ? diff
        : -diff
      })

      let furthest = maxFirst ? this.#size - 1 : 0
      let i = tiles.length - 1
      let attribute = rowWise ? 'column' : 'row'
      while (i >= 0) {
        const currentTile = tiles[i]
        if (i === 0) {
          if (currentTile[attribute] !== furthest) {
            change = true
          }
          currentTile[attribute] = furthest
        } else {
          const nextTile = tiles[i - 1]
          if (currentTile.value === nextTile.value) {
            change = true
            currentTile.show = false
            nextTile.show = false
            currentTile[attribute] = furthest
            nextTile[attribute] = furthest
            if (rowWise) {
              this.fill(index, furthest, 2 * currentTile.value)
            } else {
              this.fill(furthest, index, 2 * currentTile.value)
            }
            addedScore += 2 * currentTile.value
            i--
          } else {
            if (currentTile[attribute] !== furthest) {
              change = true
            }
            currentTile[attribute] = furthest
          }
        }
        i--
        furthest += maxFirst ? -1 : 1
      }
    }

    if (change) {
      this.fillRandom()
    }
    return addedScore
  }

  isOccupied (row, column) {
    return this.#tileArray.some((tile) => {
      return tile.row === row
      && tile.column === column
      && tile.show
    })
  }

  fill (row, column, value) {
    const newId = this.generateId()
    const newTile = {
      id: newId,
      row: row,
      column: column,
      value: value,
      show: true,
    }

    this.#tileArray.push(newTile)
  }

  fillRandom () {
    let filled = false
    while (!filled) {
      const row = Math.floor(Math.random() * this.#size)
      const column = Math.floor(Math.random() * this.#size)
      if (this.isOccupied(row, column)) continue;
      this.fill(row, column, Math.random() < 0.9 ? 2 : 4)
      filled = true
    }
  }

  generateId () {
    const newId = this.#unusedId.pop()
    this.#usedId.push(newId)
    return newId
  }

  removeInvis () {
    this.#tileArray = this.#tileArray.filter((tile) => {
      if (!tile.show) {
        this.#usedId = this.#usedId.filter((id) => id !== tile.id)
        this.#unusedId.push(tile.id)
      }
      return tile.show
    })
  }

  isOver() {
    const shownTiles = this.#tileArray.filter((tile) => tile.show)
    if (shownTiles.length < Math.pow(this.#size, 2)) return false;

    const valueArray = Array(this.#size)
    for (let row = 0; row < this.#size; row++) {
      valueArray[row] = Array(this.#size)
    }
    for (const tile of shownTiles) {
      valueArray[tile.row][tile.column] = tile.value
    }

    for (let row = 0; row < this.#size; row++) {
      for (let column = 0; column < this.#size; column++) {
        const diff = [[0, -1], [-1, 0]]
        for (const d of diff) {
          const newRow = row + d[0]
          const newColumn = column + d[1]
          if (newRow >= 0 && newColumn >= 0) {
            if (valueArray[newRow][newColumn] === valueArray[row][column]) {
              return false
            }
          }
        }
      }
    }

    return true
  }

  get tileArray() {
    return copy(this.#tileArray)
  }

  get usedId() {
    return copy(this.#usedId)
  }

  get unusedId() {
    return copy(this.#unusedId)
  }
}

export default NewBoard