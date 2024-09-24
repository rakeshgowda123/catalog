class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Polynomial {
  constructor(json) {
    this.n = json.keys.n;
    this.k = json.keys.k;
    this.points = [];

    for (let key in json) {
      if (key !== "keys") {
        let pointJson = json[key];
        let x = parseInt(key);
        let y = this.decodeValue(pointJson.base, pointJson.value);
        this.points.push(new Point(x, y));
      }
    }
  }

  decodeValue(base, value) {
    let y = 0;
    for (let c of value) {
      y = y * parseInt(base) + this.decodeChar(c, base);
    }
    return y;
  }

  decodeChar(c, base) {
    if (c >= "0" && c <= "9") {
      return c.charCodeAt(0) - "0".charCodeAt(0);
    } else if (c >= "A" && c <= "F") {
      return c.charCodeAt(0) - "A".charCodeAt(0) + 10;
    } else if (c >= "a" && c <= "f") {
      return c.charCodeAt(0) - "a".charCodeAt(0) + 10;
    } else {
      throw new Error(`Invalid character: ${c}`);
    }
  }

  getN() {
    return this.n;
  }

  getK() {
    return this.k;
  }

  getPoints() {
    return this.points;
  }
}

function findSecret(points, k) {
  let c = 0;
  for (let i = 0; i < k; i++) {
    let numerator = 1;
    let denominator = 1;
    for (let j = 0; j < k; j++) {
      if (i !== j) {
        numerator *= points[j].x;
        denominator *= points[j].x - points[i].x;
      }
    }
    c += (points[i].y * numerator) / denominator;
  }
  return c;
}

// read the JSON files
const fs = require("fs");
const json1 = JSON.parse(fs.readFileSync("input1.json", "utf8"));
const json2 = JSON.parse(fs.readFileSync("input2.json", "utf8"));

const polynomial1 = new Polynomial(json1);
const c1 = findSecret(polynomial1.getPoints(), polynomial1.getK());

const polynomial2 = new Polynomial(json2);
const c2 = findSecret(polynomial2.getPoints(), polynomial2.getK());

// output: print 'c'
console.log(`c1 = ${c1}`);
console.log(`c2 = ${c2}`);
