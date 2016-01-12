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

  addLabel(str) {
    if (str === undefined) {
      console.log('Error: undefined passed to addLabel');
      return;
    }
    var x = this.alpha.indexOf(str[0]);
    var y = this.alpha.indexOf(str[1]);
    var label = str.split(':')[1];

    // console.log(`Adding label ${x}, ${y}: ${label}`);

    this.model.addLabel(x, y, label);
  }

  handleKeyValue(a, b) {
    // console.log(`Keyvalue ${a}/${b}`);
    // http://senseis.xmp.net/?SmartGameFormat

    switch (a) {
      case 'B': this.cmove = this.addMove(b, 'b'); break;
      case 'W': this.cmove = this.addMove(b, 'w'); break;
      case 'C': this.model.addComment(b); break;
      case 'LB': this.addLabel(b); break;
      case 'SZ': this.model.setDimension(parseInt(b)); break;
      // case 'GM': Game - should always be 1 ... assuming this for now
      case 'KM': this.model.gameInfo.komi = b; break;
      case 'PB': this.model.gameInfo.playerBlack = b; break;
      case 'PW': this.model.gameInfo.playerWhite = b; break;
      case 'RE': this.model.gameInfo.result = b; break;
      // FIXME - turn 'player' into an object
      case 'BR': this.model.gameInfo.playerBlackRank = b; break;
      case 'WR': this.model.gameInfo.playerWhiteRank = b; break;
      case 'BT': this.model.gameInfo.playerBlackTeam = b; break;
      case 'WT': this.model.gameInfo.playerWhiteTeam = b; break;
      case 'PC': this.model.gameInfo.place = b; break;
      case 'DT': this.model.gameInfo.date = b; break;
      case 'HA': this.model.gameInfo.handicap = b; break;
      case 'RU': this.model.gameInfo.ruleSet = b; break;
      case 'AP': this.model.gameInfo.application = b; break;
      case 'CP': this.model.gameInfo.copyright = b; break;
      // case 'FF': // File Format - don't need to do anything I guess ;-)
      case 'AB': this.addMove(b, 'b', undefined, true); break;
      case 'AW': this.addMove(b, 'w', undefined, true); break;
      case 'AE': this.addMove(b, 'x', undefined, true); break;
      case 'PL': this.model.setNextPlayer(b.toLowerCase()); break;
      // case 'ST': // FIXME - see http://www.red-bean.com/sgf/properties.html#ST
      // default: console.log('Unknown ' + a + '/' + b);
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
      if (xmlhttp.status !== 200 || xmlhttp.readyState !== 4) {
        // window.alert("Couldn't get url: " + sgfurl);
        return;
      }
      this.parse(xmlhttp.responseText, true);
    };
  }
}

export default SGFParser;
