const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver;
const puzzles = require('../controllers/puzzle-strings.js')

suite('Unit Tests', () => {
  setup(() => {
    solver = new Solver();
  });

  test('Logic handles a valid puzzle string of 81 characters', () => {
    let puzzle = puzzles.puzzlesAndSolutions[0][0];
    assert.isTrue(solver.validate(puzzle));
  });

  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
    let puzzle = puzzles.puzzlesAndSolutions[0][0].replace(/^.{2}/g, 'AB');
    assert.isFalse(solver.validate(puzzle));
  });

  test('Logic handles a puzzle string that is not 81 characters in length', () => {
    let puzzle = puzzles.puzzlesAndSolutions[0][0].substring(0,15);
    assert.isFalse(solver.validate(puzzle));
  });

  test('Logic handles a valid row placement', () => {
    let puzzle = puzzles.puzzlesAndSolutions[0][0];
    assert.isTrue(solver.checkRowPlacement(puzzle, 'a', 2, 3));
  });

  test('Logic handles an invalid row placement', () => {
    let puzzle = puzzles.puzzlesAndSolutions[0][0];
    assert.isFalse(solver.checkRowPlacement(puzzle, 'a', 2, 1));
  });

  test('Logic handles a valid column placement', () => {
    let puzzle = puzzles.puzzlesAndSolutions[0][0];
    assert.isTrue(solver.checkColPlacement(puzzle, 'd',6,9));
  });

  test('Logic handles an invalid column placement', () => {
    let puzzle = puzzles.puzzlesAndSolutions[0][0];
    assert.isFalse(solver.checkColPlacement(puzzle, 'd',6,3));
  });

  test('Logic handles a valid region (3x3 grid) placement', () => {
    let puzzle = puzzles.puzzlesAndSolutions[0][0];
    assert.isTrue(solver.checkRegionPlacement(puzzle, 'f',7,1));
  });

  test('Logic handles an invalid region (3x3 grid) placement', () => {
    let puzzle = puzzles.puzzlesAndSolutions[0][0];
    assert.isFalse(solver.checkRegionPlacement(puzzle, 'f',7,7));
  });

  test('Valid puzzle strings pass the solver', () => {
    let puzzle = puzzles.puzzlesAndSolutions[0][0];
    let result = solver.solve(puzzle);
    assert.notProperty(result, 'error');
  });

  test('Invalid puzzle strings fail the solver', () => {
    let puzzle = puzzles.puzzlesAndSolutions[0][0].replace(/^.{2}/g, 'AB');
    let result = solver.solve(puzzle);
    assert.property(result, 'error');
  });

  test('Solver returns the expected solution for an incomplete puzzle', () => {
    let puzzle = puzzles.puzzlesAndSolutions[0][0]
    let result = solver.solve(puzzle);
    assert.equal(result.solution, puzzles.puzzlesAndSolutions[0][1]);

    // const solution = result.solution;
    // assert.isTrue(solver.validate(solution));
    // assert.notEqual(puzzle, solution);
  });

});
