import GameModel from '../../src/gamemodel';
import SGFParser from '../../src/sgfparser';

var fs = require('fs');

/* eslint-disable no-unused-expressions,no-loop-func */

describe(`Kogo's Joseki Dictionary`, () => {
  var model = new GameModel();
  var parser = new SGFParser(model);
  var start = (new Date()).getTime();

  before(function(done) { // use ES5 style function so that 'this' is accessible
    this.timeout(5000);
    // Note - at the moment I'm not including Kogo's joseki dictionary in the repository
    // TODO: automatically download instead of failing if you don't have it ;-)
    fs.readFile('./sgf/Kogos.sgf', 'utf-8', (err, data) => {
      if (err) {
        throw `Error opening file ${err}`;
      }
      parser.parse(data);

      done();
    });
  });

  it(`didn't take too long`, () => {
    var duration = (new Date()).getTime() - start;
    // NH - todo, would like this to load in under a second!
    console.log(`it took ${duration}ms to load Kogo's joseki dictionary`);
    expect(duration).to.be.at.most(4000);
  });

  it(`should parse move 1, branch 0 correctly`, () => {
    model.goToMove(0);
    expect(model.labelAt(16, 2)).to.equal('A');
    expect(model.labelAt(16, 3)).to.equal('B');
    expect(model.labelAt(13, 2)).to.equal('F');
    expect(model.labelAt(16, 9)).to.equal('I');
    expect(model.labelAt(15, 2)).to.be.undefined;

    model.nextMove();
    // model.logPosition();
    expect(model.labelAt(15, 3)).to.equal('a');
    expect(model.labelAt(14, 2)).to.equal('b');
    expect(model.labelAt(16, 2)).to.be.undefined;

  });

});
