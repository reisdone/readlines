# System
During preparation, the text file is read in chunks and the bytes of the lines are indexed in an array.

When the API is called, the line bytes are retrieved from the array and a createReadStream is opened in the position of the line to be read.

## Routing
The route for the API which returns the line is
__/lines/:line__

Example: http://localhost:3000/lines/1

# File Handling
Sample data has approximately 4GB and performs great during load. I would expect that as file size grows bigger, a database index for where to start reading the stream (line bytes) would be more adequate.

# Load Handling
Considering I've chosen Node as my webserver and that only partial read operations are done with the data file, concurrent requests should scale pretty well. Created several requests in a Postman Collection and response times were good.

# References
* Super reference in the NodeJS documentation https://nodejs.org/api/fs.html#fs_fs_createreadstream_path_options
* After reading the whole stream and creating the array by splitting on the newline, I figured there had to be a better way, so I ended up checking this article which mentioned the use of the EventStream package
https://itnext.io/using-node-js-to-read-really-really-large-files-pt-1-d2057fe76b33

# 3rd party libraries and tools
## npm and packages
Used __express__ package for setting up the API, and __event-stream__ package to split the stream while indexing

# Time spent
It probably took me about 5h to complete this, but I believe 1h30 or so were spent debugging my data had UNIX line-endings and I was using a constant for EOL from Windows... workaround for my scenario was to force the \n as the newline marker to consider while event-stream was splitting

Having more time to spend on this, I would test a lot more scenarios, including deploying the api into containers and load testing.

# Comments on the code
My code could probably be doing things a little more gracefully, in particular, how I determine returning the 413 status code. Spending more time structuring the response object would have possibly been better.