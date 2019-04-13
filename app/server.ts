import express = require("express");
import { Fileservice } from "./services/fileservice";

// Create a new express application instance
const app: express.Application = express();
let fileservice: Fileservice;

console.log("started");
app.get("/lines/:line", async function(req, res) {
  const lineResult = await fileservice.readline(req.params.line);
  if (lineResult === "") {
    res.statusCode = 413;
    res.end();
    return;
  }

  res.write(lineResult);
  res.statusCode = 200;
  res.end();
});

app.listen(3000, function() {
  const filePath: string = process.argv[2];
  if (filePath === undefined || filePath.length <= 0) {
    throw "Cannot start, data file is missing";
  }
  fileservice = new Fileservice(filePath);
  console.log(filePath);
  // index line bytes
  fileservice.index();
  console.log("Example app listening on port 3000!");
});
