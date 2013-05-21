exports.controller = function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.write('Hello World');
    res.end();
}