const { format } = require('date-fns');
const { v4: uuid } = require('uuid');

const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const logEvents = async (fromIP, message, logName) => {
  const dateTime = `${format(new Date(), 'dd/MMM/yyyy:HH:mm:ss')}`;

  const gmtRe = /GMT([\-\+]?\d{4})/;
  const tz = gmtRe.exec(new Date())[1];

  const logItem = `${fromIP} - - [${dateTime} ${tz}] ${message}\n`;

  try {
    if (!fs.existsSync(path.join(__dirname, '..', '..', 'logs'))) {
      await fsPromises.mkdir(path.join(__dirname, '..', '..', 'logs'));
    }

    await fsPromises.appendFile(path.join(__dirname, '..', '..', 'logs', logName), logItem);
  } catch (err) {
    console.log(err);
  }
}

const logger = (req, res, next) => {
  const oldWrite = res.write;
  const oldEnd = res.end;
  const oldJson = res.json;

  const chunks = [];

  res.write = (...restArgs) => {
    chunks.push(Buffer.from(restArgs[0]));
    oldWrite.apply(res, restArgs);
  };
  res.json = (...restArgs) => {
    chunks.push(Buffer.from(JSON.stringify(restArgs[0])));
    oldJson.apply(res, restArgs);
  };

  res.end = (...restArgs) => {
    if (restArgs[0]) {
      chunks.push(Buffer.from(restArgs[0]));
    }
    const body = Buffer.concat(chunks).toString('utf8');
    const contentSize = body.length != 0 ? body.length : '-';

    let fromIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    if (fromIP.includes(':')) {
      const splitted = fromIP.split(':');
      // make sure we only use this if it's ipv4 (ip:port)
      if (splitted.length === 4) {
        fromIP = splitted[3];
      }
    }

    logEvents(fromIP, `"${req.method} ${req.url} HTTP/${req.httpVersion}" ${res.statusCode} ${contentSize}`, 'access.log');

    oldEnd.apply(res, restArgs);
  };

  next();
}

module.exports = { logger, logEvents };
