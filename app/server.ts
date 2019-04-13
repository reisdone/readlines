import express = require("express");
import { Fileservice } from "./services/fileservice";

// Create a new express application instance
const app: express.Application = express();
const fileservice = new Fileservice("./build/data/itcont.txt");

console.log("started");
app.get("/lines/:line", async function(req, res) {
  const lineResult = await fileservice.readline(req.params.line);
  if(lineResult === ''){
     res.statusCode=413;
     res.end(); 
     return;
  }
  
  res.write(lineResult);
  res.statusCode = 200;
  res.end();
});

app.listen(3000, function() {
    // index line bytes
  fileservice.index();
  console.log("Example app listening on port 3000!");
});
