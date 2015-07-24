class SGFParser {
  constructor(model) {
    this.entryre = new RegExp('([A-Z]+)((\\[[^\\]]*\\])*)', 'g');
    this.valuere = new RegExp('\\[([^\\]]*)\\]', 'g');
    this.dimension = 19; // default assumption ...
    this.alpha = 'abcdefghijklmnopqrstuvwxyz';
    this.model = model;
  }

  addMove(str, colour, comment = undefined, addToCurrent = false) {
    var x = this.alpha.indexOf(str[0]);
    var y = this.alpha.indexOf(str[1]);

    if (addToCurrent) {
      this.model.addMove(x, y, colour, comment, true);
    } else {
      this.model.addMove(x, y, colour);
    }
  }

  handleKeyValue(a, b) {
    // http://senseis.xmp.net/?SmartGameFormat
    if (a === 'SZ') {
      this.model.setDimension(parseInt(b));
      // } else if (a === 'GM') {
      // Game - should always be 1 ... assuming this for now
    } else if (a === 'KM') {
      this.model.gameInfo.komi = b;
    } else if (a === 'PB') {
      this.model.gameInfo.playerBlack = b;
    } else if (a === 'PW') {
      this.model.gameInfo.playerWhite = b;
    } else if (a === 'RE') {
      this.model.gameInfo.result = b;
    } else if (a === 'BR') {
      // FIXME - turn 'player' into an object
      this.model.gameInfo.playerBlackRank = b;
    } else if (a === 'WR') {
      this.model.gameInfo.playerWhiteRank = b;
    } else if (a === 'BT') {
      this.model.gameInfo.playerBlackTeam = b;
    } else if (a === 'WT') {
      this.model.gameInfo.playerWhiteTeam = b;
    } else if (a === 'PC') {
      this.model.gameInfo.place = b;
    } else if (a === 'DT') {
      this.model.gameInfo.date = b;
    } else if (a === 'HA') {
      this.model.gameInfo.handicap = b;
    } else if (a === 'RU') {
      this.model.gameInfo.ruleSet = b;
    } else if (a === 'AP') {
      this.model.gameInfo.application = b;
    } else if (a === 'CP') {
      this.model.gameInfo.copyright = b;
      // } else if (a === 'FF') {
      // File Format - don't need to do anything I guess ;-)
    } else if (a === 'AB') { // Add black stone (e.g. handicap stone)
      this.addMove(b, 'b', undefined, true);
    } else if (a === 'AW') {
      this.addMove(b, 'w', undefined, true);
    } else if (a === 'AE') { // clear stone at ...
      this.addMove(b, 'x', undefined, true);
    } else if (a === 'PL') { // next player
      this.model.setNextPlayer(b.toLowerCase());
    } else if (a === 'B') {
      this.cmove = this.addMove(b, 'b');
    } else if (a === 'W') {
      this.cmove = this.addMove(b, 'w');
    } else if (a === 'C') {
      this.model.addComment(b);
      // } else if (a === 'ST') {
      // FIXME - see http://www.red-bean.com/sgf/properties.html#ST
      // } else {
      // console.log('Unknown ' + a + '/' + b);

    }
    // console.log('=> ' +result[1] + ' ' + result[2]);
  }

  handleKeyValues(a, b) {
    let result;
    let count = 0;
    while ((result = this.valuere.exec(b))) {
      count++;
      this.handleKeyValue(a, result[1]);
    }
  }

  parse(data) {
    data.split(';').map(l => {
      let result;
      while ((result = this.entryre.exec(l))) {
        this.handleKeyValues(result[1], result[2]);
      }
      this.model.resetPosition();
    });
    if (this.callbackFunction !== undefined) {
      this.callbackFunction();
    }
  }

  setCallback(func) {
    this.callbackFunction = func;
  }

  parseURL(sgfurl) {
    var xmlhttp;
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', sgfurl, true);
    xmlhttp.send();

    xmlhttp.onreadystatechange = () => {
      if (xmlhttp.readyState !== 4) { return; }
      if (xmlhttp.status !== 200) {
        // window.alert('Couldn't get url: ' + sgfurl);
        return;
      }
      this.parse(xmlhttp.responseText);
    };
  }
}

export default SGFParser;
