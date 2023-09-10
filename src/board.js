class Board {
  #boardArray
  #size

  constructor(size, startingCells) {
    this.#size = size
    this.#boardArray = Array(size)
      .fill(0)
      .map(() => Array(size).fill(0))

    while (startingCells--) this.fillRandom()
  }

  fillRandom() {
    const getRandomIndex = () => Math.floor(Math.random() * this.#size)
    const getRandomStart = () => Math.random() < 0.9 ? 2 : 4

    let filled = false
    while (!filled) {
      const row = getRandomIndex()
      const column = getRandomIndex()
      if (this.#boardArray[row][column]) continue
      this.#boardArray[row][column] = getRandomStart()
      filled = true
    }
  }

  setCell(row, column, value) {
    this.#boardArray[row][column] = value
    return value
  }

  setRow(row, array) {
    this.#boardArray[row] = array.slice()
  }

  setColumn(column, array) {
    let index = 0
    for (const row of this.#boardArray) {
      row[column] = array[index]
      index++
    }
  }

  moveRight() {
    console.log('moveRight run')
    const newBoardArray = []

    // collapse each row to the right
    for (const row of this.#boardArray) {
      const nonZeros = row.filter((number) => number > 0)
      const collapsedRow = []
      let i = nonZeros.length - 1
      while (i >= 0) {
        if (i >= 1 && nonZeros[i] === nonZeros[i - 1]) {
          collapsedRow.push(2 * nonZeros[i])
          i -= 2
        } else {
          collapsedRow.push(nonZeros[i])
          i--
        }
      }
      while (collapsedRow.length < row.length) collapsedRow.push(0)
      collapsedRow.reverse()
    newBoardArray.push(collapsedRow)
    }

    // detect if board is the same
    const newBoard = Board.createFromArray(newBoardArray)
    if (Board.same(this, newBoard)) return this // TODO
    
    // if not, fill a random cell with 2 and 4, return new board
    newBoard.fillRandom()
    console.log('moveRight done')
    return newBoard
  }

  move(key) {
    const startTime = new Date();
    console.log('move run')
    const numRotates = {
      ArrowRight: 0,
      ArrowUp: 1,
      ArrowLeft: 2,
      ArrowDown: 3,
    }

    if (!key.includes('Arrow')) return this

    let rotatedBoard = this
    for (let i = 0; i < numRotates[key]; i++) {
      rotatedBoard = rotatedBoard.rotateClockwise()
    }

    let newBoard = rotatedBoard.moveRight()
    for (let i = 0; i < this.#size - numRotates[key]; i++) {
      newBoard = newBoard.rotateClockwise()
    }

    console.log(newBoard.array)
    const endTime = new Date();
    console.log('move done, time', endTime - startTime)
    return newBoard
  }

  static createFromArray(array) {
    const board = new Board(array.length, 1)

    for (let row = 0; row < array.length; row++) {
      for (let column = 0; column < array[0].length; column++) {
        board.setCell(row, column, array[row][column])
      }
    }

    return board
  }

  static same(board1, board2) {
    console.log('same run')
    const array1 = board1.array
    const array2 = board2.array
    const numRow = array1.length
    const numColumn = array1[0].length
    for (let row = 0; row < numRow; row++) {
      for (let column = 0; column < numColumn; column++) {
        if (array1[row][column] !== array2[row][column]) {
          console.log('same done: false')
          return false;
        }
      }
    }
    console.log('same done: true')
    return true
  }

  rotateClockwise() {
    const newArray = Array(this.#size).fill(0).map(() => Array(this.#size))
    for (let row = 0; row < this.#size; row++) {
      for (let column = 0; column < this.#size; column++) {
        newArray[column][this.#size - 1 - row] = this.#boardArray[row][column]
      }
    }
    return Board.createFromArray(newArray)
  }

  get array() {
    return this.#boardArray.map((row) => row.slice())
  }
}

export default Board