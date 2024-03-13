'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;
      if (!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' });
      }
      if (!/^[a-iA-I]{1}[1-9]{1}$/.test(coordinate)) {
        return res.json({ error: 'Invalid coordinate' });
      }
      if (!/^[1-9]{1}$/.test(value)) {
        return res.json({ error: 'Invalid value' });
      }

      const validationResult = solver.validate(puzzle);
      if (typeof validationResult === 'object' && validationResult.error ) {
        return res.json(validationResult);
      }

      const row = coordinate[0].toLowerCase();
      const col = parseInt(coordinate[1]) - 1;
      const val = parseInt(value);

      let errors = [];
      if (!solver.checkRowPlacement(puzzle,row,col,val)) {
        errors.push("row");
      }
      if (solver.checkColPlacement(puzzle, row, col, val)) {
        errors.push("column");
      }
      if (solver.checkRegionPlacement(puzzle,row,col,val)) {
        errors.push("region");
      }

      if (errors.length == 0) {
        return res.status(200).json({ valid: true });
      } else {
        return res.status(200).json({
          valid: false,
        conflict: errors
        });
      }
    });

  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;

      if (!puzzle) {
        return res.json({ error: 'Required field missing' });
      } else {
        const validationResult = solver.validate(puzzle);
        if (typeof validationResult === 'object' && validationResult.error) {
          return res.json(validationResult);
        }

        const solvedPuzzle = solver.solve(puzzle);
        return res.json(solvedPuzzle);
      }
    });
};
