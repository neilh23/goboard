class SGFParser {
  constructor(model) {
    this.entryre = new RegExp('([A-Z]+)\\[([^\\]]*)\\]', 'g');
    this.dimension = 19; // default assumption ...
    this.alpha = 'abcdefghijklmnopqrstuvwxyz';
    this.model = model;
  }

  addMove(str, colour) {
    var x = this.alpha.indexOf(str[0]);
    var y = this.alpha.indexOf(str[1]);

    this.model.addMove(x, y, colour);
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
      // } else if (a === 'AB') {
      // TODO - setup placement correctly
      // } else if (a === 'AW') {
      // TODO - setup placement correctly
    } else if (a === 'B') {
      this.cmove = this.addMove(b, 'b');
    } else if (a === 'W') {
      this.cmove = this.addMove(b, 'w');
    } else if (a === 'C') {
      if (this.cmove !== undefined) {
        this.cmove.comment = b;
      } // FIXME: else it's the comment on 'move zero' (empty move)
      // } else if (a === 'ST') {
      // FIXME - see http://www.red-bean.com/sgf/properties.html#ST
      // } else {
      // console.log('Unknown ' + a + '/' + b);

    }
    // console.log('=> ' +result[1] + ' ' + result[2]);
  }

  parse(data) {
    data.split(';').map(l => {
      let result;
      while ((result = this.entryre.exec(l))) {
        this.handleKeyValue(result[1], result[2]);
      }
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
