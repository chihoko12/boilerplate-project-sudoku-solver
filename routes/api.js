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

      const row = parseInt(coordinate.charAt(0)) - 1;
      const col = coordinate.charAt(1).toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);

      if (row < 0 || row > 8 || col < 0 || col > 8) {
        return res.json({ error: 'Invalid coordinate' });
      }

      if (!/^[1-9]$/.test(value)) {
        return res.json({ error: 'Invalid value' });
      }

      const isValidRow = solver.checkRowPlacement(puzzle, row, col, value);
      const isValidCol = solver.checkColPlacement(puzzle, row, col, value);
      const isValidRegion = solver.checkRegionPlacement(puzzle, row, col, value);

      if (isValidRow && isValidCol && isValidRegion) {
        return res.json({ valid: true });
      } else {
        return res.json({ valid: false, conflict: ['row', 'column', 'region'].filter((type) => !solver[`check${type.charAt(0).toUpperCase()}${type.slice(1)}Placement`](puzzle, row, col,value)) });
      }

    });

  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;
      if (!puzzle) {
        return res.json({ error: 'Required field missing' });
      }

      const result = solver.solve(puzzle);
      if (result.error) {
        return res.json(result);
      }
      return res.json(result);

    });
};
