class SudokuSolver {

  validate(puzzleString) {
    return /^[1-9\.]{81}$/.test(puzzleString);
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const rowStart = row * 9;
    const rowEnd = rowStart + 9;
    for (let i = rowStart; i < rowEnd; i++) {
      if (puzzleString[i] === value) {
        return false;
      }
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    for (let i = column; i < 81; i += 9) {
      if (puzzleString[i] === value) {
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(column / 3) * 3;
    for (let i = startRow; i < startRow + 3; i++) {
      for (let j = startCol; j < startCol + 3; j++) {
        if (puzzleString[i * 9 + j] === value) {
          return false;
        }
      }
    }
    return true;
  }

  solve(puzzleString) {
    if (this.validate(puzzleString)) {
      return { error: 'Invalid puzzle' };
    }

    const solvedString = this.solvePuzzle(puzzleString);
    if (!solvedString) {
      return { error: 'Puzzle cannot be solved' };
    }
    return { solution: solvedString };

  }

  solvePuzzle(puzzleString) {
    const puzzleArray = puzzleString.split('');
    const emptyIndex = puzzleArray.findIndex(cell => cell === '.');
    if (emptyIndex === -1) {
      return puzzleArray.join('');
    }

    for (let value = 1; value <= 9; value++) {
      const newValue = value.toString();
      if (this.checkRowPlacement(puzzleArray.join(''), Math.floor(emptyIndex / 9), emptyIndex % 9, newValue) &&
          this.checkColPlacement(puzzleArray.join(''), Math.floor(emptyIndex / 9), emptyIndex % 9, newValue) &&
          this.checkRegionPlacement(puzzleArray.join(''), Math.floor(emptyIndex / 9), emptyIndex % 9, newValue))
      {
        puzzleArray[emptyIndex] = newValue;
        const result = this.solvePuzzle(puzzleArray.join(''));
        if (result) {
          return result;
        }
        puzzleArray[emptyIndex] = '';
      }
    }
  }
}

module.exports = SudokuSolver;

