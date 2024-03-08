const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

let validPuzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
let validSolution = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';

chai.use(chaiHttp);

suite('Functional Tests', () => {
  test('Solve a puzzle with valid puzzle string: POST request to /api/solve', (done) => {
    chai.request(server)
      .post('/api/solve')
      .send({validPuzzleString})
      .end((err,res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'solution');
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
    let invalidCharPuzzleString = validPuzzleString.replace(/^.{2}/g, 'AB');
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: invalidCharPuzzleString })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        done();
      });
  });

  test('Solve a puzzle with incorrect length: POST request to /api/solve', (done) => {
    let invalidLengthPuzzleString = validSolution.substring(0,21);
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: invalidLengthPuzzleString })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        done();
      });
  });

  test('Solve a puzzle that cannot be solved: POST request to /api/solve', (done) => {
    let unsolvablePuzzleString = validPuzzleString.replace(/^.{2}/g, '12');
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: unsolvablePuzzleString })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Puzzle cannot be solved');
        done();
      });
  });

  test('Check a puzzle placement with all fields: POST request to /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: validSolution, coordinate:'A1', value:'1' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'valid');
        done();
      });
  });

  test('Check a puzzle placement with single placement conflict: POST request to /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: validPuzzleString, coordinate: 'A1', value:'2' })
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
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: validSolution, coordinate: 'A1', value: '2' })
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

  test('Check a puzzle placement with all placement conflicts: POST request to /api/check', (done) => {
    let allConflictPuzzleString = '123456789123456789123456789123456789123456789123456789123456789123456789123456789';
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: allConflictPuzzleString, coordinate: 'A1', value: '1' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'valid');
        assert.isFalse(res.body.valid);
        assert.property(res.body, 'conflict');
        assert.isArray(res.body.conflict);
        assert.lengthOf(res.body.conflict, 27);
        done();
      });
  });

  test('Check a puzzle placement with missing required fields: POST request to /api/check', (done) => {
    let allConflictPuzzleString = '123456789123456789123456789123456789123456789123456789123456789123456789123456789';
    chai.request(server)
      .post('/api/check')
      .send({})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        assert.lengthOf(res.body.error, 'Required field(s) missing');
        done();
      });
  });

  test('Check a puzzle placement with invalid characters: POST request to /api/check', (done) => {
    let invalidCharPuzzleString = validPuzzleString.replace(/^.{2}/g, 'AB');
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: invalidCharPuzzleString, coordinate: 'A1', value: '1' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        done();
      });
  });

  test('Check a puzzle placement with incorrect length: POST request to /api/check', (done) => {
    let invalidLengthPuzzleString = validSolution.substring(0, 21);
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: invalidLengthPuzzleString, coordinate: 'A1', value:'1' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        done();
      });
  });

  test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', (done) => {
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: validPuzzleString, coordinate: 'A1', value:'1' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        done();
      });
  });

  test('Check a puzzle placement with invalid placement value: POST request to /api/check', (done) => {
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: validPuzzleString, coordinate: 'A1', value: '0' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        done();
      });
  });


});

