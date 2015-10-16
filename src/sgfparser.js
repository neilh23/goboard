class SGFParser {
  constructor(model) {
    this.dimension = 19; // default assumption ...
    this.alpha = 'abcdefghijklmnopqrstuvwxyz';
    this.model = model;
    this.state = 'Start';
    this.AToZ = /[A-Z]/;
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
    // console.log(`Keyvalue ${a}/${b}`);
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

  parseStart(c) {
    this.state = 'Body';

    if (c === '(' || c === ' ' || c === '\n' || c === '\r') { return; }
    console.log(`START: unexpected '${c}'`);
    this.parseBody(c);
  }

  parseBody(c) {
    if (c === ' ' || c === '\n' || c === '\r') {
      return;
    } else if (this.AToZ.test(c)) {
      this.property = c;
      this.state = 'Property';
    } else if (c === '[') {
      if (this.property !== undefined) {
        this.state = 'Value'; // re-parse as same property as last
        // value is an array - we then construct with join (see https://developers.google.com/speed/articles/optimizing-javascript
        this.value = [];
      }
    } else if (c === ';') {
      // FIXME: close off current move
      this.property = undefined;
    } else if (c === '(') {
      this.model.pushBranch();
    } else if (c === ')') {
      this.model.popBranch();
    }
  }

  parseProperty(c) {
    if (this.AToZ.test(c)) {
      this.property += c;
    } else if (c === '[') {
      this.value = [];
      this.state = 'Value';
    } else if (c === ' ' || c === '\n' || c === '\r') /*eslint-disable no-empty */ {
      // nop
    } /*eslint-enable no-empty*/ else {
      console.log(`PROPERTY: unexpected '${c}'`);
    }
  }

  parseValue(c) {
    if (c === ']') {
      this.handleKeyValue(this.property, this.value.join(''));
      this.state = 'Body';
      return;
    }
    if (c === '\\') {
      this.state = 'EscapeValue';
    }
    this.value.push(c);
  }

  parseEscapeValue(c) {
    if (c === '\n' || c === '\r') { c = ' '; } // soft line break
    this.value.push(c);
    this.state = 'Value';
  }

  parseChar(c) {
    // console.log(`${this.state} -> '${c}'`);
    this['parse' + this.state](c);
  }

  parse(data, eof=true) {
    for (var i in data) { this.parseChar(data[i]); }

    if (eof) {
      this.model.resetPosition();
      if (this.callbackFunction !== undefined) {
        this.callbackFunction();
      }
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
      if (xmlhttp.status !== 200) {
        // window.alert("Couldn't get url: " + sgfurl);
        return;
      }
      this.parse(xmlhttp.responseText, (xmlhttp.readyState === 4));
    };
  }
}

export default SGFParser;
