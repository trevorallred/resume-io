/*
    Simple Web Server for Development
    Requires Node JS and Connect
 */
var connect = require('connect');
connect.createServer(
    connect.static(__dirname)
).listen(8080);
