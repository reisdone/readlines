import express = require('express');
import fs = require('fs');
 
 
console.log('after calling readFile');

// Create a new express application instance
const app: express.Application = express();

app.get('/lines/:line', function (req, res) {
    fs.readFile('./build/data.txt', 'ascii', function(err, contents) {
        if(err){
            console.error(err.message);
        }
        res.send(contents);
    });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});