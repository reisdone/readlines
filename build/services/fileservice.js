"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const es = require("event-stream");
const newLineBytes = Buffer.byteLength('\n', 'ascii');
class Fileservice {
    constructor(file) {
        this._index = [];
        this._file = file;
    }
    index() {
        let index = [];
        let bytes = 0;
        // start of file
        index.push(0);
        // read the stream and store line byte length
        const stream = fs
            .createReadStream(this._file, {
            encoding: "ascii",
            flags: "r"
        })
            .pipe(es.split('\n')) //split stream to break on newlines
            .pipe(es.mapSync(function (line) {
            bytes += Buffer.byteLength(line, "ascii") + newLineBytes;
            const lineBytes = bytes;
            index.push(lineBytes);
        }));
        this._index = index;
    }
    readline(line) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._index.length <= line) {
                return Promise.resolve("");
            }
            // line start bytes
            const startByte = this._index[line - 1];
            // next line start bytes
            const endByte = this._index[line] - 1 - newLineBytes;
            const stream = fs.createReadStream(this._file, {
                encoding: "ascii",
                start: startByte,
                end: endByte,
                flags: "r"
            });
            return new Promise((resolve, reject) => {
                let lineText = "";
                stream.on("data", function (chunk) {
                    lineText = chunk;
                });
                stream.on("end", () => {
                    resolve(lineText);
                });
                stream.on("error", error => {
                    reject(error);
                });
            });
        });
    }
}
exports.Fileservice = Fileservice;
