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
const express = require("express");
const fileservice_1 = require("./services/fileservice");
// Create a new express application instance
const app = express();
let fileservice;
console.log("started");
app.get("/lines/:line", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const lineResult = yield fileservice.readline(req.params.line);
        if (lineResult === '') {
            res.statusCode = 413;
            res.end();
            return;
        }
        res.write(lineResult);
        res.statusCode = 200;
        res.end();
    });
});
app.listen(3000, function () {
    const filePath = process.argv[2];
    fileservice = new fileservice_1.Fileservice(filePath);
    console.log(filePath);
    // index line bytes
    fileservice.index();
    console.log("Example app listening on port 3000!");
});
