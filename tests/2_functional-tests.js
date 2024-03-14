const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

const puzzles = require('../controllers/puzzle-strings.js')

chai.use(chaiHttp);

suite('Functional Tests', () => {
  test('Solve a puzzle with valid puzzle string: POST request to /api/solve', (done) => {
    let puzzle = puzzles.puzzlesAndSolutions[0][0];
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: puzzle })
      .end((err,res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.solution, puzzles.puzzlesAndSolutions[0][1]);
        done();
      });
  });

  test('Solve a puzzle with missing puzzle string: POST request to /api/solve', (done) => {
    chai.request(server)
      .post('/api/solve')
      .send({})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Required field missing')
        done();
      });
  });

  test('Solve a puzzle with invalid characters: POST request to /api/solve', (done) => {
    let puzzle = puzzles.puzzlesAndSolutions[0][1].replace(/^.{2}/g, 'AB');
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: puzzle })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        done();
      });
  });

  test('Solve a puzzle with incorrect length: POST request to /api/solve', (done) => {
    let puzzle = puzzles.puzzlesAndSolutions[0][1].substring(0,21);
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: puzzle })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        done();
      });
  });

  test('Solve a puzzle that cannot be solved: POST request to /api/solve', (done) => {
    let puzzle = puzzles.puzzlesAndSolutions[0][0].replace(/^.{3}/g, '123');
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: puzzle })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Puzzle cannot be solved');
        done();
      });
  });

  test('Check a puzzle placement with all fields: POST request to /api/check', (done) => {
    let puzzle = puzzles.puzzlesAndSolutions[0][1];
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: puzzle, coordinate:'A1', value:'1' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'valid');
        done();
      });
  });

  test('Check a puzzle placement with single placement conflict: POST request to /api/check', (done) => {
    let puzzle = puzzles.puzzlesAndSolutions[0][0];
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: puzzle, coordinate: 'A2', value:'7' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'valid');
        assert.isFalse(res.body.valid);
        assert.property(res.body, 'conflict');
        assert.isArray(res.body.conflict);
        assert.lengthOf(res.body.conflict, 1);
        done();
      });
  });

  test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', (done) => {
    let puzzle = puzzles.puzzlesAndSolutions[0][0];
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: puzzle, coordinate: 'B1', value: '3' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'valid');
        assert.isFalse(res.body.valid);
        assert.property(res.body, 'conflict');
        assert.isArray(res.body.conflict);
        assert.lengthOf(res.body.conflict, 2);
        done();
      });
  });

  test('Check a puzzle placement with all placement conflicts: POST request to /api/check', (done) => {
    let puzzle = puzzles.puzzlesAndSolutions[0][0];
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: puzzle, coordinate: 'A2', value: '2' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'valid');
        assert.isFalse(res.body.valid);
        assert.property(res.body, 'conflict');
        assert.isArray(res.body.conflict);
        assert.lengthOf(res.body.conflict, 3);
        done();
      });
  });

  test('Check a puzzle placement with missing required fields: POST request to /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Required field(s) missing');
        done();
      });
  });

  test('Check a puzzle placement with invalid characters: POST request to /api/check', (done) => {
    let puzzle = puzzles.puzzlesAndSolutions[0][0].replace(/^.{2}/g, 'AB');
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: puzzle, coordinate: 'A1', value: '1' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        done();
      });
  });

  test('Check a puzzle placement with incorrect length: POST request to /api/check', (done) => {
    let puzzle = puzzles.puzzlesAndSolutions[0][0].substring(0, 21);
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: puzzle, coordinate: 'A1', value:'1' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        done();
      });
  });

  test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', (done) => {
    let puzzle = puzzles.puzzlesAndSolutions[0][0];
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: puzzle, coordinate: '55', value:'1' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        done();
      });
  });

  test('Check a puzzle placement with invalid placement value: POST request to /api/check', (done) => {
    let puzzle = puzzles.puzzlesAndSolutions[0][0];
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: puzzle, coordinate: 'e5', value: '30' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Invalid value');
        done();
      });
  });

});

