import GameModel from './gamemodel';
import SGFParser from './sgfparser';
import GoBoard from './goboard';
export default class SGFGameController {
  constructor(el, sgf, move) {
    if (move === undefined) { move = -1; }
    // if string starts with http, it's definitely a url
    // if string contains ']' anywhere, assume it's a sgf string
    // otherwise treat as a URL
    var isUrl = (sgf.match(/^http/) || !sgf.match('\\]'));
    this.model = new GameModel();
    var parser = new SGFParser(this.model);

    let model = this.model;
    parser.setCallback(() => { model.goToMove(move); }); // just display the last move

    this.board = new GoBoard(el, this.model);
    this.model.registerMoveListener(this.board);

    if (isUrl) {
      parser.parseURL(sgf);
    } else {
      parser.parse(sgf);
    }
  }
}
