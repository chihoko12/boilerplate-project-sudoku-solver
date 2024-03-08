const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver;
let validPuzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';

suite('Unit Tests', () => {
  setup(() => {
    solver = new Solver();
  });

  test('Logic handles a valid puzzle string of 81 characters', () => {
    assert.isTrue(solver.validate(validPuzzleString));
  });

  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
    let invalidPuzzleString = validPuzzleString.replace(/^.{2}/g, 'AB');
    assert.isFalse(solver.validate(invalidPuzzleString));
  });

  test('Logic handles a puzzle string that is not 81 characters in length', () => {
    let invalidLengthPuzzleString = validPuzzleString.substring(0,15);
    assert.isFalse(solver.validate(invalidLengthPuzzleString));
  });

  test('Logic handles a valid row placement', () => {
    let row = 0;
    let column = 0;
    let value = '1';
    assert.isTrue(solver.checkRowPlacement(validPuzzleString, row, column, value));
  });

  test('Logic handles an invalid row placement', () => {
    let row = 0;
    let column = 0;
    let value = '1';
    assert.isFalse(solver.checkRowPlacement(validPuzzleString, row, column, value));
    assert.isFalse(solver.checkRowPlacement(validPuzzleString, row, column, value));
  });

  test('Logic handles a valid column placement', () => {
    let row = 0;
    let column = 0;
    let value = '1';
    assert.isTrue(solver.checkColPlacement(validPuzzleString, row, column, value));
    assert.isTrue(solver.checkColPlacement(validPuzzleString, row, column, value));
  });

  test('Logic handles an invalid column placement', () => {
    let row = 0;
    let column = 0;
    let value = '1';
    assert.isFalse(solver.checkColPlacement(validPuzzleString, row, column, value));
    assert.isFalse(solver.checkColPlacement(validPuzzleString, row, column, value));
  });

  test('Logic handles a valid region (3x3 grid) placement', () => {
    let row = 0;
    let column = 0;
    let value = '1';
    assert.isTrue(solver.checkRegionPlacement(validPuzzleString, row, column, value));
    assert.isTrue(solver.checkRegionPlacement(validPuzzleString, row, column, value));
  });

  test('Logic handles an invalid region (3x3 grid) placement', () => {
    let row = 0;
    let column = 0;
    let value = '1';
    assert.isFalse(solver.checkRegionPlacement(validPuzzleString, row, column, value));
    assert.isFalse(solver.checkRegionPlacement(validPuzzleString, row, column, value));
  });

  test('Valid puzzle strings pass the solver', () => {
    let result = solver.solve(validPuzzleString);
    assert.notProperty(result, 'error');
  });

  test('Invalid puzzle strings fail the solver', () => {
    let invalidPuzzleString = validPuzzleString.replace(/^.{2}/g, 'AB');
    let result = solver.solve(invalidPuzzleString);
    assert.property(result, 'error');
  });

  test('Solver returns the expected solution for an incomplete puzzle', () => {
    const incompletePuzzleString = '...235418851496372432178956174569283395842761628713549283657194516924837947381625'
    let result = solver.solve(incompletePuzzleString);
    const solution = result.solution;
    assert.isTrue(solver.validate(solution));
    assert.notEqual(incompletePuzzleString, solution);
  });

});
