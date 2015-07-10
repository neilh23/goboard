/* global XMLHttpRequest */
/* global window */
class SGFParser {
  constructor(model) {
    this.entryre = new RegExp("([A-Z]+)\\[(.*)\\]", "g");
    this.dimension = 19; // default assumption ...
    this.alpha = "abcdefghijklmnopqrstuvwxyz";
    this.model = model;
  }

  addMove(str, colour) {
    var x = this.alpha.indexOf(str[0]);
    var y = this.alpha.indexOf(str[1]);

    this.model.addMove(x, y, colour);
  }

  parse(data) {
    data.split(";").map(l => {
      let result;
      var cmove;
      while((result = this.entryre.exec(l))) {
        let [a, b] = [result[1], result[2]];
        if (a === "SZ") {
          this.model.setDimension(b);
        } else if (a === "KM") {
          this.model.gameInfo.komi = b;
        } else if (a === "PB") {
          this.model.gameInfo.playerBlack = b;
        } else if (a === "PW") {
          this.model.gameInfo.playerWhite = b;
        } else if (a === "RE") {
          this.model.gameInfo.result = b;
        } else if (a === "BR") {
          // FIXME - turn "player" into an object
          this.model.gameInfo.playerBlackRank = b;
        } else if (a === "WR") {
          this.model.gameInfo.playerWhiteRank = b;
        } else if (a === "B") {
          cmove = this.addMove(b, "b");
        } else if (a === "W") {
          cmove = this.addMove(b, "w");
        } else if (a === "C") {
          if (cmove !== undefined ) {
            cmove.comment = b;
          } // FIXME: else it's the comment on 'move zero' (empty move)
        } else {
          console.log("Unknown " + a + "/" + b);

        }
        // console.log("=> " +result[1] + " " + result[2]);
      }
    });
    this.callbackFunction();
  }

  setCallback(func) {
    this.callbackFunction = func;
  }

  parseURL(sgfurl) {
    var xmlhttp;
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", sgfurl, true);
    xmlhttp.send();

    xmlhttp.onreadystatechange = () => {
      if ( xmlhttp.readyState !== 4 ) { return; }
      if ( xmlhttp.status !== 200 ) {
        window.alert("Couldn't get url: " + sgfurl);
        return;
      }
      this.parse(xmlhttp.responseText);
    };
  }
}
