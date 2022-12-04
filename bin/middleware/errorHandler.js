const { logEvents } = require('./logEvents');

const errorHandler = (err, req, res, next) => {
    let fromIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (fromIP.includes(':')) {
      const splitted = fromIP.split(':');
      // make sure we only use this if it's ipv4 (ip:port)
      if (splitted.length === 4) {
        fromIP = splitted[3];
      }
    }

    const atRe = /at([\s]?[\w:\s()\\\.]+)/;
    const fatalError = atRe.exec(err.stack)[1].trim();

    const fileRe = /([\w]?[:]?[\w\\.]+)/;
    const fileError = fileRe.exec(fatalError)[1];

    const lineRe = /[\w]+[:]?([\d]+)/;
    const lineError = lineRe.exec(fatalError)[1];

    const columnRe = /[\w]+[:]?[\d]+[:]?([\d]+)/;
    const columnError = columnRe.exec(fatalError)[1];
    console.log(err.stack)

    //Error: ENOENT: no such file or directory, stat 'C:\developer\ExpressJS\public\views\index.html'
    //Fatal error: ReferenceError: path is not defined in h is not defined at catchall (C:\developer\ExpressJS\public\middleware\error_middleware.js:98:18) at Layer.handle thrown in h on line 98 column 18

    logEvents(fromIP, `"Fatal error: ${err.name}: ${err.message} in ${fatalError} thrown in ${fileError} on line ${lineError} column ${columnError}"`, 'error.log');
    res.status(500).send(`<br />\n<b>Fatal error</b>: ${err.name}: ${err.message} in ${fatalError}\n thrown in <b>${fileError}</b> on line <b>${lineError}</b> column <b>${columnError}</b><br />`);
}

module.exports = errorHandler;