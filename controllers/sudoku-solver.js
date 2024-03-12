class SudokuSolver {

  convertRowToNum(rowStr) {
    const rowToNum = { a: 0, b:1, c:2, d:3, e:4, f:5, g:6, h:7, i:8};
    let rowNum;

    if (/^[a-iA-I]$/.test(rowStr)) {
      rowNum = rowToNum[rowStr.toLowerCase()];
    } else {
      rowNum = rowStr;
    }
    return rowNum;
  }


  validate(puzzleString) {
    return /^[1-9\.]{81}$/.test(puzzleString);
  }

  checkRowPlacement(puzzleString, row, column, value) {
    if (puzzleString[this.convertRowToNum(row) * 9 + column === value]) {
      return true;
    }

    const rowStart = this.convertRowToNum[row] * 9;
    const rowEnd = rowStart + 9;

    const rowValues = puzzleString.slice(rowStart, rowEnd).split('');
    return !rowValues.includes(value);
  }

  checkColPlacement(puzzleString, row, column, value) {
    if (puzzleString[this.convertRowToNum(row) * 9 + column] === value) {
      return true;
    }

    for (let i = column - 1; i < 81; i += 9) {
      if (puzzleString[i] === value) {
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    if (puzzleString[this.convertRowToNum(row) * 9 + column] === value) {
      return true;
    }

    const startRow = Math.floor(this.convertRowToNum[row] / 3) * 3;
    const startCol = Math.floor(column -1 / 3) * 3;
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
    if (!this.validate(puzzleString)) {
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

    const row = Math.floor(emptyIndex / 9);
    const col = emptyIndex % 9;

    for (let i = 1; i <= 9; i++) {
      // const valString = value.toString();
      if (this.checkRowPlacement(puzzleArray.join(''), row, col, i) &&
          this.checkColPlacement(puzzleArray.join(''), row, col, i) &&
          this.checkRegionPlacement(puzzleArray.join(''), row, col, i))
      {
        puzzleArray[emptyIndex] = i;
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

