import SGFGameController from './sgfgamecontroller';
export default function createGoBoard(opts) {
  var el = opts.board;
  var sgf = opts.sgf;

  if (el === undefined) {
    throw 'Please supply an element for the Go board';
  }

  if (sgf !== undefined) {
    return new SGFGameController(el, sgf);
  }

  throw 'Unsupported configuration';
}
