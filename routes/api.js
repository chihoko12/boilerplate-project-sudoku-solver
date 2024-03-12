'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;
      if (!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' });
      } else if (!/^[a-iA-I][1-9]$/.test(coordinate)) {
        return res.json({ error: 'Invalid coordinate' });
      } else if (!/^[1-9]$/.test(value)) {
        return res.json({ error: 'Invalid value' });
      } else if (solver.validate(puzzle) === true) {

        const col = parseInt(coordinate[1]) - 1;
        const val = parseInt(value);

        const isValidPlacement = solver.checkRowPlacement(puzzle, row, col, value) &&
          solver.checkColPlacement(puzzle, row, col, value) &&
          solver.checkRegionPlacement(puzzle, row, col, value);

        if (!isValidPlacement) {
          return res.json({ valid: false });
        }
        return res.json({ valid: true });

        // const isValidRow = solver.checkRowPlacement(puzzle, row, col, value);
        // const isValidCol = solver.checkColPlacement(puzzle, row, col, value);
        // const isValidRegion = solver.checkRegionPlacement(puzzle, row, col, value);

        // if (isValidRow && isValidCol && isValidRegion) {
        //   return res.json({ valid: true });
        // } else {
        //   return res.json({ valid: false, conflict: ['row', 'column', 'region'].filter((type) => !solver[`check${type.charAt(0).toUpperCase()}${type.slice(1)}Placement`](puzzle, row, col,value)) });
        // }


      } else {
        res.json({ error: 'Invalid puzzle'})
      }

    });

  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;
      if (!puzzle) {
        return res.json({ error: 'Required field missing' });
      } else if (solver.validate(puzzle) === true) {
        res.json(solver.solve(puzzle));
      } else {
        res.json({ error: 'Invalid puzzle' })
      }

      const result = solver.solve(puzzle);
      // return res.json(result);
      if (result.error) {
        return res.json(result);
      }
      return res.json(result);

    });
};
