"use strict";
import fs = require("fs");
import es = require("event-stream");

const newLineBytes = Buffer.byteLength('\n', 'ascii');
class Fileservice {
  _file: string;
  _index: Array<number> = [];

  constructor(file: string) {
    this._file = file;
  }

  index() {
    let index: Array<number> = [];
    let bytes: number = 0;
    
    // start of file
    index.push(0);

    // read the stream and store line byte length
    const stream = fs
      .createReadStream(this._file, {
        encoding: "ascii",
        flags: "r"
      })
      .pipe(es.split('\n')) //split stream to break on newlines
      .pipe(
        es.mapSync(function(line: string) {
          bytes += Buffer.byteLength(line, "ascii") + newLineBytes;
          const lineBytes: number = bytes;
          index.push(lineBytes);
        })
      );

    this._index = index;
  }

  async readline(line: number): Promise<string> {
    if (this._index.length <= line) {
      return Promise.resolve("");
    }
    // line start bytes
    const startByte: number = this._index[line - 1];
    // next line start bytes
    const endByte: number = this._index[line] - 1 - newLineBytes;

    const stream = fs.createReadStream(this._file, {
      encoding: "ascii",
      start: startByte,
      end: endByte,
      flags: "r"
    });

    return new Promise((resolve, reject) => {
      let lineText: string = "";
      stream.on("data", function(chunk: string) {
        lineText = chunk;
      });
      stream.on("end", () => {
        resolve(lineText);
      });
      stream.on("error", error => {
        reject(error);
      });
    });
  }
}

export { Fileservice };